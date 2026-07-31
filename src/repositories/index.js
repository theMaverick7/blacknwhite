import Document_Repository from './document.repository.js';
import Account_Repository from './account.repository.js';
import TextExtraction_Repository from './text_extraction.repository.js';

const DocumentRepository = new Document_Repository();
const AccountRepository = new Account_Repository();
const TextExtractionRepository = new TextExtraction_Repository();

export { DocumentRepository, AccountRepository, TextExtractionRepository };