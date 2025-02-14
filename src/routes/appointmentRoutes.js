import { Router } from 'express';
import { getAppointments, getAppointment, createAppointment, payAppointment } from './../controllers/appointmentContorller.js';
import { idValidator, appointmentValidator } from './../validators/validators.js';
import { authenticate, authorize } from '../controllers/authController.js';

const router = Router();

router.use(authenticate)
router.route('/')
  .post(appointmentValidator ,authorize('patient'), createAppointment)
  .get(getAppointments)

router.route('/:appointmentId').get(idValidator, getAppointment)
router.route('/:appointmentId/pay').post(idValidator,authorize('patient'), payAppointment)

/**
 * @swagger
 * tags:
 *   name: Appointments 
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
 * /api/v1/appointments:
 *   post:
 *     tags: [Appointments]
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

/**
 * @swagger
 * '/api/v1/appointments/{appointmentId}/pay':
 *  post:
 *     tags: [Appointments]
 *     summary: Appointment Payment 
 */

/**
 * @swagger
 * /api/v1/appointments:
 *   get:
 *     tags: [Appointments]
 *     summary: Get Appointments
 *     responses:
 *       200:
 *         description: Success 
 *       500:
 *         description: Server Error
 */

/**
 * @swagger
 * /api/v1/appointments/{appointmentId}:
 *   get:
 *     tags: [Appointments]
 *     summary: Get single Appointment
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

export default router;
