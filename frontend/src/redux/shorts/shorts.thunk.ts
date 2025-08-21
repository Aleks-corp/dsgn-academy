import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "../../lib/api/axios";
import { AxiosError } from "axios";
// import { AddPost, EditPost } from "../../types/posts.types";

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

export const fetchShorts = createAsyncThunk(
  "shorts/fetchShorts",
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
      const response = await instance.get(`/shorts?${params.toString()}`);
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
  "shorts/fetchRecommendedShorts",
  async ({ page = 1, limit = 5, recommended = false }: Query, thunkAPI) => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (recommended) params.append("recommended", "true");
    try {
      const response = await instance.get(`/shorts?${params.toString()}`);
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

export const fetchFavoritesShorts = createAsyncThunk(
  "shorts/fetchFavoritesShorts",
  async ({ page = 1, limit = 9, favorites = false }: Query, thunkAPI) => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (favorites) params.append("favorites", "true");
    try {
      const response = await instance.get(`/shorts?${params.toString()}`);
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

export const fetchWatchedShorts = createAsyncThunk(
  "shorts/fetchWatchedShorts",
  async ({ page = 1, limit = 9, watched = false }: Query, thunkAPI) => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (watched) params.append("watched", "true");
    try {
      const response = await instance.get(`/shorts?${params.toString()}`);
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

export const fetchShortById = createAsyncThunk(
  "shorts/fetchShortById",
  async (id: string, thunkAPI) => {
    try {
      const response = await instance.get(`/shorts/${id}`);
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
  async (shortId: string, thunkAPI) => {
    try {
      const response: {
        data: { downloadUrl: string; dailyDownloadCount?: number };
      } = await instance.get(`/shorts/check-download/${shortId}`);
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

// export const addShort = createAsyncThunk(
//   "shorts/addShort",
//   async (data: AddShort, thunkAPI) => {
//     try {
//       const response = await instance.post("/shorts", data);
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

// export const editShort = createAsyncThunk(
//   "shorts/editShort",
//   async ({ short, shortId }: { short: EditShort; shortId: string }, thunkAPI) => {
//     try {
//       const response = await instance.patch(`/shorts/${shortId}`, short);
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

export const addRemoveFavoritesShort = createAsyncThunk(
  "shorts/favorites",
  async (shortId: string, thunkAPI) => {
    try {
      const response = await instance.patch(`/shorts`, {
        shortId,
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

export const deleteShort = createAsyncThunk(
  "shorts/deleteShort",
  async (id: string, thunkAPI) => {
    try {
      await instance.delete(`/shorts/${id}`);
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
