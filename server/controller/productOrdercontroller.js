const Order = require("../modal/productOrderModal");
const jwt = require("jsonwebtoken");
const User = require("../modal/userModal");

// Middleware to verify token and extract userId
const verifyToken = (req) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Extract Bearer token
    if (!token) return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.userId;
  } catch (error) {
    return null;
  }
};

// Add Order
exports.addOrder = async (req, res) => {
  try {

    // Extract user ID from token
    const userId = verifyToken(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    // Fetch user details
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { name, phone, deliveryAddress, products, paymentMode } = req.body;

    // Validate required fields
    if (
      !name ||
      !phone ||
      !deliveryAddress ||
      !products ||
      products.length === 0 ||
      !paymentMode
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Ensure products are correctly structured
    const formattedProducts = products.map((product) => ({
      productId: product.productId,
      name: product.name,
      price: product.price,
      quantity: product.quantity || 1,
    }));

    // Create new order
    const newOrder = new Order({
      userId,
      name,
      milkmanId: user.milkman,
      phone: phone,
      deliveryAddress,
      products: formattedProducts,
      status: "pending",
      paymentMode,
      createdAt: new Date(),
    });

    // Save to database
    await newOrder.save();
    res
      .status(201)
      .json({ message: "Order created successfully", order: newOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
// Get All Orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("userId milkmanId productId");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Edit Order
exports.editOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, deliveredBy, paymentMode } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status, deliveredBy, paymentMode },
      { new: true }
    );

    if (!updatedOrder)
      return res.status(404).json({ message: "Order not found" });

    res
      .status(200)
      .json({ message: "Order updated successfully", order: updatedOrder });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getTodayProductData = async (req, res) => {
  try {
    const milkmanId = verifyToken(req);
    // Get today's date in YYYY-MM-DD format
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset()); // Adjust for timezone
    const formattedDate = today.toISOString().split("T")[0];

    // Find all orders for today and this milkman
    const orders = await Order.find({
      milkmanId,
      createdAt: {
        $gte: new Date(`${formattedDate}T00:00:00.000Z`),
        $lt: new Date(`${formattedDate}T23:59:59.999Z`),
      },
    });

    // Calculate total items, total quantity, and total price
    let totalItems = 0;
    let totalQuantity = 0;
    let totalPrice = 0;

    orders.forEach((order) => {
      order.products.forEach((product) => {
        totalItems++;
        totalQuantity += product.quantity;
        totalPrice += product.quantity * product.price;
      });
    });

    res.json({ totalItems, totalQuantity, totalPrice, orders });
  } catch (error) {
    console.error("Error fetching product data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.createOrder = async (req, res) => {
  try {

    // Extract token and decode user info
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const milkmanId = decoded.userId; // Get milkman ID from token

    // Validate user existence based on enterCode
    const user = await User.findOne({ enterCode: req.body.code });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user is linked to the milkman
    if (!user.milkman || user.milkman.toString() !== milkmanId) {
      return res.status(403).json({ message: "User is not associated with this milkman" });
    }

    // Validate request body fields
    const { name, phone, deliveryAddress, products } = req.body;
    if (!name || !phone || !deliveryAddress || !products || products.length === 0) {
      return res.status(400).json({ message: "All fields are required, including at least one product" });
    }

    // Prepare the order data
    const orderData = {
      userId: user._id,
      milkmanId,
      name,
      phone,
      deliveryAddress,
      products,
      paymentMode: "cash on", // Default payment mode
      status: "accepted", // Initial order status
      createdAt: new Date(),
    };

    // Create the order
    const newOrder = new Order(orderData);
    await newOrder.save();

    return res.status(201).json({ message: "Order created successfully", order: newOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({ message: "Error creating order", error: error.message });
  }
};

exports.fetchMilkManNotification = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Extract token safely
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const milkManId = decoded.userId;

    // Fetch recent 15 pending orders for the milkman sorted by createdAt (newest first)
    const pendingOrders = await Order.find({
      milkmanId: milkManId,
      status: 'pending'
    })
      .sort({ createdAt: -1 }) // Sort by recent date
      .limit(15) // Fetch only the latest 15 orders
      .populate('userId', 'name phone') // Populate user details
      .populate('products.productId', 'name price') // Populate product details
      .lean(); // Convert mongoose docs to plain objects for faster response
    res.status(200).json({ success: true, data: pendingOrders });
  } catch (error) {
    console.error('Error fetching pending orders:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};



exports.fetchMilkManAcceptOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    
    if (!orderId) {
      return res.status(400).json({ message: 'Order ID is required' });
    }

    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ message: 'Order is already processed' });
    }

    order.status = 'accepted';
    await order.save();

    res.status(200).json({ message: 'Order accepted successfully', order });
  } catch (error) {
    console.error('Error accepting order:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.fetchOrdersByMilkman = async (req, res) => {
  try {
    // Decode token to get milkmanId
    const token = req.headers.authorization.split(" ")[1]; // Extract token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const milkmanId = decoded.userId; // Extract milkmanId from token

    if (!milkmanId) {
      return res.status(400).json({ message: "Milkman ID is required" });
    }

    // Find all orders where status is 'accepted' or 'rejected' for this milkmanId
    const orders = await Order.find({
      milkmanId,
      status: { $in: ["accepted", "rejected"] },
    }).populate("userId", "name phone") // Populate user details
      .populate("products.productId", "name price"); // Populate product details

    res.status(200).json({ message: "Orders fetched successfully", orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};