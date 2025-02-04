import { Router } from 'express';
import { getPatients, getPatient, deletePatient, updatePatient, getPatientAppointments } from '../controllers/patientController.js'
//import { } from './../validators/validators.js';
import { ensureAuthenticated } from './../middlewares/ensureAuthenticated.js';

const router = Router();

// Protected 
// ROLES Admin and Doctor?
router.use(ensureAuthenticated)

router.route('/')
  .get(getPatients)
  //.post()

router.route('/:id')
  .get(getPatient)
  //.patch()
  //.delete()

// get patient's appointments 
// ROLES Patient and Admin
router.get('/:id/appointments', getPatientAppointments)

export default router;
