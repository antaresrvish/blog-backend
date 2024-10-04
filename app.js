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

app.get('/posts', async (req, res) => {
    try{
        const posts = await db.select().from(postSchema);
        const Mposts = posts.map(post => {
            let imageBlobUrl = null;
            if(post.imageBlobUrl) {
                const base64Data = `data:image/png;base64,${post.imageBlobUrl}`;
                const buffer = Buffer.from(base64Data.split(',')[1], 'base64');
                console.log(buffer);
                const blob = new Blob([buffer], { type: 'image/png' });
                console.log(blob);
                imageBlobUrl = URL.createObjectURL(blob);
                console.log(imageBlobUrl);
            }
            return {
                ...post,
                imageBlobUrl
            }
        });
        res.status(200).json(Mposts);
    } catch(ex) {
        console.error(ex);
        res.status(500).send('SERVER ERROR')
    }
});

app.post('/posts', async (req, res) => {
    try{
        await db.insert(postSchema).values({
            title: req.body.title,
            description: req.body.description,
            content: req.body.content,
            tags: req.body.tags,
            author: req.body.author,
            imageBlobUrl: req.body.imageBlobUrl,
        });
        res.status(200).send('OK');
    } catch(ex) {
        console.error(ex);
        res.status(500).send('SERVER ERROR');
    }
});

app.delete('/posts/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const delRow = await db.delete(postSchema).where(eq(postSchema.id, id));
        delRow.rowCount > 0 ? res.status(204).send('POST DELETE OK') : res.status(404).send('CANT FIND POST');
    } catch(ex) {
        console.error(ex);
        res.status(500).send('SERVER ERROR');
    }
});

app.get('/posts/:postId/comments', async (req, res) => {
    const id = req.params.postId;
    const comments = await db.select().from(commentSchema).where(eq(commentSchema.postId, id));
    res.status(200).json(comments);
});

app.post('/posts/:postId/comments', async (req, res) => {
    try{
        await db.insert(commentSchema).values({
            postId: req.params.postId,
            text: req.body.text
        });
        res.status(200).send('OK');
    } catch(ex) {
        console.error(ex);
        res.status(500).send('SERVER ERROR')
    }
});

app.delete('/comments/:id', async (req, res) => {
    const id = req.params.id;
    try{
        const delCom = await db.delete(commentSchema).where(eq(commentSchema.id, id));
        delCom.rowCount > 0 ? res.status(204).send('COM DELETE OK') : res.status(404).send('CANT FIND COMMENT');
    } catch(ex){
        console.error(ex);
        res.status(500).send('SERVER ERROR');
    }
});

app.listen(port, () => {
    console.log(`test on ${port}`);
});