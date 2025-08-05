import type { Request, Response } from "express";
import { testServices } from "../services/index.js";
import { ctrlWrapper } from "../decorators/index.js";
import { endOfTest } from "../constants/alpha.js";
const { isTesterService } = testServices;

export const isAlpha = async (req: Request, res: Response): Promise<void> => {
  const current = new Date().getTime();
  const testing = { isAlpha: false, timer: 0 };
  if (current < endOfTest) {
    testing.isAlpha = true;
    testing.timer = endOfTest;
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
