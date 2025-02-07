import { Router } from 'express';
import { getPatientAppointments, getPatientAppointment, registerPatient, getPatientProfile, updatePatientProfile, deletePatientProfile } from '../controllers/patientController.js'
import { authenticate } from '../controllers/authController.js';
import { registerValidator } from '../validators/validators.js'

const router = Router();
 
/**
 * @openapi
 * '/api/v1/patients':
 *  post:
 *     tags:
 *     - Patients 
 *     summary: Register Patients 
 */
router.post('/',registerValidator, registerPatient)

router.use(authenticate)
router.route('/profile')
/**
 * @openapi
 * '/api/v1/patients/profile':
 *  get:
 *     tags:
 *     - Patients 
 *     summary: Get Patient Profile
 */
  .get(getPatientProfile)
/**
 * @openapi
 * '/api/v1/patients/profile':
 *  patch:
 *     tags:
 *     - Patients 
 *     summary: Update Patient Profile
 */
  .patch(updatePatientProfile)
/**
* @openapi
* '/api/v1/patients/profile':
*  delete:
*     tags:
*     - Patients 
*     summary: Delete Patient Profile
*/
  .delete(deletePatientProfile)

/**
 * @openapi
 * '/api/v1/patients/appointments':
 *  post:
 *     tags:
 *     - Patients 
 *     summary: Create Appointment
 */
router.post('/appointments', getPatientAppointments)
/**
 * @openapi
 * '/api/v1/patients/appointments':
 *  get:
 *     tags:
 *     - Patients 
 *     summary: Get Patient's Appointments
 */
router.get('/appointments', getPatientAppointments)
/**
 * @openapi
 * '/api/v1/patients/appointments/:appointmentId':
 *  get:
 *     tags:
 *     - Patients 
 *     summary: Get Patient's single Appointment
 */
router.get('/appointments/:appointmentId', getPatientAppointment)
/**
 * @openapi
 * '/api/v1/patients/appointments/:appointmentId':
 *  post:
 *     tags:
 *     - Patients 
 *     summary: Appointment Payment 
 */
router.post('/appointments/:appointmentId/pay')

export default router;
