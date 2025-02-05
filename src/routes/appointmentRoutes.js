import { Router } from 'express';
import { getAppointments, addAppointment, getAppointment, updateAppointment, deleteAppointment } from './../controllers/appointmentContorller.js';
import { idValidator } from './../validators/validators.js';
import ensureAuthenticated from './../middlewares/ensureAuthenticated.js';

const router = Router();

// Authenticated 
// ROLES only ADMINS
router.use(ensureAuthenticated)
router.route('/appointments')
  .get(getAppointments)
  .post(addAppointment)

router.use(idValidator)
router.route('/appointments/:id')
  .get(getAppointment)
  .patch(updateAppointment)
  .delete(deleteAppointment)


export default router;
