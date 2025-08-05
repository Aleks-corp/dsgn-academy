import "dotenv/config";
import axios from "axios";
import type { IUser } from "../types/user.type.js";
import { HttpError } from "./index.js";

const requestType = "REMOVE";
const merchantAccount = process.env.WFP_MERCHANT_ACCOUNT || "";
const merchantPassword = process.env.WFP_MERCHANT_PASSWORD || "";
const WFP_API_URL =
  process.env.WFP_API_URL || "https://api.wayforpay.com/regularApi";

const unsubscribeUser = async (
  user: IUser
): Promise<{ reasonCode: number }> => {
  const payload = {
    requestType,
    merchantAccount,
    merchantPassword,
    orderReference: user.orderReference,
  };
  try {
    const response = await axios.post(WFP_API_URL, payload, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("Error unsubscribe from WayForPay subscription:", error);
    if (error instanceof Error) {
      throw HttpError(400, error.message);
    }
    throw new Error("Не вдалося відписатися від підписки");
  }
};
export default unsubscribeUser;
