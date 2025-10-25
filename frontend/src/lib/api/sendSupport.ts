import { AxiosError } from "axios";
import { instanceFormData } from "./axios";

export const sendToSupport = async (form: FormData) => {
  try {
    const response = await instanceFormData.post("/auth/support", form);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      return error.response?.data.message ?? error.message;
    }
  }
};
