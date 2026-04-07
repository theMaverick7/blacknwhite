import { hashPassword, comparePassword } from '../utils/bcrypt.js';
import { dbTransaction } from '../utils/dbTransaction.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { apiResponse } from '../utils/apiResponse.js';
import { apiError } from '../utils/apiError.js';

// This function handles account creation
export const Create = asyncHandler(async (req, res,) => {
    const Account = req.accountDbInterface;
    const { username, email, password } = req.body;
    const hashedPassword = await hashPassword(password);
    const account = await Account.create({
        username,
        email,
        hashedPassword
    });

    res.status(201).json(new apiResponse(
        201,
        {
            "username": account.username,
            "email": account.email,
            "created": account.created_at.toString()
        },
        'Account created successfully'
    ));
});

// This function retrieves account details by ID
export const GetById = asyncHandler(async (req, res) => {
    const Account = req.accountDbInterface;
    const { user_id } = req.params;
    const account = await Account.findById(user_id);
    if (!account) throw new apiError(404, 'Account not found');

    res.status(200).json(new apiResponse(
        200,
        {
            "username": account.username,
            "email": account.email,
            "created": account.created_at.toString()
        },
        'ok'
    ));
});

// This function updates the account password
export const updatePassword = asyncHandler(async (req, res) => {
    const Account = req.accountDbInterface;
    await dbTransaction(async () => {
        const { currentPassword, newPassword } = req.body;
        const data = await Account.findById({ return: 'password_hash' });
        const isEqualPswd = await comparePassword(currentPassword, data.password_hash);
        if (!isEqualPswd) {
            throw new apiError(400, 'Current password is incorrect');
        }
        const newHashedPassword = await hashPassword(newPassword);
        await Account.update('password_hash', newHashedPassword);
        await Account.update('updated_at', 'now()');
    })

    res.status(200).json(new apiResponse(
        200,
        null,
        'Password changed successfully'
    ));
});

// this function updates the account email
export const updateEmail = asyncHandler(async (req, res) => {
    const Account = req.accountDbInterface;
    await dbTransaction(async () => {
        const { newEmail } = req.body;

        await Account.update('email', newEmail);
        await Account.update('updated_at', 'now()');
    })

    res.status(200).json(new apiResponse(
        200,
        null,
        'Email updated successfully'
    ));
});

// this function updates the account username
export const updateUsername = asyncHandler(async (req, res) => {
    const Account = req.accountDbInterface;
    await dbTransaction(async () => {
        const { newUsername } = req.body;
        await Account.update('username', newUsername);
        await Account.update('updated_at', 'now()');
    })

    res.status(200).json(new apiResponse(
        200,
        null,
        'Username updated successfully'
    ));
});

// This function deletes an account
export const Delete = asyncHandler(async (req, res) => {
    const Account = req.accountDbInterface;
    await dbTransaction(async () => {
        await Account.delete();
    })
    res.status(200).json(new apiResponse(
        200,
        null,
        'Account deleted successfully'
    ));
});