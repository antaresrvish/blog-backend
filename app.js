import express from 'express';
import db from './src/db/index.js';
const app = express();
const port = 3000;


app.get('/', (req,res) => {
    res.send('express test');
});

app.listen(port, () => {
    console.log(`test on ${port}`);
})