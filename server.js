const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// In-memory storage (replace with database in production)
let threads = [];
let comments = [];
let users = [{ id: 1, username: 'admin', email: 'admin@forum.com' }];

// Routes
app.get('/api/threads', (req, res) => {
    res.json(threads);
});

app.post('/api/threads', (req, res) => {
    const thread = {
        id: threads.length + 1,
        title: req.body.title,
        content: req.body.content,
        author: req.body.author || 'Anonymous',
        createdAt: new Date(),
        upvotes: 0,
        comments: 0
    };
    threads.unshift(thread);
    res.json(thread);
});

app.get('/api/threads/:id', (req, res) => {
    const thread = threads.find(t => t.id === parseInt(req.params.id));
    if (!thread) return res.status(404).json({ error: 'Thread not found' });
    
    const threadComments = comments.filter(c => c.threadId === thread.id);
    res.json({ ...thread, comments: threadComments });
});

app.post('/api/threads/:id/comments', (req, res) => {
    const comment = {
        id: comments.length + 1,
        threadId: parseInt(req.params.id),
        content: req.body.content,
        author: req.body.author || 'Anonymous',
        createdAt: new Date(),
        upvotes: 0
    };
    comments.push(comment);
    
    // Update thread comment count
    const thread = threads.find(t => t.id === parseInt(req.params.id));
    if (thread) thread.comments++;
    
    res.json(comment);
});

app.post('/api/threads/:id/upvote', (req, res) => {
    const thread = threads.find(t => t.id === parseInt(req.params.id));
    if (!thread) return res.status(404).json({ error: 'Thread not found' });
    
    thread.upvotes++;
    res.json({ upvotes: thread.upvotes });
});

app.get('/', (req, res) => {
    res.send('<h1>Community Forum API</h1><p>API running. Use /api/threads to access the forum.</p>');
});

app.listen(PORT, () => {
    console.log(`🌐 Community Forum running on http://localhost:${PORT}`);
});
