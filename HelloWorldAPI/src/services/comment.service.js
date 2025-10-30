import pool from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';
import * as postService from './post.service.js';
import * as userService from './user.service.js';

export const getAllComments = async () => {
  const [comments] = await pool.query(`
    SELECT 
      c.id,
      c.content,
      c.postId,
      c.authorId,
      c.createdAt,
      u.username AS authorUsername,
      u.email AS authorEmail
    FROM comments c
    JOIN users u ON c.authorId = u.id
    ORDER BY c.createdAt DESC
  `);
  return comments;
};

export const getCommentsByPostId = async (postId) => {
  const [comments] = await pool.query(`
    SELECT 
      c.id,
      c.content,
      c.postId,
      c.authorId,
      c.createdAt,
      u.username AS authorUsername,
      u.email AS authorEmail
    FROM comments c
    JOIN users u ON c.authorId = u.id
    WHERE c.postId = ?
    ORDER BY c.createdAt DESC
  `, [postId]);

  return comments;
};

export const createCommentForPost = async (postId, commentData) => {
  const { content, authorId } = commentData;

  try {
    const [result] = await pool.query(
      'INSERT INTO comments (content, postId, authorId) VALUES (?, ?, ?)',
      [content, postId, authorId]
    );

    const newCommentId = result.insertId;

    const [rows] = await pool.query(`
      SELECT 
        c.id,
        c.content,
        c.postId,
        c.authorId,
        c.createdAt,
        u.username AS authorUsername,
        u.email AS authorEmail
      FROM comments c
      JOIN users u ON c.authorId = u.id
      WHERE c.id = ?
    `, [newCommentId]);

    return rows[0];
  } catch (error) {
    
    if (error && error.code === 'ER_NO_REFERENCED_ROW_2') {
      throw new ApiError(400, "Invalid postId or authorId. The specified post or user does not exist.");
    }
    
    throw error;
  }
};