import nodemailer from "nodemailer";
import asyncWrapper from "../middlewares/asyncWrapper.js";
import { emailTemplate } from "./emailTemplate.js";
import ApiError from "./apiError.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

export const sendResetMail = async (email, otp) => {
  try {
    const mail = emailTemplate;

    let resetTemplate = mail.replace(/{{OTP_CODE}}/g, otp);
    for (let i = 0; i < 4; i++) {
      resetTemplate = resetTemplate.replace(`{{DIGIT_${i + 1}}}`, otp[i]);
    }
    let mailOptions = {
      from: process.env.email,
      to: email,
      subject: "NeuroGuard Password Recovery",
      html: resetTemplate,
    };

    const res = await transporter.sendMail(mailOptions);
    return res;
  } catch (error) {
    throw new ApiError(error.message, 500);
  }
};
