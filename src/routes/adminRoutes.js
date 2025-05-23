import { Router } from "express";
import {
  registerAdmin,
  getAllAppointments,
  getAllPatients,
  getAllUsers,
} from "../controllers/adminController.js";
import { authenticate, authorize } from "../controllers/authController.js";
import { registerValidator } from "../validators/validators.js";
import profileRoutes from "./profileRoutes.js";

const router = Router();

router.post("/register", registerValidator, registerAdmin);

router.use(authenticate, authorize("ADMIN"));

router.get("/appointments", getAllAppointments);
router.get("/patients", getAllPatients);
router.get("/users", getAllUsers);

router.use("/profile", profileRoutes);

/**
 * openapi
 * '/api/v1/users/profile':
 *  get:
 *     tags:
 *     - Users
 *     summary: Get a user by userId
 *     responses:
 *      200:
 *        description: Fetched Successfully
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */

/**
 * swagger
 * /api/v1/users/profile:
 *  patch:
 *    summary: Update
 *    tags:
 *    - Users
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Patient'
 *    responses:
 *      200:
 *        description: The book was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Patient'
 *      404:
 *        description: The book was not found
 *      500:
 *        description: Some error happened
 */

/**
 * openapi
 * '/api/v1/users/{userId}':
 *  delete:
 *     tags:
 *     - Users
 *     summary: Delete user by Id
 *     parameters:
 *      - name: userId
 *        in: path
 *        description: The unique Id of the user
 *        required: true
 *     responses:
 *      200:
 *        description: Removed
 *      400:
 *        description: Bad request
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */

export default router;
