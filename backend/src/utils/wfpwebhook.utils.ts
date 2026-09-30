import crypto from "crypto";
import type { RequestData, ResponseData } from "../types/data.types.js";

const hmacMd5 = (secret: string, str: string): string =>
  crypto.createHmac("md5", secret).update(str).digest("hex");

// WFP не завжди шле очікуваний Content-Type: тіло може бути вже розпарсеним
// (json/urlencoded), сирим Buffer (route-level raw) або порожнім.
export const parseWebhookBody = (body: unknown): Record<string, unknown> => {
  let raw: unknown = body;
  if (Buffer.isBuffer(raw)) raw = raw.toString("utf8");
  if (typeof raw === "string") {
    const text = raw.trim();
    if (!text) return {};
    if (text.startsWith("{")) {
      try {
        return JSON.parse(text);
      } catch {
        /* fallthrough to urlencoded */
      }
    }
    raw = Object.fromEntries(new URLSearchParams(text));
  }
  if (!raw || typeof raw !== "object") return {};
  const obj = raw as Record<string, unknown>;
  const keys = Object.keys(obj);
  // Квірк WFP: весь JSON прийшов як єдиний urlencoded-ключ з порожнім значенням.
  if (keys.length === 1 && obj[keys[0]] === "" && keys[0].startsWith("{")) {
    return JSON.parse(keys[0]);
  }
  return obj;
};

export const verifyWebhookSignature = (
  data: RequestData,
  secret: string
): boolean => {
  const {
    merchantAccount,
    orderReference,
    amount,
    currency,
    authCode,
    cardPan,
    transactionStatus,
    reasonCode,
    merchantSignature,
  } = data;
  if (!merchantSignature || !secret) return false;
  const str = [
    merchantAccount,
    orderReference,
    amount,
    currency,
    authCode,
    cardPan,
    transactionStatus,
    reasonCode,
  ]
    .map((v) => (v === undefined || v === null ? "" : String(v)))
    .join(";");
  const expected = Buffer.from(hmacMd5(secret, str));
  const received = Buffer.from(String(merchantSignature));
  return (
    expected.length === received.length &&
    crypto.timingSafeEqual(expected, received)
  );
};

export const buildWebhookResponse = (
  orderReference: string,
  secret: string
): ResponseData => {
  const time = Math.floor(Date.now() / 1000);
  return {
    orderReference,
    status: "accept",
    time,
    signature: hmacMd5(secret, `${orderReference};accept;${time}`),
  };
};
