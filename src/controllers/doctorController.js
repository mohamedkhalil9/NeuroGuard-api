import User from '../models/userModel.js'
import Doctor from './../models/doctorModel.js';
import Appointment from './../models/appointmentModel.js';
import asyncWrapper from './../middlewares/asyncWrapper.js';
import ApiError from './../utils/apiError.js';
import bcrypt from 'bcrypt';

export const registerDoctor = asyncWrapper(async (req, res) => {
  const { firstName, lastName, email, password, role, dateOfBirth, gender, phone, country, address } = req.body;

  const user = await User.findOne({ email: email });
  if (user) throw new ApiError("email aleardy existed", 409);

  const hashedPassword = await bcrypt.hash(password, 10);
  const newDoctor = await Doctor.create({ firstName, lastName, email, password: hashedPassword, role: 'doctor', dateOfBirth, gender, phone, country, address });

  res.status(201).json({ status: "success", data: newDoctor });
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
  const { doctor } = req;
  res.status(200).json({ status: "success", data: {doctor} });
})

export const updateDoctorProfile = asyncWrapper(async (req, res) => {
  const id = req.user._id;

  const doctor = await Doctor.findById(id);
  if (!doctor) throw new ApiError(`there is no doctor with id ${id}`, 404);

  const newDoctor = { ...req.body };
  const updatedDoctor = await Doctor.findByIdAndUpdate(id, newDoctor, { new: true });

  res.status(200).json({ status: "success", data: { updatedDoctor }});
})

export const deleteDoctorProfile = asyncWrapper(async (req, res) => {
  const id = req.user._id;
  const doctor = await Doctor.findByIdAndDelete(id);
  if (!doctor) throw new ApiError(`there is no doctor with id ${id}`, 404);
  res.status(200).json({ status: "success", data: null });
})
