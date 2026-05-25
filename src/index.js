import dotenv from 'dotenv';
import app from './app.js';
import sequelize from './db/index.js';
import { checkDBConnection } from './db/index.js';

// load environment variables
dotenv.config();

const PORT = process.env.PORT || 8000;

// this function spin up the server.
const startServer = async() => {
    try {
        await checkDBConnection();
        app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
        app.on('error', (error) => {
            console.error('Error initializing the server: ', error);
            process.exit(1);
        });
    } catch (error) {
        console.error('Error initializing the server: ', error);
        process.exit(1);
    }
}

await startServer();