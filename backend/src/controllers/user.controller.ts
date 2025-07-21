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
} from "../services/user.service.js";

const { FRONT_SERVER } = process.env;

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

  res.status(201).json({ message: "Thank you for signing up" });
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
      isBlocked: updatedUser.isBlocked,
      subscription: updatedUser.subscription,
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

    isBlocked,
    subscription,
    status,
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

      isBlocked,
      subscription,
      status,
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
  const { data }: { data: PaymentData } = req.body;
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
      console.log("🚀 ~ paymentWebhook ~ error:", error);
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
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Processing Payment</title>
    </head>
    <body>
        <h2>Processing your payment...</h2>
        <script>
            setTimeout(() => {
                window.location.href = "${FRONT_SERVER}/payment-success";
            }, 500);
        </script>
    </body>
    </html>
  `);
};

export default {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
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
};
