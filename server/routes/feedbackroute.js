
// routes/feedbackRoutes.js
const express = require("express");
const router = express.Router();
const feedbackController = require("../controller/feedbackcontroller");

router.post("/seller", feedbackController.createSellerFeedback);
router.post("/buyer", feedbackController.createBuyerFeedback);
router.post("/milkman", feedbackController.createMilkmanFeedback);
router.get("/all", feedbackController.getAllFeedback);
router.put("/seen/:id", feedbackController.handleSeen);

module.exports = router;
