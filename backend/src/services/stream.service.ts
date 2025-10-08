import { StreamModel } from "../models/index.js";
import type { IStream } from "../types/stream.type.js";

const getStreamDataService = async (): Promise<{
  data: IStream | null;
} | null> => {
  return StreamModel.findOne({});
};

const setStreamDataService = async (data: IStream): Promise<IStream> => {
  return StreamModel.create(data);
};

export default {
  getStreamDataService,
  setStreamDataService,
};
