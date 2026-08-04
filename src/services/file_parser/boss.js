import { PgBoss } from 'pg-boss';
import { QUEUES } from './QUEUES.js';
import logger from './logger.js';

const boss = new PgBoss({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PSWD
});

boss.on('error', (err) => logger.error('[pg-boss error]', err));

export default boss;