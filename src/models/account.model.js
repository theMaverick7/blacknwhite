import { pool } from '../index.js';
import { randomUUID } from 'node:crypto';


export default class Account {
    constructor(userId) {
        this.userId = userId;
    }

    // Create a new account record in the database
    async create(values) {
        const { username, email, hashedPassword } = values;

        try {
            const query = `
            INSERT INTO account (account_id, username, email, password_hash, created_at)
            VALUES ($1, $2, $3, $4, now()) RETURNING username, email, created_at
            `;
            const res = await pool.query(query, [randomUUID(), username, email, hashedPassword]);
            console.log(`${res.command} executed successfully`);
            return res.rows[0];

        } catch (error) {
            throw new Error('Error creating account: ' + error.message);
        }
    }

    // Retrieve an account by id
    async findById({ 'return': valuestr }) {
        try {
            const query = `SELECT ${valuestr || '*'} FROM account WHERE account_id = $1`;
            const res = await pool.query(query, [this.userId]);
            return res.rows[0];
        } catch (error) {
            throw new Error('Error retrieving account: ' + error.message);
        }
    }

    // Update an account
    async update(field, value) {
        try {
            const query = `UPDATE account SET ${field} = $1 WHERE account_id = $2`;
            await pool.query(query, [value, this.userId]);
        } catch (error) {
            throw new Error('Error updating account: ' + error.message);
        }
    }
}
