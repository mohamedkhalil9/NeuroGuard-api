import Patient from "./../models/patientModel.js";
import User from "../models/userModel.js";
import Appointment from "./../models/appointmentModel.js";
import asyncWrapper from "./../middlewares/asyncWrapper.js";
import ApiError from "./../utils/apiError.js";
import bcrypt from "bcrypt";

export const registerPatient = asyncWrapper(async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    role,
    dateOfBirth,
    gender,
    phone,
    country,
    address,
  } = req.body;

  const user = await User.findOne({ email: email });
  if (user) throw new ApiError("email aleardy existed", 409);

  // Mongoose Middleware pre save
  const hashedPassword = await bcrypt.hash(password, 10);
  const newPatient = await Patient.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role: "patient",
    dateOfBirth,
    gender,
    phone,
    country,
    address,
  });

  res.status(201).json({ status: "success", data: newPatient });
});

export const getPatients = asyncWrapper(async (req, res) => {
  const id = req.user._id;
  const query = { ...req.query };
  const excludedFields = ["sort", "page", "limit", "fields"];
  excludedFields.forEach((el) => delete query[el]);

  const page = +req.query.page || 1;
  const limit = +req.query.limit || 10;
  const skip = (page - 1) * limit;
  // const count = await patients.countDocuments();
  // if (skip > count) throw new ApiError("no more items", 400);

  const sort = req.query.sort?.split(",").join(" ");
  const fields = req.query.fields
    ? req.query.fields.split(",").join(" ")
    : "-password";

  const appointments = await Appointment.find({ doctor: id }).select("patient");

  if (appointments.lenght === 0)
    throw new ApiError("there is no patient for this doctor", 404);

  const patientIds = appointments.map((appointment) => appointment.patient);

  const findQuery = { $and: [query, { _id: { $in: patientIds } }] };
  const patients = await Patient.find(findQuery)
    .select(fields)
    .sort(sort)
    .skip(skip)
    .limit(limit);

  res
    .status(200)
    .json({ status: "success", results: patients.length, data: patients });
});

export const getPatient = asyncWrapper(async (req, res) => {
  const { id } = req.params;

  const patient = await Patient.findById(id);

  if (!patient) throw new ApiError("patient not found", 404);

  res.status(200).json({ status: "success", data: patient });
});

export const getPatientProfile = asyncWrapper(async (req, res) => {
  const id = req.user._id;

  const patient = await Patient.findById(id).select("-password");
  if (!patient) throw new ApiError(`there is no patient with id ${id}`, 404);

  res.status(200).json({ status: "success", data: { patient } });
});

export const updatePatientProfile = asyncWrapper(async (req, res) => {
  const id = req.user._id;

  const patient = await Patient.findById(id);
  if (!patient) throw new ApiError(`there is no patient with id ${id}`, 404);

  const newPatient = { ...req.body };
  const updatedPatient = await Patient.findByIdAndUpdate(id, newPatient, {
    new: true,
  });

  res.status(200).json({ status: "success", data: { updatedPatient } });
});

export const deletePatientProfile = asyncWrapper(async (req, res) => {
  const id = req.user._id;
  const patient = await Patient.findByIdAndDelete(id);
  if (!patient) throw new ApiError(`there is no patient with id ${id}`, 404);
  res.status(200).json({ status: "success", data: null });
});

export const toggleFavoriteDoctor = asyncWrapper(async (req, res) => {
  const id = req.user._id;
  const { doctorId } = req.body;

  const patient = await Patient.findById(id);
  if (!patient) throw new ApiError(`there is no patient with id ${id}`, 404);

  const existed = await Patient.find({ _id: id, favoriteDoctors: doctorId });

  const query = existed[0]
    ? { $pull: { favoriteDoctors: doctorId } }
    : { $push: { favoriteDoctors: doctorId } };

  const updatedPatient = await Patient.findByIdAndUpdate(id, query, {
    new: true,
  }).select("favoriteDoctors");

  res.status(200).json({ status: "success", data: { updatedPatient } });
});

export const getFavoriteDoctors = asyncWrapper(async (req, res) => {
  const id = req.user._id;

  const patient = await Patient.findById(id).select("favoriteDoctors");
  if (!patient) throw new ApiError(`there is no patient with id ${id}`, 404);

  if (!patient.favoriteDoctors[0])
    throw new ApiError("there is no favorite Doctors for this patient");

  res.status(200).json({ status: "success", data: { patient } });
});
