const mongoose = require('mongoose');

const seenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  milkmanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Milkman',
    required: true,
  },
  seen: {
    type: Boolean,
    default: false,
  },
  complainDetails: {
    type: String,
    required: true,
  },
  time: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });

module.exports = mongoose.model('Seen', seenSchema);
