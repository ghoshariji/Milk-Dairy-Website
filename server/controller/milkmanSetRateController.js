const MilkRate = require('../modal/milkManSetRateModal');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET; // use your secret from your auth

// Formula to calculate rate
const calculateRate = (snf, wnf) => {
  return (snf * 5) + (wnf * 2); // You can customize the formula
};

// Helper function to decode token
const getUserIdFromToken = (token) => {
  const decoded = jwt.verify(token, JWT_SECRET);
  return decoded.userId; // or whatever you saved in payload (like { id: user._id })
};

// Add new milk rate
exports.addMilkRate = async (req, res) => {
  try {
    const { token, milkType, snf, wnf } = req.body;

    if (!token) {
      return res.status(401).json({ message: 'Token missing' });
    }

    const userId = getUserIdFromToken(token);

    const rate = calculateRate(snf, wnf);

    const newMilkRate = new MilkRate({
      userId,
      milkType,
      snf,
      wnf,
      rate,
    });

    await newMilkRate.save();
    res.status(201).json({ message: 'Milk rate added successfully', data: newMilkRate });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

// Get all milk rates by user
exports.getMilkRatesByUser = async (req, res) => {
  try {
    const { token } = req.query; // send token in query or header

    if (!token) {
      return res.status(401).json({ message: 'Token missing' });
    }
    console.log(token)

    const userId = getUserIdFromToken(token);

    const milkRates = await MilkRate.find({ userId });

    res.status(200).json({ data: milkRates });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

// Edit a milk rate
exports.updateMilkRate = async (req, res) => {
  try {
    const { id } = req.params;
    const { token, milkType, snf, wnf } = req.body;

    if (!token) {
      return res.status(401).json({ message: 'Token missing' });
    }

    const userId = getUserIdFromToken(token);

    const rate = calculateRate(snf, wnf);

    const updatedMilkRate = await MilkRate.findOneAndUpdate(
      { _id: id, userId }, // ensure only owner can update
      { milkType, snf, wnf, rate },
      { new: true }
    );

    if (!updatedMilkRate) {
      return res.status(404).json({ message: 'Milk rate not found or unauthorized' });
    }

    res.status(200).json({ message: 'Milk rate updated successfully', data: updatedMilkRate });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

// Delete a milk rate
exports.deleteMilkRate = async (req, res) => {
  try {
    const { id } = req.params;
    const { token } = req.query; // you can also use headers

    if (!token) {
      return res.status(401).json({ message: 'Token missing' });
    }

    const userId = getUserIdFromToken(token);

    const deletedMilkRate = await MilkRate.findOneAndDelete({ _id: id, userId });

    if (!deletedMilkRate) {
      return res.status(404).json({ message: 'Milk rate not found or unauthorized' });
    }

    res.status(200).json({ message: 'Milk rate deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};
