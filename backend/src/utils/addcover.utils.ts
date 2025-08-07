import axios, { AxiosError } from "axios";

interface IData {
  title: string;
  author_name: string;
  duration: number;
  description: string;
  thumbnail_url: string;
  thumbnail_url_with_play_button: string;
  upload_date: string;
}

export default async function fetchVideoDataById(
  url: string
): Promise<IData | undefined> {
  try {
    const response = await axios.get(
      `https://vimeo.com/api/oembed.json?url=${url}`
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      return error.response?.data.message ?? error.message;
    }
  }
}
