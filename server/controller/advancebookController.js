// controllers/orderController.js
const Order = require("../modal/advancebookModal");
const User = require("../modal/userModal");
const jwt = require("jsonwebtoken")
// Submit a request
exports.submitRequest = async (req, res) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const order = new Order({
        ...req.body,
        userId: user._id,
        milkmanId: user.milkman,
      });
      
      await order.save();
      res.status(201).json({ message: "Order submitted successfully", order });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
// Get all requests
exports.getAllRequests = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Accept order
exports.acceptOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: "accepted" }, { new: true });
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.status(200).json({ message: "Order accepted", order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Reject order
exports.rejectOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: "rejected" }, { new: true });
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.status(200).json({ message: "Order rejected", order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};