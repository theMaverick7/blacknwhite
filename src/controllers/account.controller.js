import { hashPassword, comparePassword } from '../utils/bcrypt.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { apiResponse } from '../utils/apiResponse.js';
import { apiError } from '../utils/apiError.js';
import { unlink } from 'node:fs/promises';
import { dbTransaction } from '../utils/dbTransaction.js';
import Account from '../db/models/account.model.js';
import Document from '../db/models/documents.model.js';

export const Create = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    const existing = await Account.findOne({ where: { username } });
    if (existing) throw new apiError(400, 'Username already exists');

    const hashedPassword = await hashPassword(password);
    const account = await Account.create({ username, email, password_hash: hashedPassword });

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
    const account = await Account.findByPk(account_id);
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
        const account = await Account.findByPk(account_id, {
            attributes: ['account_id', 'password_hash'],
            transaction: t
        });
        if (!account) throw new apiError(404, 'Account not found');

        const isMatch = await comparePassword(currentPassword, account.password_hash);
        if (!isMatch) throw new apiError(400, 'Current password is incorrect');

        await account.update({ password_hash: await hashPassword(newPassword) }, { transaction: t });
    });

    res.status(200).json(new apiResponse(200, null, 'Password changed successfully'));
});

export const updateEmail = asyncHandler(async (req, res) => {
    const { account_id } = req.params;
    const { newEmail } = req.body;

    const [rows] = await Account.update({ email: newEmail }, { where: { account_id } });
    if (rows === 0) throw new apiError(404, 'Account not found');

    res.status(200).json(new apiResponse(200, null, 'Email updated successfully'));
});

export const updateUsername = asyncHandler(async (req, res) => {
    const { account_id } = req.params;
    const { newUsername } = req.body;

    const [rows] = await Account.update({ username: newUsername }, { where: { account_id } });
    if (rows === 0) throw new apiError(404, 'Account not found');

    res.status(200).json(new apiResponse(200, null, 'Username updated successfully'));
});

export const Delete = asyncHandler(async (req, res) => {
    const { account_id } = req.params;

    let storagePaths;
    await dbTransaction(async (t) => {
        const account = await Account.findByPk(account_id, { transaction: t });
        if (!account) throw new apiError(404, 'Account not found');

        const documents = await Document.findAll({
            where: { user_id: account_id },
            attributes: ['storage_path'],
            transaction: t
        });
        storagePaths = documents.map(d => d.storage_path);

        await account.destroy({ transaction: t });
    });

    await Promise.all(storagePaths.map(p => unlink(p).catch(() => {})));

    res.status(200).json(new apiResponse(200, null, 'Account deleted successfully'));
});
