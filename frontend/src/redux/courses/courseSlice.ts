import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { CourseState } from "../../types/state.types";
import {
  fetchCourses,
  fetchCourseById,
  // addCourse,
  addRemoveFavoritesCourse,
  deleteCourse,
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

export const handleFulfilledPosts = (
  state: CourseState,
  action: PayloadAction<{ courses: ICourse[]; totalHits: number }>
): void => {
  const newCourses = action.payload.courses.filter(
    (newCourse) =>
      !state.courses.some((existingPost) => existingPost._id === newCourse._id)
  );
  state.courses = [...state.courses, ...newCourses];

  state.totalHits = action.payload.totalHits;
};

export const handleFulfilledPostById = (
  state: CourseState,
  action: PayloadAction<ICourse>
): void => {
  state.selectedCourse = action.payload;
};

export const handleFulfilledAddPost = (
  state: CourseState,
  action: PayloadAction<ICourse>
): void => {
  state.courses.push({ ...action.payload });
  state.selectedCourse = { ...action.payload };
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

export const handleFulfilledDeletePost = (
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
  name: "course",
  initialState: initialState,
  reducers: {
    clearCourses(state: CourseState) {
      state.courses = [];
      state.totalHits = 0;
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
        state.totalHits = state.totalHits - 1;
      }
    },
    setCourseToEdit: (state, action) => {
      state.courseToEdit = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, handlePending)
      .addCase(fetchCourses.fulfilled, handleFulfilledPosts)
      .addCase(fetchCourseById.pending, handlePending)
      .addCase(fetchCourseById.fulfilled, handleFulfilledPostById)
      // .addCase(addCourse.pending, handlePending)
      // .addCase(addCourse.fulfilled, handleFulfilledAddPost)
      .addCase(addRemoveFavoritesCourse.fulfilled, handleFulfilledAddFavorites)
      .addCase(deleteCourse.pending, handlePending)
      .addCase(deleteCourse.fulfilled, handleFulfilledDeletePost)
      .addMatcher(
        ({ type }) => type.endsWith("/rejected") && type.startsWith("posts"),
        handleRejected
      )
      .addMatcher(
        (action) => action.type.endsWith("fulfilled"),
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
