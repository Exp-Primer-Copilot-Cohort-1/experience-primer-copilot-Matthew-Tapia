// Create web server 
// 1. Create web server
// 2. Create router
// 3. Create router handler
// 4. Create router handler to listen to request
// 5. Create router handler to response to request
// 6. Create router handler to send response back to client
// 7. Create router handler to send response back to client with error message
// 8. Create router handler to send response back to client with error message

// 1. Create web server
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
const { randomBytes } = require('crypto');

const app = express();

app.use(bodyParser.json());
app.use(cors());

// 2. Create router
// Create a new post
// Get all posts
// Create a new comment
// Get all comments
app.post('/posts/:id/comments', async (req, res) => {
    const commentId = randomBytes(4).toString('hex');
    const { content } = req.body;
    const postId = req.params.id;
    const comments = commentsByPostId[postId] || [];

    comments.push({ id: commentId, content, status: 'pending' });
    commentsByPostId[postId] = comments;

    // Emit event to event bus
    await axios.post('http://localhost:4005/events', {
        type: 'CommentCreated',
        data: {
            id: commentId,
            content,
            postId,
            status: 'pending'
        }
    });

    res.status(201).send(comments);
});

app.post('/events', async (req, res) => {
    console.log('Event Received:', req.body.type);

    const { type, data } = req.body;
    if (type === 'CommentModerated') {
        const { postId, id, status, content } = data;
        const comments = commentsByPostId[postId];
        const comment = comments.find(comment => {
            return comment.id === id;
        });

        comment.status = status;

        await axios.post('http://localhost:4005/events', {
            type: 'CommentUpdated',
            data: {
                id,
                postId,
                status,
                content
            }
        });
    }

    res.send({});
});

// 3. Create router handler
// 4. Create router handler to listen