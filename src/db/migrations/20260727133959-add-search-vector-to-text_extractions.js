import { DataTypes } from 'sequelize';

export async function up(queryInterface) {
  await queryInterface.sequelize.query(`
      ALTER TABLE text_extractions ADD COLUMN search_vector tsvector
        GENERATED ALWAYS AS (to_tsvector('english', text)) STORED;
    `);
  await queryInterface.sequelize.query(`
      CREATE INDEX text_extractions_search_idx ON text_extractions USING GIN (search_vector);
    `);
}

export async function down(queryInterface) {
  await queryInterface.sequelize.query(`DROP INDEX IF EXISTS text_extractions_search_idx;`);
  await queryInterface.sequelize.query(`ALTER TABLE text_extractions DROP COLUMN IF EXISTS search_vector;`);
}
