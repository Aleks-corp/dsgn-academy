import nodemailer from "nodemailer";
import "dotenv/config";
import type { SendMailOptions } from "nodemailer";
import { SMTP } from "../constants/mail.constant.js";

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
  const html = `
      <h2>Новий запит у сапорт</h2>
      <table border="1" cellspacing="0" cellpadding="6" style="border-collapse:collapse;">
        <tr><td><b>Email</b></td><td>${email}</td></tr>
      </table>
      <h3>Текст повідомлення:</h3>
      <pre style="font-family: inherit; font-size: 16px; white-space: pre-line">${message}</pre>
      ${file ? `<p><b>Додано вкладення:</b> ${file.originalname}</p>` : ""}
      <hr/>
      <small>Це автоматичне повідомлення з dsgn.academy</small>
    `;

  // 3. Транспортер
  const transporter = nodemailer.createTransport({
    host: SMTP.HOST,
    port: SMTP.PORT,
    secure: true,
    auth: {
      user: EMAIL_SEND_FROM,
      pass: EMAIL_PASS,
    },
  });

  // 4. Опції для sendMail
  const mailOptions: SendMailOptions = {
    from: `"DSGN Academy Support" <${EMAIL_SEND_FROM}>`,
    to: EMAIL_REPORT_SEND,
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

  await transporter.sendMail(mailOptions);
};

export default sendMessageToSupport;
