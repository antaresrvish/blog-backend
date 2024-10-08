import express from 'express';
import bcrypt from 'bcrypt';
import db from '../db/index.js';
import { userSchema } from '../schemas/schema.js'
const router = express.Router();

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a user.
 *     parameters:
 *       - in: path
 *         name: username
 *         schema:
 *           type: string
*            required: true
*            properties:
*           
 *         description: username
 *          
 *     responses:
 *       '200':
 *         description: A successful response
 *       '500':
 *         description: Internal server error
 */

router.post('/register', async (req, res) => {
    try{
        const {username, password} = req.body;
        const salts = 10;
        const hashedPass = await bcrypt.hash(password, salts);      
        await db.insert(userSchema).values({
            username: username,
            password: hashedPass,
        });
        console.log(hashedPass);
        res.status(200).json({ message: 'REGISTER OK'});
    } catch(ex){
        console.log(ex);
        res.status(500).json({ error:'REGISTER FAILED'});
    }
});

export default router;