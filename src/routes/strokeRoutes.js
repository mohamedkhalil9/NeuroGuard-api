import { Router } from 'express';
import { prediction,uploadImage ,chatbot , uploadPdf } from './../controllers/strokeController.js'
import { authenticate } from '../controllers/authController.js'

const router = Router();

router.use(authenticate);

router.post('/predict', prediction)
router.post('/upload-image', uploadImage)
router.post('/chat', chatbot)
router.post('/upload-pdf', uploadPdf)


/**
* @openapi
* '/api/v1/stroke/detect':
*  post:
*     tags:
*     - Stroke 
*     summary: Stroke Detection using MRI img 
*/

/**
* @openapi
* '/api/v1/stroke/predict':
*  post:
*     tags:
*     - Stroke 
*     summary: Stroke Survey Risk Prediction 
*/

/**
* @openapi
* '/api/v1/stroke/chat/':
*  post:
*     tags:
*     - Stroke 
*     summary: Chat with stroke chatbot
*/

export default router;
