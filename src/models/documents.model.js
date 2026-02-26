import { pool } from '../index.js';
import { randomUUID } from 'node:crypto';
import { mimeTypes } from '../constants/mimetypes.js';

export default class Document {
    constructor(userId) {
        this.userId = userId;
    }

    // Create a new document record in the database

    async create(values) {
        const {
            file_name,
            file_type,
            file_size,
            storage_path,
            status } = values;

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
                    VALUES ($1, $2, $3, $4, now(), $5, $6, $7)
                    RETURNING file_name, file_type, file_size, upload_date
                `;

            const res = await pool.query(query, [randomUUID(), file_name, file_type, file_size, storage_path, status, this.userId]);
            console.log(`${res.command} executed successfully`);
            return res.rows[0];

        } catch (error) {
            throw new Error('Error creating document: ' + error.message);
        }
    }

    // Retrieve all documents for a specific user

    async findAll(filter) {
        let queryMimeType;
        try {
            // for all documents of a user
            if (!filter) {
                const query = 'SELECT * FROM documents WHERE user_id = $1';
                const res = await pool.query(query, [this.userId]);
                return res.rows;
            }

            if (filter && Object.keys(filter)[0] === 'type') {
                for (const [key, value] of Object.entries(mimeTypes)) {
                    if (key === filter.type) {
                        queryMimeType = value;
                    }
                }
            }

            // for documents of a user with a specific file type
            const query = 'SELECT * FROM documents WHERE user_id = $1 AND file_type = $2';
            const res = await pool.query(query, [this.userId, queryMimeType]);
            return res.rows;


        } catch (error) {
            console.error(error);
            throw new Error('Error finding documents: ' + error.message);
        }
    }

    // Retrieve a document by its ID

    async findById(id) {
        try {
            const query = 'SELECT * FROM documents WHERE user_id = $1 AND doc_id = $2';
            const res = await pool.query(query, [this.userId, id]);
            return res.rows[0];

        } catch (error) {
            console.error(error);
            throw new Error('Error finding document: ' + error.message);
        }
    }

}
