import type { ObjectId, Document, Types } from "mongoose";

export type UserSubscription =
  | "free"
  | "trial"
  | "premium"
  | "tester"
  | "admin";

export interface IUser extends Document {
  _id: string | ObjectId;
  name: string;
  email: string;
  password: string;
  ip: string;
  isBlocked: boolean;
  subscription: UserSubscription;
  status?: string;
  amount?: number;
  mode?: string;
  regularDateEnd?: Date;
  lastPayedStatus?: string;
  lastPayedDate?: Date;
  substart?: Date;
  subend?: Date;
  orderReference: string;
  token?: string;
  verify?: boolean;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: number;
  favoritesCourses?: Types.ObjectId[];
  favoritesVideos?: Types.ObjectId[];
  watchedCourses?: Types.ObjectId[];
  watchedVideos?: Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserReg {
  name: string;
  email: string;
  password: string;
  ip: string;
}

export interface IUserLog {
  email: string;
  password: string;
}
