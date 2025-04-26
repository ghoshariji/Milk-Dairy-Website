// controllers/subscriptionController.js
const Subscription = require("../modal/subscriptionModal");

// Create a new subscription
const createSubscription = async (req, res) => {
  const { subscriptionType, price, duration, description } = req.body;
  try {
    const newSubscription = new Subscription({
      subscriptionType,
      price,
      description,
    });
    await newSubscription.save();
    res.status(201).json(newSubscription);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all subscriptions
const getSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find();
    res.status(200).json(subscriptions);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a subscription
const updateSubscription = async (req, res) => {
  const { subscriptionId } = req.params;
  const { subscriptionType, price, description } = req.body;
  try {
    const updatedSubscription = await Subscription.findByIdAndUpdate(
      subscriptionId,
      { subscriptionType, price, description },
      { new: true }
    );
    if (!updatedSubscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }
    res.status(200).json(updatedSubscription);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a subscription
const deleteSubscription = async (req, res) => {
  const { subscriptionId } = req.params;
  try {
    const deletedSubscription = await Subscription.findByIdAndDelete(
      subscriptionId
    );
    if (!deletedSubscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }
    res.status(200).json(deletedSubscription);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createSubscription,
  getSubscriptions,
  updateSubscription,
  deleteSubscription,
};
