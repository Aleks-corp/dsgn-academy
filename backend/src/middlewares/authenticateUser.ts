import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import type { NextFunction, Response, Request } from "express";
import type { Document, ObjectId } from "mongoose";
import "dotenv/config";

import { ctrlWrapper } from "../decorators/index.js";
import { HttpError } from "../utils/index.js";
import { UserModel } from "../models/index.js";

import type { IUser } from "../types/user.type.js";
// import { checkSubscriptionStatus } from "src/helpers/CheckSubscriptionStatus";
// import { resetLimitedDownload } from "src/helpers/checkDownloadPermission";

export interface UserDocument extends IUser, Document {
  _id: ObjectId;
}

const JWT_SECRET = process.env.JWT_SECRET || "";

const authenticateUser = async (
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
    if (!user || !user.token) {
      throw HttpError(401);
    }
    if (user.subscription === "admin") {
      req.user = user;
      next();
    } else {
      req.user = user;
      // const resetUser = await resetLimitedDownload(user);
      // const updatedUser = await checkSubscriptionStatus(resetUser);
      // req.user = updatedUser;
      next();
    }
  } catch {
    throw HttpError(401);
  }
};

export default ctrlWrapper(authenticateUser);
