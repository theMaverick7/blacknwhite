import { hashPassword, comparePassword } from '../utils/bcrypt.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { apiResponse } from '../utils/apiResponse.js';
import { apiError } from '../utils/apiError.js';
import { unlink } from 'node:fs/promises';
import { dbTransaction } from '../utils/dbTransaction.js';
import { AccountRepository, DocumentRepository } from "../repositories/index.js";

export const Create = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    const existing = await AccountRepository.findOne({ username });
    if (existing) throw new apiError(400, 'Username already exists');

    const hashedPassword = await hashPassword(password);
    const account = await AccountRepository.create({ username, email, password_hash: hashedPassword });

    res.status(201).json(new apiResponse(
        201,
        {
            username: account.username,
            email: account.email,
            created: account.created_at.toString()
        },
        'Account created successfully'
    ));
});

export const GetById = asyncHandler(async (req, res) => {
    const { account_id } = req.params;
    const account = await AccountRepository.findById(account_id);
    if (!account) throw new apiError(404, 'Account not found');

    res.status(200).json(new apiResponse(
        200,
        {
            username: account.username,
            email: account.email,
            created: account.created_at.toString()
        },
        'ok'
    ));
});

export const updatePassword = asyncHandler(async (req, res) => {
    const { account_id } = req.params;
    const { currentPassword, newPassword } = req.body;

    await dbTransaction(async (t) => {
        const account = await AccountRepository.findById(account_id, {
            attributes: ['account_id', 'password_hash'],
            transaction: t
        });
        if (!account) throw new apiError(404, 'Account not found');

        const isMatch = await comparePassword(currentPassword, account.password_hash);
        if (!isMatch) throw new apiError(400, 'Current password is incorrect');

        await AccountRepository.update({ password_hash: await hashPassword(newPassword) }, { account_id }, { transaction: t });
    });

    res.status(200).json(new apiResponse(200, null, 'Password changed successfully'));
});

export const updateEmail = asyncHandler(async (req, res) => {
    const { account_id } = req.params;
    const { newEmail } = req.body;

    const rows = await AccountRepository.update({ email: newEmail }, { account_id });
    if (rows.length === 0) throw new apiError(404, 'Account not found');

    res.status(200).json(new apiResponse(200, null, 'Email updated successfully'));
});

export const updateUsername = asyncHandler(async (req, res) => {
    const { account_id } = req.params;
    const { newUsername } = req.body;

    const rows = await AccountRepository.update({ username: newUsername }, { account_id });
    if (rows.length === 0) throw new apiError(404, 'Account not found');

    res.status(200).json(new apiResponse(200, null, 'Username updated successfully'));
});

export const Delete = asyncHandler(async (req, res) => {
    const { account_id } = req.params;

    const storagePaths = await dbTransaction(async (t) => {
        const account = await AccountRepository.findById(account_id, { transaction: t });
        if (!account) throw new apiError(404, 'Account not found');

        const paths = await DocumentRepository.findStoragePathsByUserId(account_id, { transaction: t });

        await AccountRepository.delete({ account_id }, { transaction: t }); // cascades to documents in Postgres

        return paths;
    });

    await Promise.all(storagePaths.map(p => unlink(p).catch(() => {
        console.error(`Failed to delete file at ${p}`);
    })));

    res.status(200).json(new apiResponse(200, null, 'Account deleted successfully'));
});
