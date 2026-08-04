import dotenv from 'dotenv';
import app from './app.js';
import { checkDBConnection } from './db/index.js';
import { registerResultsWorker } from './workers/fileParserWorker.js';
import boss from './utils/boss.js';
import { QUEUES } from './constants/QUEUES.js';
import logger from './utils/logger.js';

// load environment variables
dotenv.config();

// port
const PORT = process.env.PORT || 4000;

// this function spin up the server.
const startServer = async() => {
    try {
        await checkDBConnection();
        app.listen(PORT, async () => {
            logger.info(`Server is running on port ${PORT}`);
            try {
                const res = await fetch(`http://localhost:${PORT}/api/v1/health-check/health`);
                const data = await res.json();
                logger.info('Health check:', data);
            } catch (error) {
                logger.error('Health check failed:', error.message);
            }
        });
        app.on('error', (error) => {
            logger.error('Error initializing the server: ', error);
            process.exit(1);
        });
    } catch (error) {
        logger.error('Error initializing the server: ', error);
        process.exit(1);
    }
}

await startServer().then(async() => {
    await boss.start();
    await boss.createQueue(QUEUES.GET_TEXT);
    await registerResultsWorker();
    logger.info('Workers started. Waiting for jobs...');
});