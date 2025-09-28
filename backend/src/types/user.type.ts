import type { Types, Document } from "mongoose";

export type OAuthProvider = "google" | "linkedin";

export type UserSubscription =
  | "free"
  | "trial"
  | "premium"
  | "tester"
  | "admin";

export interface IUserAccount {
  provider: OAuthProvider;
  providerId: string;
}

export interface IUserWatched {
  id: Types.ObjectId | string;
  currentTime?: number;
}

export interface IUserWatchedCourse {
  courseId: Types.ObjectId | string;
  videoId: Types.ObjectId | string;
  currentTime: number;
}

export interface IUser extends Document {
  _id: string | Types.ObjectId;
  name: string;
  avatar: string;
  email: string;
  phone?: string;
  password: string;
  accounts: IUserAccount[];
  ip: string;
  isBlocked: boolean;
  subscription: UserSubscription;
  status?: string;
  amount?: number;
  mode?: string;
  regularDateEnd?: Date;
  lastPayedStatus?: string;
  lastPayedDate?: Date;
  substart: Date;
  subend: Date;
  orderReference: string;
  newOrderReference?: string;
  token?: string;
  verify?: boolean;
  verificationToken: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: number;
  bookmarkedCourses?: Types.ObjectId[];
  bookmarkedVideos?: Types.ObjectId[];
  bookmarkedShorts?: Types.ObjectId[];
  watchedCourses?: IUserWatchedCourse[];
  watchedVideos?: IUserWatched[];
  watchedShorts?: IUserWatched[];
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

export type OAuthUpsertInput = {
  email?: string;
  name?: string;
  avatar?: string;
  provider: "google" | "linkedin";
  providerId: string;
  ip?: string;
};

export type OAuthUpsertResult = {
  token: string;
  updatedUser: IUser;
};
