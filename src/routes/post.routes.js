import { Router } from 'express';
import * as postController from '../controllers/post.controllers.js';
import { validatePost } from '../middlewares/validator.middlewares.js';

const router = Router();


router.get('/', postController.getAllPosts);
router.post('/', postController.createPost);
router.get('/:id', postController.getPostById);
router.put('/:id', postController.updatePost);
router.patch('/:id', postController.partiallyUpdatePost);
router.delete('/:id', postController.deletePost);
router.post('/', validatePost, postController.createPost);
router.put('/:id', validatePost,postController.updatePost);
router.patch('/:id', postController.partiallyUpdatePost);


export default router;



