import express from "express";
import db from '../db/index.js';
import { postSchema, commentSchema, userSchema } from '../schemas/schema.js'
import { eq } from 'drizzle-orm';
import multer from 'multer';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import auth, {authorizeRole} from '../middleware/auth.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const blobToBase64 = async (blob) => {
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return buffer.toString('base64');
};

router.get('/', (req,res) => {
    res.send('express test');
});

router.post('/register', async (req, res) => {
    try{
        const {username, password} = req.body;
        const salts = 10;
        const hashedPass = await bcrypt.hash(password, salts);      
        await db.insert(userSchema).values({
            username: username,
            password: hashedPass,
            role: 'user'
        });
        console.log(hashedPass);
    } catch(ex){
        console.log(ex);
        res.status(500).json({ error:'REGISTER FAILED'});
    }
});

router.post('/login', async (req, res) => {
    try{
        const {username, password} = req.body;
        const user = await db.select().from(userSchema).where(eq(userSchema.username, username));
        if(user.length === 0 ){
            return res.status(401).json({ error: 'INVALID USERNAME OR PASSWORD'});
        }
        const isPasswordValid = await bcrypt.compare(password, user[0].password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'INVALID PASSWORD'});
        }
        const token = jwt.sign({ userId: user[0].id, role: user[0].role }, 'mysecretkey', {expiresIn: '24h'});
        res.status(200).json({ token });
    } catch(ex){
        console.log(ex);
        res.status(500).json({ message: 'LOGIN FAILED.'})
    }
})

router.get('/posts', auth, async (req, res) => {
    try{
        const posts = await db.select().from(postSchema);
        const Mposts = posts.map(post => {
            let imageBlobUrl = null;
            if(post.imageBlobUrl) {
                const base64Data = `${post.imageBlobUrl}`;
                console.log(base64Data);
                const buffer = Buffer.from(base64Data, 'base64');
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
        res.status(500).json({ error: 'SERVER ERROR'});
    }
});

router.post('/posts', auth, authorizeRole(['admin']), upload.fields([
    { name: 'imageBlobUrl', maxCount: 1 }
  ]), async (req, res) => {
    try{
        const imageFile = req.files['imageBlobUrl'];
        console.log(imageFile);
        const blob = new Blob([imageFile[0].buffer], {type: imageFile[0].mimetype});
        console.log(blob);
        const base64 = await blobToBase64(blob);
        const url = `data:${imageFile[0].mimetype};base64,${base64}`;
        console.log(url);

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

router.get('/posts/:postId/comments', auth, authorizeRole(['admin']), async (req, res) => {
    const id = req.params.postId;
    const comments = await db.select().from(commentSchema).where(eq(commentSchema.postId, id));
    res.status(200).json(comments);
});

router.post('/posts/:postId/comments', auth, authorizeRole(['admin']), async (req, res) => {
    try{
        await db.insert(commentSchema).values({
            postId: req.params.postId,
            text: req.body.text
        });
        res.status(200).json({ message: 'OK'});
    } catch(ex) {
        console.error(ex);
        res.status(500).json({error: 'SERVER ERROR'})
    }
});

router.delete('/comments/:id', auth, authorizeRole(['admin']), async (req, res) => {
    const id = req.params.id;
    try{
        const delCom = await db.delete(commentSchema).where(eq(commentSchema.id, id));
        delCom.rowCount > 0 ? res.status(204).json({ message:'COM DELETE OK'}) : res.status(404).json({ error: 'CANT FIND COMMENT'});
    } catch(ex){
        console.error(ex);
        res.status(500).json({ error:'SERVER ERROR'});
    }
});

export default router;