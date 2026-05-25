import { Router } from 'express';
import * as accountController from '../../../controllers/account.controller.js';
// import { accountDbInterface, documentDbInterface } from '../../../middlewares/dbInterface.middleware.js';

const router = Router({ mergeParams: true });

// Create a new account
router.post('/create', accountController.Create);

router.route('/:account_id')
    .get(accountController.GetById)
    .delete(accountController.Delete);

// Change password
router.patch('/:account_id/updatePassword', accountController.updatePassword);

// change email
router.patch('/:account_id/updateEmail', accountController.updateEmail);

// change username
router.patch('/:account_id/updateUsername', accountController.updateUsername);

export default router;
