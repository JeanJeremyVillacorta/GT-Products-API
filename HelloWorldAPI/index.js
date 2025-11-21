import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';

import postRoutes from './src/routes/post.routes.js';
import userRoutes from './src/routes/user.routes.js';
import commentRoutes from './src/routes/comment.routes.js';
import authRoutes from './src/routes/auth.routes.js';
import photoRoutes from './src/routes/photo.routes.js';

import { testConnection } from './src/config/db.js';
import { errorHandler } from './src/middlewares/errorHandler.middleware.js';
import { swaggerSpec } from './src/config/swagger.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// --- Security & Middleware ---
app.use(helmet()); // Secure HTTP headers

app.use(cors({
    origin: 'http://localhost:5173', // Adjust to your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true
}));

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For form submissions
app.use('/uploads', express.static('uploads')); // Serve uploaded files

// --- Rate Limiting ---
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use(globalLimiter);

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10, // Limit login/register attempts
    message: 'Too many login attempts, please try again later'
});

// --- Swagger Documentation ---
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
        persistAuthorization: true // Keep JWT token in Swagger UI after reload
    }
}));

// --- Versioned Routes ---
app.use('/api/v1/auth', authLimiter, authRoutes); // Auth routes have stricter limiter
app.use('/api/v1/posts', postRoutes);
app.use('/api/v1/comments', commentRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/photos', photoRoutes);

// --- Error Handling ---
app.use(errorHandler);

// --- Start Server & Test DB ---
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    console.log(`API Docs available at http://localhost:${port}/api-docs`);
    testConnection();
});
