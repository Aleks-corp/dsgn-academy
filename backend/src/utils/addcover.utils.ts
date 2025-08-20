import axios, { AxiosError } from "axios";
import "dotenv/config";

const { VIMEO_TOKEN } = process.env;

export interface IProgressive {
  type: string;
  link: string;
  rendition: string;
}

export interface IData {
  name: string;
  description: string;
  duration: number;
  pictures: { base_link: string };
  release_time: string;
  play: {
    progressive: IProgressive[];
  };
}

export default async function fetchVideoDataById(
  id: string
): Promise<IData | undefined> {
  // const id = url.replace("https://vimeo.com/", "");
  try {
    const response = await axios(`https://api.vimeo.com/videos/${id}`, {
      headers: {
        Authorization: `Bearer ${VIMEO_TOKEN}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      return error.response?.data.message ?? error.message;
    }
  }
}
