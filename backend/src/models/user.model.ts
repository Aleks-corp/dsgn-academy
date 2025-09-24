import { Schema, model, Types } from "mongoose";
import type { Model } from "mongoose";
import { modelHooks } from "../utils/index.js";

import {
  emailRegexp,
  userSubscription,
  userSubscriptionConst,
  userStatus,
} from "../constants/user.constant.js";
import type { IUser } from "../types/user.type.js";

const { handleUpdateValidator, handlerSaveError } = modelHooks;

type IUserModelType = Model<IUser>;

const AccountSchema = new Schema(
  {
    provider: { type: String, required: true }, // 'google' | 'linkedin'
    providerId: { type: String, required: true },
  },
  { _id: false }
);
const WatchedVideoSchema = new Schema(
  {
    id: { type: Types.ObjectId, ref: "video", required: true },
    currentTime: { type: Number, default: 0 }, // секунди
  },
  { _id: false }
);

const WatchedCourseSchema = new Schema(
  {
    id: { type: Types.ObjectId, ref: "course", required: true },
    currentTime: { type: Number, default: 0 },
  },
  { _id: false }
);

const WatchedShortSchema = new Schema(
  {
    id: { type: Types.ObjectId, ref: "short", required: true },
    currentTime: { type: Number, default: 0 },
  },
  { _id: false }
);

const userSchema = new Schema<IUser, IUserModelType>(
  {
    name: {
      type: String,
      minlength: 3,
      maxlength: 18,
      required: true,
    },
    avatar: { type: String },
    email: {
      type: String,
      match: [emailRegexp, "Будь ласка, вкажіть коректну електронну адресу"],
      required: true,
    },
    phone: { type: String },
    password: {
      type: String,
      required: false,
    },
    accounts: { type: [AccountSchema], default: [] },
    ip: { type: String },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    subscription: {
      type: String,
      enum: userSubscription,
      default: userSubscriptionConst.FREE,
    },
    status: { type: String, enum: userStatus },
    amount: { type: Number },
    mode: { type: String },
    regularDateEnd: { type: Date, default: null },
    lastPayedStatus: { type: String },
    lastPayedDate: { type: Date, default: null },
    substart: {
      type: Date,
      default: null,
      required: function (this: IUser): boolean {
        return this.subscription === "premium";
      },
    },
    subend: {
      type: Date,
      default: null,
      required: function (this: IUser): boolean {
        return this.subscription === "premium";
      },
    },
    orderReference: {
      type: String,
      default: "",
    },
    newOrderReference: {
      type: String,
      default: "",
    },
    token: {
      type: String,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Number,
    },
    bookmarkedCourses: [{ type: Types.ObjectId, ref: "course" }],
    bookmarkedVideos: [{ type: Types.ObjectId, ref: "video" }],
    bookmarkedShorts: [{ type: Types.ObjectId, ref: "short" }],
    watchedCourses: { type: [WatchedCourseSchema], default: [] },
    watchedVideos: { type: [WatchedVideoSchema], default: [] },
    watchedShorts: { type: [WatchedShortSchema], default: [] },
  },
  { versionKey: false, timestamps: true }
);

userSchema.index({ email: 1 }, { unique: true, sparse: true });
userSchema.index(
  { "accounts.provider": 1, "accounts.providerId": 1 },
  { unique: true, sparse: true }
);

userSchema.post("save", handlerSaveError);

userSchema.pre("findOneAndUpdate", handleUpdateValidator);
userSchema.post("findOneAndUpdate", handlerSaveError);

export default model<IUser, IUserModelType>("user", userSchema);
