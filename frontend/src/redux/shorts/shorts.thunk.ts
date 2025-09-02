import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "@/lib/api/axios";
import { AxiosError } from "axios";
import type { AddShort, TagsMode } from "@/types/shorts.type";
// import { AddPost, EditPost } from "../../types/posts.types";

interface Query {
  limit?: number;
  tag?: string;
  cursor?: string;
  tagsMode?: string;
}

type ShortsSliceShape = {
  nextCursor: string | null;
  limit: number;
  activeTags: string[];
  tagsMode: TagsMode;
};

export const fetchShorts = createAsyncThunk(
  "shorts/fetchShorts",
  async (
    { limit = 9, tag = "", cursor = "", tagsMode = "" }: Query,
    thunkAPI
  ) => {
    const params = new URLSearchParams();
    if (limit) params.set("limit", String(limit));
    if (cursor) params.set("cursor", cursor);
    if (tag) params.set("tags", tag);
    if (tagsMode) params.set("tagsMode", tagsMode);
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

export const fetchShortsCount = createAsyncThunk(
  "shorts/fetchCount",
  async (_, thunkAPI) => {
    try {
      const response = await instance.get("/shorts/count");
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

export const fetchShortsNext = createAsyncThunk(
  "shorts/fetchShortsNext",
  async (_, thunkAPI) => {
    const { shorts: state } = thunkAPI.getState() as {
      shorts: ShortsSliceShape;
    };
    if (!state.nextCursor) return { shorts: [], nextCursor: null };
    const params = new URLSearchParams();
    params.set("limit", String(state.limit));
    params.set("cursor", state.nextCursor);
    if (state.activeTags.length) params.set("tags", state.activeTags.join(","));
    params.set("tagsMode", state.tagsMode);
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
  "shorts/fetchById",
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

export const fetchSequence = createAsyncThunk(
  "shorts/fetchSequence",
  async (
    { limit = 200, tag = "", cursor = "", tagsMode = "" }: Query,
    thunkAPI
  ) => {
    const params = new URLSearchParams();
    params.set("limit", String(limit));
    if (cursor) params.set("cursor", cursor);
    if (tag) params.set("tags", tag);
    if (tagsMode) params.set("tagsMode", tagsMode);
    try {
      const response = await instance.get(
        `/shorts/sequence?${params.toString()}`
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

export const fetchTopShortTags = createAsyncThunk(
  "shorts/fetchTopTags",
  async ({ limit = 20 }: { limit: number }, thunkAPI) => {
    try {
      const response = await instance.get(`/shorts/tags/top?limit=${limit}`);
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

// Admin CRUD (під ваші middlewares)
export const addShort = createAsyncThunk(
  "shorts/addShort",
  async (payload: AddShort, thunkAPI) => {
    try {
      const response = await instance.post(`/shorts`, payload);
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

export const editShort = createAsyncThunk(
  "shorts/editShort",
  async ({ id, patch }: { id: string; patch: AddShort }, thunkAPI) => {
    try {
      const response = await instance.patch(`/shorts/${id}`, patch);
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
      const response = await instance.delete(`/shorts/${id}`);
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
