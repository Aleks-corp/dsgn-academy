import type { Request, Response } from "express";
import { courseServices } from "../services/index.js";
import { ctrlWrapper } from "../decorators/index.js";
import { HttpError } from "../utils/index.js";
const {
  getCoursesService,
  getCourseByIdService,
  addCourseService,
  updateCourseService,
  deleteCourseByIdService,
  toggleFavoriteCourseService,
} = courseServices;

/**
 * GET /courses
 * Query: ?q=searchText&category=Figma&limit=12&page=1
 */
export const getCourses = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { q, category, limit = 3, page = 1 } = req.query;

  const filter: Record<string, unknown> = {};
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
    data: courses,
    total,
    page: currentPage,
    limit: perPage,
    hasMore: (currentPage - 1) * perPage + courses.length < total,
  });
};

export const getCourseById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const course = await getCourseByIdService(id);
  if (!course) {
    res.status(404).json({ error: "Course not found" });
    return;
  }
  res.json(course);
};

export const addCourse = async (req: Request, res: Response): Promise<void> => {
  const course = await addCourseService(req.body);
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

export const toggleFavoriteCourse = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id: courseId } = req.params;
  const { _id: userId } = req.user;
  if (!userId) {
    throw HttpError(404, "User not found");
  }

  const { action } = await toggleFavoriteCourseService(userId, courseId);

  res.json({ message: `Course ${action} favorites` });
};

export default {
  getCourses: ctrlWrapper(getCourses),
  getCourseById: ctrlWrapper(getCourseById),
  addCourse: ctrlWrapper(addCourse),
  updateCourse: ctrlWrapper(updateCourse),
  deleteCourseById: ctrlWrapper(deleteCourseById),
  toggleFavoriteCourse: ctrlWrapper(toggleFavoriteCourse),
};
