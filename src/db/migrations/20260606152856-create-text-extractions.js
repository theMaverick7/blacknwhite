import { DataTypes } from 'sequelize';

export async function up(queryInterface) {
    await queryInterface.createTable('text_extractions', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
        },
        text: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    });
}

export async function down(queryInterface) {
    await queryInterface.dropTable('text_extractions');
}