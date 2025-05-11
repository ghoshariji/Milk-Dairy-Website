const Milkman = require("../modal/milkmanModal");
const Payment = require("../modal/milkmanUserPayment");
const MilkRecord = require("../modal/milkModal");

// Create a new payment
exports.createPayment = async (req, res) => {
  const milkmanId = req.user.userId; // decoded from token
  const { startDate, endDate } = req.body;

  try {
    // Step 1: Fetch the milkman with related customers and sellers
    const milkman = await Milkman.findById(milkmanId).populate("customer seller");
    if (!milkman) {
      return res.status(404).json({ error: "Milkman not found" });
    }

    // Step 2: Get combined list of users (customers + sellers)
    const users = [...milkman.customer, ...milkman.seller];

    const payments = [];

    // Step 3: Loop over each user and create individual payments
    for (const user of users) {
      const userId = user._id;

      // Step 3a: Fetch milk records for this user within date range
      const milkRecords = await MilkRecord.find({
        milkmanId,
        userId,
        date: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      });

      if (milkRecords.length === 0) continue; // Skip if no records

      // Step 4: Calculate totals
      let totalLitre = 0;
      let totalAmount = 0;

      milkRecords.forEach(record => {
        totalLitre += record.kg;
        totalAmount += record.kg * record.rate;
      });

      const userRate = totalLitre > 0 ? totalAmount / totalLitre : 0;

      // Step 5: Create and save the payment
      const newPayment = new Payment({
        milkmanId,
        userId, // This is now the customer or seller ID
        totalLitre,
        paymentAmount: totalAmount,
        totalAmount: totalAmount,
        paymentStatus: "pending",
        userRate,
        fromDate: new Date(startDate),
        toDate: new Date(endDate),
        createdAt: new Date()
      });

      await newPayment.save();
      payments.push(newPayment);
    }

    if (payments.length === 0) {
      return res.status(404).json({ message: "No milk records found in this date range." });
    }

    return res.status(201).json({
      message: "Payments created successfully",
      payments
    });

  } catch (error) {
    console.error("Error creating payments:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};




// GET /api/payments
exports.getAllPayments = async (req, res) => {
  const milkmanId = req.user.userId; // decoded by auth middleware

  try {
    const payments = await Payment.find({ milkmanId })
      .populate("userId")      // customer/seller

    res.status(200).json(payments);
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({ message: "Error fetching payments", error });
  }
};


// Get single payment by ID
exports.getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate("userId").populate("milkmanId");
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ message: "Error fetching payment", error });
  }
};

// Update a payment
exports.updatePayment = async (req, res) => {
  try {
    const updatedPayment = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedPayment) return res.status(404).json({ message: "Payment not found" });

    res.status(200).json({ message: "Payment updated", payment: updatedPayment });
  } catch (error) {
    res.status(500).json({ message: "Error updating payment", error });
  }
};

// Delete a payment
exports.deletePayment = async (req, res) => {
  try {
    const deletedPayment = await Payment.findByIdAndDelete(req.params.id);
    if (!deletedPayment) return res.status(404).json({ message: "Payment not found" });

    res.status(200).json({ message: "Payment deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting payment", error });
  }
};
