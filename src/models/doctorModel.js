import mongoose from 'mongoose';
import User from './userModel.js';

const doctorSchema = new mongoose.Schema({
  specialization: { 
    type: String, 
    //required: true 
  },
  availableSlots: [{ type: Date }], // array of available time slots
  appointmentFee: Number,
  //slug
});

doctorSchema.index({
  firstName: 'text',
  lastName: 'text',
});
//  licensenumber: { type: String, required: true, unique: true },
//  isAvailable: { type: Boolean, default: true },

const Doctor = User.discriminator('Doctor', doctorSchema);

export default Doctor;
