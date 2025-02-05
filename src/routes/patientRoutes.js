import { Router } from 'express';
import { getPatients, getPatient, deletePatient, updatePatient, getPatientAppointments, getPatientAppointment } from '../controllers/patientController.js'
import { idValidator } from './../validators/validators.js';
import ensureAuthenticated from './../middlewares/ensureAuthenticated.js';

const router = Router();

// Protected 
// ROLES Admin and Doctor?
router.use(ensureAuthenticated)

router.route('/')
  .get(getPatients)
  //.post()

router.use(idValidator)
router.route('/:id')
  .get(getPatient)
  //.patch()
  //.delete()

// get patient's appointments 
// ROLES Patient and Admin
// Validation: id is a patient id
router.get('/:id/appointments', getPatientAppointments)
router.get('/:id/appointments/:appointmentId', getPatientAppointment)

export default router;
