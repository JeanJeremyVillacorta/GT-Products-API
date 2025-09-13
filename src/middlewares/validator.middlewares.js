import {body, validationResult} from 'express-validator';

export const validatePost = [
    body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required'),

    body('content') 
    .trim()
    .notEmpty()
    .withMessage('content is required'),

    (req, res, next) => {
        const errors = validateResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        next();
    }
]

export const errorHandler = (err, req, res, next) => {
    let statusCode = 500;
    let message = "Internal Server Error";

    if (err instanceof ApiError) {
        statusCode = err.statusCode;
        message = err.message;
    }

    return res.status(statusCode).json({
        success: false,
        message: message,
    });
};

