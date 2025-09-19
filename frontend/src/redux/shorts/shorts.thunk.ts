import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "@/lib/api/axios";
import { AxiosError } from "axios";
import type { AddShort } from "@/types/shorts.type";

interface Query {
  limit?: number;
  page?: number;
  tag?: string;
  cursor?: string;
  tagsMode?: string;
}

export const fetchShorts = createAsyncThunk(
  "shorts/fetchShorts",
  async (
    { limit = 18, tag = "", page = 1, tagsMode = "any" }: Query,
    thunkAPI
  ) => {
    const params = new URLSearchParams();
    params.set("limit", String(limit));
    params.set("page", String(page));
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
