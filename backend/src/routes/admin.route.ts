import express from "express";

import { usersSchemas } from "../schemas/index.js";
import { validateBody } from "../decorators/index.js";
import { authenticateAdmin } from "../middlewares/index.js";
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

adminRouter.use(authenticateAdmin);
adminRouter.get("/users", getAllUser);

adminRouter.patch(
  "/user",
  validateBody(usersUpdateSubscriptionSchema),
  updateUserSubscription
);

adminRouter.patch("/users/status-blocked", updateUserBlockStatus);

adminRouter.patch(
  "/users",
  // validateBody(usersUpdateSubscriptionSchema),
  updateUsersSubscription
);

adminRouter.patch(
  "/users/status",
  validateBody(usersCheckSubscriptionSchema),
  checkUsersSubscription
);

export default adminRouter;
