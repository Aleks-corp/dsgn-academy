import express from "express";

import { usersSchemas } from "../schemas/index.js";
import { validateBody } from "../decorators/index.js";
import { authenticateToken } from "../middlewares/index.js";
import adminController from "../controllers/admin.controler.js";

const { usersUpdateSubscriptionSchema, usersCheckSubscriptionSchema } =
  usersSchemas;
const {
  getAllUser,
  updateUsersSubscription,
  updateUserSubscription,
  updateUserBlockStatus,
  checkUsersSubscription,
} = adminController;

const adminRouter = express.Router();
adminRouter.get("/users", authenticateToken, getAllUser);

adminRouter.patch(
  "/user",
  authenticateToken,
  validateBody(usersUpdateSubscriptionSchema),
  updateUserSubscription
);

adminRouter.patch(
  "/users/status-blocked",
  authenticateToken,
  updateUserBlockStatus
);

adminRouter.patch(
  "/users",
  authenticateToken,
  // validateBody(usersUpdateSubscriptionSchema),
  updateUsersSubscription
);

adminRouter.patch(
  "/users/status",
  validateBody(usersCheckSubscriptionSchema),
  authenticateToken,
  checkUsersSubscription
);

export default adminRouter;
