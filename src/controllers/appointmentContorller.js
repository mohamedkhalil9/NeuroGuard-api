import Appointment from "./../models/appointmentModel.js";
import Doctor from "./../models/doctorModel.js";
import asyncWrapper from "./../middlewares/asyncWrapper.js";
import ApiError from "./../utils/apiError.js";
import Stripe from "stripe";
import { getAvailableSchedule } from "../utils/scheduleGenerator.js";
import { DateTime } from "luxon";

const stripe = new Stripe(process.env.STRIPE);

export const createAppointment = asyncWrapper(async (req, res) => {
  const id = req.user._id;
  // { date, time, } = req.body;
  const { doctorId, startTime, notes } = req.body;

  const doctor = await Doctor.findById(doctorId);
  if (!doctor) throw new ApiError("doctor not found", 404);

  const egyptTime = DateTime.fromISO(startTime, { zone: "Africa/Cairo" });
  const utcStartTime = egyptTime.toUTC().toJSDate();

  const requestedDate = new Date(utcStartTime);
  const availableSchedule = await getAvailableSchedule(doctorId, requestedDate);

  const isValidTime = availableSchedule.some(
    (hour) => hour.start.getTime() === requestedDate.getTime(),
  );
  if (!isValidTime) throw new ApiError("Time is not availabe", 400);

  const appointment = await Appointment.create({
    doctor: doctorId,
    patient: id,
    startTime: requestedDate,
    endTime: new Date(requestedDate.getTime() + 60 * 60 * 1000),
    notes,
  });

  res.status(201).json({
    status: "success",
    data: {
      localTime: {
        start: egyptTime.toFormat("yyyy-MM-dd HH:mm"),
        end: egyptTime.plus({ hours: 1 }).toFormat("yyyy-MM-dd HH:mm"),
      },
      ...appointment._doc,
    },
  });
});

export const payAppointment = asyncWrapper(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id).populate(
    "doctor",
  );

  if (!appointment) throw new ApiError("appointment not found", 404);
  if (appointment.payment.status === "paid")
    throw new ApiError("Already paid", 400);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    customer_email: req.user.email,
    // success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
    success_url: `${process.env.CLIENT_URL}appointment`,
    // success_url: `http://localhost:4000/api/v1/appointments`,
    cancel_url: `${process.env.CLIENT_URL}doctors`,
    // cancel_url: `http://localhost:4000/api/v1/appointments`,
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
  if (user.role === "PATIENT") query.patient = user._id;
  else if (user.role === "DOCTOR") query.doctor = user._id;

  const appointments = await Appointment.find(query)
    .populate(
      "doctor",
      " firstName lastName profileImg appointmentFee specialization",
    )
    .populate(
      "patient",
      " firstName lastName profileImg, gender, favoriteDoctors",
    );

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
            // appointment.status = "booked";
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

  // const localTime = DateTime.fromJSDate(appointment.startTime)
  //   .setZone("Africa/Cairo")
  //   .toFormat("HH:mm");
  // Use mongoose middlewares

  res.status(200).json({
    status: "success",
    results: appointments.length,
    data: updatedAppointments,
  });
});

export const getAppointment = asyncWrapper(async (req, res) => {
  const { id } = req.params;

  const appointment = await Appointment.findById(id)
    .populate(
      "doctor",
      " firstName lastName profileImg appointmentFee specialization",
    )
    .populate(
      "patient",
      " firstName lastName profileImg, gender, favoriteDoctors",
    );

  if (!appointment) throw new ApiError("appointment not found", 404);

  const localTime = DateTime.fromJSDate(appointment.startTime)
    .setZone("Africa/Cairo")
    .toFormat("HH:mm");
  res.status(200).json({ status: "success", data: { localTime, appointment } });
});
