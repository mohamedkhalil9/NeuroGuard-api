import Patient from "./../models/patientModel.js";
import asyncWrapper from "./../middlewares/asyncWrapper.js";
import ApiError from "./../utils/apiError.js";

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

  if (patient.favoriteDoctors.length === 0)
    throw new ApiError("there is no favorite Doctors for this patient");

  res.status(200).json({ status: "success", data: { patient } });
});
