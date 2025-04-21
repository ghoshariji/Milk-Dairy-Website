// const express = require("express");
// const router = express.Router();
// const milkRecordController = require("../controller/milkController");
// const authMiddleware = require("../middleware/authMiddleware"); // Middleware for token decoding
// // Create a new milk record (with optional checkbox)
// // Bulk milk update route
// router.post("/bulk-update", authMiddleware, milkRecordController.bulkUpdateMilk);

// // Manual milk update route
// router.post(
//   "/manual-update",
//   authMiddleware,
//   milkRecordController.manualUpdateMilk
// );
// // Get all milk records
// router.get("/all", milkRecordController.getMilkRecords);

// // Get a single milk record by ID
// router.get("/:id", milkRecordController.getMilkRecordById);

// // Update a milk record
// router.put("/update/:id", milkRecordController.updateMilkRecord);

// // Delete a milk record
// router.delete("/delete", milkRecordController.deleteMilkRecord);
// router.post("/sell-milk-anydate",authMiddleware, milkRecordController.sellMilkToday);
// router.get("/milkman-milkrecord/:id",authMiddleware, milkRecordController.milkManMilkRecord);

// module.exports = {
//   bulkUpdateMilk,
//   manualUpdateMilk,
//   getMilkRecords,
//   getMilkRecordById,
//   updateMilkRecord,
//   deleteMilkRecord,
//   sellMilkToday,
//   milkManMilkRecord,
// };