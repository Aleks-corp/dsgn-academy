import type { Request, Response } from "express";
import { Types } from "mongoose";
import type { ICourse } from "../types/course.type.js";
import { courseServices } from "../services/index.js";
import { ctrlWrapper } from "../decorators/index.js";
import { HttpError } from "../utils/index.js";

import {
  toggleBookmarkedCourseService,
  updateBookmarkedCoursesService,
  updateWatchedCoursesService,
} from "../services/user.service.js";

const {
  getCoursesService,
  getCoursesTotalService,
  getCourseByIdService,
  addCourseService,
  updateCourseService,
  deleteCourseByIdService,
  checkBookmarkedCoursesService,
  getBookmarkedCoursesService,
  getWatchedCoursesService,
  toggleLikeCourseService,
} = courseServices;

/**
 * GET /courses
 * Query: ?q=searchText&category=Figma&limit=12&page=1
 */
export const getCourses = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user = req.user;
  const { q, category, limit = 3, page = 1 } = req.query;
  const currentTime = new Date();
  const filter: Record<string, unknown> = {};
  filter.publishedAt = { $lte: currentTime };
  if (typeof category === "string" && category.trim() !== "") {
    filter.category = category.trim();
  }
  if (typeof q === "string" && q.trim() !== "") {
    const regex = new RegExp(q.trim(), "i");
    filter.title = regex;
  }

  const perPage = Math.max(1, Number(limit));
  const currentPage = Math.max(1, Number(page));

  const { courses, total } = await getCoursesService(filter, {
    limit: perPage,
    page: currentPage,
  });

  res.json({
    courses: courses.map((c: ICourse) => {
      const bookmarked = user?.bookmarkedCourses?.some(
        (b) => b.toString() === c._id.toString()
      );
      const videos = c.videos.map((v) => {
        const progress = user?.watchedCourses?.find(
          (w) =>
            w.courseId.toString() === c._id.toString() &&
            w.videoId.toString() === v._id.toString()
        );
        return {
          ...v.toObject(),
          watched: { progress: progress?.currentTime || 0 },
        };
      });
      return { ...c.toObject(), bookmarked, videos };
    }),
    total,
    page: currentPage,
    limit: perPage,
    hasMore: (currentPage - 1) * perPage + courses.length < total,
  });
};

export const getCoursesCounts = async (
  req: Request,
  res: Response
): Promise<void> => {
  const totalCourses = await getCoursesTotalService({});

  res.json({
    totalCourses,
  });
};

export const getCourseById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const user = req.user;
  const course = await getCourseByIdService(id);
  if (!course) throw HttpError(404, "Course not found");

  const bookmarked = user?.bookmarkedCourses?.some(
    (b) => b.toString() === course._id.toString()
  );
  const liked = course.likedBy?.some(
    (uid) => uid.toString() === user?._id.toString()
  );
  const videos = course.videos.map((v) => {
    const progress = user?.watchedCourses?.find(
      (w) =>
        w.courseId.toString() === course._id.toString() &&
        w.videoId.toString() === v._id.toString()
    );
    return {
      ...v.toObject(),
      watched: { progress: progress?.currentTime || 0 },
    };
  });

  res.json({
    ...course.toObject(),
    bookmarked,
    likedBy: {
      count: course.likedBy?.length || 0,
      isLiked: !!liked,
    },
    videos,
  });
};

export const addCourse = async (req: Request, res: Response): Promise<void> => {
  const courseData: ICourse = req.body;

  const course = await addCourseService(courseData);

  res.status(201).json(course);
};

export const updateCourse = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const course = await updateCourseService(id, req.body);
  if (!course) {
    res.status(404).json({ error: "Course not found" });
    return;
  }
  res.json(course);
};

export const deleteCourseById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const course = await deleteCourseByIdService(id);
  if (!course) {
    res.status(404).json({ error: "Course not found" });
    return;
  }
  res.json({ message: "Course deleted" });
};

export const getBookmarkedCourses = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user = req.user;
  if (!user) throw HttpError(401);

  const { limit = "9", page = "1" } = req.query;
  const perPage = Math.max(1, Number(limit));
  const currentPage = Math.max(1, Number(page));
  let courseIds = user.bookmarkedCourses || [];
  if (courseIds.length === 0) throw HttpError(404, "No courses found");
  if (currentPage === 1) {
    const { cleanIds } = await checkBookmarkedCoursesService(courseIds);
    if (cleanIds.length !== (user.bookmarkedVideos?.length || 0)) {
      await updateBookmarkedCoursesService(cleanIds, user._id);
      courseIds = cleanIds;
    }
  }
  const { courses, total } = await getBookmarkedCoursesService(courseIds, {
    limit: perPage,
    page: currentPage,
  });

  res.json({
    courses: courses.map((c: ICourse) => ({
      ...c.toObject(),
      bookmarked: true,
      watched: {
        progress:
          user.watchedCourses?.find(
            (w) => w.courseId.toString() === c._id.toString()
          )?.currentTime || 0,
      },
    })),
    total,
    page: currentPage,
    limit: perPage,
    hasMore: currentPage * perPage < courseIds.length,
  });
};

export const toggleBookmarkCourse = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id: courseId } = req.params;
  const userId = req.user?._id;
  if (!userId) throw HttpError(401);

  const { action } = await toggleBookmarkedCourseService(userId, courseId);

  res.json({ message: `Course ${action}` });
};

export const getWatchedCourses = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user = req.user;
  if (!user) throw HttpError(401);

  const { limit = "9", page = "1" } = req.query;
  const perPage = Math.max(1, Number(limit));
  const currentPage = Math.max(1, Number(page));

  const { courses, total } = await getWatchedCoursesService(
    (user.watchedCourses || []).map((w) => ({
      courseId: new Types.ObjectId(w.courseId),
      videoId: new Types.ObjectId(w.videoId),
    })),
    {
      limit: perPage,
      page: currentPage,
    }
  );

  res.json({
    courses: courses.map((c: ICourse) => {
      const bookmarked = user.bookmarkedCourses?.some(
        (b) => b.toString() === c._id.toString()
      );
      const videos = c.videos.map((v) => {
        const progress = user.watchedCourses?.find(
          (w) =>
            w.courseId.toString() === c._id.toString() &&
            w.videoId.toString() === v._id.toString()
        );
        return {
          ...v.toObject(),
          watched: { progress: progress?.currentTime || 0 },
        };
      });
      return { ...c.toObject(), bookmarked, videos };
    }),
    total,
    page: currentPage,
    limit: perPage,
    hasMore: currentPage * perPage < (user.watchedCourses?.length || 0),
  });
};

export const updateWatchedCourse = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id: courseId } = req.params;
  const { videoId, currentTime } = req.body;
  const userId = req.user?._id;

  if (!userId) throw HttpError(401);
  if (!videoId) throw HttpError(400, "videoId is required");
  if (typeof currentTime !== "number")
    throw HttpError(400, "currentTime must be a number");

  const updated = await updateWatchedCoursesService(
    userId,
    courseId,
    videoId as string,
    currentTime
  );

  res.json({ message: "Progress updated", watched: updated });
};

export const toggleLikeCourse = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id: courseId } = req.params;
  const userId = req.user?._id;
  if (!userId) throw HttpError(401);

  const { action } = await toggleLikeCourseService(userId, courseId);

  res.json({ message: `Course ${action} like` });
};

export default {
  getCourses: ctrlWrapper(getCourses),
  getCoursesCounts: ctrlWrapper(getCoursesCounts),
  getCourseById: ctrlWrapper(getCourseById),
  addCourse: ctrlWrapper(addCourse),
  updateCourse: ctrlWrapper(updateCourse),
  deleteCourseById: ctrlWrapper(deleteCourseById),
  getBookmarkedCourses: ctrlWrapper(getBookmarkedCourses),
  toggleBookmarkCourse: ctrlWrapper(toggleBookmarkCourse),
  getWatchedCourses: ctrlWrapper(getWatchedCourses),
  updateWatchedCourse: ctrlWrapper(updateWatchedCourse),
  toggleLikeCourse: ctrlWrapper(toggleLikeCourse),
};
