import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
import logger from '../utils/logger.js';

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
        logger.info('Database connection has been established successfully.');
        await sequelize.sync();
        logger.info('Database synchronized successfully.');
    } catch (error) {
        logger.error('Unable to connect to the database:', error.message);
    }
}

export default sequelize;