import { pool } from '../index.js';
import { randomUUID } from 'node:crypto';

export const create = async(values) => {

    const { username, email, hashedPassword } = values;

    try {
        const query = `
        INSERT INTO account (account_id, username, email, password_hash, created_at)
        VALUES ($1, $2, $3, $4, now()) RETURNING username, email, created_at
        `
        ;
        const res = await pool.query(query, [randomUUID(), username, email, hashedPassword]);
        console.log(`${res.command} executed successfully`);
        return res.rows[0];

    } catch (error) {
        throw new Error('Error creating account: ' + error.message);
    }
}