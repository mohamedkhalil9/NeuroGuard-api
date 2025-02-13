import mongoose from 'mongoose';
import User from './userModel.js';

const patientSchema = new mongoose.Schema({
  medicalHistory: [{ type: String }], // Array of strings for medical history
  //slug
});

const Patient = User.discriminator('Patient', patientSchema);

export default Patient;
