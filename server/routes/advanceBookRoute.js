
// routes/orderRoutes.js
const express = require("express");
const router = express.Router();
const orderController = require("../controller/advancebookController");

router.post("/submit", orderController.submitRequest);
router.get("/all", orderController.getAllRequests);
router.put("/accept/:id", orderController.acceptOrder);
router.put("/reject/:id", orderController.rejectOrder);

module.exports = router;