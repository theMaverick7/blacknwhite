import { Router } from 'express';
import * as documentController from '../../../controllers/documents.controller.js';
import upload from '../../../utils/multer.js';
import dbInterfaceMiddleware from '../../../middlewares/dbInterface.middleware.js';

const router = Router({ mergeParams: true });

const setUser = (req, res, next) => {
    req.user_id = req.params.user_id;
    next();
}

// Upload a file
router.post('/upload', dbInterfaceMiddleware, upload.array('file(s)'), documentController.Upload);

// List all files for a user
router.get('/list', dbInterfaceMiddleware, documentController.List);

router.get('/list/:id', dbInterfaceMiddleware, documentController.ListbyId);

// Read a file
router.get('/read/:doc_id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await query('SELECT * FROM documents WHERE doc_id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'File not found'
            });
        }

        const fileData = result.rows[0];

        // const buffer = await readFile(fileData.storage_path);
        // const parsed = await parsePDF(buffer);
        // console.log(typeof parsed.text);


        // const response = await readFile(fileData.storage_path);
        // const str = response.join('\n');

        // const parsed = await parsePDF(str);
        // console.log(parsed.text);


        res.status(200).json({
            message: 'File retrieved successfully',
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Internal server error'
        });
    }
});

export default router;