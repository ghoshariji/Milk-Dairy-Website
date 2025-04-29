const express = require('express');
const router = express.Router();
const milkRateController = require('../controller/milkmanSetRateController');

// Create new milk rate
router.post('/add', milkRateController.addMilkRate);

// Get milk rates by user
router.get('/user', milkRateController.getMilkRatesByUser);

// Update milk rate
router.put('/update/:id', milkRateController.updateMilkRate);

// Delete milk rate
router.delete('/delete/:id', milkRateController.deleteMilkRate);

module.exports = router;
