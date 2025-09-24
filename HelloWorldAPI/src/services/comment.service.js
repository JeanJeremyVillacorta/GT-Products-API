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
        // Verify that the post exists
        const post = await postService.getPostById(postId);
        if (!post) {
            throw new ApiError(404, "Post not found");
        }

        // Verify that the author exists
        const author = await userService.getUserById(authorId);
        if (!author) {
            throw new ApiError(404, "Author not found");
        }

        // Insert the comment
        const [result] = await pool.query(
          'INSERT INTO comments (content, postId, authorId) VALUES (?, ?, ?)',
          [content, postId, authorId]
        );

        const newCommentId = result.insertId;

        // Return the created comment with author information
        const [newComment] = await pool.query(`
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

        return newComment[0];
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, "Failed to create comment");
    }
};