import mongoose from 'mongoose';

const DoctorSchema = new mongoose.Schema({
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

//const Doctor = mongoose.model('Doctor', DoctorSchema);
//const Doctor = User.disc('Doctor', DoctorSchema);

export default Doctor;
