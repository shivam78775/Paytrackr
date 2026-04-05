import express from 'express';
import StitchingRecord from '../models/StitchingRecord.js';
import { upload } from '../middleware/upload.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../services/cloudinary.js';

const router = express.Router();



router.get('/', async (req, res) => {
    try {
        const records = await StitchingRecord.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: records });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const record = await StitchingRecord.findById(req.params.id);
        if (!record) return res.status(404).json({ success: false, message: 'Not found' });
        res.status(200).json({ success: true, data: record });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/', upload.single('image'), async (req, res) => {
    try {
        let imageData = {};
        if (req.file) {
            const uploadRes = await uploadToCloudinary(req.file.buffer, 'paytrackr/stitching');
            imageData.imageUrl = uploadRes.url;
            imageData.imagePublicId = uploadRes.public_id;
        }

        let recordData = { ...req.body, ...imageData };
        if (typeof recordData.measurements === 'string') {
            try {
                recordData.measurements = JSON.parse(recordData.measurements);
            } catch (e) {
                console.error("Failed to parse measurements JSON");
            }
        }

        const record = await StitchingRecord.create(recordData);
        res.status(201).json({ success: true, data: record });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        let record = await StitchingRecord.findById(req.params.id);
        if (!record) return res.status(404).json({ success: false, message: 'Not found' });

        let updateData = { ...req.body };
        
        // Handle new image upload and delete old image
        if (req.file) {
            if (record.imagePublicId) {
                await deleteFromCloudinary(record.imagePublicId);
            }
            const uploadRes = await uploadToCloudinary(req.file.buffer, 'paytrackr/stitching');
            updateData.imageUrl = uploadRes.url;
            updateData.imagePublicId = uploadRes.public_id;
        }

        // Handle explicit image removal by user passing empty string for imageUrl via body
        if (req.body.imageUrl === '') {
            if (record.imagePublicId) {
                await deleteFromCloudinary(record.imagePublicId);
            }
            updateData.imageUrl = '';
            updateData.imagePublicId = '';
        }

        if (typeof updateData.measurements === 'string') {
            try {
                updateData.measurements = JSON.parse(updateData.measurements);
            } catch (e) {
                console.error("Failed to parse measurements JSON");
            }
        }

        record = await StitchingRecord.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
        res.status(200).json({ success: true, data: record });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const record = await StitchingRecord.findById(req.params.id);
        if (!record) return res.status(404).json({ success: false, message: 'Not found' });

        if (record.imagePublicId) {
            await deleteFromCloudinary(record.imagePublicId);
        }
        await StitchingRecord.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
