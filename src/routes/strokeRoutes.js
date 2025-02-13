import { Router } from 'express';
import { detection, prediction, chatbot } from './../controllers/strokeController.js'
import { authenticate } from '../controllers/authController.js'

const router = Router();

router.use(authenticate);

router.post('/detect', detection)
router.post('/predict', prediction)

router.route('/chats')
  .post(chatbot)
  .get(chatbot)

router.route('/chats/:id')
  .post(chatbot)
  .get(chatbot)

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
* '/api/v1/stroke/chats/':
*  post:
*     tags:
*     - Stroke 
*     summary: Create New Chat 
*/

/**
* @openapi
* '/api/v1/stroke/chats':
*  get:
*     tags:
*     - Stroke 
*     summary: Get Stroke Chatbot All Chats
*/

/**
* @openapi
* '/api/v1/stroke/chats/{id}':
*  post:
*     tags:
*     - Stroke 
*     summary: Chat with chatbot 
*/

/**
* @openapi
* '/api/v1/stroke/chats/{id}':
*  get:
*     tags:
*     - Stroke 
*     summary: Get Stroke Chatbot single Chat
*/


export default router;
