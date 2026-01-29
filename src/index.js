import dotenv from 'dotenv';
import db_Connection from "./db/index.js";
import app from './app.js';

// load environment variables
dotenv.config();

const PORT = process.env.PORT || 8000;

// this function spin up the server.
const startServer = async() => {
    try {
        const client = await db_Connection();
        app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
        app.on('error', (error) => {
            throw error;
        });
        return client;
    } catch (error) {
        console.error('Error initializing the server: ', error);
        process.exit(1);
    }
}

const client = await startServer();
export {client}