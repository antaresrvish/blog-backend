import express from 'express';
import bcrypt from 'bcrypt';
import db from '../db/index.js';
import { userSchema } from '../schemas/schema.js'
const router = express.Router();

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

export default router;