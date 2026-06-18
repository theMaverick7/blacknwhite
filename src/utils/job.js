// send-job.js
import boss from './boss.js';

export const createJob = async (queue, data) => {
    try {
        await boss.start();

        const jobId = await boss.send(queue, data, { retryLimit: 3 });
        console.log(`Queued job: ${jobId}`);

        await boss.stop();
    } catch (error) {
        console.log(error);
    }
}