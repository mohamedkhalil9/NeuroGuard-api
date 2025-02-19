import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  role: {
    type: String,
    enum: ["patient", "doctor", "admin"],
    required: true,
  },
  gender: {
    type: String,
    enum: ["Male", "Female"],
    //required: true
  },
  dateOfBirth: {
    type: Date,
    //required: true
  },
  phone: {
    type: String,
    //required: true
  },
  country: String,
  address: String,
  otp: String,
  otpExpire: Date,
  otpVerifed: Boolean,
  googleId: String,
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

export default User;
