import { Router } from "express";
import {
  registerPatient,
  getPatients,
  getPatient,
} from "../controllers/patientController.js";
import { authenticate, authorize } from "../controllers/authController.js";
import { registerValidator, idValidator } from "../validators/validators.js";
import favoriteRoutes from "./favoriteRoutes.js";
import profileRoutes from "./profileRoutes.js";

const router = Router();

router.post("/register", registerValidator, registerPatient);

router.use(authenticate);

router.use("/profile", authorize("PATIENT"), profileRoutes);

router.use("/favorites", authorize("PATIENT"), favoriteRoutes);

router.get("/", authorize("DOCTOR"), getPatients);
router.get("/:id", idValidator, authorize("DOCTOR"), getPatient);

/**
 * @swagger
 * tags:
 *   name: Patients
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Patient:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - password
 *         - dateOfBirth
 *         - gender
 *         - phone
 *         - country
 *         - address
 *       properties:
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         dateOfBirth:
 *           type: string
 *           format: date
 *         gender:
 *           type: string
 *           enum: [Male, Female]
 *         phone:
 *           type: string
 *         country:
 *           type: string
 *       example:
 *         firstName: Ahmed
 *         lastName: Mahmoud
 *         email: ahmedmahmoud4@email.com
 *         password: a12345
 *         dateOfBirth: 2000-10-10
 *         gender: Male
 *         phone: 010001000
 *         country: egypt
 */

/**
 * @swagger
 * /api/v1/patients/register:
 *   post:
 *     tags: [Patients]
 *     summary: Register Patients
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Patient'
 *     responses:
 *       201:
 *         description: Patient Created Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Patient'
 *       409:
 *         description: User Already Exists
 *       500:
 *         description: Server Error
 */

/**
 * @swagger
 * /api/v1/patients:
 *   get:
 *     tags: [Patients]
 *     summary: Get Doctor patients
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Server Error
 */

/**
 * @swagger
 * /api/v1/patients/{patientId}:
 *   get:
 *     tags: [Patients]
 *     summary: Get Doctor single Patient
 *     parameters:
 *       - name: patientId
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Server Error
 */

/**
 * @swagger
 * /api/v1/patients/profile:
 *   get:
 *     tags: [Patients]
 *     summary: Get Patient Profile
 *     responses:
 *       200:
 *         description: Successfully Get User Profile
 *       401:
 *         description: unauhtorized please Login
 */

/**
 * @swagger
 * /api/v1/patients/profile:
 *   patch:
 *     tags: [Patients]
 *     summary: Update Patient Profile
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Patient'
 *     responses:
 *       200:
 *         description: Successfully Updated User Profile
 *       500:
 *         description: Server Error
 */

/**
 * @swagger
 * /api/v1/patients/profile:
 *   delete:
 *     tags: [Patients]
 *     summary: Delete Patient Profile
 *     responses:
 *       200:
 *         description: Successfully Deleted User Profile
 *       500:
 *         description: Server Error
 */

/**
 * @swagger
 * /api/v1/patients/favorites:
 *   post:
 *     tags: [Patients]
 *     summary: Add favorite doctor
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - doctorId
 *              properties:
 *                doctorId:
 *                  type: string
 *     responses:
 *       200:
 *         description: Successfully added favorite doctor
 *       500:
 *         description: Server Error
 */

/**
 * @swagger
 * /api/v1/patients/favorites:
 *   get:
 *     tags: [Patients]
 *     summary: get favorite doctors
 *     responses:
 *       200:
 *         description: Successfully get favorite doctors
 *       500:
 *         description: Server Error
 */

export default router;
