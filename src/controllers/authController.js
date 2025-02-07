import User from './../models/userModel.js';
import asyncWrapper from './../middlewares/asyncWrapper.js';
import ApiError from './../utils/apiError.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { sendResetMail } from '../utils/sendResetMail.js';

export const login = asyncWrapper(async (req, res) => { 
  const { user } = req;
  req.login(user, (err) => {
    if (err) throw new ApiError(err.message , 500)

    res.status(200).json({ id: user._id,  email: user.email })
  })
})

export const authenticate = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }

  new ApiError('access denied', 403) 
  return next();
}

export const logout = asyncWrapper(async (req, res) => {
  req.logout((err) => {
    if (err) throw new ApiError(err.message, 500);

    res.sendStatus(204)
  })
})

export const forgotPassword = asyncWrapper(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) throw new ApiError('user not found', 404);

  const otp = crypto.randomInt(1000, 10000).toString();
  const hashedOtp = await bcrypt.hash(otp, 10);
  user.otp = hashedOtp;
  user.otpExpire = Date.now() + 1000 * 60 * 5;
  await user.save();

  sendResetMail(email, otp);
  
  res.status(200).json({ status: 'success', data: user.email })
})

export const verifyOtp = asyncWrapper(async (req, res) => {
  const { otp, email } = req.body;

  const user = await User.findOne({ email });
  const isMatch = await bcrypt.compare(otp, user.otp)

  if (user.otpExpire < Date.now() || !isMatch ) throw new ApiError('OTP code is not valid', 409)

  // db verifed => true
  res.status(200).json({ status: 'success', data: null });
})

export const resetPassword = asyncWrapper(async (req, res) => {
  //const { OTP } = req.params;
  // Check verifed true

  const user = await User.findOne({ OTP , otpExpire: {$gt: Date.now()}});
  if (!user) throw new ApiError('OTP is invalid or has expired', 400);

  const { newPassword, confirmNewPassword } = req.body;
  if (newPassword !== confirmNewPassword) throw new ApiError("password don't match")

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  user.otp = undefined; 
  user.otpExpire = undefined;
  await user.save();

  res.status(200).json({ status: "success", data: user.email });
})
