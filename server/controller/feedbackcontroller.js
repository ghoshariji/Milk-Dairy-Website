// controllers/feedbackController.js
const Feedback = require("../modal/helpModal");

// Create feedback for seller
exports.createSellerFeedback = async (req, res) => {
  try {
    const feedback = new Feedback({ ...req.body, type: "seller" });
    await feedback.save();
    res
      .status(201)
      .json({ message: "Seller feedback saved successfully", feedback });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create feedback for buyer
exports.createBuyerFeedback = async (req, res) => {
  try {
    const feedback = new Feedback({ ...req.body, type: "buyer" });
    await feedback.save();
    res
      .status(201)
      .json({ message: "Buyer feedback saved successfully", feedback });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create feedback for milkman
exports.createMilkmanFeedback = async (req, res) => {
  try {
    console.log("Come");
    const feedback = new Feedback({ ...req.body, type: "milkman" });
    await feedback.save();
    res
      .status(201)
      .json({ message: "Milkman feedback saved successfully", feedback });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all feedback
exports.getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find();
    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.handleSeen = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedFeedback = await Feedback.findByIdAndUpdate(
      id,
      { unread: false },
      { new: true }
    );

    if (!updatedFeedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    res.status(200).json(updatedFeedback);
  } catch (error) {
    console.error("Error updating feedback:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
