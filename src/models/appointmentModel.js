import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  // dateTime: { type: Date, required: true }, // Stored in UTC
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  }, // You can use Date if you prefer
  notes: { type: String }, // Additional notes for the appointment
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  payment: {
    status: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    amount: Number,
    stripePaymentId: String,
    stripeSessionId: String,
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "canceled"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

// Prevent double bookings
appointmentSchema.index({ doctorId: 1, startDateTime: 1 }, { unique: true });

const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;
