import boss from '../utils/boss.js';
import Document from '../db/models/documents.model.js';
import {QUEUES} from "../constants/QUEUES.js";

export async function registerResultsWorker() {
    console.log('W in the chat')
  await boss.work(QUEUES.GET_TEXT, async ([job]) => {
    console.log(job);
    // await Document.update({ status: 'processed' }, {
    //   where: {
    //     doc_id: uploadId
    //   }
    // });
  });

  process.on('SIGINT', async () => {
    console.log('Shutting down workers...');
    await boss.stop();
    process.exit(0);
  });
  
}