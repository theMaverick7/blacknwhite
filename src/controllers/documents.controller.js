import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";
import { rename, unlink } from 'node:fs/promises';
import { dbTransaction } from "../utils/dbTransaction.js";
import { DocumentRepository, TextExtractionRepository } from "../repositories/index.js";
import { createJob } from "../utils/job.js";
import { QUEUES } from "../constants/QUEUES.js";

export const Upload = asyncHandler(async (req, res) => {
    const { user_id } = req.params;
    const duplicates = [];

    await Promise.all(req.files.map(async (file) => {
        const existing = await DocumentRepository.findExistingDocument(file.originalname, user_id);
        if (existing) duplicates.push(file.originalname);
    }));

    if (duplicates.length !== 0)
        throw new apiError(400, 'document(s) with the same name already exists');

    const documents = await Promise.all(req.files.map(file =>
        DocumentRepository.createDocument({
            user_id,
            file_name: file.originalname,
            file_type: file.mimetype,
            file_size: file.size,
            storage_path: file.path,
        })
    ));

    await Promise.all(documents.map(async (doc) => {
        await createJob(QUEUES.EXTRACT_TEXT, [{
            doc_id: doc.doc_id,
            storage_path: doc.storage_path,
            file_type: doc.file_type,
        }]);
    }));


    res.status(200).json(new apiResponse(
        200,
        documents.map(doc => ({
            filename: doc.file_name,
            filetype: doc.file_type,
            'size(bytes)': doc.file_size,
            upload_on: doc.upload_date
        })),
        'Files uploaded successfully'
    ));
});

export const List = asyncHandler(async (req, res) => {
    const { user_id } = req.params;
    const filter = Object.keys(req.query).length > 0 ? req.query : {};

    const documents = await DocumentRepository.findAll(
        { user_id, ...filter },
        ['file_name', 'file_type', 'file_size', 'upload_date']
    );

    if (documents.length === 0) {
        return res.status(200).json(new apiResponse(200, null, 'No documents found'));
    }

    res.status(200).json(new apiResponse(200, documents.map(doc => ({
        filename: doc.file_name,
        filetype: doc.file_type,
        'size(bytes)': doc.file_size,
        upload_on: doc.upload_date
    })), 'Documents retrieved successfully'));
});

export const ListbyId = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const document = await DocumentRepository.findById(id);
    if (!document) throw new apiError(404, 'Document not found');

    res.status(200).json(new apiResponse(200, {
        filename: document.file_name,
        filetype: document.file_type,
        'size(bytes)': document.file_size,
        upload_on: document.upload_date.toString()
    }, 'Document retrieved successfully'));
});

export const renameDocument = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { newName } = req.body;

    await dbTransaction(async (t) => {
        const document = await DocumentRepository.findById(id, {
            attributes: ['doc_id', 'file_name', 'storage_path'],
            transaction: t
        });
        if (!document) throw new apiError(404, 'Document not found');

        const originalName = document.file_name.slice(0, document.file_name.lastIndexOf('.'));
        const updatedName = document.file_name.replace(originalName, newName);
        const updatedStoragePath = document.storage_path.replace(originalName, newName);

        await rename(document.storage_path, updatedStoragePath);
        await DocumentRepository.update({ file_name: updatedName, storage_path: updatedStoragePath }, { doc_id: document.doc_id }, { transaction: t });
    });

    res.status(200).json(new apiResponse(200, null, 'Document renamed successfully'));
});

export const deleteDocument = asyncHandler(async (req, res) => {
    const { id } = req.params;

    let storagePath;
    await dbTransaction(async (t) => {
        const document = await DocumentRepository.findById(id, {
            attributes: ['doc_id', 'storage_path'],
            transaction: t
        });
        if (!document) throw new apiError(404, 'Document not found');

        storagePath = document.storage_path;
        await DocumentRepository.delete({ doc_id: document.doc_id }, { transaction: t });
    });

    await unlink(storagePath);
    res.status(200).json(new apiResponse(200, null, 'Document deleted successfully'));
});

export const searchDocuments = asyncHandler(async (req, res) => {
    const { q, limit, offset } = req.query;
    const results = await TextExtractionRepository.searchDocuments(q, { limit, offset });

    res.status(200).json(new apiResponse(200, results, 'Search completed successfully'));
});