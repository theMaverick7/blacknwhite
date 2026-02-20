import { pool } from '../index.js';
import { randomUUID } from 'node:crypto';

export const create = async(values) => {

    const { 
        file_name,
        file_type,
        file_size,
        storage_path,
        status,
        user_id } = values;

    try {
        const query = `
            INSERT INTO documents (
            doc_id,
            file_name,
            file_type,
            file_size,
            upload_date,
            storage_path,
            status,
            user_id)
                VALUES ($1, $2, $3, $4, now(), $5, $6, $7) RETURNING file_name, file_type, file_size, upload_date`
        ;

        const res = await pool.query(query, [randomUUID(), file_name, file_type, file_size, storage_path, status, user_id]);
        console.log(`${res.command} executed successfully`);
        return res.rows[0];

    } catch (error) {
        throw new Error('Error creating document: ' + error.message);
    }
}