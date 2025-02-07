import { Router } from 'express';
import { login, logout, forgotPassword, verifyOtp, resetPassword } from './../controllers/authController.js';
import { emailValidator, loginValidator, otpValidator } from './../validators/validators.js';
import passport from 'passport';

const router = Router();

/**
 * @openapi
 * '/api/v1/auth/login':
 *  post:
 *     tags:
 *     - Auth 
 *     summary: Login as a user
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - email 
 *              - password
 *            properties:
 *              email:
 *                type: string
 *                default: johndoe@email.com
 *              password:
 *                type: string
 *                default: johnDoe20!@
 *     responses:
 *      200:
 *        description: Success 
 *      401:
 *        description: Unauthorized 
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
router.post('/login', loginValidator, passport.authenticate('local'), login)

/**
 * @openapi
 * '/api/v1/auth/google':
 *  post:
 *     tags:
 *     - Auth 
 *     summary: Login or Register a user with google
 */
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))
router.get('/google/callback', passport.authenticate('google', { failureRedirect: false }), (req, res) => {
  res.redirect('http://localhost:5173')
})

/**
 * @openapi
 * '/api/v1/auth/logout':
 *  post:
 *     tags:
 *     - Auth 
 *     summary: Lougout user
 *     responses:
 *      204:
 *        description: Loged out 
 *      500:
 *        description: Server Error
 */
router.get('/logout', logout)

router.post('/forgot-password', emailValidator, forgotPassword)
router.post('/verify-otp', otpValidator, verifyOtp)
router.patch('/reset-password/', resetPassword)

export default router;
