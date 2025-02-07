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

export const getAppointment = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const appointment = await Appointment.findById(id);
  if (!appointment) throw new ApiError("appointment not found", 404);
  res.status(200).json({ status: "success", data: { appointment }});
})
