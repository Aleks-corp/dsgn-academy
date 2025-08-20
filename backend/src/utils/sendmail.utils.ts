import nodemailer from "nodemailer";
import "dotenv/config";
import { SMTP } from "../constants/mail.constant.js";
import { HttpError } from "./index.js";

const {
  FRONT_WEB_SERVER,
  FRONT_SERVER,
  EMAIL_SEND_FROM,
  EMAIL_PASS,
  EMAIL_REPORT_SEND,
} = process.env;

interface Mail {
  email: string;
  verificationToken: string;
  path: string;
  text: string;
}

const sendMail = async ({
  email,
  verificationToken,
  path,
  text,
}: Mail): Promise<void> => {
  if (!FRONT_SERVER || !EMAIL_PASS || !EMAIL_SEND_FROM || !EMAIL_REPORT_SEND) {
    throw HttpError(500, "Mail Server Error");
  }

  const transporter = nodemailer.createTransport({
    host: SMTP.HOST,
    port: SMTP.PORT,
    secure: true,
    auth: {
      user: EMAIL_SEND_FROM,
      pass: EMAIL_PASS,
    },
  });

  const html = `<html>
    <head>
    <meta charset="UTF-8">
    <title>Підтвердження електронної пошти — <strong>dsgn academy<strong></title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; text-align: center;">
    <div style="max-width: 500px; margin: auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
      <h2 style="color: #3772FF;">Вітаємо в <strong>dsgn academy<strong>!</h2>
      <p style="color: #151617; font-size: 16px;">
      ${text}
      </p>
      <a style="
      display: inline-block;
      padding: 12px 24px;
      background-color: #3772FF;
      color: #FCFCFD;
      text-decoration: none;
      font-size: 16px;
      font-weight: bold;
      border-radius: 5px;
      border: 2px solid #3772FF;
      text-align: center;
      " href="${
        FRONT_WEB_SERVER ? FRONT_WEB_SERVER : FRONT_SERVER
      }/${path}?token=${verificationToken}" target="_blank">Підтвердити електронну пошту</a>
      <p style="color: #666; font-size: 14px; margin-top: 20px;">
      Якщо ви не реєструвалися в <strong>dsgn academy<strong>, просто ігноруйте цей лист. Посилання буде дійсне протягом 24 годин.
      </p>
      <p style="color: #151617; font-size: 14px;">
      Потрібна допомога? Напишіть нам на <a href="mailto:dsgnua.sprt1@gmail.com" style="color: #3772FF;">dsgnua.sprt1@gmail.com</a>
      </p>
    </div>
    </body>
  </html>
  `;

  return await transporter.sendMail({
    from: EMAIL_SEND_FROM,
    to: email,
    subject: "Підтвердження електронної пошти",
    text: "Ваше посилання для підтвердження електронної адреси в Dsgn Academy",
    html,
  });
};

export default sendMail;
