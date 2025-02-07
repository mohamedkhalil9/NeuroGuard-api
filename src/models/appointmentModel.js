import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  date: { 
    type: Date, 
    required: true 
  },
  time: { 
    type: String, 
    required: true 
  }, // You can use Date if you prefer
  notes: { type: String }, // Additional notes for the appointment

  patient: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Patient', 
    required: true 
  },
  doctor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Doctor', 
    required: true 
  },

  status: { 
    type: String, 
    enum: ['scheduled', 'completed', 'cancelled'], 
    default: 'scheduled' },

  createdAt: { type: Date, default: Date.now },
});

//const appointmentSchema = new mongoose.Schema({
//  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
//  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
//  date: { type: Date, required: true },
//  time: { type: String, required: true }, // You can use Date if you prefer
//  status: { type: String, enum: ['scheduled', 'completed', 'cancelled'], default: 'scheduled' },
//  notes: { type: String }, // Additional notes for the appointment
//  createdAt: { type: Date, default: Date.now },
//});

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;
