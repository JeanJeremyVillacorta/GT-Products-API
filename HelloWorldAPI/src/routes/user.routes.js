import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';

const router = Router();

router.post('/', userController.createUser);
router.get('/:userId/posts', userController.getPostsByUserId);
router.get('/:id', userController.getUserById);
router.get('/', userController.getAllUsers);

export default router;