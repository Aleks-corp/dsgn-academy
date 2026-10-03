import "dotenv/config";
import axios from "axios";
import type { IUser } from "../types/user.type.js";
import { UserModel } from "../models/index.js";
import { userSubscriptionConst } from "../constants/user.constant.js";

const requestType = "STATUS";
const merchantAccount = process.env.WFP_MERCHANT_ACCOUNT || "";
const merchantPassword = process.env.WFP_MERCHANT_PASSWORD || "";
const WFP_API_URL =
  process.env.WFP_API_URL || "https://api.wayforpay.com/regularApi";

// WFP віддає unix-секунди; null/undefined не повинні давати Invalid Date
const fromUnix = (value: unknown): Date | undefined => {
  const n = Number(value);
  return value && Number.isFinite(n) ? new Date(n * 1000) : undefined;
};
const defaultNext = (user: IUser, now: number): Date => {
  const base = new Date(user.subend ?? now);
  return new Date(base.setMonth(base.getMonth() + 1));
};

const CHECK_INTERVAL_MS =
  Number(process.env.WFP_CHECK_INTERVAL_HOURS || 6) * 60 * 60 * 1000;

interface CheckOptions {
  // обійти throttle (логін, ручна адмінська перевірка, cron)
  force?: boolean;
  // опитати WFP навіть якщо підписка не прострочена
  full?: boolean;
}

const syncWithWfp = async (user: IUser, full = false): Promise<IUser> => {
  if (user.subscription === userSubscriptionConst.ADMIN) {
    return user;
  }
  if (!user.orderReference) {
    return user;
  }
  const newDateTime = new Date().getTime();

  if (user.orderReference && !user.subend) {
    const payload = {
      requestType,
      merchantAccount,
      merchantPassword,
      orderReference: user.orderReference,
    };
    try {
      const { data } = await axios.post(WFP_API_URL, payload, {
        headers: { "Content-Type": "application/json" },
      });
      if (data.status === "Active") {
        user.subscription = userSubscriptionConst.PREMIUM;
        user.lastPayedStatus = data.lastPayedStatus;
        user.lastPayedDate = fromUnix(data.lastPayedDate) ?? user.lastPayedDate;
        user.status = data.status;
        user.amount = data.amount;
        user.mode = data.mode;
        if (data.nextPaymentDate) {
          user.subend = fromUnix(data.nextPaymentDate) ?? defaultNext(user, newDateTime);
        } else {
          user.subend = new Date(
            new Date(newDateTime).setMonth(new Date(newDateTime).getMonth() + 1)
          );
        }
        const currentDate = fromUnix(data.dateBegin) ?? new Date(newDateTime);
        if (!user.substart) {
          user.substart = new Date(
            currentDate.setMonth(
              currentDate.getMonth() === 0 ? 11 : currentDate.getMonth() - 1
            )
          );
        }
        await UserModel.findByIdAndUpdate(user._id, {
          subscription: user.subscription,
          status: user.status,
          subend: user.subend,
          substart: user.substart,
          amount: user.amount,
          mode: user.mode,
          lastPayedStatus: user.lastPayedStatus,
          lastPayedDate: user.lastPayedDate,
        });
        return user;
      }
      if (data.status === "Created") {
        user.status = data.status;
        await UserModel.findByIdAndUpdate(user._id, {
          status: user.status,
        });
        return user;
      }
    } catch (error) {
      console.error("Error checking WayForPay subscription:", error);
    }
  }
  if (full || (user.subend && newDateTime > user.subend.getTime())) {
    const payload = {
      requestType,
      merchantAccount,
      merchantPassword,
      orderReference: user.orderReference,
    };
    try {
      const { data } = await axios.post(WFP_API_URL, payload, {
        headers: { "Content-Type": "application/json" },
      });

      if (data.status === "Active") {
        // щойно зареєстрований регулярний платіж: lastPayedStatus === null — це теж ОК
        user.subscription =
          data.lastPayedStatus === "Declined"
            ? userSubscriptionConst.FREE
            : userSubscriptionConst.PREMIUM;
        user.lastPayedStatus = data.lastPayedStatus;
        user.lastPayedDate = fromUnix(data.lastPayedDate) ?? user.lastPayedDate;
        user.status = data.status;
        user.amount = data.amount;
        user.mode = data.mode;
        if (data.nextPaymentDate) {
          user.subend = fromUnix(data.nextPaymentDate) ?? defaultNext(user, newDateTime);
        } else {
          const base = user.subend ?? new Date(newDateTime);
          user.subend = new Date(base.setMonth(base.getMonth() + 1));
        }
        const currentDate = fromUnix(data.dateBegin) ?? new Date(newDateTime);
        if (!user.substart) {
          user.substart = new Date(
            currentDate.setMonth(
              currentDate.getMonth() === 0 ? 11 : currentDate.getMonth() - 1
            )
          );
        }
        await UserModel.findByIdAndUpdate(user._id, {
          subscription: user.subscription,
          status: user.status,
          subend: user.subend,
          substart: user.substart,
          amount: user.amount,
          mode: user.mode,
          lastPayedStatus: user.lastPayedStatus,
          lastPayedDate: user.lastPayedDate,
        });
        return user;
      }
      if (data.status === "Suspended") {
        user.subscription = userSubscriptionConst.FREE;
        user.status = "Suspended";
        await UserModel.findByIdAndUpdate(user._id, {
          subscription: user.subscription,
          status: user.status,
        });
        return user;
      }
      if (data.status === "Removed") {
        user.subscription = userSubscriptionConst.FREE;
        user.status = "Removed";
        user.lastPayedStatus = "";
        await UserModel.findByIdAndUpdate(user._id, {
          subscription: user.subscription,
          status: user.status,
          lastPayedDate: user.lastPayedDate,
          lastPayedStatus: user.lastPayedStatus,
        });
        return user;
      }
      if (data.status === "Completed") {
        user.subscription = userSubscriptionConst.FREE;
        user.status = "Completed";
        user.lastPayedStatus = "";
        await UserModel.findByIdAndUpdate(user._id, {
          subscription: user.subscription,
          status: user.status,
          lastPayedDate: user.lastPayedDate,
          lastPayedStatus: user.lastPayedStatus,
        });
        return user;
      }
      if (data.status === "Created") {
        user.subscription = userSubscriptionConst.FREE;
        user.status = "Created";
        await UserModel.findByIdAndUpdate(user._id, {
          subscription: user.subscription,
          status: user.status,
        });
        return user;
      }
      if (!data.status) {
        user.subscription = userSubscriptionConst.FREE;
        user.orderReference = "";
        await UserModel.findByIdAndUpdate(user._id, {
          subscription: user.subscription,
          orderReference: user.orderReference,
        });
        return user;
      }
    } catch (error) {
      console.error("Error checking WayForPay subscription:", error);
    }
  }
  if (user.lastPayedStatus === "Declined") {
    const payload = {
      requestType,
      merchantAccount,
      merchantPassword,
      orderReference: user.orderReference,
    };
    try {
      const { data } = await axios.post(WFP_API_URL, payload, {
        headers: { "Content-Type": "application/json" },
      });
      if (data.status === "Active") {
        if (data.lastPayedStatus !== "Declined") {
          user.subscription = userSubscriptionConst.PREMIUM;
        }
        user.lastPayedStatus = data.lastPayedStatus;
        user.lastPayedDate = fromUnix(data.lastPayedDate) ?? user.lastPayedDate;
        user.status = data.status;
        user.amount = data.amount;
        user.mode = data.mode;

        if (data.nextPaymentDate) {
          user.subend = fromUnix(data.nextPaymentDate) ?? defaultNext(user, newDateTime);
        } else {
          const base = user.subend ?? new Date(newDateTime);
          user.subend = new Date(base.setMonth(base.getMonth() + 1));
        }
        const currentDate = fromUnix(data.dateBegin) ?? new Date(newDateTime);
        if (!user.substart) {
          user.substart = new Date(
            currentDate.setMonth(
              currentDate.getMonth() === 0 ? 11 : currentDate.getMonth() - 1
            )
          );
        }
        await UserModel.findByIdAndUpdate(user._id, {
          subscription: user.subscription,
          status: user.status,
          subend: user.subend,
          substart: user.substart,
          amount: user.amount,
          mode: user.mode,
          lastPayedStatus: user.lastPayedStatus,
          lastPayedDate: user.lastPayedDate,
        });
        return user;
      }
    } catch (error) {
      console.error("Error checking WayForPay subscription:", error);
    }
    return user;
  }
  return user;
};

const checkSubscriptionStatus = async (
  user: IUser,
  { force = false, full = false }: CheckOptions = {}
): Promise<IUser> => {
  if (user.subscription === userSubscriptionConst.ADMIN || !user.orderReference) {
    return user;
  }
  const now = Date.now();
  const last = user.subCheckedAt ? new Date(user.subCheckedAt).getTime() : 0;
  if (!force && now - last < CHECK_INTERVAL_MS) {
    return user;
  }
  // Запит у WFP потрібен лише за цих умов (як і раніше), тож штампуємо тільки тоді
  const needsWfp =
    full ||
    !user.subend ||
    now > new Date(user.subend).getTime() ||
    user.lastPayedStatus === "Declined";
  if (!needsWfp) {
    return user;
  }
  user.subCheckedAt = new Date(now);
  await UserModel.findByIdAndUpdate(user._id, { subCheckedAt: user.subCheckedAt });
  return syncWithWfp(user, full);
};

export default checkSubscriptionStatus;
