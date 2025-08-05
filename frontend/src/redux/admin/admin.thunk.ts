import { createAsyncThunk } from "@reduxjs/toolkit";
import { UserProfile } from "../../types/auth.types";
import { instance } from "../../api/axios";

interface Query {
  page?: number;
  limit?: number;
}

export const getAllUsers = createAsyncThunk(
  "admin/getallusers",
  async ({ page = 1, limit = 100 }: Query, thunkAPI) => {
    try {
      const response = await instance.get(
        `/admin/users/?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (e) {
      if (e instanceof Error) {
        return thunkAPI.rejectWithValue(e.message);
      }
    }
  }
);

export const patchUser = createAsyncThunk(
  "admin/updateuser",
  async (userData: UserProfile, thunkAPI) => {
    try {
      const response = await instance.patch("/admin/user", userData);
      return response.data;
    } catch (e) {
      if (e instanceof Error) {
        return thunkAPI.rejectWithValue(e.message);
      }
    }
  }
);

export const patchUsers = createAsyncThunk(
  "admin/updateusers",
  async (userData: { usersId: string[]; subscription: string }, thunkAPI) => {
    try {
      const response = await instance.patch("/admin/users", userData);
      return response.data;
    } catch (e) {
      if (e instanceof Error) {
        return thunkAPI.rejectWithValue(e.message);
      }
    }
  }
);

export const banUsers = createAsyncThunk(
  "admin/banusers",
  async (userData: { usersId: string[] }, thunkAPI) => {
    try {
      const response = await instance.patch(
        "/admin/users/status-blocked",
        userData
      );
      return response.data;
    } catch (e) {
      if (e instanceof Error) {
        return thunkAPI.rejectWithValue(e.message);
      }
    }
  }
);

export const patchCheckSub = createAsyncThunk(
  "admin/checksubusers",
  async (userData: { usersId: string[] }, thunkAPI) => {
    try {
      const response = await instance.patch("/admin/users/status", userData);
      return response.data;
    } catch (e) {
      if (e instanceof Error) {
        return thunkAPI.rejectWithValue(e.message);
      }
    }
  }
);

export const getUnpublishedPosts = createAsyncThunk(
  "admin/getunpublposts",
  async ({ page = 1, limit = 12 }: Query, thunkAPI) => {
    try {
      const response = await instance.get(
        `/admin/posts?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (e) {
      if (e instanceof Error) {
        return thunkAPI.rejectWithValue(e.message);
      }
    }
  }
);

export const getUnpublishedPostById = createAsyncThunk(
  "admin/getunpublpost",
  async (postId: string, thunkAPI) => {
    try {
      const response = await instance.get(`/admin/post/${postId}`);
      return response.data;
    } catch (e) {
      if (e instanceof Error) {
        return thunkAPI.rejectWithValue(e.message);
      }
    }
  }
);

export const sendMessageSpt = createAsyncThunk(
  "admin/sendmessagespt",
  async (userData: { message: string }, thunkAPI) => {
    try {
      const response = await instance.post(`/admin/message`, userData);
      return response.data;
    } catch (e) {
      if (e instanceof Error) {
        return thunkAPI.rejectWithValue(e.message);
      }
    }
  }
);
