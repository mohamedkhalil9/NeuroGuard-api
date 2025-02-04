import { Router } from 'express';
import { getUsers, getUser, deleteUser, updateUser, getCurrentUser } from '../controllers/userController.js';
import { getMe } from './../controllers/userController.js';
import ensureAuthenticated from './../middlewares/ensureAuthenticated.js';

const router = Router();

// Protected
// ROLES All
router.use(ensureAuthenticated);
router.get('/me', getMe);

// ROLES Admin
router.route('/')
  .get(getUsers)

router.route('/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser)


export default router;
