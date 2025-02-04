import { Router } from 'express';
//import { } from './../controllers/appointmentContorllerl.js';
//import { } from './../validators/validators.js';
import { ensureAuthenticated } from './../middlewares/ensureAuthenticated.js';

const router = Router();

// Authenticated 
// ROLES only ADMINS
router.use(ensureAuthenticated)
router.route('/appointments')
  .get(register)
  //.post(register)

router.route('/appointments/:id')
  .get(register)
  //.patch(register)
  //.delete(register)


export default router;
