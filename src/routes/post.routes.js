import { Router } from 'express';
import * as postController from '../controllers/post.controllers.js';


const router = Router();


router.get('/', postController.getAllPosts);
router.post('/', postController.createPost);
router.get('/:id', postController.getPostById);
router.put('/:id', postController.updatePost);
router.patch('/:id', postController.partiallyUpdatePost);
router.delete('/:id', postController.deletePost);


export default router;



