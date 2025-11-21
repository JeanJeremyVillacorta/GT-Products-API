import pool from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';


export const getAllPosts = async () => {
    const [posts] = await pool.query(`
        SELECT 
            p.id,
            p.title,
            p.content,
            p.authorId,
            p.createdAt,
            u.username AS authorUsername,
            u.email AS authorEmail
        FROM 
            posts p
        JOIN 
            users u ON p.authorId = u.id
    `);
    return posts;
};

export const getPostById = async (id) => {
  if (isNaN(id)) {
    throw new ApiError(400, "Invalid post ID format");
  }

  const [rows] = await pool.query(`
    SELECT 
        p.id,
        p.title,
        p.content,
        p.authorId,
        p.createdAt,
        u.username AS authorUsername,
        u.email AS authorEmail
    FROM posts p
    JOIN users u ON p.authorId = u.id
    WHERE p.id = ?
  `, [id]);

  if (!rows || rows.length === 0) {
    throw new ApiError(404, "Post not found");
  }

  return rows[0];
};

export const getPostsByAuthorId = async (authorId) => {
    const [posts] = await pool.query(`
        SELECT 
            p.id,
            p.title,
            p.content,
            p.authorId,
            p.createdAt,
            u.username AS authorUsername,
            u.email AS authorEmail
        FROM posts p
        JOIN users u ON p.authorId = u.id
        WHERE p.authorId = ?
        ORDER BY p.createdAt DESC
    `, [authorId]);

    return posts;
};

export const createPost = async (postData, authorId) => {
    const { title, content } = postData; // No longer need authorId from here
    try {
        const [result] = await pool.query(
            'INSERT INTO posts (title, content, authorId) VALUES (?, ?, ?)',
            [title, content, authorId] // Use the authorId from the argument
        );
        const newPost = await getPostById(result.insertId);
        return newPost;
    } catch (error) {
        // This will catch if the authorId does not exist in the users table
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            throw new ApiError(400, "Invalid author ID. User does not exist.");
        }
        throw error;
    }
};


export const updatePost = async (id, postData, userId) => { // Add userId as an argument
    const { title, content } = postData;

    // First, get the post to check for ownership
    const post = await getPostById(id); // This will throw a 404 if not found

    // AUTHORIZATION CHECK
    if (post.authorId !== userId) {
        throw new ApiError(403, "Forbidden: You do not have permission to edit this post.");
    }

    // If the check passes, proceed with the update
    await pool.query(
        'UPDATE posts SET title = ?, content = ? WHERE id = ?',
        [title, content, id]
    );
    const updatedPost = await getPostById(id);
    return updatedPost;
};


export const partiallyUpdatePost = async (id, updates) => {
    const fields = Object.keys(updates);
    const values = Object.values(updates);

    if (fields.length === 0) {
        return getPostById(id);
    }

    const setClause = fields.map(field => `${field} = ?`).join(', ');

    const [result] = await pool.query(
        `UPDATE posts SET ${setClause} WHERE id = ?`,
        [...values, id]
    );

    if (result.affectedRows === 0) {
        throw new ApiError(404, "Post not found");
    }
    return getPostById(id);
};

export const deletePost = async (id, userId) => { // Add userId as an argument
    // First, get the post to check for ownership
    const post = await getPostById(id); // This will throw a 404 if not found

    // AUTHORIZATION CHECK
    if (post.authorId !== userId) {
        throw new ApiError(403, "Forbidden: You do not have permission to delete this post.");
    }
    
    // If the check passes, proceed with the deletion
    const [result] = await pool.query('DELETE FROM posts WHERE id = ?', [id]);
    return result.affectedRows;
};