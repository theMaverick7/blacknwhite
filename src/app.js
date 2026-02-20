import express from "express";
import apiv1Router from './routes/api/v1/index.js';

const app = express();

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));

// Parse JSON bodies (as sent by API clients)
app.use(express.json());


// app.use('/api/v1/blacknwhite', testRouter);
// app.use('/api/v1/:user_id/documents', documentRouter);
// app.use('/api/v1/account', accountRouter);

app.use('/api/v1', apiv1Router);


export default app;