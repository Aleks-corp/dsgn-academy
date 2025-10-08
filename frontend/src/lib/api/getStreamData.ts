import { AxiosError } from "axios";
import { instance } from "./axios";

export const fetchStreamData = async () => {
  try {
    const response = await instance.get(`/stream/data`);
    return { data: response.data, status: response.status };
  } catch (error) {
    if (error instanceof AxiosError) {
      return error.response?.data.message ?? error.message;
    }
  }
};
