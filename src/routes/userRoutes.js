import { Router } from 'express';
import { getUsers, getUser, getUserProfile, updateUserProfile, deleteUserProfile } from '../controllers/userController.js';
import { idValidator } from './../validators/validators.js';
import { authenticate } from '../controllers/authController.js';

const router = Router();

router.use(authenticate);

router.get('/', getUsers)
/**
 * @openapi
 * '/api/v1/users/:userId':
 *  get:
 *     tags:
 *     - Users
 *     summary: Get a user by userId 
 *     parameters:
 *      - name: userId 
 *        in: path
 *        description: The id of the user
 *        required: true
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
router.get('/:id', idValidator, getUser)

router.route('/profile')
  .get(getUserProfile)
/**
 * @openapi
 * '/api/v1/users/:id':
 *  patch:
 *     tags:
 *     - Users 
 *     summary: Modify a user
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - userId
 *            properties:
 *              userId:
 *                type: string
 *                default: ''
 *              firstName:
 *                type: string
 *                default: ''
 *              lastName:
 *                type: string
 *                default: ''
 *     responses:
 *      200:
 *        description: Modified
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
  .patch(updateUserProfile)
/**
 * @openapi
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
  .delete(deleteUserProfile)

export default router;
