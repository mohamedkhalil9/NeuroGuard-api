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

// NOTE: add patient filters (aggregation)
export const getPatients = asyncWrapper(async (req, res) => {
  const { user } = req;
  const doctorId = user._id;
  console.log(user, doctorId);

  // const pipeline = [{ $match: { doctor: user._id } }, { $lookup: {
  //   from: 'users', // Patient collection name
  //   localField: 'patient',
  //   foreignField: '_id',
  //   as: 'patient'
  // }
  // const patients = await Appointment.aggregate([
  //     // Stage 1: Lookup to join the Appointment and Patient collections
  //     {
  //       $lookup: {
  //         from: 'patients', // The name of the Patient collection (ensure the name matches in your DB)
  //         localField: 'patientId', // Field from Appointment collection
  //         foreignField: '_id', // Field from Patient collection
  //         as: 'patientDetails' // Alias for the joined data
  //       }
  //     },
  //     // Stage 2: Filter to only include the doctor's appointments
  //     {
  //       $match: {
  //         doctorId: new mongoose.Types.ObjectId(doctorId), // Match appointments with the given doctor
  //       }
  //     },
  //     // Stage 3: Unwind the patientDetails array (flatten it)
  //     {
  //       $unwind: '$patientDetails'
  //     },
  //     // Stage 4: Filter by age and gender of the patient
  //     {
  //       $match: {
  //         'patientDetails.age': { $gte: age },
  //         'patientDetails.gender': gender
  //       }
  //     },
  //     // Stage 5: Project to include only the patient details in the result
  //     {
  //       $project: {
  //         _id: 0, // Exclude the _id from the final result (optional)
  //         patientId: '$patientDetails._id',
  //         name: '$patientDetails.name',
  //         age: '$patientDetails.age',
  //         gender: '$patientDetails.gender',
  //         // Include any other fields from the Patient document you need
  //       }
  //     }
  //   ]);
  // model.find({
  //   '_id': { $in: [
  //     mongoose.Types.ObjectId('4ed3ede8844f0f351100000c'),
  //     mongoose.Types.ObjectId('4ed3f117a844e0471100000d'),
  //     mongoose.Types.ObjectId('4ed3f18132f50c491100000e')
  //   ]}
  // })
  const id = req.user._id;

  const appointments = await Appointment.find({ doctor: id }).select("patient");
  // .populate("patient", "firstName lastName"); // Populate patient details

  if (!appointments[0])
    throw new ApiError("there is no patient for this doctor", 404);

  res.status(200).json({ status: "success", data: appointments });
});

// NOTE: using patientId instead of appointmentId?
export const getPatient = asyncWrapper(async (req, res) => {
  // const { id } = req.user._id;
  // const { appointmentId } = req.params;
  //
  // const appointment = await Appointment.findOne({_id: appointmentId, doctor: id}).select('patient')
  //   .populate('patient', 'firstName lastName'); // Populate doctor details
  //
  // if (!appointment) throw new ApiError('appointment not found', 404)
  //
  // res.status(200).json({ status: 'success', data: appointment});
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
