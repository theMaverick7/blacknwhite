import {BaseRepository} from './base.repository.js';
import Document from '../db/models/documents.model.js';

export default class DocumentRepository extends BaseRepository {
  constructor() {
    super(Document);
  }

  async findExistingDocument(fileName, userId) {
    return this.model.findOne({
      where: { file_name: fileName, user_id: userId },
    });
  }

  async createDocument(data, options = {}) {
    return this.model.create({...data, status: 'pending'}, options);
  }

  async findStoragePathsByUserId(userId, options = {}) {
        const documents = await this.model.findAll({
            where: { user_id: userId },
            attributes: ['storage_path'],
            ...options,
        });
        return documents.map(d => d.storage_path);
    }

  //   async findPendingParse(limit = 50) {
//     return this.model.findAll({
//       where: { status: 'pending' },
//       limit,
//       order: [['createdAt', 'ASC']],
//     });
//   }

//   async markParsed(id, ocrText, options = {}) {
//     return this.model.update(
//       { status: 'parsed', ocrText, parsedAt: new Date() },
//       { where: { id }, ...options }
//     );
//   }

}


