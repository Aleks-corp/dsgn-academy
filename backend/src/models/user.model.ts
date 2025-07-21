import { Schema, model, Types } from "mongoose";
import type { Model } from "mongoose";
import { modelHooks } from "../utils/index.js";

import {
  emailRegexp,
  passRegexp,
  userSubscription,
  userSubscriptionConst,
  userStatus,
} from "../constants/user.constant.js";
import type { IUser } from "../types/user.type.js";

const { handleUpdateValidator, handlerSaveError } = modelHooks;

type IUserModelType = Model<IUser>;

const userSchema = new Schema<IUser, IUserModelType>(
  {
    name: {
      type: String,
      minlength: 3,
      maxlength: 18,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      match: [emailRegexp, "Please set a valid email address"],
      required: true,
    },
    password: {
      type: String,
      match: [passRegexp, "Please set a valid password"],
      required: true,
    },
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
    favoritesCourses: [{ type: Types.ObjectId, ref: "course" }],
    favoritesVideos: [{ type: Types.ObjectId, ref: "video" }],
    watchedCourses: [{ type: Types.ObjectId, ref: "course" }],
    watchedVideos: [{ type: Types.ObjectId, ref: "video" }],
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", handlerSaveError);

userSchema.pre("findOneAndUpdate", handleUpdateValidator);
userSchema.post("findOneAndUpdate", handlerSaveError);

export default model<IUser, IUserModelType>("user", userSchema);
