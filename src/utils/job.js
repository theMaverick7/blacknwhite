// send-job.js
import boss from './boss.js';

export const createJob = async (queue, data) => {
    try {

        const jobId = await boss.send(queue, data, { retryLimit: 3 });
        console.log(`Queued job: ${jobId}`);

    } catch (error) {
        console.log(error);
    }
}