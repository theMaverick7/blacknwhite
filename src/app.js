import express from "express";
import testRouter from './routes/test.routes.js';

const app = express();

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

// Mount the test router
app.use('/api/v1/blacknwhite', testRouter);


export default app;