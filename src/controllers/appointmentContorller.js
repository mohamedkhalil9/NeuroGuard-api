import Appointment from "./../models/appointmentModel.js";
import Doctor from "./../models/doctorModel.js";
import Patient from "./../models/patientModel.js";
import asyncWrapper from "./../middlewares/asyncWrapper.js";
import ApiError from "./../utils/apiError.js";
import stripe from "stripe";

export const createAppointment = asyncWrapper(async (req, res) => {
  const id = req.user._id;
  const { date, time, doctorId, notes } = req.body;

  const doctor = await Doctor.findById(doctorId);
  if (!doctor) throw new ApiError("doctor not found", 404);

  // NOTE: doc avaliable time validation
  const available = doctor.availableSlots;

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
  try {
    const appointment = await Appointment.findById(req.params.id).populate(
      "doctor",
    );

    if (!appointment)
      return res.status(404).json({ error: "Appointment not found" });
    if (appointment.payment.status === "paid")
      return res.status(400).json({ error: "Already paid" });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Appointment with Dr. ${appointment.doctorId.name}`,
            },
            unit_amount: appointment.doctorId.fee,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/payment-canceled`,
      metadata: {
        appointmentId: appointment._id.toString(),
      },
    });

    // Save Stripe session ID to appointment
    appointment.payment.stripeSessionId = session.id;
    await appointment.save();

    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export const getAppointments = asyncWrapper(async (req, res) => {
  const { user } = req;

  const query = {};
  if (user.role === "patient") query.patient = user._id;
  else if (user.role === "doctor") query.doctor = user._id;

  const appointments = await Appointment.find(query)
    .populate("doctor", "firstName lastName specialization") // Populate doctor details
    .populate("patient", "firstName lastName"); // Populate patient details (optional)

  if (!appointments[0])
    throw new ApiError("there is no appointments for this user", 404);

  res.status(200).json({
    status: "success",
    results: appointments.length,
    data: { appointments },
  });
});

export const getAppointment = asyncWrapper(async (req, res) => {
  // const { user } = req;
  const { id } = req.params;

  // const query = {_id: appointmentId};
  // if (user.role === 'patient') query.patient = user._id;
  // else if (user.role === 'doctor') query.doctor = user._id;

  // const appointment = await Appointment.findOne(query)
  const appointment = await Appointment.findById(id)
    .populate("doctor", "firstName lastName specialization") // Populate doctor details
    .populate("patient", "firstName lastName"); // Populate patient details (optional)

  if (!appointment) throw new ApiError("appointment not found", 404);

  res.status(200).json({ status: "success", data: appointment });
});
