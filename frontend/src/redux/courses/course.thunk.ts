import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "../../lib/api/axios";
import { AxiosError } from "axios";
import { AddCourse } from "@/types/courses.type";
// import { AddPost, EditPost } from "../../types/posts.types";

interface Query {
  page?: number;
  limit?: number;
  category?: string;
  favorites?: boolean;
  watched?: boolean;
  search?: string;
}

export const fetchCourses = createAsyncThunk(
  "courses/fetchCourses",
  async (
    { page = 1, limit = 12, category = "", search = "" }: Query,
    thunkAPI
  ) => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (category) params.append("category", "category");
    if (search) params.append("q", search);
    try {
      const response = await instance.get(`/courses?${params.toString()}`);
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

export const fetchFavoritesCourses = createAsyncThunk(
  "courses/fetchFavoritesCourses",
  async ({ page = 1, limit = 9, favorites = false }: Query, thunkAPI) => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (favorites) params.append("favorites", "true");
    try {
      const response = await instance.get(`/courses?${params.toString()}`);
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

export const fetchWatchedCourses = createAsyncThunk(
  "courses/fetchWatchedCourses",
  async ({ page = 1, limit = 9, watched = false }: Query, thunkAPI) => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (watched) params.append("watched", "true");
    try {
      const response = await instance.get(`/courses?${params.toString()}`);
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

export const fetchCoursesCount = createAsyncThunk(
  "courses/fetchCoursesCount",
  async (_, thunkAPI) => {
    try {
      const response = await instance.get(`/courses/counts`);
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

export const addCourse = createAsyncThunk(
  "courses/addCourse",
  async (data: AddCourse, thunkAPI) => {
    try {
      const response = await instance.post("/courses", data);
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

export const editCourse = createAsyncThunk(
  "courses/editCourse",
  async (
    { course, courseId }: { course: AddCourse; courseId: string },
    thunkAPI
  ) => {
    try {
      const response = await instance.patch(`/courses/${courseId}`, course);
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
