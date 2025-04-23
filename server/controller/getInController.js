// controllers/feedbackController.js
const Feedback = require("../modal/getInModal");

// Create feedback for seller
exports.getInCreate = async (req, res) => {
  try {
    const feedback = new Feedback(req.body);
    await feedback.save();
    res
      .status(201)
      .json({ message: "Get in touch saved successfully", feedback });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all feedback
exports.getInAll = async (req, res) => {
  try {
    const feedbacks = await Feedback.find();
    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
