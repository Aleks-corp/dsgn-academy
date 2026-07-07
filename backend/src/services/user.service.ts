import "dotenv/config";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// import axios from "axios";
import { nanoid } from "nanoid";
import { Types } from "mongoose";

import type {
  IUser,
  IUserReg,
  IUserWatched,
  OAuthUpsertInput,
  OAuthUpsertResult,
  UserSubscription,
} from "../types/user.type.js";
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
  unsubscribeUser,
  sendMailSub,
  sendMailToSprt,
} from "../utils/index.js";
import { answerWFPCodes } from "../constants/answerWfpCodes.js";

const {
  JWT_SECRET,
  WFP_SECRET_KEY,
  WFP_MERCHANT_ACCOUNT,
  WFP_MERCHANT_DOMAIN_NAME,
  BASE_URL,
  // IPHUB_API_KEY,
} = process.env;

export const registerService = async ({
  name,
  email,
  password,
  ip,
}: IUserReg): Promise<void> => {
  const user = await UserModel.findOne({ email });

  if (user) {
    throw HttpError(
      409,
      "Електронна пошта вже використовується. Будь ласка, увійдіть."
    );
  }

  // if (ip && ip !== "") {
  // const { data } = await axios.get(`https://v2.api.iphub.info/ip/${ip}`, {
  //   headers: {
  //     "X-Key": IPHUB_API_KEY as string,
  //   },
  // });

  // if (data.block === 1 || data.block === 2) {
  //   throw HttpError(403, "Registration via VPN or Proxy is not allowed.");
  // }
  // const sameIpUsers = await UserModel.countDocuments({ ip });

  // if (sameIpUsers > 0) {
  //   throw HttpError(
  //     403,
  //     "Too many registrations from your network. Contact support."
  //   );
  // }
  // }

  const userData = {
    password: await bcrypt.hash(password, 10),
    verificationToken: nanoid(),
    orderReference: "",
    subscription: userSubscriptionConst.FREE,
  };
  const emailText =
    "Дякуємо за реєстрацію! Щоб завершити реєстрацію, будь ласка, підтвердьте свою електронну адресу, натиснувши кнопку нижче.";
  await sendMail({
    email,
    verificationToken: userData.verificationToken,
    path: "verify",
    text: emailText,
  });
  await UserModel.create({
    name,
    email,
    ip,
    ...userData,
  });
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
    throw HttpError(401, "Невірна електронна пошта або пароль");
  }
  if (!(await bcrypt.compare(password, user.password))) {
    throw HttpError(401, "Невірна електронна пошта або пароль");
  }
  if (!user.verify) {
    throw HttpError(
      403,
      "Користувач не підтверджений, перевірте електронну пошту"
    );
  }
  const updatedUser = await checkSubscriptionStatus(user);

  const token = jwt.sign({ id: user._id }, JWT_SECRET ? JWT_SECRET : "", {
    expiresIn: "333h",
  });
  if (ip && ip !== "") {
    //   try {
    //     const { data } = await axios.get(`https://v2.api.iphub.info/ip/${ip}`, {
    //       headers: {
    //         "X-Key": IPHUB_API_KEY as string,
    //       },
    //     });
    //     if (data.block === 1 || data.block === 2) {
    //       await UserModel.findByIdAndUpdate(user._id, { token });
    //       return { token, updatedUser };
    //     }
    //   } catch (error) {
    //     console.error("🚀 ~ error:", error); // log
    //   }
    await UserModel.findByIdAndUpdate(user._id, { token, ip });
    return { token, updatedUser };
  }

  await UserModel.findByIdAndUpdate(user._id, { token });
  return { token, updatedUser };
};

export const oauthUpsertService = async ({
  email,
  name,
  avatar,
  provider,
  providerId,
  ip,
}: OAuthUpsertInput): Promise<OAuthUpsertResult> => {
  if (!provider || !providerId) {
    throw HttpError(400, "Відсутні дані провайдера");
  }
  const emailLc = email?.toLowerCase();

  let user = await UserModel.findOne({
    accounts: { $elemMatch: { provider, providerId } },
  });

  if (!user && emailLc) {
    user = await UserModel.findOne({ email: emailLc });
  }

  if (!user) {
    user = await UserModel.create({
      email: emailLc,
      name,
      avatar,
      orderReference: "",
      subscription: userSubscriptionConst.FREE,
      verify: !!emailLc,
      accounts: [{ provider, providerId }],
    });
  } else {
    const hasAccount = user.accounts?.some(
      (a) => a.provider === provider && a.providerId === providerId
    );
    if (!hasAccount) {
      user.accounts?.push({ provider, providerId });
    }

    if (emailLc && !user.email) user.email = emailLc;
    if (name && !user.name) user.name = name;
    if (avatar && !user.avatar) user.avatar = avatar;
    if (emailLc) user.verify = true;
  }
  if (ip) user.ip = ip;
  const updatedUser = await checkSubscriptionStatus(user);
  const token = jwt.sign(
    { id: updatedUser._id },
    JWT_SECRET ? JWT_SECRET : "",
    {
      expiresIn: "333h",
    }
  );

  await UserModel.findByIdAndUpdate(updatedUser._id, {
    ...updatedUser.toObject(),
    token,
  });
  return { token, updatedUser };
};

export const logoutService = async (
  _id: Types.ObjectId
): Promise<{ message: string }> => {
  const user = await UserModel.findById(_id);
  if (!user) {
    throw HttpError(404, "Користувача не знайдено");
  }
  await UserModel.findByIdAndUpdate(_id, { token: "" });
  return { message: "Успішний вихід" };
};

export const verificationService = async (
  verificationToken: string
): Promise<{
  message: string;
}> => {
  const user = await UserModel.findOne({ verificationToken });
  if (!user) {
    throw HttpError(404, "Користувача не знайдено");
  }
  if (user.verify) {
    throw HttpError(400, "Верифікацію вже пройдено");
  }
  await UserModel.findByIdAndUpdate(user._id, {
    verify: true,
  });
  return { message: "Верифікацію пройдено" };
};

export const resendVerifyService = async (
  email: string
): Promise<{
  message: string;
}> => {
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw HttpError(404, "Користувача не знайдено");
  }
  if (user.verify) {
    throw HttpError(400, "Верифікацію вже пройдено");
  }
  await sendMail({
    email,
    path: "verify",
    verificationToken: user.verificationToken,
    text: "Дякуємо за реєстрацію! Щоб завершити реєстрацію, будь ласка, підтвердьте свою електронну адресу, натиснувши кнопку нижче.",
  });

  return { message: "Лист для підтвердження відправлено" };
};

export const forgotPasswordService = async (
  email: string
): Promise<{
  message: string;
}> => {
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw HttpError(404, "Користувача не знайдено");
  }

  const resetToken = nanoid();
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = Date.now() + 3600000;
  await UserModel.findByIdAndUpdate(user._id, {
    resetPasswordToken: resetToken,
    resetPasswordExpires: user.resetPasswordExpires,
  });

  await sendMail({
    email: user.email,
    path: "reset-password",
    verificationToken: resetToken,
    text: "Ви запросили скидання пароля. Натисніть на посилання нижче, щоб встановити новий пароль.",
  });

  return { message: "Посилання на скидання паролю відправлено на пошту" };
};

export const changeNameService = async ({
  name,
  userId,
}: {
  name: string;
  userId: Types.ObjectId;
}): Promise<string> => {
  const updatedUser = await UserModel.findByIdAndUpdate(userId, {
    name,
  });
  if (!updatedUser) {
    throw HttpError(404, "Користувача не знайдено");
  }
  return updatedUser.name;
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
    throw HttpError(400, "Невірний токен для скидання пароля");
  }
  if (user.resetPasswordExpires && user.resetPasswordExpires < Date.now()) {
    throw HttpError(400, "Термін дії токена для скидання пароля закінчився");
  }

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetPasswordToken = "";
  user.resetPasswordExpires = 0;
  await UserModel.findByIdAndUpdate(user._id, {
    ...user,
  });
  return { message: "Пароль успішно змінено" };
};

export const changePasswordService = async ({
  oldPassword,
  newPassword,
  userId,
}: {
  oldPassword: string;
  newPassword: string;
  userId: Types.ObjectId;
}): Promise<{
  message: string;
}> => {
  const user = await UserModel.findById(userId);

  if (!user) {
    throw HttpError(404, "Користувача не знайдено");
  }

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    throw HttpError(401, "Старий пароль невірний");
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await UserModel.findByIdAndUpdate(user._id, {
    ...user,
  });
  return { message: "Пароль успішно змінено" };
};

export const createPaymentService = async ({
  data,
  userId,
}: {
  data: PaymentData;
  userId: Types.ObjectId;
}): Promise<PaymentData> => {
  if (!userId) {
    throw HttpError(401, "Будь ласка, увійдіть в систему");
  }
  await UserModel.findByIdAndUpdate(userId, {
    newOrderReference: data.orderReference,
  });
  const amountPriceData = {
    amount: Number(data.amount).toFixed(2),
    productPrice: [Number(data.amount).toFixed(2)],
    regularAmount: Number(data.amount).toFixed(2),
    productName:
      data.regularMode === "monthly"
        ? amountData.productNameMonth
        : amountData.productNameYear,
    currency: "EUR",
    productCount: [1],
    merchantAuthType: "SimpleSignature",
    merchantTransactionSecureType: "AUTO",
    recurringToken: "auto",
    regularBehavior: "preset",
    regularOn: 1,
  };

  const secretKey = WFP_SECRET_KEY ? WFP_SECRET_KEY : "";
  const merchantAccount = WFP_MERCHANT_ACCOUNT;
  const merchantDomainName = WFP_MERCHANT_DOMAIN_NAME;
  const string = [
    merchantAccount,
    merchantDomainName,
    data.orderReference,
    data.orderDate,
    amountPriceData.amount,
    amountPriceData.currency,
    ...amountPriceData.productName,
    ...amountPriceData.productCount,
    ...amountPriceData.productPrice,
  ].join(";");
  const hmac = crypto.createHmac("md5", secretKey);
  hmac.update(string);
  const merchantSignature = hmac.digest("hex");

  const paymentData = {
    ...data,
    ...amountPriceData,
    merchantAccount,
    merchantDomainName,
    merchantSignature,
    returnUrl: `${BASE_URL}/auth/payment-return`,
    serviceUrl: `${BASE_URL}/auth/payment-webhook`,
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
    const updatedUser = await UserModel.findOneAndUpdate(
      { newOrderReference: orderReference },
      {
        subscription: userSubscriptionConst.PREMIUM,
        orderReference,
        newOrderReference: "",
        phone,
        status: "Active",
        regularDateEnd: regularDateEnd
          ? new Date(regularDateEnd.split(".").reverse().join("-"))
          : null,
        substart: new Date(parseInt(arr[1])),
      },
      { new: true }
    );
    console.info("✅ Оплата підтверджена для", orderReference); //Log
    if (updatedUser) {
      try {
        await sendMailSub({
          email: updatedUser.email,
          mode: updatedUser.mode
            ? updatedUser.mode
            : data.amount === 4.95
            ? "monthly"
            : "yearly",
        });
      } catch (err) {
        console.error("sendMailSub error on payment:", err);
      }
    }
  }
  return responseData;
};

export const paymentStatusService = async (
  userId: Types.ObjectId
): Promise<UserSubscription> => {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw HttpError(404, "Користувача не знайдено");
  }
  const { subscription } = user;
  return subscription;
};

export const unsubscribeWebhookService = async (
  user: IUser,
  reason: string
): Promise<{ updatedUser?: IUser | null; message: string }> => {
  const data = await unsubscribeUser(user);

  if (
    data.reasonCode === answerWFPCodes.ok.code ||
    data.reasonCode === answerWFPCodes.closed.code
  ) {
    const updatedUser = await UserModel.findByIdAndUpdate(
      user._id,
      {
        status: "Removed",
        regularDateEnd: null,
      },
      { new: true }
    );
    try {
      await sendMailSub({
        email: user.email,
        reason,
      });
    } catch (err) {
      console.error("sendMailSub error on unsubscribe:", err);
    }
    const message =
      Object.values(answerWFPCodes).find(
        (item) => String(item.code) === String(data.reasonCode)
      )?.message ?? "Unknown error";
    console.log("Webhook unsubscribe message:", message);
    return { updatedUser, message };
  }
  const answer = Object.values(answerWFPCodes).find(
    (item) => String(item.code) === String(data.reasonCode)
  );
  const message = answer?.message ?? "Unknown error";
  console.log("Webhook unsubscribe message:", message);
  return { message };
};

export const callSupportService = async (user: IUser): Promise<void> => {
  await sendMailToSprt({ user });
};

export const reportSupportService = async (
  user: IUser,
  report: string
): Promise<void> => {
  await sendMailToSprt({ user, report });
};

export const toggleBookmarkedVideoService = async (
  userId: Types.ObjectId | string,
  videoId: Types.ObjectId | string
): Promise<{ action: "bookmarked" | "unbookmarked" }> => {
  const user = await UserModel.findById(userId);
  if (!user) throw HttpError(404, "User not found");

  const hasBookmarked = user.bookmarkedVideos?.some(
    (id) => id.toString() === videoId.toString()
  );

  if (hasBookmarked) {
    await UserModel.findByIdAndUpdate(userId, {
      $pull: { bookmarkedVideos: videoId },
    });
    return { action: "unbookmarked" };
  } else {
    await UserModel.findByIdAndUpdate(userId, {
      $addToSet: { bookmarkedVideos: videoId },
    });
    return { action: "bookmarked" };
  }
};

export const updateBookmarkedVideosService = async (
  cleanIds: Types.ObjectId[],
  userId: Types.ObjectId | string
): Promise<void> => {
  await UserModel.findByIdAndUpdate(userId, {
    bookmarkedVideos: cleanIds.map((id) => id.toString()),
  });
};

export const updateWatchedVideosService = async (
  userId: Types.ObjectId | string,
  videoId: Types.ObjectId | string,
  currentTime: number
): Promise<IUserWatched> => {
  const user = await UserModel.findById(userId);
  if (!user) throw HttpError(404, "User not found");

  const watched = user.watchedVideos || [];
  const idx = watched.findIndex((w) => w.id.toString() === videoId.toString());

  if (idx >= 0) {
    watched[idx].currentTime = currentTime;
  } else {
    watched.push({ id: videoId, currentTime });
  }

  await UserModel.findByIdAndUpdate(userId, { watchedVideos: watched });

  return { id: videoId, currentTime };
};

export const syncWatchedVideosService = async (
  cleanIds: (Types.ObjectId | string)[],
  userId: Types.ObjectId | string
): Promise<void> => {
  const watched = cleanIds.map((id) => ({ id: id.toString(), currentTime: 0 }));
  await UserModel.findByIdAndUpdate(userId, { watchedVideos: watched });
};

export const toggleBookmarkedCourseService = async (
  userId: Types.ObjectId | string,
  courseId: Types.ObjectId | string
): Promise<{ action: "bookmarked" | "unbookmarked" }> => {
  const user = await UserModel.findById(userId);
  if (!user) throw HttpError(404, "User not found");

  const hasBookmarked = user.bookmarkedCourses?.some(
    (id) => id.toString() === courseId.toString()
  );

  if (hasBookmarked) {
    await UserModel.findByIdAndUpdate(userId, {
      $pull: { bookmarkedCourses: courseId },
    });
    return { action: "unbookmarked" };
  } else {
    await UserModel.findByIdAndUpdate(userId, {
      $addToSet: { bookmarkedCourses: courseId },
    });
    return { action: "bookmarked" };
  }
};

export const updateBookmarkedCoursesService = async (
  cleanIds: (Types.ObjectId | string)[],
  userId: Types.ObjectId | string
): Promise<void> => {
  await UserModel.findByIdAndUpdate(userId, {
    bookmarkedCourses: cleanIds.map((id) => id.toString()),
  });
};

export const updateWatchedCoursesService = async (
  userId: Types.ObjectId | string,
  courseId: Types.ObjectId | string,
  videoId: Types.ObjectId | string,
  currentTime: number
): Promise<{
  courseId: Types.ObjectId | string;
  videoId: Types.ObjectId | string;
  currentTime: number;
}> => {
  const user = await UserModel.findById(userId);
  if (!user) throw HttpError(404, "User not found");

  const watched = user.watchedCourses || [];
  const idx = watched.findIndex(
    (w) =>
      w.courseId.toString() === courseId.toString() &&
      w.videoId.toString() === videoId.toString()
  );

  if (idx >= 0) {
    watched[idx].currentTime = currentTime;
  } else {
    watched.push({
      courseId: new Types.ObjectId(courseId),
      videoId: new Types.ObjectId(videoId),
      currentTime,
    });
  }

  await UserModel.findByIdAndUpdate(userId, { watchedCourses: watched });

  return { courseId, videoId, currentTime };
};

export const toggleBookmarkedShortService = async (
  userId: Types.ObjectId | string,
  shortId: Types.ObjectId | string
): Promise<{ action: "bookmarked" | "unbookmarked" }> => {
  const user = await UserModel.findById(userId);
  if (!user) throw HttpError(404, "User not found");

  const hasBookmarked = user.bookmarkedShorts?.some(
    (id) => id.toString() === shortId.toString()
  );

  if (hasBookmarked) {
    await UserModel.findByIdAndUpdate(userId, {
      $pull: { bookmarkedShorts: shortId },
    });
    return { action: "unbookmarked" };
  } else {
    await UserModel.findByIdAndUpdate(userId, {
      $addToSet: { bookmarkedShorts: shortId },
    });
    return { action: "bookmarked" };
  }
};

export const updateBookmarkedShortsService = async (
  cleanIds: Types.ObjectId[],
  userId: Types.ObjectId | string
): Promise<void> => {
  await UserModel.findByIdAndUpdate(userId, {
    bookmarkedShorts: cleanIds.map((id) => id.toString()),
  });
};

export const updateWatchedShortsService = async (
  userId: Types.ObjectId | string,
  shortId: Types.ObjectId | string,
  currentTime: number
): Promise<IUserWatched> => {
  const user = await UserModel.findById(userId);
  if (!user) throw HttpError(404, "User not found");

  const watched = user.watchedShorts || [];
  const idx = watched.findIndex((w) => w.id.toString() === shortId.toString());

  if (idx >= 0) {
    watched[idx].currentTime = currentTime;
  } else {
    watched.push({ id: shortId, currentTime });
  }

  await UserModel.findByIdAndUpdate(userId, { watchedShorts: watched });

  return { id: shortId, currentTime };
};

export const syncWatchedShortsService = async (
  cleanIds: (Types.ObjectId | string)[],
  userId: Types.ObjectId | string
): Promise<void> => {
  const watched = cleanIds.map((id) => ({ id: id.toString(), currentTime: 0 }));
  await UserModel.findByIdAndUpdate(userId, { watchedShorts: watched });
};
