import type { Request, Response } from "express";
import { testServices } from "../services/index.js";
import { ctrlWrapper } from "../decorators/index.js";
import "dotenv/config";
const { isTesterService } = testServices;

const { END_TEST } = process.env;

export const isAlpha = async (_: Request, res: Response): Promise<void> => {
  const current = new Date().getTime();
  const testing = { isAlpha: false, timer: 0 };
  if (END_TEST && current < parseInt(END_TEST)) {
    testing.isAlpha = true;
    testing.timer = parseInt(END_TEST);
  }
  res.json(testing);
};

export const isTester = async (req: Request, res: Response): Promise<void> => {
  const testing = await isTesterService(req.body);
  res.json(testing);
};

export default {
  isAlpha: ctrlWrapper(isAlpha),
  isTester: ctrlWrapper(isTester),
};
