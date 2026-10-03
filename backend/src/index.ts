import mongoose from "mongoose";
import "dotenv/config";
// import axios from "axios";

import app from "./app.js";
import { UserModel } from "./models/index.js";
import { checkSubscriptionStatus, assertBaseUrl } from "./utils/index.js";

const { DB_HOST = "", PORT = 3000 } = process.env;

assertBaseUrl();

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
});

const SYNC_INTERVAL_MS = 30 * 60 * 1000;

// Статус оновлюється і без візитів користувача: форсимо перевірку прострочених підписок
const syncExpiredSubscriptions = async (): Promise<void> => {
  try {
    const users = await UserModel.find({
      subscription: "premium",
      orderReference: { $ne: "" },
      subend: { $lt: new Date() },
    });
    for (const user of users) {
      await checkSubscriptionStatus(user, { force: true });
    }
    if (users.length) console.info(`Subscription sync: ${users.length} checked`);
  } catch (error) {
    console.error("Subscription sync failed:", error);
  }
};

mongoose
  .connect(DB_HOST)
  .then(() => {
    app.listen(PORT, () => {
      console.info(`Database connection successful on port ${PORT}`);
      setInterval(() => void syncExpiredSubscriptions(), SYNC_INTERVAL_MS);
    });
  })
  .catch((error: unknown) => {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error("Unknown Error");
    }
    process.exit(1);
  });
