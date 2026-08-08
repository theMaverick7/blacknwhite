import { Router } from 'express';
import * as accountController from '../../../controllers/account.controller.js';
import { authenticateToken } from '../../../middlewares/authentication.middleware.js';

const router = Router({ mergeParams: true });

// Create a new account
router.post('/create', accountController.Create);

// Login
router.post('/login', accountController.login);

// Logout
router.post('/logout', authenticateToken, accountController.logout);

router.route('/:account_id')
    .get(authenticateToken, accountController.GetById)
    .delete(authenticateToken, accountController.Delete);

// Change password
router.patch('/:account_id/updatePassword', authenticateToken, accountController.updatePassword);

// change email
router.patch('/:account_id/updateEmail', authenticateToken, accountController.updateEmail);

// change username
router.patch('/:account_id/updateUsername', authenticateToken, accountController.updateUsername);

export default router;
