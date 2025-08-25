import fs from "fs";
import path from "path";
import express from "express";
import type { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";

import type { Err } from "./types/error.type.js";

import usersRouter from "./routes/user.route.js";
import coursesRouter from "./routes/course.route.js";
import videosRouter from "./routes/video.route.js";
import testRouter from "./routes/test.route.js";
import adminRouter from "./routes/admin.route.js";

const logPath = path.resolve("logs");

if (!fs.existsSync(logPath)) {
  fs.mkdirSync(logPath);
}

const accessLogStream = fs.createWriteStream(path.join(logPath, "access.log"), {
  flags: "a",
});

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "combined";

app.use(morgan(formatsLogger, { stream: accessLogStream }));

app.use(
  cors({
    origin:
      process.env.FRONT_SERVER && process.env.FRONT_WEB_SERVER
        ? [process.env.FRONT_SERVER, process.env.FRONT_WEB_SERVER]
        : true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Authorization", "Content-Type"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json()); // для application/json
app.use(express.urlencoded({ extended: true })); // для application/x-www-form-urlencoded
app.use(express.static("public"));

app.use((req: Request, res: Response, next: NextFunction) => {
  const ip =
    typeof req.headers["x-forwarded-for"] === "string"
      ? req.headers["x-forwarded-for"].split(",")[0].trim()
      : req.socket.remoteAddress || "";

  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    console.info(
      `📩 New Request: ${ip} ${req.method} ${req.originalUrl} -> ${res.statusCode} ${res.statusMessage} (${duration}ms)`
    );
  });

  next();
});

app.use("/auth", usersRouter);
app.use("/courses", coursesRouter);
app.use("/videos", videosRouter);
app.use("/testing", testRouter);
app.use("/admin", adminRouter);

app.get("/ping", (req, res) => {
  res.send("POST /pong");
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((error: Err, _req: Request, res: Response, ___: NextFunction): void => {
  if (!error.status) {
    error.status = 500;
  }
  const { status, message } = error;
  res.status(status).json({ message });
  console.error("📩 Error Response:", res.statusCode, res.statusMessage);
});

export default app;
