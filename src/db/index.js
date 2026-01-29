import dotenv from 'dotenv';
import { Pool } from 'pg';

// load environment variables
dotenv.config();

const credentials = {
    user: process.env.DB_USERNAME, // database user
    password: process.env.DB_PSWD, // database password
    host: process.env.DB_HOST,     // database host
    port: process.env.DB_PORT,     // database port
    database: process.env.DB_NAME, // database name
};

// create connection pool
const pool = new Pool(credentials);

// handle pool error
pool.on('error', (err) => {
    console.error('unexpected error on idle client', err);
    process.exit(-1);
})

// this function connects to postgresql server
const db_Connection = async() => {
    const client = await pool.connect();
    console.log('postgres database connected successfully');
    return client;
}

export default db_Connection