import Doctor from './../models/doctorModel.js';
import Appointment from './../models/appointmentModel.js';
import asyncWrapper from './../middlewares/asyncWrapper.js';
import ApiError from './../utils/apiError.js';

export const registerDoctor = asyncWrapper(async (req, res) => {
  const { firstName, lastName, email, password, role, dateOfBirth, gender, phone, country, address } = req.body;

  const doctor = await Doctor.findOne({ email: email });
  if (doctor) throw new ApiError("user aleardy existed", 409);

  const hashedPassword = await bcrypt.hash(password, 10);
  const newDoctor = await User.create({ firstName, lastName, email, password: hashedPassword, role, dateOfBirth, gender, phone, country, address });

  res.status(201).json({ status: "success", data: newDoctor });
})

export const getDoctorAppointments = asyncWrapper(async (req, res) => {
  const id = req.user._id;
  const appointments = await Appointment.find({ doctor: id })
    .populate('patient', 'firstName lastName') // Populate patient details
    .populate('doctor', 'firstName lastName specialization'); // Populate doctor details (optional)
  res.status(200).json({ status: 'success', data: appointments });
})

export const getDoctorAppointment = asyncWrapper(async (req, res) => {
  const { id } = req.user._id;
  const { appointmentId } = req.params;

  // Could be User.find() also => discriminator: same document
  //const patient = await User.findById(id);
  const doctor = await Doctor.findById(id);
  if (!doctor || doctor.role !== 'doctor') throw new ApiError('doctor not found', 404)

  const appointment = await Appointment.findOne({_id: appointmentId, doctor: id})
    .populate('patient', 'firstName lastName'); // Populate doctor details

  if (!appointment) throw new ApiError('appointment not found', 404)

  res.status(200).json({ status: 'success', data: appointment});
})

export const getDoctorPatients = asyncWrapper(async (req, res) => {
  const id = req.user._id;
  const appointments = await Appointment.find({ doctor: id })//.select('-')
    .populate('patient', 'firstName lastName') // Populate patient details
  res.status(200).json({ status: 'success', data: appointments });
})

export const getDoctorPatient = asyncWrapper(async (req, res) => {
  const { id } = req.user._id;
  const { appointmentId } = req.params;

  // Could be User.find() also => discriminator: same document
  //const patient = await User.findById(id);
  const doctor = await Doctor.findById(id);
  if (!doctor || doctor.role !== 'doctor') throw new ApiError('doctor not found', 404)

  const appointment = await Appointment.findOne({_id: appointmentId, doctor: id})//.select('-')
    .populate('patient', 'firstName lastName'); // Populate doctor details

  if (!appointment) throw new ApiError('appointment not found', 404)

  res.status(200).json({ status: 'success', data: appointment});
})

export const getDoctors = asyncWrapper(async (req, res) => {
  // query validation ??
  const query = { ...req.query };
  const excludedFields = ['sort', 'page', 'limit', 'fields'];
  excludedFields.forEach((el) => delete query[el]);

  const page = +req.query.page || 1;
  const limit = +req.query.limit || 10;
  const skip = (page - 1) * limit;
  const count = await Doctor.countDocuments();
  if (skip > count) throw new ApiError('no more items', 400);

  const sort = req.query.sort?.split(',').join(' ');
  const fields = req.query.fields?.split(',').join(' ');

  const doctors = await Doctor.find(query).select(fields).sort(sort).skip(skip).limit(limit);
  res.status(200).json({ status: "success", results: doctors.length, data: { doctors }});
})

export const getDoctor = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const doctor = await Doctor.findById(id);
  if (!doctor) throw new ApiError("doctor not found", 404);
  res.status(200).json({ status: "success", data: { doctor }});
})

export const getDoctorProfile = asyncWrapper(async (req, res) => {
  const { user } = req;
  res.status(200).json({ status: "success", data: {user} });
})

export const updateDoctorProfile = asyncWrapper(async (req, res) => {
//  const { id } = req.params;
  const id = req.user._id;
//  const { title, description, estimated } = req.body;
//
//  const doctor = await Doctor.findById(id);
//  if (!doctor) throw new ApiError(`there is no doctor with id ${id}`, 404);
//
//  const newDoctor = { title, description, estimated };
//  const updatedDoctor = await Doctor.findByIdAndUpdate(id, newDoctor, { new: true });
//
//  res.status(200).json({ status: "success", data: { updatedDoctor }});
})

export const deleteDoctorProfile = asyncWrapper(async (req, res) => {
  const id = req.user._id;
  const doctor = await Doctor.findByIdAndDelete(id);
  if (!doctor) throw new ApiError(`there is no doctor with id ${id}`, 404);
  res.status(200).json({ status: "success", data: null });
})
