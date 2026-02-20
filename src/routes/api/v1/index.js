import { Router } from "express";
import accountRouter from './account.routes.js';
import documentRouter from './document.routes.js';

const router = Router();

router.use('/account', accountRouter);
router.use('/account/:user_id/documents', documentRouter);

export default router;