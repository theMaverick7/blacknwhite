// worker.js
import boss from "./boss.js";
import { QUEUES } from "./QUEUES.js";
import { fileTypeFromBuffer } from 'file-type';
import { readChunk } from 'read-chunk';
import switcher from "./switcher.js";
import { readFile } from 'node:fs/promises';
import { response } from "./response.js";
//import Document from '../../db/models/documents.model.js';

async function main() {

  await boss.start();
  await boss.createQueue(QUEUES.EXTRACT_TEXT);

  await boss.work(QUEUES.EXTRACT_TEXT, async ([job]) => {

    console.log(`received job ${job.id} with data ${JSON.stringify(job.data)}`);

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

    await boss.send(QUEUES.GET_TEXT, {
      status: 'success',
      doc_id: job.data[0].doc_id,
      extractedText: text,
    });

    // await Document.update({ status: 'processed' }, {
    //   where: {
    //     doc_id: job.data[0].doc_id
    //   }
    // });

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