import boss from '../utils/boss.js';
import Document from '../db/models/documents.model.js';
import { QUEUES } from "../constants/QUEUES.js";
import { TextExtractionRepository, DocumentRepository } from "../repositories/index.js";
import logger from '../utils/logger.js';

export async function registerResultsWorker() {

  await boss.work(QUEUES.GET_TEXT, async ([job]) => {

    const log = logger.child({
      jobId: job.id,
      requestId: job.data.requestId,
      userId: job.data.userId,
      docId: job.data.docId
    });

    log.info('Extracted text received, writing to database...');

    const textExtraction = await TextExtractionRepository.create({
      text: job.data.extractedText,
    });

    const textId = textExtraction.dataValues.id;

    await DocumentRepository.update(
      { status: 'processed', textId: textId },
      { doc_id: job.data.docId }
    );

    log.info('Text written to database for doc_id');

  });

  logger.info('Workers started. Waiting for jobs...');

  // Keep the process alive
  process.on('SIGINT', async () => {
    logger.flush('Shutting down workers...');
    await boss.stop();
    process.exit(0);
  });
}