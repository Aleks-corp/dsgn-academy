import type { FilterQuery, Types } from "mongoose";

import { CourseModel } from "../models/index.js";
import type { ICourse } from "../types/course.type.js";

const getCoursesService = async (
  filter: FilterQuery<ICourse>,
  options: { limit: number; page: number }
): Promise<{
  courses: ICourse[];
  total: number;
  page: number;
  limit: number;
}> => {
  const { limit, page } = options;
  const skip = (page - 1) * limit;
  const [courses, total] = await Promise.all([
    CourseModel.find(filter, "-createdAt -updatedAt -videos.url -likedBy")
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec(),
    CourseModel.countDocuments(filter),
  ]);
  return { courses, total, page, limit };
};

export const getCoursesTotalService = async (
  filter: FilterQuery<ICourse>
): Promise<number> => {
  const count = await CourseModel.countDocuments(filter);
  return count;
};

export const getCourseByIdService = async (
  id: string
): Promise<ICourse | null> => {
  return CourseModel.findById(id).exec();
};

export const addCourseService = async (
  data: Partial<ICourse>
): Promise<ICourse> => {
  return CourseModel.create(data);
};

export const updateCourseService = async (
  id: string,
  data: Partial<ICourse>
): Promise<ICourse | null> => {
  return CourseModel.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).exec();
};

export const deleteCourseByIdService = async (
  id: string
): Promise<ICourse | null> => {
  return CourseModel.findByIdAndDelete(id).exec();
};

export const getBookmarkedCoursesService = async (
  courseIds: (Types.ObjectId | string)[],
  options: { limit: number; page: number }
): Promise<{
  courses: ICourse[];
  total: number;
  cleanIds: Types.ObjectId[];
}> => {
  const { limit, page } = options;
  const skip = (page - 1) * limit;

  const [courses, total] = await Promise.all([
    CourseModel.find(
      { _id: { $in: courseIds } },
      "-createdAt -updatedAt -videos.url -likedBy"
    )
      .sort({ publishedAt: -1, _id: -1 })
      .skip(skip)
      .limit(limit)
      .exec(),
    CourseModel.countDocuments({ _id: { $in: courseIds } }),
  ]);

  const cleanIds = courses.map((c) => c._id);

  return { courses, total, cleanIds };
};

export const getWatchedCoursesService = async (
  watched: { courseId: Types.ObjectId; videoId: Types.ObjectId }[],
  options: { limit: number; page: number }
): Promise<{
  courses: ICourse[];
  total: number;
  cleanIds: Types.ObjectId[];
}> => {
  const { limit, page } = options;
  const skip = (page - 1) * limit;

  const ids = [...new Set(watched.map((w) => w.courseId))];

  const [courses, total] = await Promise.all([
    CourseModel.find(
      { _id: { $in: ids } },
      "-createdAt -updatedAt -videos.url -likedBy"
    )
      .sort({ publishedAt: -1, _id: -1 })
      .skip(skip)
      .limit(limit)
      .exec(),
    CourseModel.countDocuments({ _id: { $in: ids } }),
  ]);

  return { courses, total, cleanIds: courses.map((c) => c._id) };
};

export const toggleLikeCourseService = async (
  userId: Types.ObjectId | string,
  courseId: Types.ObjectId | string
): Promise<{ action: "liked" | "unliked" }> => {
  const course = await CourseModel.findById(courseId);
  if (!course) throw new Error("Course not found");

  const hasLiked = course.likedBy?.some(
    (id) => id.toString() === userId.toString()
  );

  if (hasLiked) {
    await CourseModel.findByIdAndUpdate(courseId, {
      $pull: { likedBy: userId },
    });
    return { action: "unliked" };
  } else {
    await CourseModel.findByIdAndUpdate(courseId, {
      $addToSet: { likedBy: userId },
    });
    return { action: "liked" };
  }
};

export default {
  getCoursesService,
  getCoursesTotalService,
  getCourseByIdService,
  addCourseService,
  updateCourseService,
  deleteCourseByIdService,
  getBookmarkedCoursesService,
  getWatchedCoursesService,
  toggleLikeCourseService,
};
