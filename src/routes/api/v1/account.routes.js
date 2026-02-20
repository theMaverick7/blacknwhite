import { Router } from 'express';
import * as accountController from '../../../controllers/account.controller.js';

const router = Router();


router.post('/create', accountController.Create);








export default router;
