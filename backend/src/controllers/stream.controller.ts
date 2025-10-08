import type { Request, Response } from "express";
import { streamServices } from "../services/index.js";
import { ctrlWrapper } from "../decorators/index.js";
import "dotenv/config";
const { getStreamDataService, setStreamDataService } = streamServices;

export const fetchStreamData = async (
  _: Request,
  res: Response
): Promise<void> => {
  const data = await getStreamDataService();
  res.json(data);
};

export const setStreamData = async (
  req: Request,
  res: Response
): Promise<void> => {
  await setStreamDataService(req.body);
  res.json({ message: "new stream seted" });
};

export default {
  fetchStreamData: ctrlWrapper(fetchStreamData),
  setStreamData: ctrlWrapper(setStreamData),
};
