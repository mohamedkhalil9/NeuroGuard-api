import { Router } from 'express';
import { getAppointments, getAppointment } from './../controllers/appointmentContorller.js';
import { idValidator } from './../validators/validators.js';
import { authenticate } from '../controllers/authController.js';

const router = Router();

router.use(authenticate)

/**
* @openapi
* '/api/v1/appointments/':
*  get:
*     tags:
*     - Appointments
*     summary: Get All Appointments 
*/
router.get('/', getAppointments)

/**
* @openapi
* '/api/v1/appointments/:id':
*  get:
*     tags:
*     - Appointments
*     summary: Get single Appointment
*/
router.get('/:id', idValidator, getAppointment)

export default router;
