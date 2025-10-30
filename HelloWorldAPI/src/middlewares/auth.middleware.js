// src/middlewares/auth.middleware.js
import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';
import asyncHandler from 'express-async-handler';
import { getUserById } from '../services/user.service.js';

export const authMiddleware = asyncHandler(async (req, res, next) => {
    let token;

   
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            
            token = req.headers.authorization.split(' ')[1];

            
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            
            req.user = await getUserById(decoded.id);

            
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


