import nodemailer from "nodemailer";
import { emailTemplate } from "./emailTemplate.js";

export const sendResetMail = (email, otp) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
  });

  const mail = emailTemplate(otp);

  let mailOptions = {
    from: process.env.email,
    to: email,
    subject: "NeuroGuard Password Recovery",
    html: mail,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error occurred: ", error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
