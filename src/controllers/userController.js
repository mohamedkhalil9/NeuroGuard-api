import User from './../models/userModel.js';
import asyncWrapper from './../middlewares/asyncWrapper.js';
import ApiError from './../utils/apiError.js';

export const getUsers = asyncWrapper(async (req, res) => {
  // query validation ??
  const query = { ...req.query };
  const excludedFields = ['sort', 'page', 'limit', 'fields'];
  excludedFields.forEach((el) => delete query[el]);

  const page = +req.query.page || 1;
  const limit = +req.query.limit || 10;
  const skip = (page - 1) * limit;
  const count = await User.countDocuments();
  if (skip > count) throw new ApiError('no more items', 400);

  const sort = req.query.sort?.split(',').join(' ');
  const fields = req.query.fields?.split(',').join(' ');

  const users = await User.find(query).select(fields).sort(sort).skip(skip).limit(limit);
  res.status(200).json({ status: "success", results: users.length, data: { users }});
})

export const getUser = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) throw new ApiError("user not found", 404);
  res.status(200).json({ status: "success", data: { user }});
})

export const getUserProfile = asyncWrapper(async (req, res) => {
  const id = req.user._id;

  const user = await User.findById(id).select('-password');
  if (!user) throw new ApiError(`there is no patient with id ${id}`, 404);
  
  res.status(200).json({ status: "success", data: {user} });
})

export const updateUserProfile = asyncWrapper(async (req, res) => {
  //const { id } = req.params;
  const id = req.user._id;
  const { role } = req.body;

  const user = await User.findById(id);
  if (!user) throw new ApiError(`there is no user with id ${id}`, 404);

  const updatedUser = await User.findOneAndUpdate({_id: id}, {$set: {role: role}}, {new: true})
  
  // const newUser = { role, __t: "Patient" };
  // const updatedUser = await User.findByIdAndUpdate(id, newUser, { new: true });

  res.status(200).json({ status: "success", data: { updatedUser }});
})

export const deleteUserProfile = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const user = await User.findByIdAndDelete(id);
  if (!user) throw new ApiError(`there is no user with id ${id}`, 404);
  res.status(200).json({ status: "success", data: null });
})
