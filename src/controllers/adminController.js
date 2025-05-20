import User from "./../models/userModel.js";
import Patient from "./../models/patientModel.js";
import Appointment from "./../models/appointmentModel.js";
import asyncWrapper from "./../middlewares/asyncWrapper.js";
import ApiError from "./../utils/apiError.js";
import bcrypt from "bcrypt";

export const registerAdmin = asyncWrapper(async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    dateOfBirth,
    gender,
    phone,
    country,
    address,
  } = req.body;
  const user = await User.findOne({ email: email });
  if (user) throw new ApiError("email aleardy existed", 409);

  const hashedPassword = await bcrypt.hash(password, 10);
  const admin = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    profileImg: `https://eu.ui-avatars.com/api/?name=${firstName}+${lastName}`,
    role: "ADMIN",
    dateOfBirth,
    gender,
    phone,
    country,
    address,
  });

  res.status(201).json({ status: "success", data: admin });
});

export const getAllAppointments = asyncWrapper(async (req, res) => {
  // query validation ??
  const query = { ...req.query };
  const excludedFields = ["sort", "page", "limit", "fields"];
  excludedFields.forEach((el) => delete query[el]);

  const page = +req.query.page || 1;
  const limit = +req.query.limit || 10;
  const skip = (page - 1) * limit;
  const count = await Appointment.countDocuments();
  if (skip > count) throw new ApiError("no more items", 400);

  const sort = req.query.sort?.split(",").join(" ");
  const fields = req.query.fields?.split(",").join(" ");

  const appointments = await Appointment.find(query)
    .select(fields)
    .sort(sort)
    .skip(skip)
    .limit(limit);
  res.status(200).json({
    status: "success",
    results: appointments.length,
    data: appointments,
  });
});

export const getAllPatients = asyncWrapper(async (req, res) => {
  // query validation ??
  const query = { ...req.query };
  const excludedFields = ["sort", "page", "limit", "fields"];
  excludedFields.forEach((el) => delete query[el]);

  const page = +req.query.page || 1;
  const limit = +req.query.limit || 10;
  const skip = (page - 1) * limit;
  const count = await Patient.countDocuments();
  if (skip > count) throw new ApiError("no more items", 400);

  const sort = req.query.sort?.split(",").join(" ");
  const fields = req.query.fields?.split(",").join(" ");

  const patients = await Patient.find(query)
    .select(fields)
    .sort(sort)
    .skip(skip)
    .limit(limit);
  res
    .status(200)
    .json({ status: "success", results: patients.length, data: patients });
});

export const getAllUsers = asyncWrapper(async (req, res) => {
  // query validation ??
  const query = { ...req.query };
  const excludedFields = ["sort", "page", "limit", "fields"];
  excludedFields.forEach((el) => delete query[el]);

  const page = +req.query.page || 1;
  const limit = +req.query.limit || 10;
  const skip = (page - 1) * limit;
  const count = await User.countDocuments();
  if (skip > count) throw new ApiError("no more items", 400);

  const sort = req.query.sort?.split(",").join(" ");
  const fields = req.query.fields?.split(",").join(" ");

  const users = await User.find(query)
    .select(fields)
    .sort(sort)
    .skip(skip)
    .limit(limit);
  res
    .status(200)
    .json({ status: "success", results: users.length, data: { users } });
});
