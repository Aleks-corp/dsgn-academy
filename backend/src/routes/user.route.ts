import express, { Router } from "express";
import type { RequestHandler } from "express";
import multer from "multer";
import { userController } from "../controllers/index.js";
import { usersSchemas } from "../schemas/index.js";
import { validateBody } from "../decorators/index.js";
import { HttpError } from "../utils/index.js";
import { authenticateUser, uploadFile } from "../middlewares/index.js";

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
  getAvatar,
  changeName,
  changeAvatar,
  callSupport,
  reportSupport,
  messageToSupport,
} = userController;

const avatarUpload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 1024 * 1024 * 2 } });

const upload = multer();

const usersRouter = Router();

usersRouter.get("/avatar/avatars/:filename", getAvatar);
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

usersRouter.patch(
  "/change-avatar",
  authenticateUser,
  avatarUpload.single("avatar"),
  changeAvatar
);

usersRouter.post(
  "/change-password",
  authenticateUser,
  validateBody(changePasswordSchema),
  changePassword
);

usersRouter.get("/callsupport", authenticateUser, callSupport);
usersRouter.post("/callsupport", authenticateUser, reportSupport);

// помилки multer (напр. файл > 2 МБ) інакше віддавались як безіменний 500
const supportUpload: RequestHandler = (req, res, next) => {
  uploadFile.single("file")(req, res, (err: unknown) => {
    if (!err) return next();
    if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
      return next(HttpError(413, "Файл завеликий, максимум 2 МБ"));
    }
    return next(HttpError(400, "Не вдалося завантажити файл"));
  });
};
usersRouter.post("/support", supportUpload, messageToSupport);

usersRouter.post("/create-payment", authenticateUser, createPayment);
// Global json/urlencoded парсять лише точний Content-Type; для решти читаємо сирий body
usersRouter.post(
  "/payment-webhook",
  express.raw({ type: () => true, limit: "100kb" }),
  paymentWebhook
);
usersRouter.post("/payment-return", upload.none(), paymentReturn);
usersRouter.get("/payment-status", authenticateUser, paymentStatus);
usersRouter.post("/unsubscribe", authenticateUser, unsubscribeWebhook);

export default usersRouter;
