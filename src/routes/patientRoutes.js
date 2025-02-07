import { Router } from 'express';
import { getPatientAppointments, getPatientAppointment, registerPatient, getPatientProfile, updatePatientProfile, deletePatientProfile } from '../controllers/patientController.js'
import { authenticate } from '../controllers/authController.js';
import { registerValidator } from '../validators/validators.js'

const router = Router();
 
/**
 * @swagger
 * /api/v1/patients/register:
 *   post:
 *     tags: [Patients]
 *     summary: Register Patients 
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Patient'
 *     responses:
 *       201:
 *         description: Patient Created Successfully 
 *       409:
 *         description: User Already Exists 
 *       500:
 *         description: Server Error
 */
router.post('/register',registerValidator, registerPatient)

router.use(authenticate)
router.route('/profile')
/**
 * @swagger
 * /api/v1/patients/profile:
 *   get:
 *     tags: [Patients]
 *     summary: Get Patient Profile
 *     responses:
 *       200:
 *         description: Successfully Get User Profile 
 *       403:
 *         description: Access Denied please Login 
 */
  .get(getPatientProfile)
/**
 * @swagger
 * /api/v1/patients/profile:
 *   patch:
 *     tags: [Patients]
 *     summary: Update Patient Profile
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Patient'
 *     responses:
 *       200:
 *         description: Successfully Updated User Profile 
 *       500:
 *         description: Server Error 
 */
  .patch(updatePatientProfile)
/**
 * @swagger
 * /api/v1/patients/profile:
 *   delete:
 *     tags: [Patients]
 *     summary: Delete Patient Profile
 *     responses:
 *       200:
 *         description: Successfully Deleted User Profile 
 *       500:
 *         description: Server Error 
 */
  .delete(deletePatientProfile)

/**
 * @swagger
 * /api/v1/patients/appointments:
 *   post:
 *     tags: [Patients]
 *     summary: Book New Appointment 
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Appointment'
 *     responses:
 *       201:
 *         description: Appointment Created Successfully 
 *       500:
 *         description: Server Error
 */

router.post('/appointments', getPatientAppointments)

/**
 * @swagger
 * /api/v1/patients/appointments:
 *   get:
 *     tags: [Patients]
 *     summary: Get Patient Appointments
 *     responses:
 *       200:
 *         description: Success 
 *       500:
 *         description: Server Error
 */

router.get('/appointments', getPatientAppointments)

/**
 * @swagger
 * /api/v1/patients/appointments/{appointmentId}:
 *   get:
 *     tags: [Patients]
 *     summary: Get Patient single Appointment
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
router.get('/appointments/:appointmentId', getPatientAppointment)
/**
 * @openapi
 * '/api/v1/patients/appointments/{appointmentId}':
 *  post:
 *     tags:
 *     - Patients 
 *     summary: Appointment Payment 
 */
router.post('/appointments/:appointmentId/pay')

/**
 * @swagger
 * components:
 *   schemas:
 *     Patient:
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
 * components:
 *   schemas:
 *     Appointment:
 *       type: object
 *       required:
 *         - date 
 *         - time 
 *         - patient 
 *         - doctor 
 *       properties:
 *         date:
 *           type: string
 *           format: date
 *         time:
 *           type: string
 *         patientId:
 *           type: string
 *         doctorId:
 *           type: string
 *         notes:
 *           type: string
 *       example:
 *         date:
 *         time:
 *         patientId:
 *         doctorId:
 *         notes:
 */


/**
 * @swagger
 * tags:
 *   name: Patients 
 */

export default router;
