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

export const fetchVideos = createAsyncThunk(
  "videos/fetchVideos",
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
        `/videos?page=${page}&limit=${limit}${
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

// export const addVideo = createAsyncThunk(
//   "videos/addVideo",
//   async (data: AddVideo, thunkAPI) => {
//     try {
//       const response = await instance.post("/videos", data);
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

// export const editVideo = createAsyncThunk(
//   "videos/editVideo",
//   async ({ video, videoId }: { video: EditVideo; videoId: string }, thunkAPI) => {
//     try {
//       const response = await instance.patch(`/videos/${videoId}`, video);
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
