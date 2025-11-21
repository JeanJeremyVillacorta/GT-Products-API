import { Router } from 'express';
import * as photoController from '../controllers/photo.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import upload from '../middlewares/multer.middleware.js';

const router = Router();

// Require login for all photo routes
router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   - name: Photos
 *     description: Photo upload and management
 */

/**
 * @swagger
 * /photos:
 *   get:
 *     summary: Get user photos
 *     tags: [Photos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user photos
 */
router.get('/', photoController.getUserPhotos);

/**
 * @swagger
 * /photos/{id}:
 *   delete:
 *     summary: Delete a photo
 *     tags: [Photos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Photo deleted
 */
router.delete('/:id', photoController.deleteUserPhoto);

/**
 * @swagger
 * /photos/upload:
 *   post:
 *     summary: Upload a photo
 *     tags: [Photos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               caption:
 *                 type: string
 *               photo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Photo uploaded successfully
 */
router.post('/upload', upload.single('photo'), photoController.uploadPhoto);

export default router;
