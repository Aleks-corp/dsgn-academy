import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import type { NextFunction, Response, Request } from "express";
import type { Document, ObjectId } from "mongoose";
import "dotenv/config";

import { ctrlWrapper } from "../decorators/index.js";
import { HttpError } from "../utils/index.js";
import { UserModel } from "../models/index.js";

import type { IUser } from "../types/user.type.js";

export interface UserDocument extends IUser, Document {
  _id: ObjectId;
}

const JWT_SECRET = process.env.JWT_SECRET || "";

const authenticateAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    throw HttpError(401);
  }
  try {
    const jwtPayload: JwtPayload = jwt.verify(token, JWT_SECRET) as JwtPayload;
    const user = (await UserModel.findById(jwtPayload.id)) as UserDocument;
    if (!user || !user.token || user.subscription !== "admin") {
      throw HttpError(401);
    }
  } catch {
    throw HttpError(401);
  }
  next();
};

export default ctrlWrapper(authenticateAdmin);
