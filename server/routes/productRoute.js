// routes/productRoutes.js
const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const {
  createProduct,
  getUserProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getCustomerProduct,
  getCustomerProductByIdCart,
  getUserProductsForUpdateManuallySellMilk
} = require("../controller/productController");

router.get("/getCustomerProduct", getCustomerProduct);

// Create a new product
router.post("/", upload.single("image"), createProduct);

// Get all products
router.get("/", getUserProducts);
router.get("/get-sellMilk-product", getUserProductsForUpdateManuallySellMilk);

// Get a single product by ID
router.get("/:id", getProductById);

// Update a product
router.put("/:id", upload.single("image"), updateProduct);

// Delete a product
router.delete("/:id", deleteProduct);

router.post('/getCustomerProductByIdCart', getCustomerProductByIdCart);


module.exports = router;
