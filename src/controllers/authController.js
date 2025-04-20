import User from "./../models/userModel.js";
import asyncWrapper from "./../middlewares/asyncWrapper.js";
import ApiError from "./../utils/apiError.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { sendResetMail } from "../utils/sendResetMail.js";

export const login = asyncWrapper(async (req, res) => {
  const { user } = req;
  req.login(user, (err) => {
    if (err) throw new ApiError(err.message, 500);

    const user = { ...req.user._doc };
    delete user["password"];

    res.status(200).json({ user });
  });
});

export const authenticate = (req, res, next) => {
  if (!req.isAuthenticated())
    return next(new ApiError("unauthorized please login", 401));
  next();
};

export const authorize = (...roles) => {
  return async (req, res, next) => {
    const role = req.user.role;
    if (!roles.includes(role))
      return next(new ApiError("forbidden you're not allowed", 403));
    next();
  };
};

export const logout = asyncWrapper(async (req, res) => {
  req.logout((err) => {
    if (err) return new ApiError(err.message, 500);

    res.sendStatus(204).clearCookie("connect.sid", { httpOnly: true });
  });
});

export const forgotPassword = asyncWrapper(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) throw new ApiError("user not found", 404);

  const otp = crypto.randomInt(1000, 10000).toString();
  const hashedOtp = await bcrypt.hash(otp, 10);
  user.otp = hashedOtp;
  user.otpExpire = Date.now() + 1000 * 60 * 5;
  await user.save();

  try {
    sendResetMail(email, otp);
  } catch (error) {
    throw new ApiError(error, 500);
  }

  res.status(200).json({ status: "success", data: user.email });
});

export const verifyOtp = asyncWrapper(async (req, res) => {
  const { otp, email } = req.body;

  // NOTE: send a cookie with the email expires after certain time
  const user = await User.findOne({ email });
  const isMatch = await bcrypt.compare(otp, user.otp);
  if (user.otpExpire < Date.now() || !isMatch)
    throw new ApiError("OTP code is not valid", 409);

  user.otpVerifed = true;
  await user.save();

  res.status(200).json({ status: "success", data: null });
});

export const resetPassword = asyncWrapper(async (req, res) => {
  const { email, newPassword, confirmNewPassword } = req.body;

  if (newPassword !== confirmNewPassword)
    throw new ApiError("password don't match", 409);

  const user = await User.findOne({ email });
  if (!user) throw new ApiError("user not found", 404);
  if (user.otpVerifed == false)
    throw new ApiError("unauthorized otp is not verifed", 401);

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  user.otp = undefined;
  user.otpExpire = undefined;
  user.otpVerifed = undefined;
  await user.save();

  res.status(200).json({ status: "success", data: user.email });
});
