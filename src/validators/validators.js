import { body, param } from 'express-validator';
import { validatorMiddleware } from '../middlewares/validatorMiddleware.js';

export const idValidator = [
  param('id')
    .isMongoId()
    .withMessage('invalid id'),
  validatorMiddleware
]

export const registerValidator = [
  body('firstName')
    .notEmpty()
    .withMessage('first name is required'),
  body('lastName')
    .notEmpty()
    .withMessage('last name is required'),
  body('email')
    .notEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage('enter a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('password is required'),
  body('dateOfBirth')
    .notEmpty()
    .withMessage('date of birth is required'),
  body('gender')
    .notEmpty()
    .withMessage('gender is required'),
  body('phone')
    .notEmpty()
    .withMessage('phone is required'),
  validatorMiddleware
]

export const loginValidator = [
  body('email')
    .notEmpty()
    .withMessage('email required')
    .isEmail()
    .withMessage('enter a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('password required'),
  validatorMiddleware
]

export const emailValidator = [
  body('email')
    .notEmpty()
    .withMessage('email required')
    .isEmail()
    .withMessage('enter a valid email address'),
  validatorMiddleware
]

export const OTPValidator = [
  body('OTP')
    .notEmpty()
    .withMessage('OTP verification code is required')
    .isLength({ min: 4, max: 4 })
    .withMessage('enter a valid OTP code'),
  validatorMiddleware
]
