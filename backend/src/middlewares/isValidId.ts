import { isValidObjectId } from "mongoose";
import type { NextFunction, Request, Response } from "express";
import { HttpError } from "../utils/index.js";

const isValidId = (req: Request, __: Response, next: NextFunction): void => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return next(HttpError(400, `${id} is not valid id`));
  }
  next();
};
export default isValidId;
