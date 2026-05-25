import { DataTypes } from 'sequelize';

export async function up(queryInterface) {
    await queryInterface.createTable('documents', {
        doc_id: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
        },
        file_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        file_type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        file_size: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        storage_path: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'account',
                key: 'account_id',
            },
            onDelete: 'CASCADE',
        },
        upload_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    });
}

export async function down(queryInterface) {
    await queryInterface.dropTable('documents');
}
