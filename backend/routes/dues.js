import express from 'express';
import Due from '../models/Due.js';
import { upload } from '../middleware/upload.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../services/cloudinary.js';

const router = express.Router();



router.get('/', async (req, res) => {
    try {
        const dues = await Due.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: dues });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const due = await Due.findById(req.params.id);
        if (!due) return res.status(404).json({ success: false, message: 'Due not found' });
        res.status(200).json({ success: true, data: due });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/', upload.single('image'), async (req, res) => {
    try {
        let imageData = {};
        if (req.file) {
            const uploadRes = await uploadToCloudinary(req.file.buffer, 'paytrackr/dues');
            imageData.imageUrl = uploadRes.url;
            imageData.imagePublicId = uploadRes.public_id;
        }
        const due = await Due.create({ ...req.body, ...imageData });
        res.status(201).json({ success: true, data: due });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        let due = await Due.findById(req.params.id);
        if (!due) return res.status(404).json({ success: false, message: 'Due not found' });

        let updateData = { ...req.body };
        
        if (req.file) {
            if (due.imagePublicId) {
                await deleteFromCloudinary(due.imagePublicId);
            }
            const uploadRes = await uploadToCloudinary(req.file.buffer, 'paytrackr/dues');
            updateData.imageUrl = uploadRes.url;
            updateData.imagePublicId = uploadRes.public_id;
        }

        if (req.body.imageUrl === '') {
            if (due.imagePublicId) {
                await deleteFromCloudinary(due.imagePublicId);
            }
            updateData.imageUrl = '';
            updateData.imagePublicId = '';
        }

        due = await Due.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true
        });
        res.status(200).json({ success: true, data: due });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const due = await Due.findById(req.params.id);
        if (!due) return res.status(404).json({ success: false, message: 'Due not found' });

        if (due.imagePublicId) {
            await deleteFromCloudinary(due.imagePublicId);
        }
        await Due.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
