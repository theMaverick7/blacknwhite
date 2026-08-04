import sequelize from '../db/index.js';
import { apiError } from './apiError.js';
import logger from './logger.js';

export const dbTransaction = async (fn) => {
    try {
        return await sequelize.transaction(fn);
    } catch (error) {
        logger.error('Database Transaction failed:', error.message);
        throw error;
    }
}
