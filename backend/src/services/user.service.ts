import "dotenv/config";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// import axios from "axios";
import { nanoid } from "nanoid";
import type { ObjectId } from "mongoose";

import type {
  IUser,
  IUserFavWatched,
  IUserReg,
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
  setSubDate,
  unsubscribeUser,
} from "../utils/index.js";

const {
  JWT_SECRET,
  WFP_SECRET_KEY,
  WFP_MERCHANT_ACCOUNT,
  WFP_MERCHANT_DOMAIN_NAME,
  VITE_BASE_URL,
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
  await UserModel.create({
    name,
    email,
    ip,
    ...userData,
  });
  await sendMail({
    email,
    verificationToken: userData.verificationToken,
    path: "verify",
    text: emailText,
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
  _id: ObjectId
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
    ...user,
  });

  await sendMail({
    email: user.email,
    path: "reset-password",
    verificationToken: resetToken,
    text: "Ви запросили скидання пароля. Натисніть на посилання нижче, щоб встановити новий пароль.",
  });

  return { message: "Посилання на скидання паролю відправлено на пошту" };
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
  userId: ObjectId;
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
  userId: ObjectId;
}): Promise<PaymentData> => {
  if (!userId) {
    throw HttpError(401, "Будь ласка, увійдіть в систему");
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
        subend: setSubDate(parseInt(arr[1])),
      }
    );
    console.info("✅ Оплата підтверджена для", orderReference); //Log
  }
  return responseData;
};

export const paymentStatusService = async (
  userId: ObjectId
): Promise<UserSubscription> => {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw HttpError(404, "Користувача не знайдено");
  }
  const { subscription } = user;
  return subscription;
};

export const unsubscribeWebhookService = async (
  user: IUser
): Promise<IUser | undefined | null> => {
  const data = await unsubscribeUser(user);
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

export const undateFaforitesVideosService = async (
  cleanIds: IUserFavWatched[],
  _id: string | ObjectId
): Promise<void> => {
  await UserModel.findByIdAndUpdate(_id, { favoritesVideos: cleanIds });
};

export const undateWatchedVideosService = async (
  cleanIds: IUserFavWatched[],
  _id: string | ObjectId
): Promise<void> => {
  await UserModel.findByIdAndUpdate(_id, { watchedVideos: cleanIds });
};

export const undateFaforitesCoursesService = async (
  cleanIds: IUserFavWatched[],
  _id: string | ObjectId
): Promise<void> => {
  await UserModel.findByIdAndUpdate(_id, { favoritesCourses: cleanIds });
};

export const undateWatchedCoursesService = async (
  cleanIds: IUserFavWatched[],
  _id: string | ObjectId
): Promise<void> => {
  await UserModel.findByIdAndUpdate(_id, { watchedCourses: cleanIds });
};
