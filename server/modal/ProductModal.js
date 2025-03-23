// models/Product.js
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true }, // Added category field
  image: { 
    data: Buffer, 
    contentType: String 
  },
  isAvailable: { type: String, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
