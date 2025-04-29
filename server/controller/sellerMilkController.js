const User = require("../modal/userModal");
const SellerMilkRecord = require("../modal/sellMilkModalRecord");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const Milkman = require("../modal/milkmanModal");

// Function to extract milkmanId from token
const getMilkmanIdFromToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.userId; // Assuming the token contains milkmanId
  } catch (error) {
    return null;
  }
};

// Add Milk Record
exports.addMilkRecord = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const milkmanId = getMilkmanIdFromToken(token);
    if (!milkmanId) return res.status(401).json({ message: "Invalid Token" });

    const { weight, fat, snf, rate, addAutoMilk, enterCode } = req.body;

    // Find the user based on enterCode
    const user = await User.findOne({ enterCode });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if the user is mapped to the milkman
    const milkman = await Milkman.findById(milkmanId);
    if (!milkman) return res.status(404).json({ message: "Milkman not found" });

    const isUserMapped =
      milkman.customer.includes(user._id) || milkman.seller.includes(user._id);

    if (!isUserMapped) {
      return res.status(403).json({ message: "User not associated with this milkman" });
    }

    // Save milk record
    const newMilkRecord = new SellerMilkRecord({
      userId: user._id,
      milkmanId,
      kg: weight,
      fat,
      snf,
      rate,
      addAutoMilk,
      date: moment().toDate(),
    });

    await newMilkRecord.save();

    // Handle Auto Milk Addition (Consider a scheduled job instead)
    if (addAutoMilk) {
      setTimeout(async () => {
        const autoMilkRecord = new SellerMilkRecord({
          userId: user._id,
          milkmanId,
          kg: weight,
          fat,
          snf,
          rate,
          addAutoMilk: true,
          date: moment().subtract(1, "day").toDate(),
        });
        await autoMilkRecord.save();
      }, 86400000); // Runs after 24 hours once
    }

    res.status(201).json({ message: "Milk record added successfully" });
  } catch (error) {
    console.error("Error adding milk record:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};




exports.sellerMilkToday = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const milkmanId = getMilkmanIdFromToken(token);
    if (!milkmanId) return res.status(401).json({ message: "Invalid Token" });

    // Get today's date in proper format
    const today = moment().startOf("day");

    // Fetch records for today
    const milkRecords = await SellerMilkRecord.find({
      milkmanId,
      date: { $gte: today.toDate(), $lt: moment(today).endOf("day").toDate() },
    });

    // Calculate totals
    const totalKg = milkRecords.reduce((sum, record) => sum + record.kg, 0);
    const totalFat = milkRecords.reduce((sum, record) => sum + parseFloat(record.fat), 0);
    const totalAmount = milkRecords.reduce((sum, record) => sum + record.kg * record.rate, 0);

    res.status(200).json({
      // records: milkRecords,
      totalKg,
      totalFat,
      totalAmount,
    });
  } catch (error) {
    console.error("Error fetching milk records:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};