import { Router } from 'express';
import { registerPatient, getPatientProfile, updatePatientProfile, deletePatientProfile, getDoctorPatients, getDoctorPatient } from '../controllers/patientController.js'
import { authenticate } from '../controllers/authController.js';
import { registerValidator, idValidator } from '../validators/validators.js'

const router = Router();
 
router.post('/register',registerValidator, registerPatient)

router.use(authenticate)

router.get('/patients', getDoctorPatients);
router.get('/patients/:patientId',idValidator, getDoctorPatient);

router.route('/profile')
  .get(getPatientProfile)
  .patch(updatePatientProfile)
  .delete(deletePatientProfile)


/**
 * @swagger
 * tags:
 *   name: Patients 
 */

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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Patient'
 *       409:
 *         description: User Already Exists 
 *       500:
 *         description: Server Error
 */

/**
 * @swagger
 * /api/v1/doctors/patients:
 *   get:
 *     tags: [Patients]
 *     summary: Get Doctor patients 
 *     responses:
 *       200:
 *         description: Success 
 *       500:
 *         description: Server Error
 */

/**
 * @swagger
 * /api/v1/doctors/patients/{patientId}:
 *   get:
 *     tags: [Patients]
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

export default router;
