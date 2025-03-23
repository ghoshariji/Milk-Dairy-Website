const Milkman = require("../modal/milkmanModal");
const MilkRecord = require("../modal/milkModal");
const SellerMilkRecord = require("../modal/sellMilkModalRecord");
const jwt = require("jsonwebtoken");
const User = require("../modal/userModal");

// Create a new milk record
exports.bulkUpdateMilk = async (req, res) => {
  try {
    const { milkData } = req.body; // Get the array of milk data from the request
    if (!milkData || !Array.isArray(milkData)) {
      return res.status(400).json({ message: "Invalid milk data format" });
    }

    // Loop over each user in milkData and update their milk quantity
    for (let i = 0; i < milkData.length; i++) {
      const { userId, date } = milkData[i];

      // Find user by userId
      const user = await User.findById(userId);
      if (!user) {
        return res
          .status(404)
          .json({ message: `User with ID ${userId} not found` });
      }

      // Check if a MilkRecord for this user and date already exists
      let milkRecord = await MilkRecord.findOne({ userId, date });
      if (milkRecord) {
        // If record exists, update it
        milkRecord.kg = user.milkQuantity; // Update the milk quantity
        await milkRecord.save();
      } else {
        // If record does not exist, create a new MilkRecord
        milkRecord = new MilkRecord({
          userId,
          milkmanId: user.milkman, // Assuming the milkman is associated with the user
          kg: user.milkQuantity,
          date,
          rate: 5, // You can set a default rate here or pass it from frontend
        });
        await milkRecord.save();
      }
    }

    return res.status(200).json({ message: "Bulk update successful" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error updating milk records", error });
  }
};

// Manual Milk Update
exports.manualUpdateMilk = async (req, res) => {
  const { userId, date, milkQuantity } = req.body;
  const milkmanId = req.user.userId; // Get the milkmanId from the decoded JWT token

  try {
    // Find the user by userId
    const updatedUser = await User.findById(userId); // Assuming you have a User model
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if a MilkRecord for this user and date already exists
    let milkRecord = await MilkRecord.findOne({ userId, date });
    if (milkRecord) {
      // If record exists, update it
      milkRecord.kg = milkQuantity; // Update the milk quantity
      await milkRecord.save();
    } else {
      // If record does not exist, create a new MilkRecord
      milkRecord = new MilkRecord({
        userId,
        milkmanId,
        kg: milkQuantity,
        date,
        rate: 5, // You can change this to dynamically pass the rate if needed
      });
      await milkRecord.save();
    }

    res.status(200).json({ message: "Manual milk update successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update milk" });
  }
};

// Get all milk records

exports.getMilkRecords = async (req, res) => {
  try {
    console.log("Fetching milk record");

    // Extract token from headers
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    // Decode token to get user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const milkmanId = decoded.userId;

    // Get all customers under this milkman
    const milkman = await Milkman.findById(milkmanId).populate(
      "customer",
      "_id name enterCode milkQuantity phone"
    );
    if (!milkman) return res.status(404).json({ message: "Milkman not found" });

    const customers = milkman.customer;
    if (!customers.length) {
      return res
        .status(200)
        .json({ updatedCustomers: [], notUpdatedCustomers: [] });
    }

    // Get date from request query
    const { date } = req.query;
    console.log(date);
    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    console.log("Requested Date:", date);

    // Fetch milk records for the given date
    const records = await MilkRecord.find({ milkmanId, date }).populate(
      "userId",
      "_id name enterCode milkQuantity phone"
    );

    console.log(records);
    // Extract updated customer IDs
    const updatedCustomerIds = new Set(
      records.map((record) => record.userId._id.toString())
    );

    // Separate updated and not updated customers
    const updatedCustomers = customers.filter((customer) =>
      updatedCustomerIds.has(customer._id.toString())
    );
    const notUpdatedCustomers = customers.filter(
      (customer) => !updatedCustomerIds.has(customer._id.toString())
    );

    console.log(updatedCustomers);
    console.log(notUpdatedCustomers);
    res.status(200).json({
      updatedCustomers: updatedCustomers.map((customer) => ({
        _id: customer._id,
        name: customer.name,
        enterCode: customer.enterCode,
        milkQuantity: customer.milkQuantity,
        phone: customer.phone,
      })),
      notUpdatedCustomers: notUpdatedCustomers.map((customer) => ({
        _id: customer._id,
        name: customer.name,
        enterCode: customer.enterCode,
        milkQuantity: customer.milkQuantity,
        phone: customer.phone,
      })),
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error fetching milk records", error: error.message });
  }
};

// Get a single milk record by ID
exports.getMilkRecordById = async (req, res) => {
  try {
    const record = await MilkRecord.findById(req.params.id).populate(
      "userId milkmanId"
    );
    if (!record) {
      return res.status(404).json({ message: "Milk record not found" });
    }
    res.status(200).json(record);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching milk record", error: error.message });
  }
};

// Update a milk record
exports.updateMilkRecord = async (req, res) => {
  try {
    const { kg, date, rate } = req.body;
    const updatedRecord = await MilkRecord.findByIdAndUpdate(
      req.params.id,
      { kg, date, rate },
      { new: true }
    );

    if (!updatedRecord) {
      return res.status(404).json({ message: "Milk record not found" });
    }

    res
      .status(200)
      .json({ message: "Milk record updated", record: updatedRecord });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating milk record", error: error.message });
  }
};

// Delete a milk record
// Controller: deleteMilkRecord
exports.deleteMilkRecord = async (req, res) => {
  try {
    const { userId, date } = req.body; // Extract userId and date from request body

    console.log(req.body);
    // Convert the date to the same format used in your DB
    const todayDate = new Date();
    todayDate.setMinutes(
      todayDate.getMinutes() - todayDate.getTimezoneOffset()
    );
    const formattedDate = todayDate.toISOString().split("T")[0];
    if (date !== formattedDate) {
      return res.status(400).json({
        message: "Date mismatch. Only today's records can be deleted.",
      });
    }

    // Delete the milk record for the given userId and today's date
    const deletedRecord = await MilkRecord.findOneAndDelete({
      userId,
      date: formattedDate,
    });

    if (!deletedRecord) {
      return res.status(404).json({ message: "Milk record not found" });
    }

    res.status(200).json({ message: "Milk record deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting milk record", error: error.message });
  }
};

exports.sellMilkToday = async (req, res) => {
  try {
    const { enterCode, weight, rate, date } = req.body;
    const milkmanId = req.user.userId;

    // Find the user using enterCode
    const user = await User.findOne({ enterCode });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user is linked to the milkman
    if (!user.milkman || user.milkman.toString() !== milkmanId) {
      return res
        .status(403)
        .json({ message: "User is not associated with this milkman" });
    }

    // Save milk record in DB
    const newMilkRecord = new MilkRecord({
      userId: user._id,
      milkmanId,
      kg: weight,
      rate,
      date: date ? new Date(date) : new Date(),
    });

    await newMilkRecord.save();

    res
      .status(201)
      .json({ message: "Milk record added successfully", newMilkRecord });
  } catch (error) {
    console.error("Error adding milk record:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.milkManMilkRecord = async (req, res) => {
  try {
    const milkmanId = req.user.userId; // Extracted from token

    const { id } = req.params;

    // Extract fromDate and toDate from query parameters
    const { fromDate, toDate } = req.query;

    if (!fromDate || !toDate) {
      return res
        .status(400)
        .json({ message: "Please provide both fromDate and toDate" });
    }

    const startDate = new Date(fromDate);
    const endDate = new Date(toDate);
    endDate.setHours(23, 59, 59, 999); // Include the entire last day

    // Fetch user details to check userType
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let records = [];
    if (user.userType === "Customer") {
      // Fetch records from SellerMilkRecord
      records = await MilkRecord.find({
        userId: id,
        milkmanId,
        date: { $gte: startDate, $lte: endDate },
      }).sort({ date: 1 });
    } else {
      // Fetch records from MilkRecord
      records = await SellerMilkRecord.find({
        userId: id,
        milkmanId,
        date: { $gte: startDate, $lte: endDate },
      }).sort({ date: 1 });
    }

    if (records.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No records found in the given date range",
        totalLitres: 0,
        totalAmount: 0,
        avgRate: 0,
        records: [],
      });
    }

    // Perform calculations
    const totalLitres = records.reduce((sum, record) => sum + record.kg, 0);
    const totalAmount = records.reduce(
      (sum, record) => sum + record.kg * record.rate,
      0
    );
    const avgRate = totalLitres > 0 ? totalAmount / totalLitres : 0;

    res.status(200).json({
      success: true,
      totalLitres,
      totalAmount,
      avgRate: avgRate.toFixed(2),
      records,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


