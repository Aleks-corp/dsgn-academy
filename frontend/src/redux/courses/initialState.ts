import { CourseState } from "../../types/state.types";

export const initialState: CourseState = {
  courses: [],
  bookmarkedCourses: [],
  totalHits: 0,
  totalCourses: undefined,
  currentFilter: "",
  selectedCourse: null,
  isLoading: false,
  error: "",
  courseToEdit: null,
};
