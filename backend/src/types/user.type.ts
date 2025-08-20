import type { ObjectId, Document, Types } from "mongoose";

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

export interface IUserFavWatched {
  id: Types.ObjectId;
  updatedAt: Date;
}

export interface IUser extends Document {
  _id: string | ObjectId;
  name: string;
  avatar: string;
  email: string;
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
  token?: string;
  verify?: boolean;
  verificationToken: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: number;
  favoritesCourses?: IUserFavWatched[];
  favoritesVideos?: IUserFavWatched[];
  watchedCourses?: IUserFavWatched[];
  watchedVideos?: IUserFavWatched[];
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
