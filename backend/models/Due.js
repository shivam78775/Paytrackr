import mongoose from 'mongoose';

const dueSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    item: {
        type: String,
        required: [true, 'Item description is required'],
        trim: true
    },
    billNumber: {
        type: String,
        trim: true
    },
    phoneNumber: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true
    },
    remark: {
        type: String,
        trim: true
    },
    dueDate: {
        type: Date,
        default: Date.now
    },
    expectedReturnDate: {
        type: Date
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required'],
        min: 0
    },
    imageUrl: {
        type: String
    },
    imagePublicId: {
        type: String
    },
    status: {
        type: String,
        enum: ['pending', 'paid'],
        default: 'pending'
    }
}, { timestamps: true });

const Due = mongoose.model('Due', dueSchema);
export default Due;
