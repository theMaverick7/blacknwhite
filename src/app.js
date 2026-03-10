import express from "express";
import apiv1Router from './routes/api/v1/index.js';

const app = express();

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

// API v1
app.use('/api/v1', apiv1Router);

// log errors
app.use((err, req, res, next) => {
    console.error(err.stack);
    next(err);
});

// error handler
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