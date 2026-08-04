// worker.js
import boss from "./boss.js";
import { QUEUES } from "./QUEUES.js";
import { fileTypeFromBuffer } from 'file-type';
import { readChunk } from 'read-chunk';
import switcher from "./switcher.js";
import { readFile } from 'node:fs/promises';
import { response } from "./response.js";
import logger from "./logger.js";

async function main() {

  await boss.start();
  await boss.createQueue(QUEUES.EXTRACT_TEXT);

  await boss.work(QUEUES.EXTRACT_TEXT, async ([job]) => {

    const log = logger.child({
      jobId: job.id,
      requestId: job.data[0].request_id,
      userId: job.data[0].user_id,
      docId: job.data[0].doc_id
    });

    log.info(`Job received`);

    let text;

    // Handle plain text files directly
    if (job.data[0].file_type === 'text/plain') {
      text = await readFile(job.data[0].storage_path, 'utf-8');
    } else {

      // checking file-type from the first 4100 bytes of the file
      const buffer = await readChunk(job.data[0].storage_path, { length: 4100 });
      const fileType = await fileTypeFromBuffer(buffer);
      text = await switcher(fileType, job.data[0].storage_path);

    }

    log.info('Text extraction completed, sending results to GET_TEXT queue');

    await boss.send(QUEUES.GET_TEXT, {
      jobId: job.id,
      requestId: job.data[0].request_id,
      userId: job.data[0].user_id,
      docId: job.data[0].doc_id,
      status: 'success',
      extractedText: text,
    });
  });

  logger.info('Workers started. Waiting for jobs...');

  // Keep the process alive
  process.on('SIGINT', async () => {
    logger.flush('Shutting down workers...');
    await boss.stop();
    process.exit(0);
  });
}

main().catch(logger.error);