import { Router } from "express";
import { client } from "../index.js";

const router = Router();

// test router
router.get('/', async(req, res) => {
    const query = 'SELECT * FROM users';
    const response = await client.query(query);
    client.release();
    console.log(`${response.command} executed successfully`);
    console.log(response.rows[0]);
    res.send('done');
})

export default router;