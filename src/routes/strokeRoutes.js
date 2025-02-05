import { Router } from 'express';
import { detection, predection, chatbot } from './../controllers/strokeController.js'
import ensureAuthenticated from '../middlewares/ensureAuthenticated.js';

const router = Router();

// Protected 
// ROLES All
router.use(ensureAuthenticated);

router.post('/detect', detection)
router.post('/predect', predection)
router.post('/chat', chatbot)

export default router;
