import * as commentService from '../services/comment.service.js';
import asyncHandler from 'express-async-handler';
import { ApiResponse } from '../utils/ApiResponse.js';

export const getAllComments = asyncHandler(async (req, res) => {
  const comments = await commentService.getAllComments();
  return res.status(200).json(new ApiResponse(200, comments, "Comments retrieved successfully"));
});

export const getCommentsByPostId = asyncHandler(async (req, res) => {
  const postId = parseInt(req.params.postId, 10);
  const comments = await commentService.getCommentsByPostId(postId);
  return res.status(200).json(new ApiResponse(200, comments, "Comments retrieved successfully"));
});

export const createCommentForPost = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const postId = parseInt(req.params.postId, 10);
  const authorId = req.user.id; //comes from authMiddleware

  const comment = await commentService.createCommentForPost(postId, { content, authorId });

  return res.status(201).json({
    success: true,
    data: comment,
    message: 'Comment created successfully',
  });
});