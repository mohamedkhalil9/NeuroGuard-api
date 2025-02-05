import Doctor from './../models/doctorModel.js';
import asyncWrapper from './../middlewares/asyncWrapper.js';
import ApiError from './../utils/apiError.js';

export const getDoctorPatients = asyncWrapper(async (req, res) => {

})

export const getDoctorAppointments = asyncWrapper(async (req, res) => {

})

export const getDoctorPatient = asyncWrapper(async (req, res) => {

})

export const getDoctorAppointment = asyncWrapper(async (req, res) => {

})


export const getDoctors = asyncWrapper(async (req, res) => {
  // query validation ??
  const query = { ...req.query };
  const excludedFields = ['sort', 'page', 'limit', 'fields'];
  excludedFields.forEach((el) => delete query[el]);

  const page = +req.query.page || 1;
  const limit = +req.query.limit || 10;
  const skip = (page - 1) * limit;
  const count = await Doctor.countDocuments();
  if (skip > count) throw new ApiError('no more items', 400);

  const sort = req.query.sort?.split(',').join(' ');
  const fields = req.query.fields?.split(',').join(' ');

  const doctors = await Doctor.find(query).select(fields).sort(sort).skip(skip).limit(limit);
  res.status(200).json({ status: "success", results: doctors.length, data: { doctors }});
})

export const addDoctor = asyncWrapper(async(req, res) => {
  const { title, description, estimated } = req.body;
  //const doctor = await Doctor.create({ title, description, completed: false });
  const doctor = await Doctor.create({ title, description, estimated });

  res.status(201).json({ status: 'success', data: { doctor }});
  //res.status(201).json({ status: 'success', data: doctor });
})

export const getDoctor = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const doctor = await Doctor.findById(id);
  if (!doctor) throw new ApiError("doctor not found", 404);
  res.status(200).json({ status: "success", data: { doctor }});
})

export const toggleComplete = asyncWrapper(async(req, res) => {
  const { id } = req.params;

  const doctor = await Doctor.findById(id);
  if (!doctor) throw new ApiError(`there is no doctor with id ${id}`, 404);

  //doctor = !doctor.completed;
  //const updatedDoctor = await doctor.save();
  const toggle = !doctor.completed;
  const updatedDoctor = await Doctor.findByIdAndUpdate(id, { completed: toggle }, { new: true });

  res.status(200).json({ status: 'success', data: { updatedDoctor }});
})

export const updateDoctor = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const { title, description, estimated } = req.body;

  const doctor = await Doctor.findById(id);
  if (!doctor) throw new ApiError(`there is no doctor with id ${id}`, 404);
  
  const newDoctor = { title, description, estimated };
  const updatedDoctor = await Doctor.findByIdAndUpdate(id, newDoctor, { new: true });

  res.status(200).json({ status: "success", data: { updatedDoctor }});
})

export const deleteDoctor = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const doctor = await Doctor.findByIdAndDelete(id);
  if (!doctor) throw new ApiError(`there is no doctor with id ${id}`, 404);
  res.status(200).json({ status: "success", data: null });
})
