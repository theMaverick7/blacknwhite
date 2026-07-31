import { Model, DataTypes } from 'sequelize';
import sequelize from '../index.js';

class Document extends Model {
    static associate(models) {
        // define associations here
    }
}

Document.init(
    {
        doc_id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
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
        },
        textId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'text_extractions',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
    },
    {
        sequelize,
        modelName: 'Document',
        tableName: 'documents',
        timestamps: true,
        createdAt: 'upload_date',
        updatedAt: false,
    }
);

export default Document;
