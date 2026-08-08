import express from "express";
import apiv1Router from './routes/api/v1/index.js';
import cors from 'cors';
import logger from './utils/logger.js';
import pinoHttp from 'pino-http';
import cookieParser from 'cookie-parser';

const app = express();

// CORS
app.use(cors());

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

// pino http logger
app.use(pinoHttp({ logger }));

// cookie parser
app.use(cookieParser());

// API v1
app.use('/api/v1', apiv1Router);

// log errors
app.use((err, req, res, next) => {
    req.log.error(err);
    next(err);
});

// api error handler
app.use((err, req, res, next) => {

    if (!err.statusCode) {
        res.status(500).json({
            message: 'Internal Server Error'
        });
        return;
    }

    res.status(err.statusCode).json({
        message: err.message || 'something went wrong'
    });
})

export default app;