import mongoose from 'mongoose';

const AppointmentSchema = new mongoose.Schema({
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

const Appointment = mongoose.model('Appointment', AppointmentSchema);

export default Appointment;
