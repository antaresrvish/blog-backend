import express from 'express';
import db from '../db/index.js';
import { postSchema } from '../schemas/schema.js'
import { eq } from 'drizzle-orm';
import multer from 'multer';
import auth, {authorizeRole} from '../middleware/auth.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
const blobToBase64 = async (blob) => {
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return buffer.toString('base64');
};

router.get('/posts', auth, async (req, res) => {
    try{
        const posts = await db.select().from(postSchema);
        const Mposts = posts.map(post => {
            let imageBlobUrl = null;
            if(post.imageBlobUrl) {
                const base64Data = `${post.imageBlobUrl}`;
                const buffer = Buffer.from(base64Data, 'base64');
                const blob = new Blob([buffer], { type: 'image/png' });
                imageBlobUrl = URL.createObjectURL(blob);
            }
            return {
                ...post,
                imageBlobUrl
            }
        });
        res.status(200).json(Mposts);
    } catch(ex) {
        console.error(ex);
        res.status(500).json({ error: 'SERVER ERROR'});
    }
});

router.post('/posts', auth, authorizeRole(['admin']), upload.fields([
    { name: 'imageBlobUrl', maxCount: 1 }
  ]), async (req, res) => {
    try{
        const imageFile = req.files['imageBlobUrl'];
        const blob = new Blob([imageFile[0].buffer], {type: imageFile[0].mimetype});
        const base64 = await blobToBase64(blob);
        const url = `data:${imageFile[0].mimetype};base64,${base64}`;
        await db.insert(postSchema).values({
            title: req.body.title,
            description: req.body.description,
            content: req.body.content,
            tags: req.body.tags,
            author: req.body.author,
            imageBlobUrl: url
        });
        res.status(200).json({ message: 'OK'});
    } catch(ex) {
        console.error(ex);
        res.status(500).json({ error: 'SERVER ERROR'});
    }
});

router.delete('/posts/:id', auth, authorizeRole(['admin']), async (req, res) => {
    const id = req.params.id;
    try {
        const delRow = await db.delete(postSchema).where(eq(postSchema.id, id));
        delRow.rowCount > 0 ? res.status(204).json({ message: 'POST DELETE OK'}) : res.status(404).json({ error: 'CANT FIND POST'});
    } catch(ex) {
        console.error(ex);
        res.status(500).json({ error: 'SERVER ERROR'});
    }
});

export default router;