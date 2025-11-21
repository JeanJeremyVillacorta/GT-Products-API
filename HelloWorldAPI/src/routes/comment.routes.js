import { Router } from 'express';
import * as commentController from '../controllers/comment.controller.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Comments
 *     description: Comment management
 */

/**
 * @swagger
 * /comments:
 *   get:
 *     summary: Get all comments
 *     tags: [Comments]
 *     responses:
 *       200:
 *         description: List of all comments
 */
router.get('/', commentController.getAllComments);

export default router;
