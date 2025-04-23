// routes/feedbackRoutes.js
const express = require("express");
const router = express.Router();
const feedbackController = require("../controller/getInController");

router.post("/add", feedbackController.getInCreate);
router.get("/all", feedbackController.getInAll);

module.exports = router;
