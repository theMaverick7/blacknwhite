import { BaseRepository } from './base.repository.js';
import TextExtraction from '../db/models/text_extractions.model.js';
import sequelize from '../db/index.js';

export default class TextExtractionRepository extends BaseRepository {
  constructor() {
    super(TextExtraction);
  }

  async searchDocuments(searchTerm, { limit = 20, offset = 0 } = {}) {
    return sequelize.query(
      `
    SELECT
      d.doc_id    AS "documentId",
      d.file_name AS "fileName",
      d.status,
      ts_rank(te.search_vector, query)                                     AS rank,
      ts_headline('english', te.text, query, 'MaxWords=30, MinWords=15')   AS snippet
    FROM documents d
    JOIN text_extractions te ON te.id = d."textId"
    CROSS JOIN websearch_to_tsquery('english', :searchTerm) query
    WHERE te.search_vector @@ query
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