const mongoose = require('mongoose');

const milkRecordSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    milkmanId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Milkman',
        required: true
    },
    kg: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    rate: {
        type: Number,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('MilkRecord', milkRecordSchema);
