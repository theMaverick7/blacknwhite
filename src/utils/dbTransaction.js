import { pool } from '../index.js';

export const dbTransaction = async (fn) => {
    await pool.query('BEGIN');
    await fn().catch(async (error) => {
        await pool.query('ROLLBACK');
        console.error('Database Transaction failed');
        throw error;
    })
    await pool.query('COMMIT');
}