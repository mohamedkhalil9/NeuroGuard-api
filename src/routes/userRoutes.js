import { Router } from 'express';
import { getMe } from './../controllers/userController.js';
import ensureAuthenticated from './../middlewares/ensureAuthenticated.js';

const router = Router();

router.use(ensureAuthenticated);
router.get('/me', getMe);


export default router;
