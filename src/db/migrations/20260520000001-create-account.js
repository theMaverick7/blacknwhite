import { DataTypes } from 'sequelize';

export async function up(queryInterface) {
    await queryInterface.createTable('account', {
        account_id: {
            type: DataTypes.UUID,
            primaryKey: true,
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
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    });
}

export async function down(queryInterface) {
    await queryInterface.dropTable('account');
}
