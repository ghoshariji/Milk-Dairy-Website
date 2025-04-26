// routes/subscriptionRoutes.js
const express = require('express');
const router = express.Router();
const subscriptionController = require('../controller/subscriptionController');

// Create a new subscription
router.post('/', subscriptionController.createSubscription);

// Get all subscriptions
router.get('/', subscriptionController.getSubscriptions);

// Update a subscription by ID
router.put('/:subscriptionId', subscriptionController.updateSubscription);

// Delete a subscription by ID
router.delete('/:subscriptionId', subscriptionController.deleteSubscription);

module.exports = router;
