import { Router } from 'express';
import { getDoctors, getDoctor, deleteDoctor, updateDoctor, getDoctorPatients, getDoctorAppointments, getDoctorPatient, getDoctorAppointment, addDoctor } from '../controllers/doctorController.js';
import { idValidator } from './../validators/validators.js';
import ensureAuthenticated from './../middlewares/ensureAuthenticated.js';

const router = Router();

// Protected
// ROLES 
router.use(ensureAuthenticated)
router.route('/')
  // ROLES All
  .get(getDoctors)
  // ROLES Admin
  .post(addDoctor)

router.use(idValidator)
router.route('/:id')
  // all ROLES
  .get(getDoctor)
  //.patch()
  //.delete()

// get doctor's appointments 
// ROLES Doctor, Admin
// Validation: id is a doctor id
router.get('/:id/patients', getDoctorPatients);
router.get('/:id/patients/:patientId', getDoctorPatient);
router.get('/:id/appointments', getDoctorAppointments);
router.get('/:id/appointments/:appointmentId', getDoctorAppointment);

export default router;
