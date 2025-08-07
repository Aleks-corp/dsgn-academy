import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "../../lib/api/axios";
import { AxiosError } from "axios";
// import { AddPost, EditPost } from "../../types/posts.types";

interface Query {
  page?: number;
  limit?: number;
  filter?: string;
  favorites?: boolean;
  search?: string;
}

export const fetchCourses = createAsyncThunk(
  "courses/fetchCourses",
  async (
    {
      page = 1,
      limit = 12,
      filter = "",
      favorites = false,
      search = "",
    }: Query,
    thunkAPI
  ) => {
    try {
      const response = await instance.get(
        `/courses?page=${page}&limit=${limit}${
          filter ? `&filter=${filter}` : ``
        }${favorites ? `&favorites=${favorites}` : ``}${
          search ? `&search=${search}` : ``
        }`
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return thunkAPI.rejectWithValue(
          error.response?.data.message ?? error.message
        );
      }
    }
  }
);

export const fetchCourseById = createAsyncThunk(
  "courses/fetchCourseById",
  async (id: string, thunkAPI) => {
    try {
      const response = await instance.get(`/courses/${id}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return thunkAPI.rejectWithValue(
          error.response?.data.message ?? error.message
        );
      }
    }
  }
);

export const checkDownloadPermission = createAsyncThunk(
  "courses/checkDownloadPermission",
  async (courseId: string, thunkAPI) => {
    try {
      const response: {
        data: { downloadUrl: string; dailyDownloadCount?: number };
      } = await instance.get(`/courses/check-download/${courseId}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return thunkAPI.rejectWithValue(
          error.response?.data.message ?? error.message
        );
      }
    }
  }
);

// export const addCourse = createAsyncThunk(
//   "courses/addCourse",
//   async (data: AddCourse, thunkAPI) => {
//     try {
//       const response = await instance.post("/courses", data);
//       return response.data;
//     } catch (error) {
//       if (error instanceof AxiosError) {
//         return thunkAPI.rejectWithValue(
//           error.response?.data.message ?? error.message
//         );
//       }
//     }
//   }
// );

// export const editCourse = createAsyncThunk(
//   "courses/editCourse",
//   async ({ course, courseId }: { courses: EditCourse; courseId: string }, thunkAPI) => {
//     try {
//       const response = await instance.patch(`/courses/${courseId}`, course);
//       return response.data;
//     } catch (error) {
//       if (error instanceof AxiosError) {
//         return thunkAPI.rejectWithValue(
//           error.response?.data.message ?? error.message
//         );
//       }
//     }
//   }
// );

export const addRemoveFavoritesCourse = createAsyncThunk(
  "courses/favorites",
  async (courseId: string, thunkAPI) => {
    try {
      const response = await instance.patch(`/courses`, {
        courseId,
      });

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return thunkAPI.rejectWithValue(
          error.response?.data.message ?? error.message
        );
      }
    }
  }
);

export const deleteCourse = createAsyncThunk(
  "courses/deleteCourse",
  async (id: string, thunkAPI) => {
    try {
      await instance.delete(`/courses/${id}`);
      return id;
    } catch (error) {
      if (error instanceof AxiosError) {
        return thunkAPI.rejectWithValue(
          error.response?.data.message ?? error.message
        );
      }
    }
  }
);
