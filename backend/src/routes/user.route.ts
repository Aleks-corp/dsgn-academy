import { Router } from "express";

import { userController } from "../controllers/index.js";
import { usersSchemas } from "../schemas/index.js";
import { validateBody } from "../decorators/index.js";
import { authenticateToken } from "../middlewares/index.js";

const {
  usersRegSchema,
  usersLoginSchema,
  usersVerifySchema,
  passwordResetSchema,
  changePasswordSchema,
} = usersSchemas;

const {
  register,
  login,
  logout,
  getCurrent,
  getVerification,
  resendVerify,
  forgotPassword,
  resetPassword,
  changePassword,
  createPayment,
  paymentWebhook,
  paymentStatus,
  unsubscribeWebhook,
  paymentReturn,
} = userController;

const usersRouter = Router();

usersRouter.post("/register", validateBody(usersRegSchema), register);
usersRouter.post("/login", validateBody(usersLoginSchema), login);
usersRouter.post("/logout", authenticateToken, logout);
usersRouter.get("/current", authenticateToken, getCurrent);
usersRouter.get("/verify/:verificationToken", getVerification);
usersRouter.post("/verify", validateBody(usersVerifySchema), resendVerify);
usersRouter.post(
  "/forgot-password",
  validateBody(usersVerifySchema),
  forgotPassword
);
usersRouter.post(
  "/reset-password/:resetToken",
  validateBody(passwordResetSchema),
  resetPassword
);
usersRouter.post(
  "/change-password",
  authenticateToken,
  validateBody(changePasswordSchema),
  changePassword
);

usersRouter.post("/create-payment", authenticateToken, createPayment);
usersRouter.post("/payment-webhook", paymentWebhook);
usersRouter.post("/payment-return", paymentReturn);
usersRouter.get("/payment-status", authenticateToken, paymentStatus);
usersRouter.get("/unsubscribe", authenticateToken, unsubscribeWebhook);

export default usersRouter;
