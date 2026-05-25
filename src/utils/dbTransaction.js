import sequelize from '../db/index.js';
import { apiError } from './apiError.js';

export const dbTransaction = async (fn) => {
    try {
        return await sequelize.transaction(fn);
    } catch (error) {
        console.error('Database Transaction failed');
        throw error;
    }
}
