const express = require("express");
const { validateToken } = require("../controller/authController");

const router = express.Router();

// Token validation route (protected route example)
router.get("/validate-token", validateToken);

module.exports = router;
