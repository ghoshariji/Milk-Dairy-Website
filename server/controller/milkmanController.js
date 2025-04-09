const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Milkman = require("../modal/milkmanModal");
const geolib = require("geolib");
const User = require("../modal/userModal");
const advancebookModal = require("../modal/advancebookModal");

// Register Milkman
exports.registerMilkman = async (req, res) => {
  const {
    name,
    phone,
    email,
    upiId,
    village,
    enterCode,
    subcriptionCode,
    password,
    location,
  } = req.body;

console.log(req.body)
  try {
    // Validate location data
    if (
      !location ||
      !location.latitude ||
      !location.longitude ||
      !location.accuracy
    ) {
      return res.status(400).json({
        message:
          "Location data is required and must include latitude, longitude, and accuracy!",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new milkman instance
    const milkman = new Milkman({
      name,
      phone,
      email,
      upiId,
      village,
      enterCode,
      subcriptionCode,
      password: hashedPassword,
      location,
    });

    // Save milkman to the database
    await milkman.save();

    // Generate a token for the milkman
    const token = jwt.sign(
      { userId: milkman._id, phone: milkman.phone },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Send response with the token and user details
    return res.status(201).json({
      message: "Milkman registered successfully!",
      token,
    });
  } catch (error) {
    console.error("Error:", error);

    // Handle duplicate key error (E11000)
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyPattern)[0]; // Get the duplicate field name
      return res.status(400).json({
        message: `${duplicateField} '${error.keyValue[duplicateField]}' already exists`,
      });
    }

    res.status(500).json({ message: "Error registering milkman!", error });
  }
};

// Login Milkman
exports.loginMilkman = async (req, res) => {
  const { enterCode, password } = req.body;

  console.log(req.body)
  try {
    // Find milkman by enterCode
    const milkman = await Milkman.findOne({ enterCode });
    if (!milkman) {
      return res.status(404).json({ message: "Milkman not found!" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, milkman.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials!" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: milkman._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "Login successful!",
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in milkman!", error });
  }
};

exports.getAllMilkmen = async (req, res) => {
  try {
    const { latitude, longitude } = req.params; // Extracting from params

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude are required!",
      });
    }

    const userLocation = {
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    };

    const milkmen = await Milkman.find().select("-password -profileImage");

    const nearbyMilkmen = milkmen
      .map((milkman) => {
        if (milkman.location?.latitude && milkman.location?.longitude) {
          const milkmanLocation = {
            latitude: milkman.location.latitude,
            longitude: milkman.location.longitude,
          };

          const distanceInMeters = geolib.getDistance(userLocation, milkmanLocation);
          const distanceInKm = (distanceInMeters / 1000).toFixed(2); // Convert to KM

          if (distanceInKm <= 30) { // Check within 30km range
            return {
              ...milkman.toObject(), // Convert Mongoose document to object
              distance: `${distanceInKm} km`,
            };
          }
        }
        return null;
      })
      .filter(Boolean); // Remove null values

    if (!nearbyMilkmen.length) {
      return res.status(404).json({
        success: false,
        message: "No milkmen found within a 30 km radius!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Milkmen fetched successfully!",
      milkmen: nearbyMilkmen,
    });
  } catch (error) {
    console.error("Error fetching milkmen:", error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching milkmen!",
      error: error.message,
    });
  }
};


exports.updateMilkman = async (req, res) => {
  console.log(req.body)
  const { name, email, phone } = req.body;
  console.log("Request Body:", req.body); // Debugging log to ensure correct data is coming

  try {
    // Extract token from the Authorization header
    const token = req.headers["authorization"]?.split(" ")[1]; // Ensure the token is present
    if (!token) {
      return res.status(401).json({ message: "No token provided!" });
    }

    // Decode the token to get the userId
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Assuming JWT_SECRET is stored in your env
    const userId = decoded.userId; // User ID from token

    // Find the milkman by ID (userId from token)
    const milkman = await Milkman.findById(userId);

    if (!milkman) {
      return res.status(404).json({ message: "Milkman not found!" });
    }

    // Update fields with new values if provided
    milkman.name = name || milkman.name;
    milkman.email = email || milkman.email;
    milkman.phone = phone || milkman.phone;

    // If an image file is uploaded, save it in the required format
    if (req.file) {
      console.log("File uploaded:", req.file); // Debugging log to check if file is uploaded
      milkman.profileImage = {
        data: req.file.buffer, // Buffer data of the uploaded image
        contentType: req.file.mimetype, // MIME type (e.g., 'image/jpeg')
      };
    } else {
      console.log("No file uploaded, skipping profile image update.");
    }

    // Save updated milkman document
    const updatedMilkman = await milkman.save();

    // Respond with success message and updated data
    res.status(200).json({
      message: "Milkman updated successfully!",
    });
  } catch (error) {
    console.error("Error during update:", error); // Debugging log for catching errors
    res
      .status(500)
      .json({ message: "Error updating milkman!", error: error.message });
  }
};

// Controller to fetch Milkman data
exports.getMilkmanData = async (req, res) => {
  try {
    console.log("Come");
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

// Function to get customer data by ID
exports.getCustomerById = async (req, res) => {
  try {
    console.log("Come");
    const customerId = req.params.id; // Get the customer ID from URL params

    console.log(customerId);
    // Find the customer by ID in the database
    const customer = await User.findById(customerId).select(
      "-password -profileImage"
    );

    if (!customer) {
      return res
        .status(404)
        .json({ success: false, message: "Customer not found" });
    }

    return res.status(200).json({ success: true, customer });
  } catch (error) {
    console.error("Error fetching customer:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.customerDeleteByMilkMan = async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Accept Order
exports.acceptOrder = async (req, res) => {
  try {
    // Extract token from headers
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    // Decode token to get userId
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Get Order ID from query
    const { id } = req.query;

    // Find order with userId and milkmanId
    const order = await advancebookModal.findOne({
      _id: id,
      milkmanId: userId,
    });
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Update status to "accepted"
    order.status = "accepted";
    order.isSeen = true;
    await order.save();

    res.status(200).json({ message: "Order accepted successfully", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Reject Order
exports.rejectOrder = async (req, res) => {
  try {
    // Extract token from headers
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    // Decode token to get userId
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Get Order ID from query
    const { id } = req.query;

    // Find order with userId and milkmanId
    const order = await advancebookModal.findOne({
      _id: id,
      milkmanId: userId,
    });
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Update status to "rejected"
    order.status = "rejected";
    order.isSeen = true;
    await order.save();

    res.status(200).json({ message: "Order rejected successfully", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.markAsSeen = async (req, res) => {
  try {
    console.log("COme");
    // Get Authorization token
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Authorization token missing" });
    }

    // Decode the token to get the user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const milkmanId = decoded.userId;

    // Get the order ID from query params
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ message: "Order ID is required" });
    }

    // Find and update the order as seen
    const updatedOrder = await advancebookModal.findOneAndUpdate(
      { _id: id, milkmanId },
      { isSeen: true },
      { new: true } // Return the updated document
    );

    if (!updatedOrder) {
      return res
        .status(404)
        .json({ message: "Order not found or unauthorized" });
    }

    res.status(200).json({ message: "Order marked as seen", updatedOrder });
  } catch (error) {
    console.error("Error marking order as seen:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Add Category
exports.addCategory = async (req, res) => {
  try {
    const userId = req.user.userId; // Extract user ID from decoded token
    const { name } = req.body;

    if (!name)
      return res.status(400).json({ error: "Category name is required" });

    const milkman = await Milkman.findById(userId);
    if (!milkman) return res.status(404).json({ error: "Milkman not found" });

    milkman.categoryProduct.push({ name });
    await milkman.save();

    res
      .status(201)
      .json({ message: "Category added successfully", category: { name } });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

// ✅ Edit Category
exports.editCategory = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { categoryId } = req.params;
    const { name } = req.body;

    if (!name)
      return res.status(400).json({ error: "Category name is required" });

    const milkman = await Milkman.findById(userId);
    if (!milkman) return res.status(404).json({ error: "Milkman not found" });

    const category = milkman.categoryProduct.id(categoryId);
    if (!category) return res.status(404).json({ error: "Category not found" });

    category.name = name;
    await milkman.save();

    res
      .status(200)
      .json({ message: "Category updated successfully", category });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

// ✅ Delete Category
exports.deleteCategory = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { categoryId } = req.params;

    const milkman = await Milkman.findById(userId);
    if (!milkman) return res.status(404).json({ error: "Milkman not found" });

    milkman.categoryProduct = milkman.categoryProduct.filter(
      (cat) => cat._id.toString() !== categoryId
    );
    await milkman.save();

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

// ✅ Fetch All Categories
exports.getCategories = async (req, res) => {
  try {
    const userId = req.user.userId;
    const milkman = await Milkman.findById(userId);
    if (!milkman) return res.status(404).json({ error: "Milkman not found" });

    res.status(200).json({ categories: milkman.categoryProduct });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

exports.updateMilkRate = async (req, res) => {
  const { id } = req.params; // Get user ID from request params
  const { rate } = req.body; // Get new rate from request body

  if (!rate) {
    return res.status(400).json({ message: "Rate is required." });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: { milkRate: rate } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({
      message: "Milk rate updated successfully!",
      user: updatedUser,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

