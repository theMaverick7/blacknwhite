import { hashPassword, comparePassword } from '../utils/bcrypt.js';

export const Create = async (req, res) => {
    const Account = req.dbInterface;
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await hashPassword(password);
        const account = await Account.create({
            username,
            email,
            hashedPassword
        });

        res.status(201).json({
            message: 'account created successfully',
            data: {
                "username": account.username,
                "email": account.email,
                "created_at": account.created_at
            }
        });

    } catch (error) {
        console.error(error);
        res.status(401).json({
            message: 'Server error'
        })
    }
};

export const GetById = async (req, res) => {
    const Account = req.dbInterface;
    try {
        const { account_id } = req.params;
        const account = await Account.findById(account_id);
        if (!account) {
            return res.status(404).json({
                message: 'Account not found'
            });
        }

        res.status(200).json({
            message: 'ok',
            data: {
                "username": account.username,
                "email": account.email,
                "created_at": account.created_at.toString()
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Server error'
        });
    }
}

export const updatePassword = async (req, res) => {
    const Account = req.dbInterface;
    try {
        const { currentPassword, newPassword } = req.body;
        const data = await Account.findById({ return: 'password_hash' });
        const isEqualPswd = await comparePassword(currentPassword, data.password_hash);
        if (!isEqualPswd) {
            return res.status(401).json({
                message: 'Current password is incorrect'
            });
        }

        const newHashedPassword = await hashPassword(newPassword);
        Promise.all([
            Account.update('password_hash', newHashedPassword),
            Account.update('updated_at', 'now()')
        ]);

        res.status(200).json({
            message: 'Password changed successfully'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Server error'
        });
    }
}