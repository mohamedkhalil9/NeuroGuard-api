import { Router } from 'express';
import { register,  login, logout, forgotPassword, resetPassword } from './../controllers/authController.js';
import { emailValidator, loginValidator, registerValidator, OTPValidator } from './../validators/validators.js';
import { verifyOTP } from './../middlewares/verifyOTP.js';
import passport from 'passport';

const router = Router();

router.post('/register', registerValidator, register);
router.post('/login', loginValidator, passport.authenticate('local'), login)

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))
router.get('/google/callback', passport.authenticate('google', { failureRedirect: false }), (req, res) => {
  res.redirect('http://localhost:5173')
})

router.get('/logout', logout)

router.post('/forgot-password', emailValidator, forgotPassword)
router.post('/verify-otp', OTPValidator, verifyOTP)
router.patch('/reset-password/:OTP', resetPassword)

export default router;
