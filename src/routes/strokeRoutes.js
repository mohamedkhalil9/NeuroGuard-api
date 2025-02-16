import { Router } from "express";
import {
  prediction,
  uploadImage,
  chatbot,
  uploadPdf,
} from "./../controllers/strokeController.js";
import { authenticate } from "../controllers/authController.js";

const router = Router();

router.use(authenticate);

router.post("/predict", prediction);
router.post("/upload-image", uploadImage);
router.post("/chat", chatbot);
router.post("/upload-pdf", uploadPdf);

/**
 * @swagger
 * tags:
 *   name: Stroke
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     predict:
 *       type: object
 *       required:
 *         - age
 *         - hypertension
 *         - heart_disease
 *         - avg_glucose_level
 *         - bmi
 *         - gender
 *         - ever_married
 *         - work_type
 *         - residence_type
 *         - smoking_status
 *       properties:
 *         age:
 *           type: number
 *         hypertension:
 *           type: number
 *         heart_disease:
 *           type: number
 *         avg_glucose_level:
 *           type: number
 *         bmi:
 *           type: number
 *         gender:
 *           type: string
 *         ever_married:
 *           type: boolean
 *         work_type:
 *           type: string
 *         residence_type:
 *           type: string
 *         smoking_status:
 *           type: string
 *       example:
 *         age: 50
 *         hypertension: 0
 *         heart_disease: 0
 *         avg_glucose_level: 100.0
 *         bmi: 25.0
 *         gender: Male
 *         ever_married: Yes
 *         work_type: Private
 *         residence_type: Urban
 *         smoking_status: never smoked
 */

/**
 * @swagger
 * /api/v1/stroke/predict:
 *   post:
 *     tags: [Stroke]
 *     summary: Stroke Survey Risk Prediction
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/predict'
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Server Error
 */

/**
 * @swagger
 * /api/v1/stroke/upload-image:
 *   post:
 *     tags: [Stroke]
 *     summary: Upload image for stroke prediction
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - image
 *              properties:
 *                image:
 *                  type: string
 *                  format: byte
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *        description: No file uploaded
 *       500:
 *         description: Server Error
 */

/**
 * @swagger
 * /api/v1/stroke/chat:
 *   post:
 *     tags: [Stroke]
 *     summary: Chatbot assistant
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - user_input
 *              properties:
 *                user_input:
 *                  type: string
 *                  default: what is stroke
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Server Error
 */

/**
 * @swagger
 * /api/v1/stroke/upload-pdf:
 *   post:
 *     tags: [Stroke]
 *     summary: Upload pdf for stroke prediction
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - file
 *              properties:
 *                file:
 *                  type: string
 *                  format: byte
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *        description: No file uploaded
 *       500:
 *         description: Server Error
 */

export default router;
