import * as postService from '../services/post.services.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const getAllPosts = async (req, res) => {
    try {
        const posts = await postService.getAllPosts();
        return res
            .status(200)
            .json(new ApiResponse(200, posts, "Posts retrieved successfully"));
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving posts', error: error.message });
  }
};


export const getPostById = async (req, res) => {
  try {
    const postId = parseInt(req.params.id, 10);
    const post = await postService.getPostById(postId);


    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving post', error: error.message });
  }
};


export const createPost = async (req, res) => {
  try {
    // Assuming req.body is already validated (e.g. via middleware)
    const newPost = await postService.createPost(req.body);

    return res
      .status(201)
      .json(new ApiResponse(201, newPost, "Post created successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, error.message || "Error creating post"));
  }
};


export const updatePost = async (req, res) => {
  try {
    const postId = parseInt(req.params.id, 10);
    const post = await postService.updatePost(postId, req.body);


    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error updating post', error: error.message });
  }
};


export const partiallyUpdatePost = async (req, res) => {
  try {
    const postId = parseInt(req.params.id, 10);
    const updatedPost = await postService.partiallyUpdatePost(postId, req.body);


    if (!updatedPost) {
      return res.status(404).json({ message: 'Post not found.' });
    }
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: 'Error partially updating post', error: error.message });
  }
};


export const deletePost = async (req, res) => {
  try {
    const postId = parseInt(req.params.id, 10);
    const success = await postService.deletePost(postId);


    if (!success) {
      return res.status(404).json({ message: 'Post not found.' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting post', error: error.message });
  }
};



