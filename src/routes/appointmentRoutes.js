import { Router } from 'express';
import { getAppointments, getAppointment, createAppointment, payAppointment } from './../controllers/appointmentContorller.js';
import { idValidator, appointmentValidator } from './../validators/validators.js';
import { authenticate } from '../controllers/authController.js';

const router = Router();

router.use(authenticate)
router.route('/')
  .post(appointmentValidator, createAppointment)
  .get(getAppointments)

router.route('/:appointmentId').get(getAppointment)

router.route('/:appointmentId/pay').post(payAppointment)

//router.post('/appointments', appointmentValidator, createAppointment)
//router.post('/appointments/:appointmentId/pay', payAppointment)
//
//router.get('/appointments', getPatientAppointments)
//router.get('/appointments/:appointmentId', getPatientAppointment)
//
//router.get('/appointments', getDoctorAppointments);
//router.get('/appointments/:appointmentId', getDoctorAppointment);
//
//router.get('/', getAppointments)
//router.get('/:id', idValidator, getAppointment)


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
 * @openapi
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
 *     summary: Get Patient Appointments
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

/**
 * swagger
 * /api/v1/appointments:
 *   get:
 *     tags: [Appointments]
 *     summary: Get Doctor Appointments
 *     responses:
 *       200:
 *         description: Success 
 *       500:
 *         description: Server Error
 */

/**
 * swagger
 * /api/v1/appointments/{appointmentId}:
 *   get:
 *     tags: [Appointments]
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

/**
* openapi
* '/api/v1/appointments/':
*  get:
*     tags:
*     - Appointments
*     summary: Get All Appointments 
*/

/**
* openapi
* '/api/v1/appointments/:id':
*  get:
*     tags:
*     - Appointments
*     summary: Get single Appointment
*/

export default router;
