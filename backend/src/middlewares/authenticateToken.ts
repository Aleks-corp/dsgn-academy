import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import type { NextFunction, Response, Request } from "express";
import type { Document, Types } from "mongoose";
import "dotenv/config";

import { ctrlWrapper } from "../decorators/index.js";
import { checkSubscriptionStatus, HttpError } from "../utils/index.js";
import { UserModel } from "../models/index.js";

import type { IUser } from "../types/user.type.js";

export interface UserDocument extends IUser, Document {
  _id: Types.ObjectId;
}

const JWT_SECRET = process.env.JWT_SECRET || "";

const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next();
  }
  const [bearer, token] = authorization.split(" ");
  if (bearer === "Bearer" && token) {
    try {
      const jwtPayload: JwtPayload = jwt.verify(
        token,
        JWT_SECRET
      ) as JwtPayload;
      const user = (await UserModel.findById(jwtPayload.id)) as UserDocument;
      if (user && user.token) {
        const updatedUser = await checkSubscriptionStatus(user);
        req.user = updatedUser;
      } else {
        return next(HttpError(401));
      }
    } catch {
      return next(HttpError(401));
    }
  }
  next();
};

export default ctrlWrapper(authenticateToken);
