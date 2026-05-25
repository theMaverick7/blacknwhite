import { Model, DataTypes } from 'sequelize';
import sequelize from '../index.js';

class Account extends Model {
    static associate(models) {
        // define associations here
    }
}

Account.init(
    {
        account_id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password_hash: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'Account',
        tableName: 'account',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false,
    }
);

export default Account;