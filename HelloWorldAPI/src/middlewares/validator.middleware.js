import { body, validationResult } from 'express-validator';
import { ApiResponse } from '../utils/ApiResponse.js';

export const validatePost = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Title is required'),

    body('content')
        .trim()
        .notEmpty()
        .withMessage('Content is required'),

    body('authorId')
        .isInt({ min: 1 })
        .withMessage('A valid authorId is required'),

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

  body('authorId')
    .isInt({ min: 1 })
    .withMessage('A valid authorId is required'),

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