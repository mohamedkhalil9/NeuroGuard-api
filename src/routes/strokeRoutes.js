import { Router } from "express";
import {
  prediction,
  uploadImage,
  srganPrediction,
  denoisingPrediction,
  cycleganPrediction,
} from "./../controllers/strokeController.js";
import { authenticate } from "../controllers/authController.js";
import upload from "../middlewares/multer.js";

const router = Router();

router.use(authenticate);

// use FastAPI server /chat/stream
// use FastAPI server /chat_history
// use FastAPI server /pdf/upload
router.post("/predict", prediction);
router.post("/upload-image", upload.single("file"), uploadImage);
// router.post("/chat", chatbot);
// router.post("/upload-pdf", uploadPdf);
router.post("/predict/srgan", upload.single("file"), srganPrediction);
router.post("/predict/denoising", upload.single("file"), denoisingPrediction);
router.post("/predict/cyclegan", upload.single("file"), cycleganPrediction);

/**
 * @swagger
 * tags:
 *   name: Stroke
 */
/**
 * @swagger
 * /api/v1/stroke/predict:
 *   post:
 *     tags: [Stroke]
 *     summary: Stroke Survey Risk Prediction
 *     description: Predicts the risk of stroke based on user-provided survey data.
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
 *     description: Uploads an image for stroke prediction and processes it.
 *     requestBody:
 *        required: true
 *        content:
 *          multipart/form-data:
 *            schema:
 *              type: object
 *              required:
 *                - file
 *              properties:
 *                file:
 *                  type: string
 *                  format: binary
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: No file uploaded
 *       500:
 *         description: Server Error
 */

/**
 * @swagger
 * /api/v1/stroke/predict/srgan:
 *   post:
 *     tags: [Stroke]
 *     summary: SRGAN-based image enhancement and stroke prediction
 *     description: Enhances the uploaded image using SRGAN and performs stroke prediction.
 *     requestBody:
 *        required: true
 *        content:
 *          multipart/form-data:
 *            schema:
 *              type: object
 *              required:
 *                - file
 *              properties:
 *                file:
 *                  type: string
 *                  format: binary
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: No file uploaded
 *       500:
 *         description: Server Error
 */

/**
 * @swagger
 * /api/v1/stroke/predict/denoising:
 *   post:
 *     tags: [Stroke]
 *     summary: Denoising GAN-based image enhancement and stroke prediction
 *     description: Enhances the uploaded image using a Denoising GAN and performs stroke prediction.
 *     requestBody:
 *        required: true
 *        content:
 *          multipart/form-data:
 *            schema:
 *              type: object
 *              required:
 *                - file
 *              properties:
 *                file:
 *                  type: string
 *                  format: binary
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: No file uploaded
 *       500:
 *         description: Server Error
 */

/**
 * @swagger
 * /api/v1/stroke/predict/cyclegan:
 *   post:
 *     tags: [Stroke]
 *     summary: CycleGAN-based image transformation and stroke prediction
 *     description: Transforms the uploaded image using CycleGAN and performs stroke prediction.
 *     requestBody:
 *        required: true
 *        content:
 *          multipart/form-data:
 *            schema:
 *              type: object
 *              required:
 *                - file
 *              properties:
 *                file:
 *                  type: string
 *                  format: binary
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: No file uploaded
 *       500:
 *         description: Server Error
 */

export default router;
