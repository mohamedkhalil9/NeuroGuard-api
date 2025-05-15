import User from "../models/userModel.js";
import Doctor from "./../models/doctorModel.js";
import asyncWrapper from "./../middlewares/asyncWrapper.js";
import ApiError from "./../utils/apiError.js";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import {
  getAvailableSchedule,
  toEgyptTime,
} from "../utils/scheduleGenerator.js";

export const registerDoctor = asyncWrapper(async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    dateOfBirth,
    gender,
    appointmentFee,
    phone,
    specialization,
    country,
    address,
    workingDays,
    defaultWorkingDays,
  } = req.body;
  const user = await User.findOne({ email: email });
  if (user) throw new ApiError("email aleardy existed", 409);

  const hashedPassword = await bcrypt.hash(password, 10);
  const newDoctor = await Doctor.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role: "DOCTOR",
    dateOfBirth,
    gender,
    phone,
    country,
    address,
    appointmentFee,
    workingDays,
    defaultWorkingDays,
    specialization,
  });

  res.status(201).json({ status: "success", data: newDoctor });
});

export const uploadProfileImg = asyncWrapper(async (req, res) => {
  const id = req.user._id;
  const img = req.file;

  const doctor = await Doctor.findById(id);
  const upload = await cloudinary.uploader.upload(img.path);
  const url = upload.secure_url;

  doctor.profileImg = url;
  await doctor.save();

  res.status(200).json({ status: "success", data: { doctor } });
});

export const getDoctors = asyncWrapper(async (req, res) => {
  // query validation ??
  const query = { ...req.query };
  const excludedFields = ["sort", "page", "limit", "fields"];
  excludedFields.forEach((el) => delete query[el]);

  const page = +req.query.page || 1;
  const limit = +req.query.limit || 10;
  const skip = (page - 1) * limit;

  // NOTE: we should count the results not the document itself
  // const count = await Doctor.countDocuments();
  // if (skip > count) throw new ApiError("no more items", 400);

  const sort = req.query.sort?.split(",").join(" ");
  const fields = req.query.fields
    ? req.query.fields.split(",").join(" ")
    : "-password";

  const doctors = await Doctor.find(query)
    .select(fields)
    .sort(sort)
    .skip(skip)
    .limit(limit);

  res
    .status(200)
    .json({ status: "success", results: doctors.length, data: { doctors } });
});

export const searchDoctors = asyncWrapper(async (req, res) => {
  const { searchQuery } = req.params;
  const query = { ...req.query };
  const excludedFields = ["sort", "page", "limit", "fields"];
  excludedFields.forEach((el) => delete query[el]);

  const page = +req.query.page || 1;
  const limit = +req.query.limit || 10;
  const skip = (page - 1) * limit;
  // const count = await Doctor.countDocuments();
  // if (skip > count) throw new ApiError("no more items", 400);

  const sort = req.query.sort?.split(",").join(" ");
  const fields = req.query.fields
    ? req.query.fields.split(",").join(" ")
    : "-password";

  const findQuery = {
    $and: [query, { $text: { $search: searchQuery } }],
  };
  const doctors = await Doctor.find(findQuery)
    .select(fields)
    .sort(sort)
    .skip(skip)
    .limit(limit);

  res
    .status(200)
    .json({ status: "success", results: doctors.length, data: { doctors } });
});

export const getDoctor = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const doctor = await Doctor.findById(id).select("-password -workingHours");
  if (!doctor) throw new ApiError("doctor not found", 404);

  const availableSchedule = await getAvailableSchedule(doctor._id, new Date());

  const egyptTime = availableSchedule.map((hour) => ({
    start: toEgyptTime(hour.start),
    end: toEgyptTime(hour.end),
  }));

  res.status(200).json({
    status: "success",
    data: {
      doctor,
      availabeHours: egyptTime,
    },
  });
});

export const getDoctorSchedule = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const { date } = req.params;

  const doctor = await Doctor.findById(id).select("-password -workingHours");
  if (!doctor) throw new ApiError("doctor not found", 404);

  const availableSchedule = await getAvailableSchedule(doctor._id, date);

  const egyptTime = availableSchedule.map((hour) => ({
    start: toEgyptTime(hour.start),
    end: toEgyptTime(hour.end),
  }));

  res.status(200).json({
    status: "success",
    data: {
      availabeHours: egyptTime,
      doctor,
    },
  });
});

export const getDoctorProfile = asyncWrapper(async (req, res) => {
  const id = req.user._id;

  const doctor = await Doctor.findById(id).select("-password");
  if (!doctor) throw new ApiError(`there is no doctor with id ${id}`, 404);

  res.status(200).json({ status: "success", data: { doctor } });
});

export const updateDoctorProfile = asyncWrapper(async (req, res) => {
  const id = req.user._id;

  const doctor = await Doctor.findById(id);
  if (!doctor) throw new ApiError(`there is no doctor with id ${id}`, 404);

  const newDoctor = { ...req.body };
  const updatedDoctor = await Doctor.findByIdAndUpdate(id, newDoctor, {
    new: true,
  });

  res.status(200).json({ status: "success", data: { updatedDoctor } });
});

export const deleteDoctorProfile = asyncWrapper(async (req, res) => {
  const id = req.user._id;
  const doctor = await Doctor.findByIdAndDelete(id);
  if (!doctor) throw new ApiError(`there is no doctor with id ${id}`, 404);
  res.status(200).json({ status: "success", data: null });
});
