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
  const mail = emailTemplate(otp);

  let mailOptions = {
    from: process.env.email,
    to: email,
    subject: "NeuroGuard Password Recovery",
    html: mail,
  };

  await transporter.sendMail(mailOptions);
});
