import { Router } from 'express';
import { login, logout, forgotPassword, verifyOtp, resetPassword, authenticate } from './../controllers/authController.js';
import { emailValidator, loginValidator, otpValidator } from './../validators/validators.js';
import passport from 'passport';

const router = Router();

router.post('/login', loginValidator, passport.authenticate('local'), login)
router.get('/logout', authenticate, logout)

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))
router.get('/google/callback', passport.authenticate('google', { failureRedirect: false }), (req, res) => {
  res.redirect('http://localhost:5173')
})

router.post('/forgot-password', emailValidator, forgotPassword)
router.post('/verify-otp', otpValidator, verifyOtp)
router.patch('/reset-password', resetPassword)

/**
 * @swagger
 * tags:
 *   name: Auth 
 */

/**
 * @swagger
 * components:
 *   schemas:
*     Login:
 *       type: object
 *       required:
 *         - email 
 *         - password
 *       properties:
 *         email:
 *           type: string
 *         password:
 *           type: string
 *       example:
 *         email: ahmedmahmoud4@email.com 
 *         password: '1234'
 */

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login Users
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: User Logged in Successfully 
 *       404:
 *         description: User Not Found 
 *       401:
 *         description: Invalid Email Or Password 
 *       500:
 *         description: Server Error
 */

/**
 * @swagger
 * /api/v1/auth/google:
 *   get:
 *     tags: [Auth]
 *     summary: Login or Register a user with google
 *     responses:
 *       200:
 *         description: User Logged in Successfully 
 *       500:
 *         description: Server Error
 */

/**
 * @swagger
 * /api/v1/auth/logout:
 *   get:
 *     tags: [Auth]
 *     summary: User Logout 
 *     responses:
 *       200:
 *         description: Logged out Successfully 
 *       500:
 *         description: Server Error
 */

/**
 * @swagger
 * /api/v1/auth/forgot-password:
 *   post:
 *     tags: [Auth]
 *     summary: User Forgot Password 
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - email
 *              properties:
 *                email: 
 *                  type: string
 *                  default: someemail@mail.com
 *     responses:
 *       200:
 *         description: Email sent with otp Successfully 
 *       404:
 *         description: User Not Found 
 *       500:
 *         description: Server Error
 */

/**
 * @swagger
 * /api/v1/auth/verify-otp:
 *   post:
 *     tags: [Auth]
 *     summary: Verify the sent otp
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - email
 *                - otp 
 *              properties:
 *                email: 
 *                  type: string
 *                  default: username@email.com
 *                otp:
 *                  type: string
 *                  default: 1234 
 *     responses:
 *       200:
 *         description: otp verified Successfully 
 *       409:
 *         description: Otp is invalid
 *       500:
 *         description: Server Error
 */

/**
 * @swagger
 * /api/v1/auth/reset-password:
 *   patch:
 *     tags: [Auth]
 *     summary: Reset User's Password 
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - email 
 *                - newPassword
 *                - confirmNewPassword
 *              properties:
 *                email: 
 *                  type: string
 *                  default: someemail@mail.com 
 *                newPassword: 
 *                  type: string
 *                  default: d2341
 *                confirmNewPassword: 
 *                  type: string
 *                  default: s2342s
 *     responses:
 *       200:
 *         description: Password updated Successfully 
 *       400:
 *         description: access denied otp is not verified 
 *       500:
 *         description: Server Error
 */

export default router;
