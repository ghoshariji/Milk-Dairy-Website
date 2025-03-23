// controllers/productController.js
const Milkman = require("../modal/milkmanModal");
const Product = require("../modal/ProductModal");
const jwt = require("jsonwebtoken");
const User = require("../modal/userModal");
const orderModal = require("../modal/productOrderModal")
// controllers/ProductController.js

exports.createProduct = async (req, res) => {
  try {
    // Step 1: Decode the token to get the user ID
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace with your JWT secret
    const userId = decoded.userId;

    // Step 2: Extract product data from the request body
    const { name, price, description, category } = req.body;

    // Step 3: Create a new product and associate it with the user
    const product = new Product({
      name,
      price,
      description,
      category,
      image: req.file // Handle image upload with Multer
        ? { data: req.file.buffer, contentType: req.file.mimetype }
        : undefined,
    });

    // Save the product to the database
    const savedProduct = await product.save();

    // Step 4: Associate the product with the user's product array
    const milkman = await Milkman.findById(userId);
    if (!milkman) {
      return res
        .status(404)
        .json({ success: false, message: "Milkman not found" });
    }

    milkman.products.push(savedProduct._id); // Add the product ID to the user's product list
    await milkman.save();

    // Step 5: Respond with success
    res
      .status(201)
      .json({
        success: true,
        message: "Product created",
        product: savedProduct,
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUserProducts = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const milkman = await Milkman.findById(userId).populate("products");
    if (!milkman) {
      return res
        .status(404)
        .json({ success: false, message: "Milkman not found" });
    }

    const productsWithImages = milkman.products.map((product) => {
      let imageUrl = null;

      if (product.image && product.image.data) {
        const base64Image = `data:${
          product.image.contentType
        };base64,${product.image.data.toString("base64")}`;
        imageUrl = base64Image;
      } else if (product.image && typeof product.image === "string") {
        imageUrl = product.image;
      }

      return {
        ...product.toObject(),
        image: imageUrl,
      };
    });

    res.status(200).json({ success: true, products: productsWithImages });
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUserProductsForUpdateManuallySellMilk = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const milkman = await Milkman.findById(userId).populate({
      path: 'products',
      select: '_id name' // Only fetch _id and name fields for products
    });

    if (!milkman) {
      return res
        .status(404)
        .json({ success: false, message: "Milkman not found" });
    }

    res.status(200).json({ success: true, products: milkman.products });
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single product
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a product
exports.updateProduct = async (req, res) => {
  try {
    console.log(req.body)
    const { name, price, description, category } = req.body;
    const updatedData = { name, price, description, category };

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Product updated", product });
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    // Decode token to get the milkman ID
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const milkmanId = decoded.userId; // Extract user ID

    // Find and delete the product
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Remove the product ID from the milkman's products array
    await Milkman.findByIdAndUpdate(milkmanId, {
      $pull: { products: req.params.id },
    });

    res.status(200).json({ success: true, message: "Product deleted successfully" });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Fetch customer products

exports.getCustomerProduct = async (req, res) => {
  try {
    console.log("Fetching customer products...");

    // Extract token
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    const userId = decoded.userId;

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user is linked to a milkman
    if (!user.milkman) {
      return res
        .status(400)
        .json({ message: "User is not associated with any milkman" });
    }

    // Find milkman & populate products
    const milkman = await Milkman.findById(user.milkman).populate("products");
    if (!milkman) {
      return res.status(404).json({ message: "Milkman not found" });
    }

    // Check if products exist
    if (!milkman.products || milkman.products.length === 0) {
      return res
        .status(404)
        .json({ message: "No products found for this milkman" });
    }

    // Send response
    res.status(200).json({ products: milkman.products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Fetch products by multiple IDs
exports.getCustomerProductByIdCart = async (req, res) => {
  try {
    const { productIds } = req.body; // Expecting an array of product IDs

    // Find the products by ID and only return specific fields (name, price, description)
    const products = await Product.find(
      { '_id': { $in: productIds } },
      { name: 1, price: 1, description: 1 } // Specify fields to include in the response
    );

    if (!products.length) {
      return res.status(404).json({ message: 'No products found' });
    }

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products' });
  }
};



