import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { CourseState } from "../../types/state.types";
import {
  fetchCourses,
  fetchCourseById,
  fetchCoursesCount,
  // addCourse,
  addRemoveFavoritesCourse,
  deleteCourse,
  editCourse,
  addCourse,
} from "./course.thunk";
import { ICourse } from "../../types/courses.type";
import { initialState } from "./initialState";

const handlePending = (state: CourseState) => {
  state.isLoading = true;
};
const handleRejected = (state: CourseState, action: PayloadAction<string>) => {
  state.isLoading = false;
  state.error = action.payload;
};

const handleFulfilled = (state: CourseState) => {
  state.error = "";
  state.isLoading = false;
};

export const handleFulfilledCourses = (
  state: CourseState,
  action: PayloadAction<{ courses: ICourse[]; total: number; page: number }>
): void => {
  if (action.payload.page === 1) {
    state.courses = action.payload.courses;
  } else {
    const newCourses = action.payload.courses.filter(
      (newCourse) =>
        !state.courses.some(
          (existingCourse) => existingCourse._id === newCourse._id
        )
    );
    state.courses = [...state.courses, ...newCourses];
  }
  state.totalCourses = action.payload.total;
};

export const handleFulfilledCoursesCount = (
  state: CourseState,
  action: PayloadAction<{
    totalCourses: number;
  }>
): void => {
  state.totalCourses = action.payload.totalCourses;
};

export const handleFulfilledCourseById = (
  state: CourseState,
  action: PayloadAction<ICourse>
): void => {
  state.selectedCourse = action.payload;
};

export const handleFulfilledAddCourse = (
  state: CourseState,
  action: PayloadAction<ICourse>
): void => {
  state.courses.push({ ...action.payload });
  state.selectedCourse = { ...action.payload };
};

export const handleFulfilledEditCourse = (
  state: CourseState,
  action: PayloadAction<ICourse>
): void => {
  const updatedCourse = action.payload;
  const index = state.courses.findIndex((i) => i._id === updatedCourse._id);
  if (index !== -1) {
    state.courses.splice(index, 1, updatedCourse);
  }
  if (state.selectedCourse) {
    state.selectedCourse = updatedCourse;
  }
};

export const handleFulfilledAddFavorites = (
  state: CourseState,
  action: PayloadAction<ICourse>
): void => {
  const updatedCourse = action.payload;
  const index = state.courses.findIndex((i) => i._id === updatedCourse._id);
  if (index !== -1) {
    state.courses[index].favoritedBy = updatedCourse.favoritedBy;
  }
  if (state.selectedCourse) {
    state.selectedCourse.favoritedBy = updatedCourse.favoritedBy;
  }
};

export const handleFulfilledDeleteCourse = (
  state: CourseState,
  action: PayloadAction<string | undefined>
): void => {
  const postIndex = state.courses.findIndex(
    (item) => item._id === action.payload
  );
  if (postIndex !== -1) {
    state.courses.splice(postIndex, 1);
  }
  state.selectedCourse = null;
};

const courseSlice = createSlice({
  name: "courses",
  initialState: initialState,
  reducers: {
    clearCourses(state: CourseState) {
      state.courses = [];
      state.totalCourses = 0;
    },
    setFilter(state: CourseState, action: PayloadAction<string>) {
      state.currentFilter = action.payload;
    },
    clearCourse(state: CourseState) {
      state.selectedCourse = null;
    },
    deleteCourseFavorites(state: CourseState, action: PayloadAction<string>) {
      const index = state.courses.findIndex((i) => i._id === action.payload);
      if (index !== -1) {
        state.courses.splice(index, 1);
        if (state.totalCourses) {
          state.totalCourses = state.totalCourses - 1;
        }
      }
    },
    setCourseToEdit: (state, action) => {
      state.courseToEdit = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, handlePending)
      .addCase(fetchCourses.fulfilled, handleFulfilledCourses)
      .addCase(fetchCourseById.pending, handlePending)
      .addCase(fetchCourseById.fulfilled, handleFulfilledCourseById)
      .addCase(fetchCoursesCount.fulfilled, handleFulfilledCoursesCount)
      .addCase(addCourse.pending, handlePending)
      .addCase(addCourse.fulfilled, handleFulfilledAddCourse)
      .addCase(editCourse.pending, handlePending)
      .addCase(editCourse.fulfilled, handleFulfilledEditCourse)
      .addCase(addRemoveFavoritesCourse.fulfilled, handleFulfilledAddFavorites)
      .addCase(deleteCourse.pending, handlePending)
      .addCase(deleteCourse.fulfilled, handleFulfilledDeleteCourse)
      .addMatcher(
        ({ type }) => type.endsWith("/rejected") && type.startsWith("courses"),
        handleRejected
      )
      .addMatcher(
        ({ type }) => type.startsWith("courses") && type.endsWith("/fulfilled"),
        handleFulfilled
      );
  },
});

export const {
  clearCourses,
  setFilter,
  clearCourse,
  deleteCourseFavorites,
  setCourseToEdit,
} = courseSlice.actions;
export const courseReducer = courseSlice.reducer;
