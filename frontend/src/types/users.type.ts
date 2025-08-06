export type UserSubscription =
  | "free"
  | "trial"
  | "premium"
  | "tester"
  | "admin";

export interface IUser {
  _id: string;
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
  substart: Date;
  subend: Date;
  orderReference: string;
  token?: string;
  verify?: boolean;
  verificationToken: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: number;
  favoritesCourses?: string[];
  favoritesVideos?: string[];
  watchedCourses?: string[];
  watchedVideos?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface GetUser {
  token: string;
  user: IUser;
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

export interface IUserForgot {
  email: string;
}

export interface IUserNewPass {
  newPassToken: string;
  password: string;
}

export interface IUserChangePass {
  oldPassword: string;
  newPassword: string;
}
