import express from 'express';
import db from '../db/index.js';
import { commentSchema } from '../schemas/schema.js'
import { eq } from 'drizzle-orm';
import auth, {authorizeRole} from '../middleware/auth.js';

const router = express.Router();

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