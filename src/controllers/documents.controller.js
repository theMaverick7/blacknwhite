

export const Upload = async (req, res) => {
    const Document = req.dbInterface;

    try {
        const uploaded_files = req.files;
        const filesPromises = uploaded_files.map(async (file) => {
            return await Document.create({
                file_name: file.originalname,
                file_type: file.mimetype,
                file_size: file.size,
                storage_path: file.path,
                status: 'pending',
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

export const List = async (req, res) => {
    const Document = req.dbInterface;
    try {
        const documents = await Document.findAll();
        if (documents.length === 0) {
            return res.status(200).json({
                message: 'No documents found for this user',
                data: []
            });
        }

        res.status(200).json({
            message: 'ok',
            data: documents.map(result => {
                return {
                    'filename': result.file_name,
                    'filetype': result.file_type,
                    'size(bytes)': result.file_size,
                    'upload_on': result.upload_date
                }
            })
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Internal server error'
        });
    }
}

export const ListbyId = async (req, res) => {
    const Document = req.dbInterface;
    try {
        const { id } = req.params;
        const document = await Document.findById(id);
        res.status(200).json({
            message: 'ok',
            data: document
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Internal server error'
        });
    }
}