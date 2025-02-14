import Appointment from './../models/appointmentModel.js';
import Doctor from './../models/doctorModel.js';
import Patient from './../models/patientModel.js';
import asyncWrapper from './../middlewares/asyncWrapper.js';
import ApiError from './../utils/apiError.js';

export const createAppointment = asyncWrapper(async (req, res) => {
  const id = req.user._id;
  const { date, time, doctorId, notes } = req.body;
  
  // NOTE: doc avaliable time validation
  const appointment = await Appointment.create({ date, time, patient: id, doctor: doctorId, notes });
  res.status(201).json({ status: 'success', data: appointment });
})

export const payAppointment = asyncWrapper(async (req, res) => {

})

export const getAppointments = asyncWrapper(async (req, res) => {
  const { user } = req;

  const query = {};
  if (user.role === 'patient') query.patient = user._id;
  else if (user.role === 'doctor') query.doctor = user._id;

  const appointments = await Appointment.find(query)
    .populate('doctor', 'firstName lastName specialization') // Populate doctor details
    .populate("patient", 'firstName lastName'); // Populate patient details (optional)

  if (!appointments[0]) throw new ApiError('there is no appointments for this user', 404);

  res.status(200).json({ status: 'success', data: appointments });
});

export const getAppointment = asyncWrapper(async (req, res) => {
  // const { user } = req;
  const { appointmentId } = req.params;

  // const query = {_id: appointmentId};
  // if (user.role === 'patient') query.patient = user._id;
  // else if (user.role === 'doctor') query.doctor = user._id;

  // const appointment = await Appointment.findOne(query)
  const appointment = await Appointment.findById(appointmentId)
      .populate('doctor', 'firstName lastName specialization') // Populate doctor details
      .populate("patient", 'firstName lastName'); // Populate patient details (optional)

  if (!appointment) throw new ApiError('appointment not found', 404)

  res.status(200).json({ status: 'success', data: appointment});
})
