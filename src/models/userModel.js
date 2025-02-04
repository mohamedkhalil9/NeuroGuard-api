import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
  },
  OTP: String,
  otpExpire: Date,
  role: {
    type: String,
    enum: ['patient', 'doctor', 'admin', 'amenities'],
  },
  dateOfBirth: {
    type: Date,
    //required: true,
  },
  gender: {
    type: String,
    enum: ["Male", "Female"],
    //required: true
  },
  phone: {
    type: String,
    //required: true,
  },
  country: String,
  address: String,
  googleId: String

});

const User = mongoose.model('User', UserSchema);

export default User;
