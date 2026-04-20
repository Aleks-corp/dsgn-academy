import { AxiosError } from "axios";
import { instance } from "./axios";

export const fetchCourseById = async (id: string) => {
  try {
    const response = await instance.get(`/cources/${id}`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message ?? error.message);
    }
    throw error;
  }
};

export const fetchVideoById = async (id: string) => {
  try {
    const response = await instance.get(`/videos/${id}`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message ?? error.message);
    }
    throw error;
  }
};
