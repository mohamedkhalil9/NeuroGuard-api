import Doctor from './../models/doctorModel.js';
import asyncWrapper from './../middlewares/asyncWrapper.js';
import ApiError from './../utils/ApiError.js';

export const getDoctorPatients = asyncWrapper(async (req, res) => {

})

export const getDoctorAppointments = asyncWrapper(async (req, res) => {

})


export const getTasks = asyncWrapper(async (req, res) => {
  // query validation ??
  const query = { ...req.query };
  const excludedFields = ['sort', 'page', 'limit', 'fields'];
  excludedFields.forEach((el) => delete query[el]);

  const page = +req.query.page || 1;
  const limit = +req.query.limit || 10;
  const skip = (page - 1) * limit;
  const count = await Task.countDocuments();
  if (skip > count) throw new ApiError('no more items', 400);

  const sort = req.query.sort?.split(',').join(' ');
  const fields = req.query.fields?.split(',').join(' ');

  const tasks = await Task.find(query).select(fields).sort(sort).skip(skip).limit(limit);
  res.status(200).json({ status: "success", results: tasks.length, data: { tasks }});
})

export const addTask = asyncWrapper(async(req, res) => {
  const { title, description, estimated } = req.body;
  //const task = await Task.create({ title, description, completed: false });
  const task = await Task.create({ title, description, estimated });

  res.status(201).json({ status: 'success', data: { task }});
  //res.status(201).json({ status: 'success', data: task });
})

export const getTask = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const task = await Task.findById(id);
  if (!task) throw new ApiError("task not found", 404);
  res.status(200).json({ status: "success", data: { task }});
})

export const toggleComplete = asyncWrapper(async(req, res) => {
  const { id } = req.params;

  const task = await Task.findById(id);
  if (!task) throw new ApiError(`there is no task with id ${id}`, 404);

  //task = !task.completed;
  //const updatedTask = await task.save();
  const toggle = !task.completed;
  const updatedTask = await Task.findByIdAndUpdate(id, { completed: toggle }, { new: true });

  res.status(200).json({ status: 'success', data: { updatedTask }});
})

export const updateTask = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const { title, description, estimated } = req.body;

  const task = await Task.findById(id);
  if (!task) throw new ApiError(`there is no task with id ${id}`, 404);
  
  const newTask = { title, description, estimated };
  const updatedTask = await Task.findByIdAndUpdate(id, newTask, { new: true });

  res.status(200).json({ status: "success", data: { updatedTask }});
})

export const deleteTask = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const task = await Task.findByIdAndDelete(id);
  if (!task) throw new ApiError(`there is no task with id ${id}`, 404);
  res.status(200).json({ status: "success", data: null });
})
