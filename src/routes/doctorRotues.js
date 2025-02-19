import { Router } from 'express';
import { getDoctors, getDoctor, registerDoctor, getDoctorProfile, updateDoctorProfile, deleteDoctorProfile } from '../controllers/doctorController.js';
import { registerValidator, idValidator } from './../validators/validators.js';
import { authenticate, authorize } from '../controllers/authController.js'

const router = Router();

router.post('/register', registerValidator, registerDoctor)

router.route('/profile')
  .get(authenticate, authorize('doctor'), getDoctorProfile)
  .patch(authenticate, authorize('doctor'), updateDoctorProfile)
  .delete(authenticate, authorize('doctor'), deleteDoctorProfile)

router.get('/', getDoctors)
router.get('/:id', idValidator, getDoctor)

/**
 * @swagger
 * tags:
 *   name: Doctors 
 */

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

/**
* @swagger
* /api/v1/doctors/:
*   get:
*     tags: [Doctors]
*     summary: List All Doctors
*     responses:
*       200:
*         description: Success
*       500:
*         description: Server Error
*/

/**
* @swagger
* /api/v1/doctors/{doctorId}:
*   get:
*     tags: [Doctors]
*     summary: Get single Doctors
*     parameters:
*       - name: doctorId
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
 * /api/v1/doctors/profile:
 *   get:
 *     tags: [Doctors]
 *     summary: Get Doctor Profile
 *     responses:
 *       200:
 *         description: Success 
 *       401:
 *         description: unauthorized please Login 
 */

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
export default router;
