import nodemailer from "nodemailer";
import type Mail from "nodemailer/lib/mailer/index.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

export const sendEmail = async (mailOptions: Mail.Options) => {
  const info = await transporter.sendMail({
    from: `"Elseady Space Portfolio" <${process.env.GMAIL_USER}>`,
    ...mailOptions,
  });

  console.log("Message sent: %s", info.messageId);
  return info.accepted.length > 0 ? true : false;
};
