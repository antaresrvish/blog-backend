import express from 'express';
import bcrypt from 'bcrypt';
import db from '../db/index.js';
import { userSchema } from '../schemas/schema.js'
import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';
const router = express.Router();

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
        const token = jwt.sign({ userId: user[0].id, role: user[0].role }, process.env.JWT_KEY, {expiresIn: '24h'});
        res.status(200).json({ token });
    } catch(ex){
        console.log(ex);
        res.status(500).json({ message: 'LOGIN FAILED.'})
    }
});

export default router;