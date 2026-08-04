// send-job.js
import boss from './boss.js';
import logger from './logger.js';

export const createJob = async (queue, data) => {
    try {

        const jobId = await boss.send(queue, data, { retryLimit: 3 });
        logger.info(`Queued job: ${jobId}`);

    } catch (error) {
        logger.error(`Error creating job in queue ${queue}:`, error.message);
    }
}