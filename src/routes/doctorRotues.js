import { Router } from 'express';
import { getDoctors, getDoctor, deleteDoctor, updateDoctor, getDoctorPatients, getDoctorAppointments } from '../controllers/doctorController.js';
//import { } from './../validators/validators.js';
import { ensureAuthenticated } from './../middlewares/ensureAuthenticated.js';

const router = Router();

// Protected
// ROLES 
router.use(ensureAuthenticated)
router.route('/')
  // ROLES All
  .get(getDoctors)
  // ROLES Admin
  .post()

router.route('/:id')
  // all ROLES
  .get(getDoctor)
  //.patch()
  //.delete()

// ROLES Doctor, Admin
router.get('/:id/patients', getDoctorPatients);
router.get('/:id/appointments', getDoctorAppointments);

export default router;
