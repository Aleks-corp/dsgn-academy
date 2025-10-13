/* eslint-disable n/no-missing-import */
import nodemailer from "nodemailer";
import type { SentMessageInfo } from "nodemailer";
import "dotenv/config";

import dayjs from "dayjs";
import "dayjs/locale/uk.js";
import utc from "dayjs/plugin/utc.js";
import { SMTP } from "../constants/mail.constant.js";
import type { IUser } from "../types/user.type.js";
import type { IStream } from "../types/stream.type.js";
import { HttpError } from "./index.js";

const { EMAIL_SEND_FROM, EMAIL_PASS } = process.env;
dayjs.extend(utc);

const sendMailToUsers = async ({
  user,
  stream,
}: {
  user: IUser;
  stream: IStream;
}): Promise<SentMessageInfo> => {
  if (!EMAIL_PASS || !EMAIL_SEND_FROM) {
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

  const subject = "Новий онлайн-ефір від DSGN Academy";

  let html: string;

  if (user.subscription === "free") {
    html = `
<table
  width="100%"
  cellspacing="0"
  cellpadding="0"
  border="0"
  style="
    background-color: #ffffff;
    font-family: Inter, Arial, sans-serif;
    color: #222;
  "
>
  <tr>
    <td align="center">
      <table
        width="600"
        cellspacing="0"
        cellpadding="0"
        border="0"
        style="
          background-color: #f7f7f7;
          border-radius: 24px;
          padding: 34px 68px;
          border-radius: 32px;
        "
      >
        <tr>
          <td align="start" style="padding-bottom: 32px">
            <img
              src="https://res.cloudinary.com/deeooeyeg/image/upload/v1760301174/DA/mail-link-logo_awtizh.png"
              width="183"
              height="52"
              style="display: block"
              alt="Dsgn logo"
            />
          </td>
        </tr>

        <tr>
          <td
            style="
              font-size: 20px;
              font-weight: 600;
              color: #121212;
              padding-bottom: 16px;
            "
          >
            Новий онлайн-ефір — “${stream.title}”
          </td>
        </tr>

        <tr>
          <td style="font-size: 18px; line-height: 28px; color: #222222">
            Привіт, ${user.name} 💙<br /><br />
            Ми готуємо новий онлайн-ефір — “${stream.title}”.<br />
            Поговоримо про те, як штучний інтелект допомагає прискорити роботу,
            створювати дизайн-рішення та автоматизувати рутину.<br /><br />

            🎬 <b>Що буде:</b><br />
            — нові AI-фічі у Figma;<br />
            — як інтегрувати їх у робочий процес;<br />
            — практичні приклади й корисні файли 🧩<br /><br />

            📅 <b>Коли: </b>${dayjs
              .utc(stream.startStreamAt)
              .locale("uk")
              .format("у dddd, DD MMMM, о HH:mm, за Київським часом")}<br />
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td
                  style="
                    font-size: 18px;
                    line-height: 28px;
                    color: #222222;
                    vertical-align: top;
                  "
                >
                  🔒 <b>Доступ:</b> лише для преміум-підписників<br /><br />
                </td>
                <td align="right" style="vertical-align: top">
                  <img
                    src="https://res.cloudinary.com/deeooeyeg/image/upload/v1760301173/DA/mail-icon-logo_cvaehg.png"
                    width="130"
                    height="130"
                    style="display: block"
                    alt="Dsgn logo"
                  />
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <tr>
          <td align="start">
            <a
              href="https://dsgn.academy/check-subscription"
              target="_blank"
              style="
                background-color: #0170fd;
                color: #fcfcfc;
                font-size: 16px;
                font-weight: 500;
                text-decoration: none;
                padding: 12px 28px;
                border-radius: 12px;
                display: inline-block;
              "
            >
              Придбати преміум-підписку
            </a>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
    `;
  } else {
    html = `
<table
  width="100%"
  cellspacing="0"
  cellpadding="0"
  border="0"
  style="
    background-color: #ffffff;
    font-family: Inter, Arial, sans-serif;
    color: #222;
  "
>
  <tr>
    <td align="center">
      <table
        width="600"
        cellspacing="0"
        cellpadding="0"
        border="0"
        style="
          background-color: #f7f7f7;
          border-radius: 24px;
          padding: 34px 68px;
          border-radius: 32px;
        "
      >
        <tr>
          <td align="start" style="padding-bottom: 32px">
            <img
              src="https://res.cloudinary.com/deeooeyeg/image/upload/v1760301174/DA/mail-link-logo_awtizh.png"
              width="183"
              height="52"
              style="display: block"
              alt="Dsgn logo"
            />
          </td>
        </tr>

        <tr>
          <td
            style="
              font-size: 20px;
              font-weight: 600;
              color: #121212;
              padding-bottom: 16px;
            "
          >
            Новий онлайн-ефір — “${stream.title}”
          </td>
        </tr>

        <tr>
          <td style="font-size: 18px; line-height: 28px; color: #222222">
            Привіт, ${user.name} 💙<br /><br />
            Ми готуємо новий онлайн-ефір — “${stream.title}”.<br />
            Поговоримо про те, як штучний інтелект допомагає прискорити роботу,
            створювати дизайн-рішення та автоматизувати рутину.<br /><br />

            🎬 <b>Що буде:</b><br />
            — нові AI-фічі у Figma;<br />
            — як інтегрувати їх у робочий процес;<br />
            — практичні приклади й корисні файли 🧩<br /><br />

            📅 <b>Коли: </b>${dayjs
              .utc(stream.startStreamAt)
              .locale("uk")
              .format("у dddd, DD MMMM, о HH:mm, за Київським часом")}<br />
            🔒 <b>Доступ:</b> лише для преміум-підписників<br /><br />

            Постав дзвіночок на
            <a
              href="https://youtube.com/live/${stream.videoId}"
              target="_blank"
              style="color: #0170fd; text-decoration: underline"
              >YouTube</a
            >, щоб отримати нагадування, або приєднуйся напряму з Dsgn Academy
            💫<br /><br />
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td
                  style="
                    font-size: 18px;
                    line-height: 28px;
                    color: #222222;
                    vertical-align: top;
                  "
                >
                  До зустрічі наживо 💛
                </td>
                <td align="right" style="vertical-align: top">
                  <img
                    src="https://res.cloudinary.com/deeooeyeg/image/upload/v1760301173/DA/mail-icon-logo_cvaehg.png"
                    width="130"
                    height="130"
                    style="display: block"
                    alt="Dsgn logo"
                  />
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <tr>
          <td align="start">
            <a
              href="https://dsgn.academy/stream"
              target="_blank"
              style="
                background-color: #0170fd;
                color: #fcfcfc;
                font-size: 16px;
                font-weight: 500;
                text-decoration: none;
                padding: 12px 28px;
                border-radius: 12px;
                display: inline-block;
              "
            >
              Перейти до ефіру
            </a>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>

    `;
  }

  return await transporter.sendMail({
    from: `"DSGN Academy" <${EMAIL_SEND_FROM}>`,
    to: user.email,
    subject,
    html,
  });
};

export default sendMailToUsers;
