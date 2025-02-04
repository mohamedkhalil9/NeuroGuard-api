import ApiError from '../utils/apiError.js';
import User from './../models/userModel.js';
import asyncWrapper from './asyncWrapper.js';
import bcrypt from 'bcrypt';

export const verifyOTP = asyncWrapper(async (req, res) => {
  const { OTP, email } = req.body;

  const user = await User.findOne({ email });

  //const isMatch = await bcrypt.compare(OTP, user.OTP)

  if (user.otpExpire < Date.now() || user.OTP !== OTP ) throw new ApiError('OTP code is not valid', 409)

  //next();
  res.status(200).json({ status: 'success', data: OTP });
})
