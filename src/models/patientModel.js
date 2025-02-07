import mongoose from 'mongoose';
import User from './userModel.js';

const patientSchema = new mongoose.Schema({
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
  //
  medicalHistory: [{ type: String }], // Array of strings for medical history
});

//const patientSchema = new mongoose.Schema({
//  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//  dateOfBirth: { type: Date },
//  gender: { type: String, enum: ['male', 'female', 'other'] },
//  address: { type: String },
//  medicalHistory: [{ type: String }], // Array of strings for medical history
//  allergies: [{ type: String }], // Array of strings for allergies
//});

//const Patient = mongoose.model('Patient', patientSchema);
const Patient = User.discriminator('Patient', patientSchema);

export default Patient;
