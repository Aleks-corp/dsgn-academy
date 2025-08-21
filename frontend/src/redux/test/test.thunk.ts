import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { toast } from "react-hot-toast";
import { instance } from "../../lib/api/axios";

export const isAlpha = createAsyncThunk("test/isalpha", async (_, thunkAPI) => {
  try {
    const response = await instance.get("/testing");
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(`App in testing`);
      return thunkAPI.rejectWithValue(error.response?.data ?? error.message);
    }
  }
});

export const isTester = createAsyncThunk(
  "test/istester",
  async (token: string, thunkAPI) => {
    try {
      const response = await instance.get(`/testing/login/${token}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(`App in testing`);
        return thunkAPI.rejectWithValue(error.response?.data ?? error.message);
      }
    }
  }
);
