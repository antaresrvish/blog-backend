import express from 'express';
import db from '../db/index.js';
import { likeSchema } from '../schemas/schema.js'
import auth, {authorizeRole} from '../middleware/auth.js';
import { eq, and } from "drizzle-orm";

const router = express.Router();

router.post('/posts/:id/like', auth, async(req, res) => {
    const postId = req.params.id;
    const userId = req.body;
    try{
        const likePost = await db.insert(likeSchema).values({
            userId: userId.userId,
            postId: postId
        });
        res.status(204).json({ message: 'OK'});
    } catch(ex){
        console.log(ex);
        res.status(500).json({ error: 'SERVER ERROR'});
    }
});

router.delete('/posts/:id/like', auth, async(req, res) => {
    const postId = req.params.id;
    const userId = req.body;
    try{
        const takeBackLike = await db.delete(likeSchema).where(and(eq(likeSchema.userId, userId.userId), eq(likeSchema.postId, postId)));
        takeBackLike.rowCount > 0 ? res.status(204).json({ message: 'LIKE DELETE OK'}) : res.status(404).json({ error: 'CANT FIND LIKE'});
    } catch(ex){
        console.log(ex);
        res.status(500).json({ error: 'SERVER ERROR'});
    }
});

export default router;