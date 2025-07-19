import type { NextFunction, Request, Response } from "express";
import { HttpError } from "../utils/index.js";

const isEmptyBody = (req: Request, __: Response, next: NextFunction): void => {
  if (!Object.keys(req.body).length) {
    return next(HttpError(400, "Missing fields"));
  }
  next();
};

export default isEmptyBody;
