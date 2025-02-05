import mongoose from 'mongoose';
import User from './userModel.js';

const patientSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true 
  },
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
