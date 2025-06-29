import User from "../models/userModel.js";
import Doctor from "./../models/doctorModel.js";
import asyncWrapper from "./../middlewares/asyncWrapper.js";
import ApiError from "./../utils/apiError.js";
import bcrypt from "bcrypt";
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
    nationalId,
    academicYear,
  } = req.body;
  const user = await User.findOne({ email: email });
  if (user) throw new ApiError("email aleardy existed", 409);

  const fee = appointmentFee ?? 100;
  const schedule = workingDays ?? [
    { day: 0, start: "14:00", end: "18:00" },
    { day: 1, start: "16:00", end: "20:00" },
    { day: 3, start: "20:00", end: "22:00" },
  ];

  const hashedPassword = await bcrypt.hash(password, 10);
  const newDoctor = await Doctor.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    profileImg: `https://eu.ui-avatars.com/api/?name=${firstName}+${lastName}`,
    role: "DOCTOR",
    dateOfBirth,
    gender,
    phone,
    country,
    address,
    appointmentFee: fee,
    workingDays: schedule,
    defaultWorkingDays,
    specialization,
    nationalId,
    academicYear,
  });

  res.status(201).json({ status: "success", data: newDoctor });
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
