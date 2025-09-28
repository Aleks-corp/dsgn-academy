import { State } from "../../types/state.types";

export const selectCourses = (state: State) => state.courses.courses;

export const selectBookmarkedCourses = (state: State) =>
  state.courses.bookmarkedCourses;

export const selectTotalCourses = (state: State) => state.courses.totalCourses;

export const selectCurrentFilter = (state: State) =>
  state.courses.currentFilter;

export const selectCourse = (state: State) => state.courses.selectedCourse;

export const selectCourseToEdit = (state: State) => state.courses.courseToEdit;

export const selectIsLoadingCourses = (state: State) => state.courses.isLoading;

export const selectCoursesError = (state: State) => state.courses.error;
