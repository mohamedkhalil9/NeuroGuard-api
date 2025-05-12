import mongoose from "mongoose";
import User from "./userModel.js";

const doctorSchema = new mongoose.Schema({
  specialization: {
    type: String,
    //required: true
  },
  // image: {
  //   type: String,
  // },
  // workingHours: {
  //   type: [
  //     {
  //       day: {
  //         type: String,
  //         enum: [
  //           "Sunday",
  //           "Monday",
  //           "Tuesday",
  //           "Wednesday",
  //           "Thursday",
  //           "Friday",
  //           "Saturday",
  //         ],
  //       },
  //       startTime: { type: String, default: "09:00" },
  //       endTime: { type: String, default: "17:00" },
  //     },
  //   ],
  //   default: function() {
  //     // Default working hours: Sun-Thu, 9 AM to 5 PM
  //     return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"].map(
  //       (day) => ({
  //         day,
  //         startTime: "09:00",
  //         endTime: "17:00",
  //       }),
  //     );
  //   },
  // },
  appointmentFee: Number, //  this is salary
  // booked:
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
