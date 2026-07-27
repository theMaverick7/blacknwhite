import boss from '../utils/boss.js';
import Document from '../db/models/documents.model.js';
import { QUEUES } from "../constants/QUEUES.js";
import { TextExtractionRepository, DocumentRepository } from "../repositories/index.js";


export async function registerResultsWorker() {
  console.log('W in the chat')
  await boss.work(QUEUES.GET_TEXT, async ([job]) => {
    const textExtraction = await TextExtractionRepository.create({
      text: job.data.extractedText,
    });

    await DocumentRepository.update(
      { status: 'processed', textId: textExtraction.dataValues.id },
      { doc_id: job.data.doc_id }
    );
  });

  process.on('SIGINT', async () => {
    console.log('Shutting down workers...');
    await boss.stop();
    process.exit(0);
  });

}