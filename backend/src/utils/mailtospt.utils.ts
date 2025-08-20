import nodemailer from "nodemailer";
import "dotenv/config";

import { SMTP } from "../constants/mail.constant.js";
import { HttpError } from "./index.js";

const { EMAIL_REPORT_SEND, EMAIL_SEND_FROM, EMAIL_PASS } = process.env;

interface Mail {
  email: string;
  message: string;
}

const sendMailToSprt = async ({ email, message }: Mail): Promise<void> => {
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

  return await transporter.sendMail({
    from: EMAIL_SEND_FROM,
    to: EMAIL_REPORT_SEND,
    subject: `Report designualab from ${email}`,
    text: `Report from ${email}. ${" "}
              Message: ${message}.`,
  });
};

export default sendMailToSprt;
