import User from './../models/userModel.js';
import asyncWrapper from './../middlewares/asyncWrapper.js';
import ApiError from './../utils/apiError.js';

export const getMe = asyncWrapper(async (req, res) => {
  const { user } = req;
  res.status(200).json({ status: "success", data: {user} });
})


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

export const addUser = asyncWrapper(async(req, res) => {
  const { title, description, estimated } = req.body;
  //const user = await User.create({ title, description, completed: false });
  const user = await User.create({ title, description, estimated });

  res.status(201).json({ status: 'success', data: { user }});
  //res.status(201).json({ status: 'success', data: user });
})

export const getUser = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) throw new ApiError("user not found", 404);
  res.status(200).json({ status: "success", data: { user }});
})

export const toggleComplete = asyncWrapper(async(req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);
  if (!user) throw new ApiError(`there is no user with id ${id}`, 404);

  //user = !user.completed;
  //const updatedUser = await user.save();
  const toggle = !user.completed;
  const updatedUser = await User.findByIdAndUpdate(id, { completed: toggle }, { new: true });

  res.status(200).json({ status: 'success', data: { updatedUser }});
})

export const updateUser = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const { title, description, estimated } = req.body;

  const user = await User.findById(id);
  if (!user) throw new ApiError(`there is no user with id ${id}`, 404);
  
  const newUser = { title, description, estimated };
  const updatedUser = await User.findByIdAndUpdate(id, newUser, { new: true });

  res.status(200).json({ status: "success", data: { updatedUser }});
})

export const deleteUser = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const user = await User.findByIdAndDelete(id);
  if (!user) throw new ApiError(`there is no user with id ${id}`, 404);
  res.status(200).json({ status: "success", data: null });
})
