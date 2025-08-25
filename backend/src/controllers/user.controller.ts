import "dotenv/config";
import type { Request, Response } from "express";
import type { ObjectId } from "mongoose";

import { HttpError } from "../utils/index.js";
import { ctrlWrapper } from "../decorators/index.js";
import type { PaymentData } from "../types/data.types.js";
import {
  changePasswordService,
  createPaymentService,
  forgotPasswordService,
  loginService,
  logoutService,
  paymentStatusService,
  paymentWebhookService,
  registerService,
  resendVerifyService,
  resetPasswordService,
  unsubscribeWebhookService,
  verificationService,
  oauthUpsertService,
  changeNameService,
} from "../services/user.service.js";

const { FRONT_SERVER, FRONT_WEB_SERVER } = process.env;

const register = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;

  const forwarded = req.headers["x-forwarded-for"];
  const ip =
    typeof forwarded === "string"
      ? forwarded.split(",")[0].trim()
      : req.socket.remoteAddress || "";
  await registerService({
    name,
    email,
    password,
    ip,
  });
  res
    .status(201)
    .json({ ok: true, message: "Вітаємо! Ви успішно зареєструвалися!" });
};

const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  const forwarded = req.headers["x-forwarded-for"];
  const ip =
    typeof forwarded === "string"
      ? forwarded.split(",")[0].trim()
      : req.socket.remoteAddress || "";
  const { token, updatedUser } = await loginService({ email, password, ip });

  res.json({
    token,
    user: {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
      isBlocked: updatedUser.isBlocked,
      subscription: updatedUser.subscription,
      amount: updatedUser.amount,
      status: updatedUser.status,
      regularDateEnd: updatedUser.regularDateEnd,
      lastPayedDate: updatedUser.lastPayedDate,
      lastPayedStatus: updatedUser.lastPayedStatus,
      substart: updatedUser.substart,
      subend: updatedUser.subend,
      createdAt: updatedUser.createdAt,
    },
  });
};

export const oauthUpsert = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, name, avatar, provider, providerId } = req.body;

  const forwarded = req.headers["x-forwarded-for"];
  const ip =
    typeof forwarded === "string"
      ? forwarded.split(",")[0].trim()
      : req.socket.remoteAddress || "";

  const { token, updatedUser } = await oauthUpsertService({
    email,
    name,
    avatar,
    provider,
    providerId,
    ip,
  });

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    domain: process.env.COOKIE_DOMAIN || ".dsgn.academy",
    maxAge: 30 * 24 * 60 * 60 * 1000,
    path: "/",
  });

  res.json({
    token,
    user: {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
      isBlocked: updatedUser.isBlocked,
      subscription: updatedUser.subscription,
      amount: updatedUser.amount,
      status: updatedUser.status,
      regularDateEnd: updatedUser.regularDateEnd,
      lastPayedDate: updatedUser.lastPayedDate,
      lastPayedStatus: updatedUser.lastPayedStatus,
      substart: updatedUser.substart,
      subend: updatedUser.subend,
      createdAt: updatedUser.createdAt,
    },
  });
};

const logout = async (req: Request, res: Response): Promise<void> => {
  const { _id } = req.user;
  const message = await logoutService(_id as ObjectId);
  res.status(204).json(message);
};

const getCurrent = async (req: Request, res: Response): Promise<void> => {
  const {
    _id,
    name,
    email,
    avatar,
    isBlocked,
    subscription,
    status,
    amount,
    substart,
    regularDateEnd,
    lastPayedDate,
    lastPayedStatus,
    subend,
    createdAt,
  } = req.user;
  if (req.user) {
    res.json({
      _id,
      name,
      email,
      avatar,
      isBlocked,
      subscription,
      status,
      amount,
      regularDateEnd,
      lastPayedDate,
      lastPayedStatus,
      substart,
      subend,
      createdAt,
    });
  }
};

const getVerification = async (req: Request, res: Response): Promise<void> => {
  const { verificationToken } = req.params;
  const message = await verificationService(verificationToken);
  res.json(message);
};

const resendVerify = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;
  const message = await resendVerifyService(email);
  res.json(message);
};

const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;
  const message = await forgotPasswordService(email);
  res.json(message);
};

const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const { resetToken } = req.params;
  const { newPassword } = req.body;
  const message = await resetPasswordService({ resetToken, newPassword });
  res.json(message);
};

const changeName = async (req: Request, res: Response): Promise<void> => {
  const { name } = req.body;
  const userId = req.user._id as ObjectId;
  const newName = await changeNameService({
    name,
    userId,
  });
  res.json({ name: newName });
};

const changePassword = async (req: Request, res: Response): Promise<void> => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user._id as ObjectId;
  const message = await changePasswordService({
    oldPassword,
    newPassword,
    userId,
  });
  res.json(message);
};

const createPayment = async (req: Request, res: Response): Promise<void> => {
  const data: PaymentData = req.body;
  const userId = req.user._id as ObjectId;
  const paymentData = await createPaymentService({ data, userId });
  res.json(paymentData);
};

const paymentWebhook = async (req: Request, res: Response): Promise<void> => {
  let data = req.body;
  const keys = Object.keys(data);
  if (keys.length === 1) {
    try {
      data = JSON.parse(keys[0]);
    } catch (error) {
      console.error("🚀 ~ paymentWebhook ~ error:", error);
      throw HttpError(400, "Invalid nested JSON");
    }
  }
  if (!data || typeof data !== "object" || !data.orderReference) {
    throw HttpError(400, "Missing orderReference");
  }
  const responseData = await paymentWebhookService(data);
  res.json(responseData);
};

const paymentStatus = async (req: Request, res: Response): Promise<void> => {
  const subscription = await paymentStatusService(req.user._id as ObjectId);
  res.json({ subscription });
};

const unsubscribeWebhook = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user = req.user;
  const updatedUser = await unsubscribeWebhookService(user);
  res.json(updatedUser);
};

const paymentReturn = async (req: Request, res: Response): Promise<void> => {
  const status = req.body.transactionStatus || "";
  const reason = req.body.reason || "";
  const baseUrl = FRONT_WEB_SERVER ? FRONT_WEB_SERVER : FRONT_SERVER;

  // вибираємо куди редіректити
  const redirectUrl =
    status === "Approved"
      ? `${baseUrl}/payment-success`
      : `${baseUrl}/payment-error?reason=${encodeURIComponent(reason)}`;

  res.send(`
    <!DOCTYPE html>
    <html lang="uk">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Оплата</title>
        <style>
          body {
            font-family: sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background: #f5f5f5;
          }
          .card {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            text-align: center;
          }
        </style>
    </head>
    <body>
        <div class="card">
          <h2>Перевіряється оплата...</h2>
          <p>Зачекайте, зараз ми перевіримо статус.</p>
        </div>
        <script>
            setTimeout(() => {
                window.location.href = "${redirectUrl}";
            }, 1000);
        </script>
    </body>
    </html>
  `);
};

export default {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  oauthUpsert: ctrlWrapper(oauthUpsert),
  logout: ctrlWrapper(logout),
  getCurrent: ctrlWrapper(getCurrent),
  getVerification: ctrlWrapper(getVerification),
  resendVerify: ctrlWrapper(resendVerify),
  forgotPassword: ctrlWrapper(forgotPassword),
  resetPassword: ctrlWrapper(resetPassword),
  changePassword: ctrlWrapper(changePassword),
  createPayment: ctrlWrapper(createPayment),
  paymentWebhook: ctrlWrapper(paymentWebhook),
  paymentStatus: ctrlWrapper(paymentStatus),
  unsubscribeWebhook: ctrlWrapper(unsubscribeWebhook),
  paymentReturn: ctrlWrapper(paymentReturn),
  changeName: ctrlWrapper(changeName),
};
