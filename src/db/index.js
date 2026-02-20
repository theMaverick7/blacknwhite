import dotenv from 'dotenv';
import { Pool } from 'pg';

// load environment variables
dotenv.config();

const config = {
    user: process.env.DB_USERNAME, // database user
    password: process.env.DB_PSWD, // database password
    host: process.env.DB_HOST,     // database host
    port: process.env.DB_PORT,     // database port
    database: process.env.DB_NAME, // database name
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
    maxLifetimeSeconds: 60
};





// this function connects to postgresql server
const db_Connection = async() => {
    const pool = new Pool(config);
    try {
        await pool.query('SELECT NOW()'); // Test the connection
        console.log('Connected to the database successfully');
        return pool;
    } catch (error) {
        pool.end(); // Close the pool if connection fails
        throw new Error('Error connecting to the database: ' + error.message);
    }
}

export default db_Connection