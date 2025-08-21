import { AxiosError } from "axios";
import { instance } from "./axios";

export const fetchVideoData = async (vimeoId: string) => {
  try {
    const response = await instance.get(`/videos/data/vimeo/${vimeoId}`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      return error.response?.data.message ?? error.message;
    }
  }
};
