import "dotenv/config";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import axios from "axios";
import { nanoid } from "nanoid";
import type { ObjectId } from "mongoose";

import type { IUser, IUserReg, UserSubscription } from "../types/user.type.js";
import type {
  PaymentData,
  RequestData,
  ResponseData,
} from "../types/data.types.js";
import { UserModel } from "../models/index.js";

import { userSubscriptionConst } from "../constants/user.constant.js";
import { amountData } from "../constants/amount.data.js";

import {
  HttpError,
  sendMail,
  checkSubscriptionStatus,
  nextDate,
  unsubscribeUser,
  migrateFromOldBase,
  registrationSale,
} from "../utils/index.js";

const {
  JWT_SECRET,
  WFP_SECRET_KEY,
  WFP_MERCHANT_ACCOUNT,
  WFP_MERCHANT_DOMAIN_NAME,
  VITE_BASE_URL,
  IPHUB_API_KEY,
  DATE_FOR_TRIAL,
} = process.env;

export const registerService = async ({
  name,
  email,
  password,
  ip,
}: IUserReg): Promise<void> => {
  const user = await UserModel.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use. Please Sign In.");
  }

  if (ip && ip !== "") {
    const { data } = await axios.get(`https://v2.api.iphub.info/ip/${ip}`, {
      headers: {
        "X-Key": IPHUB_API_KEY as string,
      },
    });

    if (data.block === 1 || data.block === 2) {
      throw HttpError(403, "Registration via VPN or Proxy is not allowed.");
    }
    const sameIpUsers = await UserModel.countDocuments({ ip });

    if (sameIpUsers > 0) {
      throw HttpError(
        403,
        "Too many registrations from your network. Contact support."
      );
    }
  }
  const migrateUserData = await migrateFromOldBase({ email });
  const registerSale = registrationSale(DATE_FOR_TRIAL);
  const userData = {
    password: await bcrypt.hash(password, 10),
    verificationToken: nanoid(),
    orderReference: migrateUserData
      ? migrateUserData.PaymentOrder
      : registerSale.orderReference,
    regularDateEnd:
      migrateUserData && migrateUserData.Status === "ACTIVE"
        ? migrateUserData.ExpirationDate
        : null,
    substart: migrateUserData ? null : registerSale.substart,
    subend: migrateUserData ? null : registerSale.subend,
    subscription: migrateUserData
      ? userSubscriptionConst.FREE
      : userSubscriptionConst.TRIAL,
  };
  const emailText =
    userData.subscription === userSubscriptionConst.TRIAL
      ? "Thank you for signing up! To complete your registration, please verify your email address by clicking the button below. As a new user, you will receive <strong>3 days of Limit Premium access</strong> after verification."
      : "Thank you for signing up! To complete your registration, please verify your email address by clicking the button below.";

  await UserModel.create({
    name,
    email,

    ip,
    ...userData,
  });
  const maildata = await sendMail({
    email,
    verificationToken: userData.verificationToken,
    path: "verify",
    text: emailText,
  });
  if (!maildata) {
    throw HttpError(400, "Email not sent");
  }
};

export const loginService = async ({
  email,
  password,
  ip,
}: {
  email: string;
  password: string;
  ip: string;
}): Promise<{
  token: string;
  updatedUser: IUser;
}> => {
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password not valid");
  }
  if (!(await bcrypt.compare(password, user.password))) {
    throw HttpError(401, "Email or password not valid");
  }
  if (!user.verify) {
    throw HttpError(403, "Non verified user, please check email");
  }
  const updatedUser = await checkSubscriptionStatus(user);

  const token = jwt.sign({ id: user._id }, JWT_SECRET ? JWT_SECRET : "", {
    expiresIn: "333h",
  });
  if (ip && ip !== "") {
    try {
      const { data } = await axios.get(`https://v2.api.iphub.info/ip/${ip}`, {
        headers: {
          "X-Key": IPHUB_API_KEY as string,
        },
      });
      if (data.block === 1 || data.block === 2) {
        await UserModel.findByIdAndUpdate(user._id, { token });
        return { token, updatedUser };
      }
    } catch (error) {
      console.log("🚀 ~ error:", error);
    }

    await UserModel.findByIdAndUpdate(user._id, { token, ip });
    return { token, updatedUser };
  }

  await UserModel.findByIdAndUpdate(user._id, { token });
  return { token, updatedUser };
};

export const logoutService = async (
  _id: ObjectId
): Promise<{ message: string }> => {
  const user = await UserModel.findById(_id);
  if (!user) {
    throw HttpError(401, "User not found");
  }
  await UserModel.findByIdAndUpdate(_id, { token: "" });
  return { message: "Logout successful" };
};

export const verificationService = async (
  verificationToken: string
): Promise<{
  message: string;
}> => {
  const user = await UserModel.findOne({ verificationToken });
  if (!user) {
    throw HttpError(404, "User not found");
  }
  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }
  await UserModel.findByIdAndUpdate(user._id, {
    verify: true,
  });
  return { message: "Verification has been passed" };
};

export const resendVerifyService = async (
  email: string
): Promise<{
  message: string;
}> => {
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw HttpError(404, "User Not Found");
  }
  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }
  const maildata = await sendMail({
    email,
    path: "verify",
    verificationToken: user.verificationToken,
    text: "Thank you for signing up! To complete your registration, please verify your email address by clicking the button below.",
  });
  if (!maildata) {
    throw HttpError(400, "Email not sent");
  }
  return { message: "Verification email sent" };
};

export const forgotPasswordService = async (
  email: string
): Promise<{
  message: string;
}> => {
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw HttpError(404, "User not found");
  }

  const resetToken = nanoid();
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = Date.now() + 3600000;
  await UserModel.findByIdAndUpdate(user._id, {
    ...user,
  });

  const maildata = await sendMail({
    email: user.email,
    path: "reset-password",
    verificationToken: resetToken,
    text: "You requested a password reset. Click the link below to set a new password.",
  });
  if (!maildata) {
    throw HttpError(400, "Email not sent");
  }
  return { message: "Password reset link sent to email" };
};

export const resetPasswordService = async ({
  resetToken,
  newPassword,
}: {
  resetToken: string;
  newPassword: string;
}): Promise<{
  message: string;
}> => {
  const user = await UserModel.findOne({
    resetPasswordToken: resetToken,
  });

  if (!user) {
    throw HttpError(400, "Invalid reset token");
  }
  if (user.resetPasswordExpires && user.resetPasswordExpires < Date.now()) {
    throw HttpError(400, "Expired reset token");
  }

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetPasswordToken = "";
  user.resetPasswordExpires = 0;
  await UserModel.findByIdAndUpdate(user._id, {
    ...user,
  });
  return { message: "Password reset successful" };
};

export const changePasswordService = async ({
  oldPassword,
  newPassword,
  userId,
}: {
  oldPassword: string;
  newPassword: string;
  userId: ObjectId;
}): Promise<{
  message: string;
}> => {
  const user = await UserModel.findById(userId);

  if (!user) {
    throw HttpError(404, "User not found");
  }

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    throw HttpError(401, "Old password is incorrect");
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await UserModel.findByIdAndUpdate(user._id, {
    ...user,
  });
  return { message: "Password successfully changed" };
};

export const createPaymentService = async ({
  data,
  userId,
}: {
  data: PaymentData;
  userId: ObjectId;
}): Promise<PaymentData> => {
  if (!userId) {
    throw HttpError(401, "Please login first");
  }
  await UserModel.findByIdAndUpdate(userId, {
    orderReference: data.orderReference,
  });
  const secretKey = WFP_SECRET_KEY ? WFP_SECRET_KEY : "";
  const merchantAccount = WFP_MERCHANT_ACCOUNT;
  const merchantDomainName = WFP_MERCHANT_DOMAIN_NAME;
  const string = [
    merchantAccount,
    merchantDomainName,
    data.orderReference,
    data.orderDate,
    amountData.amount,
    amountData.currency,
    ...amountData.productName,
    ...amountData.productCount,
    ...amountData.productPrice,
  ].join(";");
  const hmac = crypto.createHmac("md5", secretKey);
  hmac.update(string);

  const merchantSignature = hmac.digest("hex");
  const paymentData = {
    ...data,
    ...amountData,
    merchantAccount,
    merchantDomainName,
    merchantSignature,
    returnUrl: `${VITE_BASE_URL}/users/payment-return`,
    serviceUrl: `${VITE_BASE_URL}/users/payment-webhook`,
  };
  return paymentData;
};

export const paymentWebhookService = async (
  data: RequestData
): Promise<ResponseData> => {
  const merchantSecret = WFP_SECRET_KEY ? WFP_SECRET_KEY : "";
  const time = Math.floor(Date.now() / 1000);
  const responseData = {
    orderReference: data.orderReference,
    status: "accept",
    time,
    signature: crypto
      .createHmac("md5", merchantSecret)
      .update(`${data.orderReference};accept;${time}`)
      .digest("hex"),
  };

  const { transactionStatus, orderReference, phone, regularDateEnd } = data;
  const arr = orderReference.split("-");
  if (transactionStatus === "Approved") {
    await UserModel.findOneAndUpdate(
      { orderReference },
      {
        subscription: userSubscriptionConst.PREMIUM,
        phone,
        status: "Active",
        regularDateEnd: new Date(
          regularDateEnd.split(".").reverse().join(", ")
        ),
        substart: new Date(parseInt(arr[1])),
        subend: nextDate(parseInt(arr[1])),
      }
    );
    console.log("✅ Оплата підтверджена для", orderReference); //Log
  }
  return responseData;
};

export const paymentStatusService = async (
  userId: ObjectId
): Promise<UserSubscription> => {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw HttpError(404, "User not found");
  }
  const { subscription } = user;
  return subscription;
};

export const unsubscribeWebhookService = async (
  user: IUser
): Promise<IUser | undefined | null> => {
  const data = await unsubscribeUser(user);
  if (data instanceof Error) {
    throw HttpError(400, data.message);
  }
  if (data.reasonCode === 4100) {
    const updatedUser = await UserModel.findByIdAndUpdate(
      user._id,
      {
        status: "Removed",
        regularDateEnd: null,
      },
      { new: true }
    );
    return updatedUser;
  }
};
