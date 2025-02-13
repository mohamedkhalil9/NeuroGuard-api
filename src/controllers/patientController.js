import Patient from './../models/patientModel.js';
import Appointment from './../models/appointmentModel.js';
import Doctor from './../models/doctorModel.js';
import asyncWrapper from './../middlewares/asyncWrapper.js';
import ApiError from './../utils/apiError.js';
import bcrypt from 'bcrypt';

export const registerPatient = asyncWrapper(async (req, res) => {
  const { firstName, lastName, email, password, role, dateOfBirth, gender, phone, country, address } = req.body;

  const user = await Patient.findOne({ email: email });
  if (user) throw new ApiError("email aleardy existed", 409);

  console.log(req.body)
  // Mongoose Middleware pre save
  const hashedPassword = await bcrypt.hash(password, 10);
  const newPatient = await Patient.create({ firstName, lastName, email, password: hashedPassword, role: 'patient', dateOfBirth, gender, phone, country, address });

  res.status(201).json({ status: "success", data: newPatient });
})

// NOTE: add patient filters (aggregation)
export const getDoctorPatients = asyncWrapper(async (req, res) => {
  const id = req.user._id;
  const appointments = await Appointment.find({ doctor: id }).select('patient')
    .populate('patient', 'firstName lastName') // Populate patient details
  res.status(200).json({ status: 'success', data: appointments });
})

// NOTE: using patientId instead of appointmentId? 
export const getDoctorPatient = asyncWrapper(async (req, res) => {
  const { id } = req.user._id;
  const { appointmentId } = req.params;

  const doctor = await Doctor.findById(id);
  if (!doctor || doctor.role !== 'doctor') throw new ApiError('doctor not found', 404)

  const appointment = await Appointment.findOne({_id: appointmentId, doctor: id}).select('patient')
    .populate('patient', 'firstName lastName'); // Populate doctor details

  if (!appointment) throw new ApiError('appointment not found', 404)

  res.status(200).json({ status: 'success', data: appointment});
})


export const getPatientProfile = asyncWrapper(async (req, res) => {
  const id = req.user._id;

  const patient = await Patient.findById(id).select('-password');
  if (!patient) throw new ApiError(`there is no patient with id ${id}`, 404);
  
  res.status(200).json({ status: "success", data: { patient } });
})

export const updatePatientProfile = asyncWrapper(async (req, res) => {
  const id = req.user._id;

  const patient = await Patient.findById(id);
  if (!patient) throw new ApiError(`there is no patient with id ${id}`, 404);
  
  const newPatient = { ...req.body };
  const updatedPatient = await Patient.findByIdAndUpdate(id, newPatient, { new: true });

  res.status(200).json({ status: "success", data: { updatedPatient }});
})

export const deletePatientProfile = asyncWrapper(async (req, res) => {
  const id = req.user._id;
  const patient = await Patient.findByIdAndDelete(id);
  if (!patient) throw new ApiError(`there is no patient with id ${id}`, 404);
  res.status(200).json({ status: "success", data: null });
})
