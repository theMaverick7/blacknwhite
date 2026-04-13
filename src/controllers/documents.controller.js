import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";
import { rename, unlink } from 'node:fs';
import { dbTransaction } from "../utils/dbTransaction.js";

// This function handles document uploads and saves metadata to the database
export const Upload = asyncHandler(async (req, res) => {
    const Document = req.documentDbInterface;
    console.log(req.files);
    const duplicates = [];

    await Promise.all(req.files.map(async (file) => {
        const val = await Document.duplicateCheck(file.filename);
        if (val) {
            duplicates.push(val);
        }
    }));

    console.log(duplicates);

    if (duplicates.length !== 0) throw new apiError(400, 'document(s) with the same name already exists');

    const filesPromises = req.files.map(async (file) => {
        return await Document.create({
            file_name: file.originalname,
            file_type: file.mimetype,
            file_size: file.size,
            storage_path: file.path,
            status: 'pending',
        });
    });

    const documents = await Promise.all(filesPromises);

    res.status(200).json(new apiResponse(
        200,
        documents.map(doc => {
            return {
                'filename': doc.file_name,
                'filetype': doc.file_type,
                'size(bytes)': doc.file_size,
                'upload_on': doc.upload_date
            }
        }),
        'Files uploaded successfully'
    ));
})

// This function lists all documents for a user
export const List = asyncHandler(async (req, res) => {
    const Document = req.documentDbInterface;
    const filter = Object.keys(req.query).length > 0 ? req.query : null;

    const documents = await Document.findAll(filter, {
        RETURN: ['file_name', 'file_type', 'file_size', 'upload_date']
    });
    if (documents.length === 0) {
        return res.status(200).json(new apiResponse(200, null, 'No documents found'));
    }

    res.status(200).json(new apiResponse(200, documents.map(doc => {
        return {
            'filename': doc.file_name,
            'filetype': doc.file_type,
            'size(bytes)': doc.file_size,
            'upload_on': doc.upload_date
        }
    }), 'Documents retrieved successfully'));
})

// This function retrieves a document by its ID
export const ListbyId = asyncHandler(async (req, res) => {
    const Document = req.documentDbInterface;
    const { id } = req.params;
    const document = await Document.findById(id);
    if (!document) {
        throw new apiError(404, 'Document not found');
    }

    res.status(200).json(new apiResponse(200, {
        'filename': document.file_name,
        'filetype': document.file_type,
        'size(bytes)': document.file_size,
        'upload_on': document.upload_date.toString()
    }, 'Document retrieved successfully'));
});

// this function renames a document
export const renameDocument = asyncHandler(async (req, res) => {
    const Document = req.documentDbInterface;
    await dbTransaction(async () => {
        const { id } = req.params;
        const { newName } = req.body;

        const document = await Document.findById(id, { RETURN: ['file_name', 'storage_path'] });
        if (!document) throw new apiError(404, 'Document not found');

        const originalName = document.file_name.slice(0, document.file_name.lastIndexOf('.'));
        const updatedName = document.file_name.replace(originalName, newName);
        const updatedStoragePath = document.storage_path.replace(originalName, newName);

        await Document.update('file_name', updatedName, id);
        await Document.update('storage_path', updatedStoragePath, id)

        rename(document.storage_path, updatedStoragePath, (err) => {
            if (err) throw err;
            console.log('Rename complete!');
        });
    });

    res.status(200).json(new apiResponse(200, null, 'Document renamed successfully'));
});

// this function deletes a document
export const deleteDocument = asyncHandler(async (req, res) => {
    const Document = req.documentDbInterface;
    const { id } = req.params;

    await dbTransaction(async () => {
        const rows = await Document.delete(id);
        const path = rows[0].storage_path;
        unlink(path, (err) => {
            if (err) throw err;
            console.log('File deleted');
        })
    })

    res.status(200).json(new apiResponse(
        200,
        null,
        'Document deleted successfully'
    ));
})



