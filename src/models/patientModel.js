import mongoose from 'mongoose';

const PatientSchema = new mongoose.Schema({
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

//const Patient = mongoose.model('Patient', PatientSchema);
//const Patient = User.disc('Patient', PatientSchema);

export default Patient;
