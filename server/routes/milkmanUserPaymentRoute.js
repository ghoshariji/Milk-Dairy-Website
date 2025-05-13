const express = require("express");
const router = express.Router();
const paymentController = require("../controller/milkmanUserPaymentController");
const Middleware = require("../middleware/authMiddleware")
// Routes
router.post("/generate",Middleware, paymentController.createPayment);
router.get("/",Middleware, paymentController.getAllPayments);
router.get("/get-user",Middleware, paymentController.getPaymentById);
router.put("/:id", paymentController.updatePayment);
router.delete("/:id", paymentController.deletePayment);

module.exports = router;
