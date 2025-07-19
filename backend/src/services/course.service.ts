import type { FilterQuery } from "mongoose";

import { CourseModel } from "../models/index";
import type { ICourse } from "../types/course.type";

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

export default {
  getCoursesService,
  getCourseByIdService,
  addCourseService,
  updateCourseService,
  deleteCourseByIdService,
};
