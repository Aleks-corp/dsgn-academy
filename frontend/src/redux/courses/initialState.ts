import { CourseState } from "../../types/state.types";

export const initialState: CourseState = {
  courses: [],
  totalHits: 0,
  currentFilter: "",
  selectedCourse: null,
  isLoading: false,
  error: "",
  courseToEdit: null,
};
