import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "../../lib/api/axios";
import { AxiosError } from "axios";
import { AddVideo } from "@/types/videos.type";

interface Query {
  page?: number;
  limit?: number;
  category?: string;
  filter?: string;
  free?: boolean;
  recommended?: boolean;
  search?: string;
  favorites?: boolean;
  watched?: boolean;
}

export const fetchVideos = createAsyncThunk(
  "videos/fetchVideos",
  async (
    {
      page = 1,
      limit = 9,
      category = "",
      filter = "",
      free = false,
      recommended = false,
      search = "",
    }: Query,
    thunkAPI
  ) => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (category) params.append("category", category);
    if (filter) params.append("filter", filter);
    if (free) params.append("free", "true");
    if (recommended) params.append("recommended", "true");
    if (search) params.append("q", search);
    try {
      const response = await instance.get(`/videos?${params.toString()}`);
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

export const fetchRecommended = createAsyncThunk(
  "videos/fetchRecommendedVideos",
  async (
    { page = 1, limit = 5, recommended = false, filter = "" }: Query,
    thunkAPI
  ) => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (filter) params.append("filter", filter);
    if (recommended) params.append("recommended", "true");
    try {
      const response = await instance.get(`/videos?${params.toString()}`);
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

export const fetchFavoritesVideos = createAsyncThunk(
  "videos/fetchFavoritesVideos",
  async ({ page = 1, limit = 9, favorites = false }: Query, thunkAPI) => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (favorites) params.append("favorites", "true");
    try {
      const response = await instance.get(`/videos?${params.toString()}`);
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

export const fetchWatchedVideos = createAsyncThunk(
  "videos/fetchWatchedVideos",
  async ({ page = 1, limit = 9, watched = false }: Query, thunkAPI) => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (watched) params.append("watched", "true");
    try {
      const response = await instance.get(`/videos?${params.toString()}`);
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

export const fetchVideoById = createAsyncThunk(
  "videos/fetchVideoById",
  async (id: string, thunkAPI) => {
    try {
      const response = await instance.get(`/videos/${id}`);
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

export const fetchVideosCount = createAsyncThunk(
  "videos/fetchVideosCount",
  async (category: string | undefined, thunkAPI) => {
    console.log("🚀 ~ category:", category);
    console.log(`/videos/counts/category/${category ? category : ""}`);
    try {
      const response = await instance.get(
        `/videos/counts/category/${category ? category : ""}`
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

export const checkDownloadPermission = createAsyncThunk(
  "posts/checkDownloadPermission",
  async (videoId: string, thunkAPI) => {
    try {
      const response: {
        data: { downloadUrl: string; dailyDownloadCount?: number };
      } = await instance.get(`/videos/check-download/${videoId}`);
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

export const addVideo = createAsyncThunk(
  "videos/addVideo",
  async (data: AddVideo, thunkAPI) => {
    try {
      const response = await instance.post("/videos", data);
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

export const editVideo = createAsyncThunk(
  "videos/editVideo",
  async (
    { video, videoId }: { video: AddVideo; videoId: string },
    thunkAPI
  ) => {
    try {
      const response = await instance.patch(`/videos/${videoId}`, video);
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

export const addRemoveFavoritesVideo = createAsyncThunk(
  "videos/favorites",
  async (videoId: string, thunkAPI) => {
    try {
      const response = await instance.patch(`/videos`, {
        videoId,
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

export const deleteVideo = createAsyncThunk(
  "videos/deleteVideo",
  async (id: string, thunkAPI) => {
    try {
      await instance.delete(`/videos/${id}`);
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
