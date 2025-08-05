import sgMail from "@sendgrid/mail";
import "dotenv/config";
import type { MailDataRequired } from "@sendgrid/mail";
import { HttpError } from "./index.js";

const { FRONT_SERVER, EMAIL_SEND_FROM, SENDGRID_API_KEY } = process.env;

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
  if (EMAIL_SEND_FROM && SENDGRID_API_KEY) {
    const msg: MailDataRequired = {
      to: email,
      from: EMAIL_SEND_FROM,
      subject: "Verify Email",
      text: "Your Link to Verify Email adress in Design Lab",
      html: `<html>
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
      " href="${FRONT_SERVER}/${path}/${verificationToken}" target="_blank">Підтвердити електронну пошту</a>
      <p style="color: #666; font-size: 14px; margin-top: 20px;">
        Якщо ви не реєструвались в <strong>dsgn academy<strong>, просто ігноруйте цей лист. Посилання буде дійсне протягом 24 годин.
      </p>
      <p style="color: #151617; font-size: 14px;">
        Потрібна допомога? Напишіть нам на <a href="mailto:dsgnua.sprt1@gmail.com" style="color: #3772FF;">dsgnua.sprt1@gmail.com</a>
      </p>
    </div>
  </body>
</html>
`,
    };
    sgMail.setApiKey(SENDGRID_API_KEY);
    await sgMail.send(msg);
    return;
  } else {
    throw HttpError(400, "Mail Server Error");
  }
};

export default sendMail;
