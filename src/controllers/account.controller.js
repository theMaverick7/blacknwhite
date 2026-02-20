import * as Account from '../models/account.model.js';
import { hashPassword } from '../utils/bcrypt.js';


export const Create = async (req, res) => {
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
                "email": account.email ,
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