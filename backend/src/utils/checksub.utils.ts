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

const checkSubscriptionStatus = async (user: IUser): Promise<IUser> => {
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
        user.lastPayedDate = new Date(parseInt(data.lastPayedDate + "000"));
        user.status = data.status;
        user.amount = data.amount;
        user.mode = data.mode;
        if (data.nextPaymentDate) {
          user.subend = new Date(parseInt(data.nextPaymentDate + "000"));
        } else {
          user.subend = new Date(
            new Date(newDateTime).setMonth(new Date(newDateTime).getMonth() + 1)
          );
        }
        const currentDate = new Date(data.dateBegin + "000");
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
  if (user.subend && newDateTime > user.subend.getTime()) {
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
        if (data.lastPayedStatus === "Declined") {
          user.subscription = userSubscriptionConst.FREE;
        }
        if (data.lastPayedStatus === "Approved") {
          user.subscription = userSubscriptionConst.PREMIUM;
        }
        user.lastPayedStatus = data.lastPayedStatus;
        user.lastPayedDate = new Date(parseInt(data.lastPayedDate + "000"));
        user.status = data.status;
        user.amount = data.amount;
        user.mode = data.mode;
        if (data.nextPaymentDate) {
          user.subend = new Date(parseInt(data.nextPaymentDate + "000"));
        } else {
          user.subend = new Date(
            user.subend.setMonth(user.subend.getMonth() + 1)
          );
        }
        const currentDate = new Date(data.dateBegin + "000");
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
        if (data.lastPayedStatus === "Approved") {
          user.subscription = userSubscriptionConst.PREMIUM;
        }
        user.lastPayedStatus = data.lastPayedStatus;
        user.lastPayedDate = new Date(parseInt(data.lastPayedDate + "000"));
        user.status = data.status;
        user.amount = data.amount;
        user.mode = data.mode;

        if (data.nextPaymentDate) {
          user.subend = new Date(parseInt(data.nextPaymentDate + "000"));
        } else {
          user.subend = new Date(
            user.subend.setMonth(user.subend.getMonth() + 1)
          );
        }
        const currentDate = new Date(data.dateBegin + "000");
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
export default checkSubscriptionStatus;
