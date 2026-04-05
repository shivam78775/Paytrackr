import express from 'express';
import Due from '../models/Due.js';
import StitchingRecord from '../models/StitchingRecord.js';

const router = express.Router();

const requireAuth = (req, res, next) => {
    if (req.cookies.auth === 'true') {
        next();
    } else {
        res.status(401).json({ success: false, message: 'Unauthorized' });
    }
};

router.use(requireAuth);

router.get('/summary', async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const startOfWeek = new Date();
        startOfWeek.setDate(today.getDate() - today.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        // Fetch Dues Computations
        const dues = await Due.find();
        let totalPendingDueAmt = 0;
        let totalPaidThisWeekAmt = 0;
        let totalPaidThisMonthAmt = 0;
        let totalPendingDueRecords = 0;
        let todaysDueEntries = 0;

        dues.forEach(d => {
            if (d.status === 'pending') {
                totalPendingDueAmt += d.amount;
                totalPendingDueRecords += 1;
            }
            if (d.status === 'paid' && new Date(d.updatedAt) >= startOfWeek) {
                totalPaidThisWeekAmt += d.amount;
            }
            if (d.status === 'paid' && new Date(d.updatedAt) >= startOfMonth) {
                totalPaidThisMonthAmt += d.amount;
            }
            if (new Date(d.createdAt) >= today) {
                todaysDueEntries += 1;
            }
        });

        // Fetch Stitching Computations
        const stitchings = await StitchingRecord.find();
        let totalStitchingPendingDeliveries = 0;
        let todaysStitchingOrders = 0;
        let upcomingDeliveries = [];

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        stitchings.forEach(s => {
            if (s.status === 'pending' || s.status === 'completed') {
                totalStitchingPendingDeliveries += 1;
                
                if (s.deliveryDate) {
                    const dDate = new Date(s.deliveryDate);
                    dDate.setHours(0, 0, 0, 0);

                    if (dDate.getTime() === today.getTime() || dDate.getTime() === tomorrow.getTime()) {
                        upcomingDeliveries.push({
                            _id: s._id,
                            customerName: s.customerName,
                            clothType: s.clothType || 'Order',
                            deliveryDate: s.deliveryDate,
                            status: s.status,
                            isToday: dDate.getTime() === today.getTime()
                        });
                    }
                }
            }
            if (new Date(s.createdAt) >= today) {
                todaysStitchingOrders += 1;
            }
        });

        upcomingDeliveries.sort((a, b) => new Date(a.deliveryDate) - new Date(b.deliveryDate));

        res.status(200).json({
            success: true,
            data: {
                totalPendingDueAmt,
                totalPaidThisWeekAmt,
                totalPaidThisMonthAmt,
                totalPendingDueRecords,
                totalStitchingPendingDeliveries,
                todaysDueEntries,
                todaysStitchingOrders,
                upcomingDeliveries
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
