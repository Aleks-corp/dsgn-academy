import nodemailer from "nodemailer";
import type { SentMessageInfo } from "nodemailer";
import "dotenv/config";

import { SMTP } from "../constants/mail.constant.js";
import { HttpError } from "./index.js";

const { EMAIL_REPORT_SEND, EMAIL_SEND_FROM, EMAIL_PASS } = process.env;

interface Mail {
  email: string;
  reason?: string;
  mode?: string;
}

const sendMailSub = async ({
  email,
  reason,
  mode,
}: Mail): Promise<SentMessageInfo> => {
  if (!EMAIL_REPORT_SEND || !EMAIL_PASS || !EMAIL_SEND_FROM) {
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

  const isUnsub = Boolean(reason);

  const subject = isUnsub
    ? `🔔 Відписка від користувача ${email}`
    : `✅ Нова підписка від користувача ${email}`;

  const text = isUnsub
    ? `Користувач ${email} відписався від підписки.\nПричина: ${reason}`
    : `Користувач ${email} щойно оформив "${
        mode ? (mode === "monthly" ? "місячну" : "річну") : ""
      }" підписку!`;

  const html = isUnsub
    ? `
      <h2>Відписка користувача</h2>
      <p><b>Email:</b> ${email}</p>
      <p><b>Причина:</b> ${reason}</p>
      <hr/>
      <small>Це автоматичне повідомлення з dsgn.academy</small>
    `
    : `
      <h2>Нова підписка 🎉</h2>
      <p><b>Email:</b> ${email}</p>
      <p>Користувач успішно оформив підписку на dsgn.academy.</p>
      <hr/>
      <small>Це автоматичне повідомлення з dsgn.academy</small>
    `;
  return await transporter.sendMail({
    from: `"DSGN Academy" <${EMAIL_SEND_FROM}>`,
    to: EMAIL_REPORT_SEND,
    subject,
    text,
    html,
  });
};

export default sendMailSub;
