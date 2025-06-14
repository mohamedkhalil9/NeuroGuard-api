import nodemailer from "nodemailer";
import asyncWrapper from "../middlewares/asyncWrapper.js";
import { emailTemplate } from "./emailTemplate.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

export const sendResetMail = asyncWrapper(async (email, otp) => {
  const mail = emailTemplate;

  const resetTemplate = mail.replace(/{{OTP_CODE}}/g, otp);
  for (let i = 0; i < 6; i++) {
    resetTemplate = resetTemplate.replace(`{{DIGIT_${i + 1}}}`, otp[i]);
  }
  let mailOptions = {
    from: process.env.email,
    to: email,
    subject: "NeuroGuard Password Recovery",
    html: resetTemplate,
  };

  await transporter.sendMail(mailOptions);
});
