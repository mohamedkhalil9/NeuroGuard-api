import { Router } from 'express';
import { getMe, getUsers, getUser, deleteUser, updateUser } from '../controllers/userController.js';
import { idValidator } from './../validators/validators.js';
import ensureAuthenticated from './../middlewares/ensureAuthenticated.js';

const router = Router();

// Protected
// ROLES All
router.use(ensureAuthenticated);
router.get('/me', getMe);

// ROLES Admin
router.route('/')
  .get(getUsers)

router.use(idValidator)
router.route('/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser)


export default router;
