import * as Document from '../models/documents.model.js';

export const Upload = async(req, res) => {
    try {
        const uploaded_files = req.files;
        const user_id = req.params.user_id;

        const filesPromises = uploaded_files.map(async(file) => {
           return await Document.create({
                file_name: file.originalname,
                file_type: file.mimetype,
                file_size: file.size,
                storage_path: file.path,
                status: 'pending',
                user_id
            });
        });
        
        const documents = await Promise.all(filesPromises);

        res.status(200).json({
            message: 'upload(s) successful',
            'file(s)': documents.length,
            data: documents.map(result => {
                return {
                    'filename': result.file_name,
                    'filetype': result.file_type,
                    'size(bytes)': result.file_size,
                    'upload_on': result.upload_date
                }
            })
        })


    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Internal server error'
        });
    }
}