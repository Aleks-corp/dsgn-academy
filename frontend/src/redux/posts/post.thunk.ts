import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "../../api/axios";
import { AxiosError } from "axios";
import { AddPost, EditPost } from "../../types/posts.types";

interface Query {
  page?: number;
  limit?: number;
  filter?: string;
  favorites?: boolean;
  search?: string;
}

export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
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
        `/posts?page=${page}&limit=${limit}${
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

export const fetchPostById = createAsyncThunk(
  "posts/fetchPostById",
  async (id: string, thunkAPI) => {
    try {
      const response = await instance.get(`/posts/${id}`);
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
  async (postId: string, thunkAPI) => {
    try {
      const response: {
        data: { downloadUrl: string; dailyDownloadCount?: number };
      } = await instance.get(`/posts/check-download/${postId}`);
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

export const addPost = createAsyncThunk(
  "posts/addPost",
  async (data: AddPost, thunkAPI) => {
    try {
      const response = await instance.post("/posts", data);
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

export const editPost = createAsyncThunk(
  "posts/addPost",
  async ({ post, postId }: { post: EditPost; postId: string }, thunkAPI) => {
    try {
      const response = await instance.patch(`/posts/${postId}`, post);
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

export const addRemoveFavorites = createAsyncThunk(
  "posts/favorites",
  async (postId: string, thunkAPI) => {
    try {
      const response = await instance.patch(`/posts`, {
        postId,
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

export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (id: string, thunkAPI) => {
    try {
      await instance.delete(`/posts/${id}`);
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
