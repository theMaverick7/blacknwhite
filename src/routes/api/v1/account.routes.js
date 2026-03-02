import { Router } from 'express';
import * as accountController from '../../../controllers/account.controller.js';
import { accountDbInterface } from '../../../middlewares/dbInterface.middleware.js';

const router = Router({ mergeParams: true });

// Create a new account
router.post('/create', accountDbInterface, accountController.Create);

// Retrieve an account by id
router.get('/:account_id', accountDbInterface, accountController.GetById);

// Change password
router.post('/:account_id/updatePassword', accountDbInterface, accountController.updatePassword);


export default router;
