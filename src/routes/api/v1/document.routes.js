import { Router } from 'express';
import * as documentController from '../../../controllers/documents.controller.js';
import upload from '../../../utils/multer.js';
// import { documentDbInterface } from '../../../middlewares/dbInterface.middleware.js'

const router = Router({ mergeParams: true });

// Upload a file
router.post('/upload', upload.array('file(s)'), documentController.Upload);

// List all files for a user
router.get('/list', documentController.List);

// Search documents for a user
router.get('/search', documentController.searchDocuments);

// List a specific file for a user
router.get('/:id', documentController.ListbyId);

// rename a document
router.patch('/:id/rename', documentController.renameDocument);

// delete a document
router.delete('/:id/delete', documentController.deleteDocument)

export default router;