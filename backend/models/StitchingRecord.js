import mongoose from 'mongoose';

const stitchingSchema = new mongoose.Schema({
    customerName: {
        type: String,
        required: [true, 'Customer name is required'],
        trim: true
    },
    phoneNumber: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true
    },
    clothType: {
        type: String,
        trim: true
    },
    billNumber: {
        type: String,
        trim: true
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required'],
        min: 0
    },
    remark: {
        type: String,
        trim: true
    },
    orderDate: {
        type: Date,
        default: Date.now
    },
    deliveryDate: {
        type: Date
    },
    imageUrl: {
        type: String
    },
    imagePublicId: {
        type: String
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'delivered'],
        default: 'pending'
    },
    measurementsGlobalUnit: {
        type: String,
        enum: ['inch', 'cm'],
        default: 'inch'
    },
    measurements: [{
        name: { type: String, trim: true },
        value: { type: String, trim: true }
    }]
}, { timestamps: true });

const StitchingRecord = mongoose.model('StitchingRecord', stitchingSchema);
export default StitchingRecord;
