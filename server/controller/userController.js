const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../modal/userModal");
const MilkmanModel = require("../modal/milkmanModal");
const advancebookModal = require("../modal/advancebookModal");
const Milkman = require("../modal/milkmanModal");
const milkModal = require("../modal/milkModal");
const Feedback = require("../modal/helpModal");
const sellerMilkModal = require("../modal/sellMilkModalRecord");
const sellMilkModalRecord = require("../modal/sellMilkModalRecord");
const SECRET_KEY = process.env.JWT_SECRET;

const crypto = require("crypto");
const nodemailer = require("nodemailer");

const CLIENT_URL = "http://localhost:5173";

exports.registerUser = async (req, res) => {
  const {
    name,
    phone,
    email,
    village,
    enterCode,
    milkman, // Milkman ID from frontend
    password,
    userType,
    location,
    upiId,
  } = req.body;

  try {
    // Validate userType
    if (!["Customer", "Seller"].includes(userType)) {
      return res.status(400).json({ message: "Invalid user type!" });
    }

    // Validate location
    if (!location || !location.latitude || !location.longitude) {
      return res.status(400).json({ message: "Location data is required!" });
    }

    // Check for duplicate users
    const existingUser = await User.findOne({
      $or: [{ phone }, { email }, { upiId }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this phone, email, or UPI ID!",
      });
    }

    // Find the milkman by ID
    const milkmanRecord = await MilkmanModel.findById(milkman);
    if (!milkmanRecord) {
      return res.status(404).json({ message: "Milkman not found!" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      name,
      phone,
      email,
      village,
      enterCode,
      upiId,
      milkman, // Save the Milkman ID in the user schema
      password: hashedPassword,
      userType,
      location,
    });

    const savedUser = await user.save(); // Save the user first

    // Add user ID to the Milkman document in the correct category
    if (userType === "Customer") {
      milkmanRecord.customer.push(savedUser._id);
    } else {
      milkmanRecord.seller.push(savedUser._id);
    }

    await milkmanRecord.save(); // Save the updated milkman document

    // Generate JWT token
    const token = jwt.sign({ userId: savedUser._id }, SECRET_KEY, {
      expiresIn: "1h",
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully!",
      token,
      user: savedUser,
    });
  } catch (error) {
    console.error("Error registering user:", error);

    // Handle duplicate key error from MongoDB
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message:
          "Duplicate entry detected! A user with this information already exists.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error registering user!",
      error: error.message,
    });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  const { enterCode, password } = req.body;

  try {
    // Find user by enterCode
    const user = await User.findOne({ enterCode }).populate("name phone email");
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials!" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, SECRET_KEY, {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "Login successful!",
      token,
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Error logging in user!", error });
  }
};

exports.validateTokenController = async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res
      .status(400)
      .json({ success: false, message: "Token is required" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const userId = decoded.userId;

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid token payload" });
    }

    // Check for User
    const user = await User.findById(userId).select(
      "-password -__v -profileImage"
    );
    if (user) {
      return res.status(200).json({
        success: true,
        message: "User validated successfully",
        user,
      });
    }

    // Check for Milkman
    const milkman = await MilkmanModel.findById(userId)
      .select("-password -__v -profileImage")
      .populate("customer", "name enterCode phone") // Populate customer details
      .populate("seller", "name enterCode phone");
    if (milkman) {
      return res.status(200).json({
        success: true,
        message: "Milkman validated successfully",
        user: milkman,
      });
    }

    return res.status(401).json({ success: false, message: "Invalid token" });
  } catch (error) {
    console.error("Token validation error:", error);
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

// Update User Location
exports.updateUserLocation = async (req, res) => {
  const { userId, location } = req.body;

  try {
    if (
      !location ||
      !location.latitude ||
      !location.longitude ||
      !location.accuracy
    ) {
      return res.status(400).json({ message: "Location data is required!" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { location },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.status(200).json({
      message: "User location updated successfully!",
      user,
    });
  } catch (error) {
    console.error("Error updating user location:", error);
    res.status(500).json({ message: "Error updating user location!", error });
  }
};

exports.AddUser = async (req, res) => {
  try {
    // Extract token from request headers
    const token = req.headers.authorization?.split(" ")[1]; // Assuming "Bearer <token>"
    if (!token) {
      return res.status(401).json({ message: "Unauthorized, token missing!" });
    }

    // Decode JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId; // Extract userId from token

    const {
      name,
      phone,
      email,
      village,
      upiId,
      enterCode,
      password,
      userType,
    } = req.body;

    // Validate userType
    if (!["Customer", "Seller"].includes(userType)) {
      return res.status(400).json({ message: "Invalid user type!" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      name,
      phone,
      email,
      village,
      enterCode,
      password: hashedPassword,
      userType,
      upiId,
      milkman: userId,
    });

    await user.save();

    // Find the Milkman and update based on userType
    const updatedMilkman = await MilkmanModel.findByIdAndUpdate(
      userId,
      userType === "Customer"
        ? { $push: { customer: user._id } }
        : { $push: { seller: user._id } },
      { new: true }
    );

    if (!updatedMilkman) {
      return res.status(404).json({ message: "Milkman not found!" });
    }

    res.status(201).json({
      message: `User registered successfully as ${userType}!`,
      user,
      milkman: updatedMilkman,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Error registering user!", error });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1]; // Extract the token from the Authorization header

    if (!token) {
      return res
        .status(401)
        .json({ message: "Access Denied, No Token Provided" });
    }

    // Decode the token manually
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace JWT_SECRET with your secret key

    if (!decoded) {
      return res.status(403).json({ message: "Invalid Token" });
    }

    // The user ID is stored in the token payload
    const userId = decoded.userId;

    // Fetch user data from the database using the userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the user profile data (excluding sensitive info like password)
    const userProfile = {
      name: user.name,
      email: user.email,
      phone: user.phone,
      profileImage: user.profileImage,
    };

    res.json(userProfile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Define the multer storage configuration
exports.updateProfile = async (req, res) => {
  try {
    console.log("Received File:", req.file); // Debugging log

    const token = req.headers["authorization"]?.split(" ")[1]; // Extract token
    if (!token) {
      return res
        .status(401)
        .json({ message: "Access Denied, No Token Provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(403).json({ message: "Invalid Token" });
    }

    const userId = decoded.userId;
    const { name, phone, email } = req.body;

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update fields
    user.name = name || user.name;
    user.phone = phone || user.phone;
    user.email = email || user.email;

    // If image is uploaded, update profile image
    if (req.file) {
      user.profileImage = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }

    await user.save();

    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.changeMilkMan = async (req, res) => {
  try {
    // Step 1: Decode the token to get userId
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    // Step 2: Find the user based on decoded userId
    const user = await User.findById(userId).populate("milkman"); // Populate to get user details
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Step 3: Find the new milkman
    const { milkmanId } = req.body; // Get the selected milkmanId
    const milkman = await MilkmanModel.findById(milkmanId);
    if (!milkman) {
      return res.status(404).json({ message: "Milkman not found" });
    }

    // Step 4: Check if the selected milkman is the same as the current one
    if (user.milkman.toString() === milkmanId) {
      return res
        .status(400)
        .json({ message: "User is already assigned to this milkman" });
    }

    // Step 5: Remove the old milkman from the user's list (if it exists)
    if (user.milkman) {
      if (user.userType === "Seller") {
        await MilkmanModel.findByIdAndUpdate(user.milkman, {
          $pull: { seller: userId },
        });
      } else if (user.userType === "Customer") {
        await MilkmanModel.findByIdAndUpdate(user.milkman, {
          $pull: { customer: userId },
        });
      }
    }

    // Step 6: Update the user's milkman field
    user.milkman = milkmanId;

    // Step 7: Check if the user is already in the new milkman's list before adding
    if (user.userType === "Seller") {
      if (!milkman.seller.includes(userId)) {
        await MilkmanModel.findByIdAndUpdate(milkmanId, {
          $push: { seller: userId },
        });
      } else {
        return res
          .status(400)
          .json({ message: "User is already in the seller list" });
      }
    } else if (user.userType === "Customer") {
      if (!milkman.customer.includes(userId)) {
        await MilkmanModel.findByIdAndUpdate(milkmanId, {
          $push: { customer: userId },
        });
      } else {
        return res
          .status(400)
          .json({ message: "User is already in the customer list" });
      }
    }

    // Step 8: Save the updated user
    await user.save();

    res.status(200).json({ message: "Milkman updated successfully!" });
  } catch (error) {
    console.error("Error updating milkman:", error);
    res.status(500).json({ message: "Failed to update milkman." });
  }
};

exports.getNotificationCustomer = async (req, res) => {
  try {
    // Extract token from request headers
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Verify and decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId; // Extract user ID from the token

    // Find orders for the user and sort by date in descending order
    const orders = await advancebookModal.find({ userId }).sort({ date: -1 });

    console.log(orders);
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAdvance = async (req, res) => {
  try {
    // Check if Authorization header exists
    const token = req.header("Authorization")?.split(" ")[1]; // Assuming token is sent as 'Bearer <token>'

    console.log(token);
    if (!token) {
      return res.status(401).json({ message: "Authorization token missing" });
    }

    // Decode the token to get the user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const milkmanId = decoded.userId;
    const orders = await advancebookModal
      .find({ milkmanId })
      .sort({ date: -1 });
    const unseenCount = await advancebookModal.countDocuments({
      milkmanId,
      isSeen: false,
    });

    res.status(200).json({
      orders: orders.sort((a, b) => new Date(a.date) - new Date(b.date)), // Ensuring date-wise sorting
      unseenCount,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getNotificationCount = async (req, res) => {
  try {
    // Check if Authorization header exists
    const token = req.header("Authorization")?.split(" ")[1]; // Assuming token is sent as 'Bearer <token>'
    if (!token) {
      return res.status(401).json({ message: "Authorization token missing" });
    }

    // Decode the token to get the user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const milkmanId = decoded.userId;
    const unseenCount = await advancebookModal.countDocuments({
      milkmanId,
      isSeen: false,
    });
    res.status(200).json(unseenCount);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.getMilkmanData = async (req, res) => {
  try {
    // Extract the token from the Authorization header
    const token = req.header("Authorization")?.split(" ")[1]; // Assuming token is sent as 'Bearer <token>'

    console.log(token);
    if (!token) {
      return res.status(401).json({ message: "Authorization token missing" });
    }

    // Decode the token to get the user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace 'your_jwt_secret' with your JWT secret key

    console.log(decoded);
    // Use the user ID from the decoded token to find the Milkman
    const milkman = await Milkman.findById(decoded.userId);

    if (!milkman) {
      return res.status(404).json({ message: "Milkman not found" });
    }

    return res.json({ milkman: milkman });
  } catch (error) {
    console.error("Error fetching milkman data:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Controller function to get the user's profile
exports.getProfile = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Getting token from Authorization header

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Decode the token to get the user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user by ID and return the profile
    const user = await User.findById(decoded.userId).select("profileImage"); // Select only profileImage

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      profile: {
        profileImage: user.profileImage, // Return profileImage
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Fetch milk records for a user
exports.getMilkRecords = async (req, res) => {
  try {
    const userId = req.user.userId; // Extract userId from token
    const { date } = req.query;

    if (!date) {
      return res
        .status(400)
        .json({ success: false, message: "Date is required" });
    }

    // Convert date to proper format for searching
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Find milk records for the user on the given date
    const records = await milkModal
      .find({
        userId: userId,
        date: { $gte: startOfDay, $lte: endOfDay },
      })
      .populate("milkmanId", "name");
    res.status(200).json({ success: true, data: records });
  } catch (error) {
    console.error("Error fetching milk records:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get milk records based on user and date range
exports.getMilkRecordsBulk = async (req, res) => {
  try {
    console.log("Come");
    // Extract token from headers
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Decode user ID from token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Extract dates from query params
    const { from, to } = req.query;

    console.log(from);
    console.log(to);
    if (!from || !to) {
      return res.status(200).json({ message: "Please provide date range" });
    }

    // Fetch milk records within the date range
    const records = await milkModal.find({
      userId,
      date: { $gte: new Date(from), $lte: new Date(to) },
    });

    // Calculate total liters and price
    let totalLiters = 0,
      totalPrice = 0,
      totalRate = 0;
    records.forEach((record) => {
      totalLiters += record.kg;
      totalPrice += record.kg * record.rate;
      totalRate += record.rate;
    });

    const avgRate =
      records.length > 0 ? (totalRate / records.length).toFixed(2) : 0;

    res.status(200).json({
      records,
      totalLiters,
      totalPrice,
      avgRate,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getMonth = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decode token
    const userId = decoded.userId; // Extract userId

    const { month, year } = req.query;
    if (!month || !year) {
      return res.status(400).json({ message: "Month and Year are required" });
    }

    // Convert month/year to a date range
    const startDate = new Date(`${year}-${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + 1);
    endDate.setDate(0);

    // Fetch milk records for the user within the selected month
    const records = await milkModal.find({
      userId,
      date: { $gte: startDate, $lte: endDate },
    });

    // Aggregate Data
    const totalLiters = records.reduce((sum, record) => sum + record.kg, 0);
    const totalAmount = records.reduce(
      (sum, record) => sum + record.kg * record.rate,
      0
    );
    const avgRate = records.length ? (totalAmount / totalLiters).toFixed(2) : 0;

    return res.json({
      month,
      totalLiters,
      totalAmount,
      avgRate,
    });
  } catch (error) {
    console.error("Error fetching monthly records:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getMilkRecordsSeller = async (req, res) => {
  try {
    const userId = req.user.userId; // Extract userId from token
    const { date } = req.query;

    if (!date) {
      return res
        .status(400)
        .json({ success: false, message: "Date is required" });
    }

    // Convert date to proper format for searching
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Find milk records for the user on the given date
    const records = await sellerMilkModal
      .find({
        userId: userId,
        date: { $gte: startOfDay, $lte: endOfDay },
      })
      .populate("milkmanId", "name");
    res.status(200).json({ success: true, data: records });
  } catch (error) {
    console.error("Error fetching milk records:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get milk records based on user and date range
exports.getMilkRecordsBulkSeller = async (req, res) => {
  try {
    console.log("Come daily milk bulk");
    // Extract token from headers
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Decode user ID from token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    console.log(userId);
    // Extract dates from query params
    const { from, to } = req.query;

    console.log(from);
    console.log(to);
    if (!from || !to) {
      return res.status(200).json({ message: "Please provide date range" });
    }
    const startDate = new Date(from);
    startDate.setHours(0, 0, 0, 0); // Set to start of the day

    const endDate = new Date(to);
    endDate.setHours(23, 59, 59, 999); // Set to end of the day

    // Fetch milk records within the date range
    const records = await sellerMilkModal.find({
      userId,
      date: {
        $gte: startDate, // Start of the day
        $lte: endDate, // End of the day
      },
    });

    console.log(records);
    // Calculate total liters and price
    let totalLiters = 0,
      totalPrice = 0,
      totalRate = 0;
    records.forEach((record) => {
      totalLiters += record.kg;
      totalPrice += record.kg * record.rate;
      totalRate += record.rate;
    });

    const avgRate =
      records.length > 0 ? (totalRate / records.length).toFixed(2) : 0;

    console.log(totalLiters);
    console.log(totalPrice);
    res.status(200).json({
      records,
      totalLiters,
      totalPrice,
      avgRate,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getMonthSeller = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decode token
    const userId = decoded.userId; // Extract userId

    const { month, year } = req.query;
    if (!month || !year) {
      return res.status(400).json({ message: "Month and Year are required" });
    }

    // Convert month/year to a date range
    const startDate = new Date(`${year}-${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + 1);
    endDate.setDate(0);

    // Fetch milk records for the user within the selected month
    const records = await sellerMilkModal.find({
      userId,
      date: { $gte: startDate, $lte: endDate },
    });

    // Aggregate Data
    const totalLiters = records.reduce((sum, record) => sum + record.kg, 0);
    const totalAmount = records.reduce(
      (sum, record) => sum + record.kg * record.rate,
      0
    );
    const avgRate = records.length ? (totalAmount / totalLiters).toFixed(2) : 0;

    return res.json({
      month,
      totalLiters,
      totalAmount,
      avgRate,
    });
  } catch (error) {
    console.error("Error fetching monthly records:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.milkRecordsFromMilkman = async (req, res) => {
  try {
    const { userId, month } = req.query;
    if (!userId || !month) {
      return res
        .status(400)
        .json({ message: "User ID and month are required" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    console.log(user);
    const isSeller = user.userType === "seller";
    const MilkRecordModel = isSeller ? sellerMilkModal : milkModal;

    // Convert month name to a date range
    const monthIndex = new Date(Date.parse(month + " 1, 2023")).getMonth();
    const startDate = new Date(new Date().getFullYear(), monthIndex, 1);
    const endDate = new Date(new Date().getFullYear(), monthIndex + 1, 0);

    // Query the records
    const milkRecords = await MilkRecordModel.find({
      userId,
      date: { $gte: startDate, $lte: endDate },
    });
    let totalLiters = 0,
      totalRate = 0;

    milkRecords.forEach((record) => {
      totalLiters += record.kg;
      totalRate += record.rate * record.kg; // Corrected calculation
    });
    const avgRate = totalLiters > 0 ? (totalRate / totalLiters).toFixed(2) : 0;

    res.json({ totalLiters, totalRate, avgRate });
  } catch (error) {
    console.error("Error fetching milk records:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.superAdminDash = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Count feedback requests from the last 7 days
    const helpRequestCount = await Feedback.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    });

    // Count milkmen created in the last 7 days
    const milkmanCount = await Milkman.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    });

    // Get the latest 5 registered users with only name and email
    const latestUsers = await User.find({}, { name: 1, email: 1, _id: 0 })
      .sort({ createdAt: -1 })
      .limit(5);

    return res.json({
      helpRequests: helpRequestCount,
      milkmenCreated: milkmanCount,
      latestUsers,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getAllMilkManSuperAdmin = async (req, res) => {
  try {
    const milkmen = await Milkman.find({}, "name email"); // Fetch only name & email
    res.status(200).json(milkmen);
  } catch (error) {
    console.error("Error fetching milkmen:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getMonthDashboard = async (req, res) => {
  try {
    console.log("Fetching Monthly Dashboard Data");

    // Check for authorization header
    if (!req.headers.authorization) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Decode token and get userId
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Get the current date and calculate one year ago
    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);
    oneYearAgo.setMonth(today.getMonth());
    oneYearAgo.setDate(1); // Start from the first day of that month

    // Fetch sell and buy milk records
    const sellMilkRecords = await milkModal.find({
      userId: userId,
      date: { $gte: oneYearAgo, $lte: today },
    });

    const buyMilkRecords = await sellMilkModalRecord.find({
      userId: userId,
      date: { $gte: oneYearAgo, $lte: today },
    });

    // Initialize data structure for last 12 months
    const monthData = {};
    for (let i = 0; i < 12; i++) {
      const month = new Date();
      month.setMonth(today.getMonth() - i);
      const monthKey = month.toISOString().slice(0, 7); // YYYY-MM
      monthData[monthKey] = { sellMilk: 0, buyMilk: 0, profit: 0 };
    }

    // Process sell milk records
    sellMilkRecords.forEach((record) => {
      const month = record.date.toISOString().slice(0, 7);
      if (monthData[month]) {
        monthData[month].sellMilk += record.kg * record.rate;
      }
    });

    // Process buy milk records
    buyMilkRecords.forEach((record) => {
      const month = record.date.toISOString().slice(0, 7);
      if (monthData[month]) {
        monthData[month].buyMilk += record.kg * record.rate;
      }
    });

    // Calculate profit for each month
    Object.keys(monthData).forEach((month) => {
      monthData[month].profit =
        monthData[month].sellMilk - monthData[month].buyMilk;
    });

    // Convert object to array sorted by month (latest first)
    const formattedData = Object.keys(monthData)
      .sort((a, b) => new Date(b) - new Date(a))
      .map((month) => ({
        month,
        sellMilk: monthData[month].sellMilk,
        buyMilk: monthData[month].buyMilk,
        profit: monthData[month].profit,
      }));

    res.status(200).json({ success: true, data: formattedData });
  } catch (error) {
    console.error("Error fetching monthly dashboard:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.getMilkManDataUser = async (req, res) => {
  try {
    console.log("Come");
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Authorization token missing" });
    }

    // Decode the token to get the user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Find the user by userId
    const user = await User.findById(userId).populate("milkman");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Find the milkman associated with the user
    const milkManData = await Milkman.findById(user.milkman).select(
      "-password -requests -products -location -categoryProduct -customer -seller -subcriptionCode -buyMilk -sellMilk -profileImage"
    );
    if (!milkManData) {
      return res.status(404).json({ message: "Milkman not found" });
    }

    res.status(200).json(milkManData);
  } catch (error) {
    console.error("Error fetching Milkman data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.forgotPassword = async (req, res) => {
  const { enterCode } = req.body;

  try {
    const user = await User.findOne({ enterCode });

    if (!user || !user.email) {
      return res.status(404).json({ message: "User not found!" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    user.resetToken = token;
    user.resetTokenExpiry = expiresAt;
    await user.save();

    const resetLink = `${CLIENT_URL}/reset-password/${token}`;
    // console.log(resetLink);

    // Nodemailer setup
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "arijitghosh1203@gmail.com",
        pass: "sbkz nlun jawd ykki",
      },
    });

    const mailOptions = {
      from: "no-reply@yourdomain.com",
      to: user.email,
      subject: "Reset Your Password - Halo Dairy",
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 30px;">
          <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
            <img src="https://www.dairyfoods.com/ext/resources/DF/2024/Nov/GettyImages-2150650373.jpg?height=740&t=1734040205&width=auto" alt="Dairy Farm" style="width: 100%; height: auto;" />

            <div style="padding: 30px;">
              <h2 style="color: #333;">Hello ${
                user.name
              }, welcome to <strong>Halo Dairy</strong> 🐄</h2>

              <p style="font-size: 16px; color: #555;">
                We received a request to reset your password. Click the button below to create a new one:
              </p>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetLink}" style="display: inline-block; padding: 12px 25px; background-color: #40A1CB; color: white; text-decoration: none; border-radius: 5px; font-size: 16px;">
                  Reset Password
                </a>
              </div>

              <p style="font-size: 14px; color: #999;">
                This link will expire in 15 minutes.<br />
                If you didn’t request this, please ignore this email.
              </p>

              <p style="margin-top: 40px; font-size: 12px; color: #ccc; text-align: center;">
                © ${new Date().getFullYear()} Halo Dairy. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res
      .status(200)
      .json({
        message: "Reset link sent to your email. It will expire in 15 minutes.",
      });
  } catch (err) {
    console.error("Error sending reset email:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() }, // Ensure Date object is used
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful!" });
  } catch (err) {
    console.error("Error resetting password:", err);
    res.status(500).json({ message: "Server error" });
  }
};
