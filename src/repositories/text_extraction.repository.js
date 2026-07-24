import {BaseRepository} from './base.repository.js';
import TextExtraction from '../db/models/text_extractions.model.js';

export default class TextExtractionRepository extends BaseRepository {
  constructor() {
    super(TextExtraction);
  }

//   async findPendingParse(limit = 50) {
//     return this.model.findAll({
//       where: { status: 'pending' },
//       limit,
//       order: [['createdAt', 'ASC']],
//     });
//   }

//   async markParsed(id, ocrText, options = {}) {}
//     return this.model.update(
//       { status: 'parsed', ocrText, parsedAt: new Date() },
//       { where: { id }, ...options }
//     );
//   }
}