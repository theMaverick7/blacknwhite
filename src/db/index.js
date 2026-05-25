import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USERNAME,
    process.env.DB_PSWD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres',
        pool: {
            max: 20,
            idle: 30000,
            acquire: 2000,
            evict: 60000
        },
        logging: false
    }
);

export const checkDBConnection = async() => {
    try {
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');
        await sequelize.sync();
        console.log('Database & tables created!');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

export default sequelize;