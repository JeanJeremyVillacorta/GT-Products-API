import * as postService from '../services/post.service.js';
import { validationResult } from 'express-validator';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import asyncHandler from 'express-async-handler';

export const getAllPosts = asyncHandler(async (req, res) => {
    const posts = await postService.getAllPosts();
    return res
        .status(200)
        .json(new ApiResponse(200, posts, "Posts retrieved successfully"));
});

export const getPostById = asyncHandler(async (req, res) => {
    const postId = parseInt(req.params.id, 10);
    const post = await postService.getPostById(postId);

    return res
        .status(200)
        .json(new ApiResponse(200, post, "Post retrieved successfully"));
});

export const createPost = asyncHandler(async (req, res) => {
    // The authorId now comes from the authenticated user attached by the middleware
    const authorId = req.user.id;
    const postData = req.body;

    const newPost = await postService.createPost(postData, authorId); // Pass authorId separately
    res.status(201).json(new ApiResponse(201, newPost, "Post created successfully"));
});

export const updatePost = asyncHandler(async (req, res) => {
    const postId = parseInt(req.params.id, 10);
    const postData = req.body;
    const userId = req.user.id; // Get the user ID from the middleware

    const updatedPost = await postService.updatePost(postId, postData, userId);
    res.status(200).json(new ApiResponse(200, updatedPost, "Post updated successfully"));
});

export const partiallyUpdatePost = asyncHandler(async (req, res) => {
    const postId = parseInt(req.params.id, 10);
    const post = await postService.partiallyUpdatePost(postId, req.body);

    return res
        .status(200)
        .json(new ApiResponse(200, post, "Post updated successfully"));
});

export const deletePost = asyncHandler(async (req, res, next) => {
  console.log("DELETE post called. req.user:", req.user, "params:", req.params);  
  const postId = parseInt(req.params.id, 10);
  const userId = req.user.id;

  if (isNaN(postId)) {
    throw new ApiError(400, "Invalid post ID");
  }

  try {
    await postService.deletePost(postId, userId);
    res.status(200).json(new ApiResponse(200, null, "Post deleted successfully"));
  } catch (error) {
    // If ApiError was thrown, pass it directly
    if (error instanceof ApiError) {
      return next(error);
    }
    // Otherwise log and pass generic error
    console.error("Unexpected error in deletePost:", error);
    return next(new ApiError(500, "Something went wrong while deleting the post"));
  }
});