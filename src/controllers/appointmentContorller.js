import Appointment from './../models/appointmentModel.js';
import Doctor from './../models/doctorModel.js';
import Patient from './../models/patientModel.js';
import asyncWrapper from './../middlewares/asyncWrapper.js';
import ApiError from './../utils/apiError.js';

export const createAppointment = asyncWrapper(async (req, res) => {
  const id = req.user._id;
  const { date, time, doctorId, notes } = req.body;
  
  const appointment = await Appointment.create({ date, time, patient: id, doctor: doctorId, notes });
  res.status(201).json({ status: 'success', data: appointment });
})

export const payAppointment = asyncWrapper(async (req, res) => {

})

export const getPatientAppointments = asyncWrapper(async (req, res) => {
  const id = req.user._id;

  const appointments = await Appointment.find({ patient: id })
    .populate('doctor', 'firstName lastName specialization') // Populate doctor details
    .populate("patient", 'firstName lastName'); // Populate patient details (optional)

  res.status(200).json({ status: 'success', data: appointments });
});

export const getPatientAppointment = asyncWrapper(async (req, res) => {
  const id = req.user._id;
  const { appointmentId } = req.params;

  const patient = await Patient.findById(id);
  if (!patient || patient.role !== 'patient') throw new ApiError('patient not found', 404)

  const appointment = await Appointment.findOne({_id: appointmentId, patient: id})
    .populate('doctor', 'firstName lastName specialization'); // Populate doctor details

  if (!appointment) throw new ApiError('appointment not found', 404)

  res.status(200).json({ status: 'success', data: appointment});
})

export const getDoctorAppointments = asyncWrapper(async (req, res) => {
  const id = req.user._id;
  const appointments = await Appointment.find({ doctor: id })
    .populate('patient', 'firstName lastName') // Populate patient details
    .populate('doctor', 'firstName lastName specialization'); // Populate doctor details (optional)
  res.status(200).json({ status: 'success', data: appointments });
})

export const getDoctorAppointment = asyncWrapper(async (req, res) => {
  const id = req.user._id;
  const { appointmentId } = req.params;

  const doctor = await Doctor.findById(id);
  if (!doctor || doctor.role !== 'doctor') throw new ApiError('doctor not found', 404)

  const appointment = await Appointment.findOne({_id: appointmentId, doctor: id})
    .populate('patient', 'firstName lastName'); // Populate doctor details

  if (!appointment) throw new ApiError('appointment not found', 404)

  res.status(200).json({ status: 'success', data: appointment});
})



export const getAppointments = asyncWrapper(async (req, res) => {
  // query validation ??
  const query = { ...req.query };
  const excludedFields = ['sort', 'page', 'limit', 'fields'];
  excludedFields.forEach((el) => delete query[el]);

  const page = +req.query.page || 1;
  const limit = +req.query.limit || 10;
  const skip = (page - 1) * limit;
  const count = await Appointment.countDocuments();
  if (skip > count) throw new ApiError('no more items', 400);

  const sort = req.query.sort?.split(',').join(' ');
  const fields = req.query.fields?.split(',').join(' ');

  const appointments = await Appointment.find(query).select(fields).sort(sort).skip(skip).limit(limit);
  res.status(200).json({ status: "success", results: appointments.length, data: { appointments }});
})

export const getAppointment = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const appointment = await Appointment.findById(id);
  if (!appointment) throw new ApiError("appointment not found", 404);
  res.status(200).json({ status: "success", data: { appointment }});
})
