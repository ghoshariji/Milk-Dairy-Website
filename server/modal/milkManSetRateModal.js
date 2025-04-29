// backend/models/MilkRate.js

const mongoose = require('mongoose');

const MilkRateSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Milkman',
    required: true
  },
  milkType: {
    type: String,
    required: true,
  },
  snf: {
    type: Number,
    required: true
  },
  wnf: {
    type: Number,
    required: true
  },
  rate: {
    type: Number,
    required: true
  },
}, { timestamps: true });

module.exports = mongoose.model('MilkRate', MilkRateSchema);
