import User from "./../models/userModel.js";
import Patient from "./../models/patientModel.js";
import Doctor from "./../models/doctorModel.js";
import asyncWrapper from "./../middlewares/asyncWrapper.js";
import ApiError from "./../utils/apiError.js";
import { v2 as cloudinary } from "cloudinary";

export const getUserProfile = asyncWrapper(async (req, res) => {
  const id = req.user._id;
  const role = req.user.role;

  let Model;
  if (role === "PATIENT") Model = Patient;
  else if (role === "DOCTOR") Model = Doctor;
  else if (role === "ADMIN") Model = User;

  const user = await Model.findById(id).select("-password");
  if (!user)
    throw new ApiError(`there is no ${role.toLowerCase} with this id `, 404);

  res.status(200).json({ status: "success", data: user });
});

export const updateUserProfile = asyncWrapper(async (req, res) => {
  const id = req.user._id;
  const role = req.user.role;

  let Model;
  if (role === "PATIENT") Model = Patient;
  else if (role === "DOCTOR") Model = Doctor;
  else if (role === "ADMIN") Model = User;

  const user = await Model.findById(id);
  if (!user)
    throw new ApiError(`there is no ${role.toLowerCase} with this id `, 404);

  const newUser = { ...req.body };
  const updatedUser = await Model.findByIdAndUpdate(id, newUser, {
    new: true,
  }).select("-password");

  res.status(200).json({ status: "success", data: updatedUser });
});

export const deleteUserProfile = asyncWrapper(async (req, res) => {
  const id = req.user._id;
  const role = req.user.role;

  let Model;
  if (role === "PATIENT") Model = Patient;
  else if (role === "DOCTOR") Model = Doctor;
  else if (role === "ADMIN") Model = User;

  const user = await Model.findByIdAndDelete(id);
  if (!user)
    throw new ApiError(`there is no ${role.toLowerCase()} with id ${id}`, 404);
  res.status(204).json({
    status: "success",
    message: `${role.toLowerCase()} deleted successfully`,
    data: null,
  });
});

export const uploadProfileImg = asyncWrapper(async (req, res) => {
  const id = req.user._id;
  const role = req.user.role;
  const img = req.file;

  let Model;
  if (role === "PATIENT") Model = Patient;
  else if (role === "DOCTOR") Model = Doctor;
  else if (role === "ADMIN") Model = User;

  // const upload = await cloudinary.uploader.upload(img.path);
  const upload = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ resource_type: "image" }, (error, result) =>
        error ? reject(error) : resolve(result),
      )
      .end(img.buffer);
  });
  const url = upload.secure_url;

  const user = await Model.findByIdAndUpdate(
    id,
    { profileImg: url },
    { new: true },
  ).select("-password");

  res.status(200).json({ status: "success", data: user });
});
