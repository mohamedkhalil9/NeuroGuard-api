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
* '/api/v1/stroke/chats/':
*  post:
*     tags:
*     - Stroke 
*     summary: Create New Chat 
*/
router.get('/chats', chatbot)


/**
* @openapi
* '/api/v1/stroke/chats':
*  get:
*     tags:
*     - Stroke 
*     summary: Get Stroke Chatbot All Chats
*/
router.get('/chats', chatbot)

/**
* @openapi
* '/api/v1/stroke/chats/{id}':
*  post:
*     tags:
*     - Stroke 
*     summary: Chat with chatbot 
*/
router.post('/chats/:id', chatbot)

/**
* @openapi
* '/api/v1/stroke/chats/{id}':
*  get:
*     tags:
*     - Stroke 
*     summary: Get Stroke Chatbot single Chat
*/
router.get('/chats/:id', chatbot)


export default router;
