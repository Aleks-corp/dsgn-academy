import type { UserSubscription } from "../types/user.type.js";

export const userSubscription: UserSubscription[] = [
  "free",
  "trial",
  "premium",
  "tester",
  "admin",
];

export const userSubscriptionConst: Record<
  Uppercase<UserSubscription>,
  UserSubscription
> = {
  FREE: "free",
  TRIAL: "trial",
  PREMIUM: "premium",
  TESTER: "tester",
  ADMIN: "admin",
};

export const emailRegexp = /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/;

export const passRegexp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,18}$/;

export const userStatus = [
  "Active",
  "Suspended",
  "Created",
  "Removed",
  "Confirmed",
  "Completed",
];

export default {
  userSubscription,
  emailRegexp,
  passRegexp,
  userSubscriptionConst,
  userStatus,
};
