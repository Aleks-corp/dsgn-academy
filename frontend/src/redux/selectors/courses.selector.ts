import { State } from "../../types/state.types";

export const selectCourses = (state: State) => state.courses;

export const selectTotalHits = (state: State) => state.courses.totalHits;

export const selectCurrentFilter = (state: State) =>
  state.courses.currentFilter;

export const selectCourse = (state: State) => state.courses.selectedCourse;

export const selectCourseToEdit = (state: State) => state.courses.courseToEdit;

export const selectIsLoading = (state: State) => state.courses.isLoading;

export const selectCoursesError = (state: State) => state.courses.error;
