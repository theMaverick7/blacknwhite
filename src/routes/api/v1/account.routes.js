import { Router } from 'express';
import * as accountController from '../../../controllers/account.controller.js';
import { accountDbInterface, documentDbInterface } from '../../../middlewares/dbInterface.middleware.js';

const router = Router({ mergeParams: true });

// Create a new account
router.post('/create', accountDbInterface, accountController.Create);

router.route('/:account_id')
    .get(accountDbInterface, accountController.GetById)
    .delete(accountDbInterface, documentDbInterface, accountController.Delete);

// Change password
router.patch('/:account_id/updatePassword', accountDbInterface, accountController.updatePassword);

// change email
router.patch('/:account_id/updateEmail', accountDbInterface, accountController.updateEmail);

// change username
router.patch('/:account_id/updateUsername', accountDbInterface, accountController.updateUsername);

export default router;
