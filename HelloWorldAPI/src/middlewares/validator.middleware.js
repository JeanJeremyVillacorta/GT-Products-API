import { body, validationResult } from 'express-validator';
import { ApiResponse } from '../utils/ApiResponse.js';

export const validatePost = [
    body('title')
    .trim()
    .notEmpty()
    .withMessage ('Title is required.'),

     body('content')
     .trim()
     .notEmpty()
     .withMessage ('Content is required.'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                statusCode: 400,
                message: "Validation failed",
                data: null,
                errors: errors.array()
            });
        }
        next();
    },
];

export const validateComment = [
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Content is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Validation failed",
        data: null,
        errors: errors.array()
      });
    }
    next();
  },
];

export const validateRegistration = [
    body('username')
        .trim()
        .notEmpty()
        .withMessage('Username is required.'),
    
    body('email')
        .isEmail()
        .withMessage('A valid email is required.'),

    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long.'),
    
    // This part remains the same for all validators
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        next();
    },
];