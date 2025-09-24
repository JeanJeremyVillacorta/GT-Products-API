import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';

import postRoutes from './src/routes/post.routes.js';
import commentRoutes from './src/routes/comment.routes.js';
import userRoutes from './src/routes/user.routes.js';

import { testConnection } from './src/config/db.js';
import { errorHandler } from './src/middlewares/errorHandler.middleware.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(morgan('dev'));
app.use(express.json()); 

app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/comments', commentRoutes);

app.use(errorHandler);

app.post('/posts', (req, res) => {
    const { title, content } = req.body;
    if (!title || !content) {
        return res.status(400).json({ message: 'Title and content are required.' });
    }
    const newPost = { id: nextId++, title, content };
    posts.push(newPost);
    res.status(201).json(newPost);
});

// GET /posts (returns the full array)
app.get('/posts', (req, res) => {
    res.json(posts);
});

// GET /posts/:id (finds and returns a single post)
app.get('/posts/:id', (req, res) => {
    const postId = parseInt(req.params.id, 10);
    const post = posts.find(p => p.id === postId);
    if (!post) {
        return res.status(404).json({ message: 'Post not found.' });
    }
    res.json(post);
});

// PUT /posts/:id (finds and updates a post)
app.put('/posts/:id', (req, res) => {
    const postId = parseInt(req.params.id, 10);
    const postIndex = posts.findIndex(p => p.id === postId);
    if (postIndex === -1) {
        return res.status(404).json({ message: 'Post not found.' });
    }
    const { title, content } = req.body;
    posts[postIndex] = { ...posts[postIndex], title: title || posts[postIndex].title, content: content || posts[postIndex].content };
    res.json(posts[postIndex]);
});


app.delete('/posts/:id', (req, res) => {
    const postId = parseInt(req.params.id, 10);
    const postIndex = posts.findIndex(p => p.id === postId);
    if (postIndex === -1) {
        return res.status(404).json({ message: 'Post not found.' });
    }
    posts.splice(postIndex, 1);
    res.status(204).send();
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    testConnection(); 
});