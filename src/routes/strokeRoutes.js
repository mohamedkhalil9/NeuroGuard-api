import { Router } from 'express';
import { detection, prediction, chatbot } from './../controllers/strokeController.js'
import { authenticate } from '../controllers/authController.js'

const router = Router();

router.use(authenticate);

/**
* @openapi
* '/api/v1/stroke/detect':
*  post:
*     tags:
*     - Stroke 
*     summary: Stroke Detection using MRI img 
*/
router.post('/detect', detection)

/**
* @openapi
* '/api/v1/stroke/predict':
*  post:
*     tags:
*     - Stroke 
*     summary: Stroke Survey Risk Prediction 
*/
router.post('/predict', prediction)

/**
* @openapi
* '/api/v1/stroke/chat':
*  post:
*     tags:
*     - Stroke 
*     summary: Stroke Chatbot 
*/
router.post('/chat', chatbot)

export default router;
