import mongoose from 'mongoose';
import User from './userModel.js';

const doctorSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
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
