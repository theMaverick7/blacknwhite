import dotenv from 'dotenv';
import app from './app.js';
import { checkDBConnection } from './db/index.js';

// load environment variables
dotenv.config();

// port
const PORT = process.env.PORT || 4000;

// this function spin up the server.
const startServer = async() => {
    try {
        await checkDBConnection();
        app.listen(PORT, async () => {
            console.log(`Server started on port: ${PORT}`);
            try {
                const res = await fetch(`http://localhost:${PORT}/api/v1/health-check/health`);
                const data = await res.json();
                console.log('Health check:', data);
            } catch (error) {
                console.error('Health check failed:', error.message);
            }
        });
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