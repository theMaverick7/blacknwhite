'use strict';

import { Model, DataTypes } from 'sequelize';
import sequelize from '../index.js';


class TextExtractions extends Model {
    static associate(models) {
        // define associations here
    }
}

TextExtractions.init({
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
  }, {
    sequelize,
    modelName: 'TextExtractions',
    tableName: 'text_extractions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  });

  export default TextExtractions;