import nodemailer from "nodemailer";
import "dotenv/config";
import type { SendMailOptions } from "nodemailer";
import { SMTP } from "../constants/mail.constant.js";
import escapeHtml from "./escapehtml.utils.js";
import HttpError from "./httperror.utils.js";

const { EMAIL_REPORT_SEND, EMAIL_SEND_FROM, EMAIL_PASS } = process.env;

interface IMail {
  email: string;
  message: string;
  file?: Express.Multer.File | undefined;
}

const sendMessageToSupport = async ({
  email,
  message,
  file,
}: IMail): Promise<void> => {
  if (!EMAIL_REPORT_SEND || !EMAIL_PASS || !EMAIL_SEND_FROM) {
    console.error("[SUPPORT] Mail env is not configured");
    throw HttpError(500, "Mail Server Error");
  }

  const html = `
      <h2>Новий запит у сапорт</h2>
      <table border="1" cellspacing="0" cellpadding="6" style="border-collapse:collapse;">
        <tr><td><b>Email</b></td><td>${escapeHtml(email)}</td></tr>
      </table>
      <h3>Текст повідомлення:</h3>
      <pre style="font-family: inherit; font-size: 16px; white-space: pre-line">${escapeHtml(
        message
      )}</pre>
      ${
        file
          ? `<p><b>Додано вкладення:</b> ${escapeHtml(file.originalname)}</p>`
          : ""
      }
      <hr/>
      <small>Це автоматичне повідомлення з dsgn.academy</small>
    `;

  const transporter = nodemailer.createTransport({
    host: SMTP.HOST,
    port: SMTP.PORT,
    secure: true,
    // без таймаутів запит висів би до розриву з'єднання проксі, а клієнт не бачив помилки
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
    auth: {
      user: EMAIL_SEND_FROM,
      pass: EMAIL_PASS,
    },
  });

  const mailOptions: SendMailOptions = {
    from: `"DSGN Academy Support" <${EMAIL_SEND_FROM}>`,
    to: EMAIL_REPORT_SEND,
    // щоб підтримка могла відповісти клієнту прямо з листа
    replyTo: email,
    subject: `Запит у сапорт від ${email}`,
    html,
    attachments: file
      ? [
          {
            filename: file.originalname,
            path: file.path,
            contentType: file.mimetype,
          },
        ]
      : [],
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.info(`[SUPPORT] Sent from ${email}: ${info.messageId}`);
  } catch (error) {
    // лист не пішов — зберігаємо звернення в логах, щоб його можна було відновити
    console.error(
      `[SUPPORT] SEND FAILED from ${email}. Message: ${JSON.stringify(
        message
      )}${file ? ` (attachment: ${file.originalname})` : ""}`,
      error
    );
    throw error;
  }
};

export default sendMessageToSupport;
