import mongoose from "mongoose";
import User from "./userModel.js";

const patientSchema = new mongoose.Schema({
  profileImg: {
    type: String,
    default: "placeholder",
  },
  medicalHistory: {
    mriUrl: String,
    strokeStatus: String,
    strokeRisk: Number,
  }, // Array of strings for medical history
  favoriteDoctors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
    },
  ],
  //slug
});

const Patient = User.discriminator("Patient", patientSchema);

export default Patient;
