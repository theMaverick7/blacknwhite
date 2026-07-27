import { DataTypes } from 'sequelize';

export async function up(queryInterface) {
  await queryInterface.addColumn('documents', 'textId', {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'text_extractions',
      key: 'id',
    },
    onDelete: 'CASCADE',
  });
}

export async function down(queryInterface) {
  await queryInterface.removeColumn('documents', 'textId');
}
