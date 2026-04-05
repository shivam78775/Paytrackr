import express from 'express';
import Due from '../models/Due.js';
import StitchingRecord from '../models/StitchingRecord.js';
import { generateDuesExcel, generateStitchingExcel } from '../services/excel.js';

const router = express.Router();

const requireAuth = (req, res, next) => {
    if (req.cookies.auth === 'true') {
        next();
    } else {
        res.status(401).json({ success: false, message: 'Unauthorized' });
    }
};

router.use(requireAuth);

router.get('/excel/dues', async (req, res) => {
    try {
        const { period } = req.query;
        let query = {};

        // Basic date query filters based on period
        if (period === 'weekly') {
            const startOfLast7Days = new Date();
            startOfLast7Days.setDate(startOfLast7Days.getDate() - 7);
            query.createdAt = { $gte: startOfLast7Days };
        } else if (period === 'monthly') {
            const startOfThisMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
            query.createdAt = { $gte: startOfThisMonth };
        } else if (period === 'pending') {
            query.status = 'pending';
        }

        const dues = await Due.find(query).sort({ createdAt: -1 });
        const buffer = await generateDuesExcel(dues);

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="paytrackr_dues_${period || 'all'}.xlsx"`);
        res.send(buffer);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/excel/stitching', async (req, res) => {
    try {
        const { period } = req.query;
        let query = {};

        if (period === 'weekly') {
            const startOfLast7Days = new Date();
            startOfLast7Days.setDate(startOfLast7Days.getDate() - 7);
            query.createdAt = { $gte: startOfLast7Days };
        } else if (period === 'monthly') {
            const startOfThisMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
            query.createdAt = { $gte: startOfThisMonth };
        }

        const records = await StitchingRecord.find(query).sort({ createdAt: -1 });
        const buffer = await generateStitchingExcel(records);

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="paytrackr_stitching_${period || 'all'}.xlsx"`);
        res.send(buffer);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
