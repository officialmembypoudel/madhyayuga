import { createTransport } from "nodemailer";

export const sendMail = async (email, subject, message) => {
  try {
    const transport = createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mail = await transport.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject,
      text: message,
    });
    console.log(mail, "new message");
  } catch (error) {
    console.log(error);
  }
};
