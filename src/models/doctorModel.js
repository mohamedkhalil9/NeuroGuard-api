import mongoose from 'mongoose';
import User from './userModel.js';

const doctorSchema = new mongoose.Schema({
  //firstName: {
  //  type: String,
  //  required: true
  //},
  //lastName: {
  //  type: String,
  //  required: true
  //},
  //email: {
  //  type: String,
  //  required: true
  //},
  //password: {
  //  type: String,
  //},
  //role: {
  //  type: String,
  //  enum: ['patient', 'doctor', 'admin'],
  //},
  //gender: {
  //  type: String,
  //  enum: ['Male', 'Female'],
  //  //required: true
  //},
  //dateOfBirth: {
  //  type: Date,
  //  //required: true,
  //},
  //phone: {
  //  type: String,
  //  //required: true,
  //},
  //country: String,
  //address: String,
  //otp: String,
  //otpExpire: Date,
  //googleId: String,
  //createdAt: { type: Date, default: Date.now },

  specialization: { 
    type: String, 
    required: true 
  },
  availableSlots: [{ type: Date }], // array of available time slots
});

//const doctorSchema = new mongoose.Schema({
//  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//  specialization: { type: String, required: true },
//  licensenumber: { type: String, required: true, unique: true },
//  availableSlots: [{ type: Date }], // array of available time slots
//  isAvailable: { type: Boolean, default: true },
//});

//const Doctor = mongoose.model('Doctor', doctorSchema);
const Doctor = User.discriminator('Doctor', doctorSchema);

export default Doctor;
