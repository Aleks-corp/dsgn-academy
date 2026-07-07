import nodemailer from "nodemailer";
import type { SentMessageInfo } from "nodemailer";
import "dotenv/config";

import { SMTP } from "../constants/mail.constant.js";
import type { IUser } from "../types/user.type.js";
import { HttpError } from "./index.js";

const { EMAIL_REPORT_SEND, EMAIL_SEND_FROM, EMAIL_PASS } = process.env;

interface IMail {
  user: IUser;
  report?: string;
}

const sendMailToSprt = async ({
  user,
  report,
}: IMail): Promise<SentMessageInfo> => {
  if (!EMAIL_REPORT_SEND || !EMAIL_PASS || !EMAIL_SEND_FROM) {
    throw HttpError(500, "Mail Server Error");
  }

  const transporter = nodemailer.createTransport({
    host: SMTP.HOST,
    port: SMTP.PORT,
    secure: true,
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
    auth: {
      user: EMAIL_SEND_FROM,
      pass: EMAIL_PASS,
    },
  });

  const subject = report
    ? `🐞 Report від ${user.email}`
    : `🧾 Запит на перевірку оплати від ${user.email}`;

  let html: string;

  if (report) {
    // Якщо це репорт
    html = `
      <h2>Отримано репорт від користувача</h2>
      <table border="1" cellspacing="0" cellpadding="6" style="border-collapse:collapse;">
        <tr><td><b>Ім’я</b></td><td>${user.name}</td></tr>
        <tr><td><b>Email</b></td><td>${user.email}</td></tr>
        ${
          user.phone
            ? `<tr><td><b>Телефон</b></td><td>${user.phone}</td></tr>`
            : ""
        }
        <tr><td><b>Підписка</b></td><td>${user.subscription}</td></tr>
        <tr><td><b>Order Ref</b></td><td>${user.orderReference}</td></tr>
        ${
          user.status
            ? `<tr><td><b>Статус підписки</b></td><td>${user.status}</td></tr>`
            : ""
        }
        ${
          user.lastPayedStatus
            ? `<tr><td><b>Статус останьої оплати</b></td><td>${user.lastPayedStatus}</td></tr>`
            : ""
        }
      </table>
      <h3>Текст репорту:</h3>
      <p>${report}</p>
      <hr/>
      <small>Це автоматичне повідомлення з dsgn.academy</small>
    `;
  } else {
    // Якщо перевірка оплати
    html = `
      <h2>Запит на перевірку оплати</h2>
      <table border="1" cellspacing="0" cellpadding="6" style="border-collapse:collapse;">
        <tr><td><b>Ім’я</b></td><td>${user.name}</td></tr>
        <tr><td><b>Email</b></td><td>${user.email}</td></tr>
        ${
          user.phone
            ? `<tr><td><b>Телефон</b></td><td>${user.phone}</td></tr>`
            : ""
        }
        <tr><td><b>Підписка</b></td><td>${user.subscription}</td></tr>
        ${
          user.status
            ? `<tr><td><b>Статус підписки</b></td><td>${user.status}</td></tr>`
            : ""
        }
        ${
          user.amount
            ? `<tr><td><b>Сума оплати</b></td><td>${user.amount} €</td></tr>`
            : ""
        }
        ${
          user.mode
            ? `<tr><td><b>Період</b></td><td>${user.mode}</td></tr>`
            : ""
        }
        ${
          user.lastPayedStatus
            ? `<tr><td><b>Статус останьої оплати</b></td><td>${user.lastPayedStatus}</td></tr>`
            : ""
        }
        ${
          user.lastPayedDate
            ? `<tr><td><b>Дата останьої оплати</b></td><td>${new Date(
                user.lastPayedDate
              ).toLocaleDateString("uk-UA")}</td></tr>`
            : ""
        }
        <tr><td><b>Дата початку</b></td><td>${new Date(
          user.substart
        ).toLocaleDateString("uk-UA")}</td></tr>
        <tr><td><b>Дата закінчення</b></td><td>${new Date(
          user.subend
        ).toLocaleDateString("uk-UA")}</td></tr>
        <tr><td><b>Order Ref</b></td><td>${user.orderReference}</td></tr>
      </table>
      <hr/>
      <small>Це автоматичне повідомлення з dsgn.academy</small>
    `;
  }

  return await transporter.sendMail({
    from: `"DSGN Academy" <${EMAIL_SEND_FROM}>`,
    to: EMAIL_REPORT_SEND,
    subject,
    html,
  });
};

export default sendMailToSprt;
