import { Router } from 'express';
import { getDoctors, getDoctor, getDoctorPatients, getDoctorAppointments, getDoctorPatient, getDoctorAppointment, registerDoctor, getDoctorProfile, updateDoctorProfile, deleteDoctorProfile } from '../controllers/doctorController.js';
import { registerValidator, idValidator } from './../validators/validators.js';
import { authenticate } from '../controllers/authController.js'

const router = Router();

/**
 * @openapi
 * '/api/v1/doctors':
 *  post:
 *     tags:
 *     - Doctors 
 *     summary: Register Doctors 
 */
router.post('/', registerValidator, registerDoctor)

router.use(authenticate)
/**
* @openapi
* '/api/v1/doctors/':
*  get:
*     tags:
*     - Doctors
*     summary: Get All Doctors
*/
router.get('/', getDoctors)
/**
* @openapi
* '/api/v1/doctors/:id':
*  get:
*     tags:
*     - Doctors
*     summary: Get single Doctors
*/
router.get('/:id', idValidator, getDoctor)

router.route('/profile')
/**
 * @openapi
 * '/api/v1/doctors/profile':
 *  get:
 *     tags:
 *     - Doctors
 *     summary: Get Doctor Profile
 */
  .get(getDoctorProfile)
/**
 * @openapi
 * '/api/v1/doctors/profile':
 *  patch:
 *     tags:
 *     - Doctors 
 *     summary: Update Doctor Profile
 */
  .patch(updateDoctorProfile)
/**
* @openapi
* '/api/v1/doctors/profile':
*  delete:
*     tags:
*     - Doctors 
*     summary: Delete Doctor Profile
*/
  .delete(deleteDoctorProfile)

/**
 * @openapi
 * '/api/v1/doctors/appointments/':
 *  get:
 *     tags:
 *     - Doctors 
 *     summary: Get Doctor's Appointments
 */
router.get('/appointments', getDoctorAppointments);
/**
 * @openapi
 * '/api/v1/doctors/appointments/:appointmentId':
 *  get:
 *     tags:
 *     - Doctors 
 *     summary: Get Doctor's single Appointment
 */
router.get('/appointments/:appointmentId', getDoctorAppointment);
/**
 * @openapi
 * '/api/v1/doctors/patients/':
 *  get:
 *     tags:
 *     - Doctors 
 *     summary: Get Doctor's Patients 
 */
router.get('/patients', getDoctorPatients);
/**
 * @openapi
 * '/api/v1/doctors/patients/:patientId':
 *  get:
 *     tags:
 *     - Doctors 
 *     summary: Get Doctor's single Patient 
 */
router.get('/patients/:patientId', getDoctorPatient);

export default router;
