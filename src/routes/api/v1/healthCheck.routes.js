import { Router } from "express";
import { apiResponse } from "../../../utils/apiResponse.js";

const router = Router();

router.get('/health', async (req, res) => {
    try {
        res.status(200).json({
            status: 'ok'
        });
    } catch {
        res.status(503).json({
            status: 'service unavailable'
        });
    }
});

export default router;
