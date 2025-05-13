import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
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
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    notes: { type: String },
  },
  { timestamps: true },
);

// Prevent double bookings
appointmentSchema.index({ doctorId: 1, startTime: 1 }, { unique: true });

const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;
