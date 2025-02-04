import User from './../models/userModel.js';
import asyncWrapper from './../middlewares/asyncWrapper.js';
import ApiError from './../utils/apiError.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { sendResetMail } from '../utils/sendResetMail.js';

const register = asyncWrapper(async (req, res) => {
  const { firstName, lastName, email, password, role, dateOfBirth, gender, phone, country, address } = req.body;

  const user = await User.findOne({ email: email });
  if (user) throw new ApiError("user aleardy existed", 409);

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ firstName, lastName, email, password: hashedPassword, role, dateOfBirth, gender, phone, country, address });

  res.status(201).json({ status: "success", data: newUser });
})

const login = asyncWrapper(async (req, res) => { 
  const { user } = req;
  req.login(user, (err) => {
    if (err) throw new ApiError(err.message , 500)

    res.status(200).json({ id: user._id,  email: user.email })
  })
})

const logout = asyncWrapper(async (req, res) => {
  req.logout((err) => {
    if (err) throw new ApiError(err.message, 500);

    res.sendStatus(204)
  })
})

const forgotPassword = asyncWrapper(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) throw new ApiError('user not found', 404);

  const OTP = crypto.randomInt(1000, 10000).toString();
  
  //const hashedOTP = await bcrypt.hash(OTP, 10);
  user.OTP = OTP;
  user.otpExpire = Date.now() + 1000 * 60 * 5;
  await user.save();

  sendResetMail(email, OTP);
  
  res.status(200).json({ status: 'success', data: user.email })
})

const resetPassword = asyncWrapper(async (req, res) => {
  const { OTP } = req.params;

  const user = await User.findOne({ OTP , otpExpire: {$gt: Date.now()}});
  if (!user) throw new ApiError('OTP is invalid or has expired', 400);

  const { newPassword, confirmNewPassword } = req.body;
  if (newPassword !== confirmNewPassword) throw new appError("password don't match")

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  user.OTP = undefined; 
  user.otpExpire = undefined;
  await user.save();

  res.status(200).json({ status: "success", data: user.email });
})

export { register, login, logout, forgotPassword, resetPassword }
