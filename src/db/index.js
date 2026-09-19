import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
import logger from '../utils/logger.js';
import { PostgreSqlContainer } from '@testcontainers/postgresql';

dotenv.config();

let sequelize;
let postgresContainer;

if (process.env.NODE_ENV === 'test') {
    postgresContainer = await new PostgreSqlContainer('postgres:18.4-alpine')
        .withDatabase(process.env.TEST_DB_NAME)
        .withUsername(process.env.TEST_DB_USERNAME)
        .withPassword(process.env.TEST_DB_PSWD)
        .start();
    sequelize = new Sequelize(postgresContainer.getConnectionUri(), {
        logging: false,
    });

} else if (process.env.NODE_ENV === 'development') {
    sequelize = new Sequelize(
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
}

export const checkDBConnection = async (client) => {
    try {
        await client.authenticate();
        logger.info('Database connection has been established successfully.');
        await client.sync();
        logger.info('Database synchronized successfully.');
    } catch (error) {
        logger.error('Unable to connect to the database:', error.message);
    }
}

export { postgresContainer };
export default sequelize;