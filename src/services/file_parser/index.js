// worker.js
import boss from "./boss.js";
import { QUEUES } from "./QUEUES.js";
import {fileTypeFromBuffer} from 'file-type';
import {readChunk} from 'read-chunk';

async function main() {

  await boss.start();
  await boss.createQueue(QUEUES.EXTRACT_TEXT);








  await boss.work(QUEUES.EXTRACT_TEXT, async([job]) => {



    console.log(`received job ${job.id} with data ${JSON.stringify(job.data)}`)

    const buffer = await readChunk(job.data[0], {length: 4100});
    console.log(await fileTypeFromBuffer(buffer));



    
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