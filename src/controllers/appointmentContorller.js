import Appointment from './../models/appointmentModel.js';
import asyncWrapper from './../middlewares/asyncWrapper.js';
import ApiError from './../utils/apiError.js';


export const getAppointments = asyncWrapper(async (req, res) => {
  // query validation ??
  const query = { ...req.query };
  const excludedFields = ['sort', 'page', 'limit', 'fields'];
  excludedFields.forEach((el) => delete query[el]);

  const page = +req.query.page || 1;
  const limit = +req.query.limit || 10;
  const skip = (page - 1) * limit;
  const count = await Appointment.countDocuments();
  if (skip > count) throw new ApiError('no more items', 400);

  const sort = req.query.sort?.split(',').join(' ');
  const fields = req.query.fields?.split(',').join(' ');

  const appointments = await Appointment.find(query).select(fields).sort(sort).skip(skip).limit(limit);
  res.status(200).json({ status: "success", results: appointments.length, data: { appointments }});
})

export const addAppointment = asyncWrapper(async(req, res) => {
  const { title, description, estimated } = req.body;
  //const appointment = await Appointment.create({ title, description, completed: false });
  const appointment = await Appointment.create({ title, description, estimated });

  res.status(201).json({ status: 'success', data: { appointment }});
  //res.status(201).json({ status: 'success', data: appointment });
})

export const getAppointment = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const appointment = await Appointment.findById(id);
  if (!appointment) throw new ApiError("appointment not found", 404);
  res.status(200).json({ status: "success", data: { appointment }});
})

//export const toggleComplete = asyncWrapper(async(req, res) => {
//  const { id } = req.params;
//
//  const appointment = await Appointment.findById(id);
//  if (!appointment) throw new ApiError(`there is no appointment with id ${id}`, 404);
//
//  //appointment = !appointment.completed;
//  //const updatedAppointment = await appointment.save();
//  const toggle = !appointment.completed;
//  const updatedAppointment = await Appointment.findByIdAndUpdate(id, { completed: toggle }, { new: true });
//
//  res.status(200).json({ status: 'success', data: { updatedAppointment }});
//})

export const updateAppointment = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const { title, description, estimated } = req.body;

  const appointment = await Appointment.findById(id);
  if (!appointment) throw new ApiError(`there is no appointment with id ${id}`, 404);
  
  const newAppointment = { title, description, estimated };
  const updatedAppointment = await Appointment.findByIdAndUpdate(id, newAppointment, { new: true });

  res.status(200).json({ status: "success", data: { updatedAppointment }});
})

export const deleteAppointment = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const appointment = await Appointment.findByIdAndDelete(id);
  if (!appointment) throw new ApiError(`there is no appointment with id ${id}`, 404);
  res.status(200).json({ status: "success", data: null });
})
