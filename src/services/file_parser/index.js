// worker.js
import boss from "./boss.js";
import { QUEUES } from "./QUEUES.js";
import { fileTypeFromBuffer } from 'file-type';
import { readChunk } from 'read-chunk';
import switcher from "./switcher.js";
import {readFile} from 'node:fs/promises';

async function main() {

  await boss.start();
  await boss.createQueue(QUEUES.EXTRACT_TEXT);



  await boss.work(QUEUES.EXTRACT_TEXT, async ([job]) => {

    console.log(`received job ${job.id} with data ${JSON.stringify(job.data)}`);

    if(job.data[0].file_type === 'text/plain') {
      const buffer = await readFile(job.data[0].storage_path, 'utf-8');
      console.log(`result for job ${job.id}: ${JSON.stringify(buffer)}`);
      return;
    }

    const buffer = await readChunk(job.data[0].storage_path, { length: 4100 });
    const fileType = await fileTypeFromBuffer(buffer);

    const result = await switcher(fileType, job.data[0].storage_path);
    console.log(`result for job ${job.id}: ${JSON.stringify(result)}`);

  });



  console.log('Workers started. Waiting for jobs...');

  // Keep the process alive
  process.on('SIGINT', async () => {
    console.log('Shutting down workers...');
    await boss.stop();
    process.exit(0);
  });
}

main().catch(console.error);