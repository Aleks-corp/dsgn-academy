import { isValidObjectId } from "mongoose";
import type { NextFunction, Request, Response } from "express";
import { HttpError } from "../utils/index.js";

const isValidId = (req: Request, __: Response, next: NextFunction): void => {
  const { postId } = req.params;
  if (!isValidObjectId(postId)) {
    return next(HttpError(400, `${postId} is not valid id`));
  }
  next();
};
export default isValidId;
