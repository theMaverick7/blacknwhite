import { BaseRepository } from './base.repository.js';
import TextExtraction from '../db/models/text_extractions.model.js';

export default class TextExtractionRepository extends BaseRepository {
  constructor() {
    super(TextExtraction);
  }

  async searchDocuments(searchTerm, { limit = 20, offset = 0 } = {}) {
    return sequelize.query(
      `
      SELECT
        d.id        AS "documentId",
        d.file_name AS "fileName",
        d.status,
        ts_rank(et.search_vector, query)                                        AS rank,
        ts_headline('english', et.content, query, 'MaxWords=30, MinWords=15')   AS snippet
      FROM text_extractions et
      JOIN documents d ON d.id = et.document_id
      CROSS JOIN websearch_to_tsquery('english', :searchTerm) query
      WHERE et.search_vector @@ query
      ORDER BY rank DESC
      LIMIT :limit OFFSET :offset
      `,
      {
        replacements: { searchTerm, limit, offset },
        type: sequelize.QueryTypes.SELECT,
      }
    );
  }

}