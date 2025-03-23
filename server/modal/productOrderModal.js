

const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  milkmanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Milkman',
  },
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  deliveryAddress: {
    type: String,
    required: true
  },
  products: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: String,
    price: Number,
    quantity: {
      type: Number,
      required: true,
      default: 1
    }
  }],
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  deliveredBy: {
    type: String,
    enum: ['take in', 'delivery by home'],
    default:'take in'
  },
  paymentMode: {
    type: String,
    enum: ['cash on', 'online'],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ProductOrder', orderSchema);