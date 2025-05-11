const express = require('express');
const router = express.Router();
const seenController = require('../controller/userMilkManSuppController');
const Middleware = require("../middleware/authMiddleware")
// POST: Create complaint
router.post('/',Middleware, seenController.createSeen);

// GET: All complaints
router.get('/', seenController.getAllSeen);

// GET: Single complaint
router.get('/:id', seenController.getSeenById);

// PATCH: Update seen status
router.patch('/:id/seen', seenController.updateSeenStatus);


module.exports = router;
