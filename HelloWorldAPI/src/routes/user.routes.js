// src/routes/user.routes.js
import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';
// We no longer create users from this route file
// import * as userController from '../controllers/user.controller.js';

const router = Router();

// router.post('/', userController.createUser); // REMOVE THIS LINE
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);

export default router;