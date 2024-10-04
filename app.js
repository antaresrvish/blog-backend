import express from 'express';
import db from './src/db/index.js';
import { postSchema, commentSchema } from './src/schemas/schema.js'
import { eq } from 'drizzle-orm';
import { ExecuteResultSync } from 'drizzle-orm/sqlite-core';
const app = express();
const port = 3000;

app.use(express.json())

app.get('/', (req,res) => {
    res.send('express test');
});

app.post('/create', async (req, res, next) => {
    await db.insert(postSchema).values({
        title: req.body.title,
        content: req.body.content,
        imageBlobUrl: req.body.imageBlobUrl,
    });
    return res.send('ok');
})

app.listen(port, () => {
    console.log(`test on ${port}`);
})