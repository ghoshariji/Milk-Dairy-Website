const express = require("express");
const router = express.Router();
const milkRecordController = require("../controller/sellerMilkController");
const authMiddleware = require("../middleware/authMiddleware"); // Middleware for token decoding
// Create a new milk record (with optional checkbox)
// Bulk milk update route
router.post("/add-milk", authMiddleware, milkRecordController.addMilkRecord);
router.get("/milk-today", authMiddleware, milkRecordController.sellerMilkToday);

module.exports = router;
