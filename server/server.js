const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const axios = require("axios");
require("dotenv").config();


const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));

// Database connection (replace with actual configuration)
const db = require("./config/dbConn");
db();

// Import routes
const userRoute = require("./routes/userRoute");
const milkmanRoute = require("./routes/milkmanRoute");
const productRoute = require("./routes/productRoute");
const feedbackroute = require("./routes/feedbackroute");
const advanceBookRoute = require("./routes/advanceBookRoute");
const productOrderRoute = require("./routes/productOrderRoute");
const milkroute = require("./routes/milkroute");
const sellerMilkroute = require("./routes/sellerMilkroute");
const couponRoute = require("./routes/couponRoute");

// Static files
app.use(express.static(path.join(__dirname, "./sampleFileUpload")));

// Routes
app.use("/api/auth/user", userRoute);
app.use("/api/auth/milkman", milkmanRoute);
app.use("/api/milkman/product", productRoute);
app.use("/api/help", feedbackroute);
app.use("/api/advance", advanceBookRoute);
app.use("/api/order", productOrderRoute);
app.use("/api/milk", milkroute);
app.use("/api/seller/milk", sellerMilkroute);
app.use("/api/coupon", couponRoute);


app.get("/get-milk-today", async (req, res) => {
  try {

    // Extract and verify token
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Access Denied, no token provided" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    const milkmanId = decoded.userId; // Ensure correct field

    // **Check if milkmanId is a valid ObjectId**
    if (!mongoose.Types.ObjectId.isValid(milkmanId)) {
      return res.status(400).json({ message: "Invalid Milkman ID" });
    }

    // Get today's date range
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Fetch records
    const milkRecords = await milkModal.find({
      milkmanId: new mongoose.Types.ObjectId(milkmanId),
      date: { $gte: startOfDay, $lte: endOfDay }
    });

    // Calculate total liters and total amount
    let totalLiters = 0;
    let totalAmount = 0;

    milkRecords.forEach(record => {
      totalLiters += record.kg;
      totalAmount += record.kg * record.rate;
    });

    res.json({
      totalLiters,
      totalAmount,
      message: milkRecords.length > 0 ? "Milk data retrieved successfully" : "No records found for today",
    });

  } catch (error) {
    console.error("Error fetching milk data:", error);
    res.status(500).json({ message: "Error fetching milk record", error: error.message });
  }
});



// Paytm configuration
const PaytmChecksum = require("paytmchecksum");
const milkModal = require("./modal/milkModal");
const MID = "DIY12386817555501617"; // Paytm Merchant ID
const MKEY = "bKMfNxPPf_QdZppa"; // Paytm Merchant Key
const CALLBACK_URL = "https://securegw-stage.paytm.in/theia/paytmCallback";
const PAYTM_WEBSITE = "WEBSTAGING"; // Change to "DEFAULT" for production

// Generate Transaction Token
app.post("/api/payment/generate-token", async (req, res) => {
  const { orderId, amount } = req.body;

  const paytmParams = {
    body: {
      requestType: "Payment",
      mid: MID,
      websiteName: PAYTM_WEBSITE,
      orderId: orderId,
      callbackUrl: CALLBACK_URL,
      txnAmount: {
        value: amount.toString(),
        currency: "INR",
      },
      userInfo: {
        custId: "CUSTOMER_ID",
      },
    },
  };

  try {
    // Generate checksum
    const checksum = await PaytmChecksum.generateSignature(
      JSON.stringify(paytmParams.body),
      MKEY
    );

    paytmParams.head = { signature: checksum };

    // Make API call to Paytm
    const response = await axios.post(
      `https://securegw-stage.paytm.in/theia/api/v1/initiateTransaction?mid=${MID}&orderId=${orderId}`,
      paytmParams,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Paytm Response:", response.data);

    if (response.data.body?.txnToken) {
      res.json({ success: true, txnToken: response.data.body.txnToken });
    } else {
      res.status(500).json({
        success: false,
        message: response.data.body?.resultInfo?.resultMsg || "Error",
      });
    }
  } catch (error) {
    console.error("Error generating token:", error.response?.data || error);
    res
      .status(500)
      .json({ success: false, message: "Error generating token", error });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
