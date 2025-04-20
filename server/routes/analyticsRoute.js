const express = require("express");
const router = express.Router();

const ProductModel = require("../modal/ProductModal");
const OrderModel = require("../modal/productOrderModal");
const MilkmanModel = require("../modal/milkmanModal");

// GET /api/analytics/dashboard-metrics
router.get("/dashboard-metrics", async (req, res) => {
  try {
    const productsCount = await ProductModel.countDocuments();
    const ordersCount = await OrderModel.countDocuments();
    const milkmanCount = await MilkmanModel.countDocuments();

    res.json({ productsCount, ordersCount, milkmanCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
