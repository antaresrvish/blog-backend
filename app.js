import express from 'express';
import login from './src/routes/login.js';
import register from './src/routes/register.js';
import posts from './src/routes/posts.js';
import comments from './src/routes/comments.js';
import likes from './src/routes/likes.js';

const app = express();
const port = 3000;

app.use(express.json())
app.use('/', login);
app.use('/', register);
app.use('/', posts);
app.use('/', comments);
app.use('/', likes);

app.listen(port, () => {
    console.log(`test on ${port}`);
});