import { Router } from "express";
import multer from "multer";
import { userController } from "../controllers/index.js";
import { usersSchemas } from "../schemas/index.js";
import { validateBody } from "../decorators/index.js";
import { authenticateUser } from "../middlewares/index.js";

const {
  usersRegSchema,
  usersLoginSchema,
  usersVerifySchema,
  passwordResetSchema,
  changePasswordSchema,
  userNameSchema,
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
  oauthUpsert,
  changeName,
} = userController;

const upload = multer();

const usersRouter = Router();

usersRouter.post("/register", validateBody(usersRegSchema), register);
usersRouter.post("/login", validateBody(usersLoginSchema), login);
usersRouter.post("/oauth-upsert", oauthUpsert);
usersRouter.post("/logout", authenticateUser, logout);
usersRouter.get("/current", authenticateUser, getCurrent);
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
  "/change-name",
  authenticateUser,
  validateBody(userNameSchema),
  changeName
);

usersRouter.post(
  "/change-password",
  authenticateUser,
  validateBody(changePasswordSchema),
  changePassword
);

usersRouter.post("/create-payment", authenticateUser, createPayment);
usersRouter.post("/payment-webhook", paymentWebhook);
usersRouter.post("/payment-return", upload.none(), paymentReturn);
usersRouter.get("/payment-status", authenticateUser, paymentStatus);
usersRouter.get("/unsubscribe", authenticateUser, unsubscribeWebhook);

export default usersRouter;
