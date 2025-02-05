import Patient from './../models/patientModel.js';
import asyncWrapper from './../middlewares/asyncWrapper.js';
import ApiError from './../utils/apiError.js';

export const getPatientAppointments = asyncWrapper(async (req, res) => {

})


export const getPatients = asyncWrapper(async (req, res) => {
  // query validation ??
  const query = { ...req.query };
  const excludedFields = ['sort', 'page', 'limit', 'fields'];
  excludedFields.forEach((el) => delete query[el]);

  const page = +req.query.page || 1;
  const limit = +req.query.limit || 10;
  const skip = (page - 1) * limit;
  const count = await Patient.countDocuments();
  if (skip > count) throw new ApiError('no more items', 400);

  const sort = req.query.sort?.split(',').join(' ');
  const fields = req.query.fields?.split(',').join(' ');

  const patients = await Patient.find(query).select(fields).sort(sort).skip(skip).limit(limit);
  res.status(200).json({ status: "success", results: patients.length, data: { patients }});
})

export const addPatient = asyncWrapper(async(req, res) => {
  const { title, description, estimated } = req.body;
  //const patient = await Patient.create({ title, description, completed: false });
  const patient = await Patient.create({ title, description, estimated });

  res.status(201).json({ status: 'success', data: { patient }});
  //res.status(201).json({ status: 'success', data: patient });
})

export const getPatient = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const patient = await Patient.findById(id);
  if (!patient) throw new ApiError("patient not found", 404);
  res.status(200).json({ status: "success", data: { patient }});
})

export const toggleComplete = asyncWrapper(async(req, res) => {
  const { id } = req.params;

  const patient = await Patient.findById(id);
  if (!patient) throw new ApiError(`there is no patient with id ${id}`, 404);

  //patient = !patient.completed;
  //const updatedPatient = await patient.save();
  const toggle = !patient.completed;
  const updatedPatient = await Patient.findByIdAndUpdate(id, { completed: toggle }, { new: true });

  res.status(200).json({ status: 'success', data: { updatedPatient }});
})

export const updatePatient = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const { title, description, estimated } = req.body;

  const patient = await Patient.findById(id);
  if (!patient) throw new ApiError(`there is no patient with id ${id}`, 404);
  
  const newPatient = { title, description, estimated };
  const updatedPatient = await Patient.findByIdAndUpdate(id, newPatient, { new: true });

  res.status(200).json({ status: "success", data: { updatedPatient }});
})

export const deletePatient = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const patient = await Patient.findByIdAndDelete(id);
  if (!patient) throw new ApiError(`there is no patient with id ${id}`, 404);
  res.status(200).json({ status: "success", data: null });
})
