import nodemailer from "nodemailer";

export const sendEmail = async (to: string, subject: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
      user: "84216b001@smtp-brevo.com",
      pass: process.env.EMAIL_PASS,
    },
  });

  const info = await transporter.sendMail({
    from: '"Barbershop" <relaxbarbershop25@gmail.com>',
    to,
    subject,
    html,
  });

  console.log("Email sent: %s", info.messageId);
};
