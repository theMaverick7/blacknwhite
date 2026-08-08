import jwt from 'jsonwebtoken';
import { asyncHandler } from '../utils/asyncHandler.js';

export const authenticateToken = asyncHandler(async (req, res, next) => {

    req.log.info(`Authenticating token for request: ${req.method} ${req.originalUrl}`);

    const token = req.cookies.token;

    if (!token) {
        return res.sendStatus(401);
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        req.log.info(`Token authenticated for user: ${req.user.account_id}`);
        next();
    } catch (error) {
        req.log.error(`Token authentication failed: ${error.message}`);
        return res.sendStatus(403);
    }
});