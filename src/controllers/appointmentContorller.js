import Appointment from "./../models/appointmentModel.js";
import Doctor from "./../models/doctorModel.js";
import Patient from "./../models/patientModel.js";
import asyncWrapper from "./../middlewares/asyncWrapper.js";
import ApiError from "./../utils/apiError.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE);

export const createAppointment = asyncWrapper(async (req, res) => {
  const id = req.user._id;
  const { date, time, doctorId, notes } = req.body;

  const doctor = await Doctor.findById(doctorId);
  if (!doctor) throw new ApiError("doctor not found", 404);

  // const available = doctor.availableSlots;

  const appointment = await Appointment.create({
    date,
    time,
    patient: id,
    doctor: doctorId,
    fee: doctor.appointmentFee,
    notes,
  });
  res.status(201).json({ status: "success", data: appointment });
});

export const payAppointment = asyncWrapper(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id).populate(
    "doctor",
  );

  if (!appointment)
    return res.status(404).json({ error: "Appointment not found" });
  if (appointment.payment.status === "paid")
    return res.status(400).json({ error: "Already paid" });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    customer_email: req.user.email,
    // success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
    // success_url: `${process.env.CLIENT_URL}/appointments`,
    success_url: `http://localhost:4000/api/v1/appointments`,
    // cancel_url: `${process.env.CLIENT_URL}/appointments`,
    cancel_url: `http://localhost:4000/api/v1/appointments`,
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: appointment.doctor.appointmentFee * 100,
          product_data: {
            name: `Appointment with Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}`,
            // description,
            // images:
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      appointmentId: appointment._id.toString(),
    },
  });

  appointment.payment.stripeSessionId = session.id;

  await appointment.save();

  res.status(200).json({ status: "success", data: session });
});

export const getAppointments = asyncWrapper(async (req, res) => {
  const { user } = req;

  const query = {};
  if (user.role === "patient") query.patient = user._id;
  else if (user.role === "doctor") query.doctor = user._id;

  const appointments = await Appointment.find(query)
    .populate("doctor")
    .populate("patient");

  // NOTE:
  if (appointments.length === 0)
    throw new ApiError("there is no appointments for this user", 404);

  const updatedAppointments = await Promise.all(
    appointments.map(async (appointment) => {
      if (!appointment.payment?.stripeSessionId) {
        return appointment;
      }

      try {
        const stripeSession = await stripe.checkout.sessions.retrieve(
          appointment.payment.stripeSessionId,
        );

        if (stripeSession.payment_status === "paid") {
          if (appointment.payment.status !== "paid") {
            appointment.payment.amount = stripeSession.amount_total / 100;
            appointment.payment.status = "paid";
            appointment.status = "confirmed";
            await appointment.save();
          }
        }
        return appointment;
      } catch (error) {
        console.error(
          `Error processing appointment ${appointment._id}:`,
          error,
        );
        return appointment; // Return original if error
      }
    }),
  );

  res.status(200).json({
    status: "success",
    results: appointments.length,
    data: updatedAppointments,
  });
});

export const getAppointment = asyncWrapper(async (req, res) => {
  const { id } = req.params;

  const appointment = await Appointment.findById(id)
    .populate("doctor")
    .populate("patient");

  if (!appointment) throw new ApiError("appointment not found", 404);

  res.status(200).json({ status: "success", data: appointment });
});
