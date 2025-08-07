import type { NextFunction, Request, Response } from "express";
import { HttpError } from "../utils/index.js";

const isEmptyBody = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.body || !Object.keys(req.body).length) {
    return next(HttpError(400, "Missing fields"));
  }

  next();
};

export default isEmptyBody;
