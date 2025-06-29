import mongoose from "mongoose";
import User from "./userModel.js";

const doctorSchema = new mongoose.Schema({
  workingDays: [
    {
      day: {
        type: Number,
        required: true,
        min: 0,
        max: 6, // 0 = Sunday, 6 = Saturday
      },
      start: {
        type: String,
        default: "16:00",
        match: /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/,
      },
      end: {
        type: String,
        default: "22:00",
        match: /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/,
      },
      _id: false,
    },
  ],
  // Default working hours if none provided so what does default start and end used for?
  // If working everyday or when the day do not provided as working day
  defaultWorkingDays: {
    type: Boolean,
    // default: true,
  },
  appointmentFee: Number, //  this is salary
  specialization: {
    type: String,
    //required: true
  },
  nationalId: String,
  academicYear: String,
  //slug
});

doctorSchema.index({
  firstName: "text",
  lastName: "text",
});
//  licensenumber: { type: String, required: true, unique: true },
//  isAvailable: { type: Boolean, default: true },

const Doctor = User.discriminator("Doctor", doctorSchema);

export default Doctor;
