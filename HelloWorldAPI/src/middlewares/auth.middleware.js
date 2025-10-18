// src/middlewares/auth.middleware.js
import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';
import asyncHandler from 'express-async-handler';
import { getUserById } from '../services/user.service.js';

export const authMiddleware = asyncHandler(async (req, res, next) => {
    let token;

    // 🧭 Check if there's an Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extract the token after 'Bearer '
            token = req.headers.authorization.split(' ')[1];

            // Verify the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Attach user to request
            req.user = await getUserById(decoded.id);

            // If user not found in DB
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: "Not authorized, user not found"
                });
            }

            return next();
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "Not authorized, token failed"
            });
        }
    }

    return res.status(401).json({
        success: false,
        message: "Not authorized, no token"
    });
});


