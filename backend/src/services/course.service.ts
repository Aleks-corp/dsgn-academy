import type { FilterQuery, ObjectId } from "mongoose";

import { CourseModel, UserModel } from "../models/index.js";
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
    CourseModel.find(filter)
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec(),
    CourseModel.countDocuments(filter),
  ]);
  return { courses, total, page, limit };
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

export const toggleFavoriteCourseService = async (
  userId: string | ObjectId,
  courseId: string
): Promise<{ action: "added to" | "removed from" }> => {
  const user = await UserModel.findById(userId);
  if (!user) throw new Error("User not found");

  const isFavorite = user.favoritesCourses?.some(
    (id) => id.toString() === courseId
  );

  const action = isFavorite ? "removed from" : "added to";

  await UserModel.findByIdAndUpdate(userId, {
    [isFavorite ? "$pull" : "$addToSet"]: { favoritesCourses: courseId },
  });

  await CourseModel.findByIdAndUpdate(courseId, {
    [isFavorite ? "$pull" : "$addToSet"]: { favoritedBy: userId },
  });

  return { action };
};

export default {
  getCoursesService,
  getCourseByIdService,
  addCourseService,
  updateCourseService,
  deleteCourseByIdService,
  toggleFavoriteCourseService,
};
