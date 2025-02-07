import Patient from './../models/patientModel.js';
import Appointment from './../models/appointmentModel.js';
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

export const getPatientAppointments = asyncWrapper(async (req, res) => {
  const { id } = req.user._id;

  const appointments = await Appointment.find({ patient: id })
    .populate('doctor', 'firstName lastName specialization') // Populate doctor details
    .populate("patient", 'firstName lastName'); // Populate patient details (optional)

  res.status(200).json({ status: 'success', data: appointments });
});

export const getPatientAppointment = asyncWrapper(async (req, res) => {
  const { id } = req.user._id;
  const { appointmentId } = req.params;

  // Could be User.find() also => discriminator: same document
  //const patient = await User.findById(id);
  const patient = await Patient.findById(id);
  if (!patient || patient.role !== 'patient') throw new ApiError('patient not found', 404)

  const appointment = await Appointment.findOne({_id: appointmentId, patient: id})
    .populate('doctor', 'firstName lastName specialization'); // Populate doctor details

  if (!appointment) throw new ApiError('appointment not found', 404)

  res.status(200).json({ status: 'success', data: appointment});
})

export const getPatients = asyncWrapper(async (req, res) => {
  // query validation ??
  const query = { ...req.query };
  const excludedFields = ['sort', 'page', 'limit', 'fields'];
  excludedFields.forEach((el) => delete query[el]);

  const page = +req.query.page || 1;
  const limit = +req.query.limit || 10;
  const skip = (page - 1) * limit;
  const count = await Patient.countDocuments();
  if (skip > count) throw new ApiError('no more items', 400);

  const sort = req.query.sort?.split(',').join(' ');
  const fields = req.query.fields?.split(',').join(' ');

  const patients = await Patient.find(query).select(fields).sort(sort).skip(skip).limit(limit);
  res.status(200).json({ status: "success", results: patients.length, data: { patients }});
})

export const getPatient = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const patient = await Patient.findById(id);
  if (!patient) throw new ApiError("patient not found", 404);
  res.status(200).json({ status: "success", data: { patient }});
})

export const getPatientProfile = asyncWrapper(async (req, res) => {
  const { user } = req;
  res.status(200).json({ status: "success", data: {user} });
})

export const updatePatientProfile = asyncWrapper(async (req, res) => {
  const id = req.user._id;
  const { title, description, estimated } = req.body;

  const patient = await Patient.findById(id);
  if (!patient) throw new ApiError(`there is no patient with id ${id}`, 404);
  
  const newPatient = { title, description, estimated };
  const updatedPatient = await Patient.findByIdAndUpdate(id, newPatient, { new: true });

  res.status(200).json({ status: "success", data: { updatedPatient }});
})

export const deletePatientProfile = asyncWrapper(async (req, res) => {
  const id = req.user._id;
  const patient = await Patient.findByIdAndDelete(id);
  if (!patient) throw new ApiError(`there is no patient with id ${id}`, 404);
  res.status(200).json({ status: "success", data: null });
})
