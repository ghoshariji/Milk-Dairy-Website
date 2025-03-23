// models/Order.js
const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  milkmanId: { type: mongoose.Schema.Types.ObjectId, ref: "Milkman", required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  dealer: { type: String, required: true },
  date: { type: Date, default: Date.now },
  deliveredBy: { type: String, required: true },
  isDelivered: { type: Boolean, default: false },
  isSeen: { type: Boolean, default: false },
  status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" }
});

module.exports = mongoose.model("Order", OrderSchema);



