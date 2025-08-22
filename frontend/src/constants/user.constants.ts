import { UserSubscription } from "@/types/users.type";

export const emailRegexp = /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/;

export const passRegexp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,18}$/;

export const phoneRegexp = /^\+\d+$/;

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

export const userSubscriptionConstText = {
  free: "Безкоштовний",
  trial: "Тріал",
  premium: "Преміум",
  tester: "Тестовий",
  admin: "АдміньКа",
};
