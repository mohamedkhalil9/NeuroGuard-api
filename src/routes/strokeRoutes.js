import { Router } from 'express';
import { detection, predection, chatbot } from './../controllers/strokeController.js'
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const router = Router();

// Protected 
// ROLES All
app.use(ensureAuthenticated);

app.post('/detect', detection)
app.post('/predect', predection)
app.post('/chat', chatbot)
