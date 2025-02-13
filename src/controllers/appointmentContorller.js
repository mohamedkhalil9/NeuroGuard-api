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

export const getAppointments = asyncWrapper(async (req, res) => {
  const id = req.user._id;
  const { role } = req.user;
  
  let appointments;
  if (role == 'Patinet') {
    appointments = await Appointment.find({ patient: id })
      .populate('doctor', 'firstName lastName specialization') // Populate doctor details
      .populate("patient", 'firstName lastName'); // Populate patient details (optional)
    return appointments
  } else if (role == 'Doctor') {
    appointments = await Appointment.find({ doctor: id })
      .populate('doctor', 'firstName lastName specialization') // Populate doctor details
      .populate("patient", 'firstName lastName'); // Populate patient details (optional)
    return appointments
  } 
  
  res.status(200).json({ status: 'success', data: appointments });
});

export const getAppointment = asyncWrapper(async (req, res) => {
  const id = req.user._id;
  const { appointmentId } = req.params;
  const { role } = req.user;
  
  let appointment;
  if (role == 'Patinet') {
    appointment = await Appointment.findOne({_id: appointmentId, patient: id })
      .populate('doctor', 'firstName lastName specialization') // Populate doctor details
      .populate("patient", 'firstName lastName'); // Populate patient details (optional)
    return appointment
  } else if (role == 'Doctor') {
    appointment = await Appointment.findOne({_id: appointmentId, doctor: id })
      .populate('doctor', 'firstName lastName specialization') // Populate doctor details
      .populate("patient", 'firstName lastName'); // Populate patient details (optional)
    return appointment
  }

  if (!appointment) throw new ApiError('appointment not found', 404)

  res.status(200).json({ status: 'success', data: appointment});
})
