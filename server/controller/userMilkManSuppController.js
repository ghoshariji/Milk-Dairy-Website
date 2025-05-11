const Seen = require("../modal/userMilkManSupportModal");
const User = require("../modal/userModal");
const jwt = require("jsonwebtoken");

// Create new complaint
exports.createSeen = async (req, res) => {
  const { complainDetails, seen, time } = req.body;

  try {
    const userId = req.user.userId;

    const user = await User.findById(userId).populate("milkman");
    if (!user) return res.status(404).json({ error: "User not found" });

    const newSeen = new Seen({
      userId,
      milkmanId: user.milkman._id,
      complainDetails,
      seen,
      time,
    });

    await newSeen.save();
    res.status(201).json(newSeen);
  } catch (error) {
    console.error("Create Seen Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get all complaints
exports.getAllSeen = async (req, res) => {
  try {
    const complaints = await Seen.find()
      .populate("userId")
      .populate("milkmanId");
    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get complaint by ID
exports.getSeenById = async (req, res) => {
  try {
    const complaint = await Seen.findById(req.params.id)
      .populate("userId")
      .populate("milkmanId");
    if (!complaint)
      return res.status(404).json({ message: "Complaint not found" });
    res.status(200).json(complaint);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update seen status
exports.updateSeenStatus = async (req, res) => {
  const { seen } = req.body;
  try {
    const updated = await Seen.findByIdAndUpdate(
      req.params.id,
      { seen },
      { new: true }
    );
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

