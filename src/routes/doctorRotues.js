import { Router } from 'express';
import { getDoctors, getDoctor, getDoctorPatients, getDoctorAppointments, getDoctorPatient, getDoctorAppointment, registerDoctor, getDoctorProfile, updateDoctorProfile, deleteDoctorProfile } from '../controllers/doctorController.js';
import { registerValidator, idValidator } from './../validators/validators.js';
import { authenticate } from '../controllers/authController.js'

const router = Router();

/**
 * @swagger
 * /api/v1/doctors/register:
 *   post:
 *     tags: [Doctors]
 *     summary: Register Doctors 
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Doctor'
 *     responses:
 *       201:
 *         description: Doctor Created Successfully 
 *       409:
 *         description: User Already Exists 
 *       500:
 *         description: Server Error
 */
router.post('/register', registerValidator, registerDoctor)


router.use(authenticate)

/**
* @openapi
* '/api/v1/doctors/':
*  get:
*     tags: [Doctors]
*     summary: Get All Doctors
*/
router.get('/', getDoctors)
/**
* @openapi
* '/api/v1/doctors/{id}':
*  get:
*     tags: [Doctors]
*     summary: Get single Doctors
*/
router.get('/:id', idValidator, getDoctor)

router.route('/profile')

/**
 * @swagger
 * /api/v1/doctors/profile:
 *   get:
 *     tags: [Doctors]
 *     summary: Get Doctor Profile
 *     responses:
 *       200:
 *         description: Success 
 *       403:
 *         description: Access Denied please Login 
 */
  .get(getDoctorProfile)
 /**
 * @swagger
 * /api/v1/doctors/profile:
 *   patch:
 *     tags: [Doctors]
 *     summary: Update Doctor Profile
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Doctor'
 *     responses:
 *       200:
 *         description: Successfully Updated Doctor Profile 
 *       500:
 *         description: Server Error 
 */

  .patch(updateDoctorProfile)

/**
 * @swagger
 * /api/v1/doctors/profile:
 *   delete:
 *     tags: [Doctors]
 *     summary: Delete Doctor Profile
 *     responses:
 *       200:
 *         description: Successfully Deleted Doctor Profile 
 *       500:
 *         description: Server Error 
 */
  .delete(deleteDoctorProfile)


/**
 * @swagger
 * /api/v1/doctors/appointments:
 *   get:
 *     tags: [Doctors]
 *     summary: Get Doctor Appointments
 *     responses:
 *       200:
 *         description: Success 
 *       500:
 *         description: Server Error
 */
router.get('/appointments', getDoctorAppointments);

/**
 * @swagger
 * /api/v1/doctors/appointments/{appointmentId}:
 *   get:
 *     tags: [Doctors]
 *     summary: Get Doctor single Appointment
 *     parameters:
 *       - name: appointmentId
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: Success 
 *       500:
 *         description: Server Error
 */

router.get('/appointments/:appointmentId', getDoctorAppointment);

/**
 * @swagger
 * /api/v1/doctors/patients:
 *   get:
 *     tags: [Doctors]
 *     summary: Get Doctor patients 
 *     responses:
 *       200:
 *         description: Success 
 *       500:
 *         description: Server Error
 */

router.get('/patients', getDoctorPatients);

/**
 * @swagger
 * /api/v1/doctors/patients/{patientId}:
 *   get:
 *     tags: [Doctors]
 *     summary: Get Doctor single Patient
 *     parameters:
 *       - name: patientId 
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: Success 
 *       500:
 *         description: Server Error
 */
router.get('/patients/:patientId', getDoctorPatient);

/**
 * @swagger
 * components:
 *   schemas:
 *     Doctor:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email 
 *         - password
 *         - dateOfBirth
 *         - gender
 *         - phone
 *         - country
 *         - address
 *       properties:
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         dateOfBirth: 
 *           type: string
 *           format: date 
 *         gender:
 *           type: string
 *         phone:
 *           type: string
 *         country:
 *           type: string
 *       example:
 *         firstName: Ahmed
 *         lastName: Mahmoud
 *         email: ahmedmahmoud4@email.com 
 *         password: '1234'
 *         dateOfBirth: 2000-10-10 
 *         gender: Male
 *         phone: 010001000
 *         country: egypt
 */

/**
 * @swagger
 * tags:
 *   name: Doctors 
 */

export default router;
