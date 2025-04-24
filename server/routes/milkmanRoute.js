const express = require("express");
const {
  registerMilkman,
  loginMilkman,
  getAllMilkmen,
  updateMilkman,
  getMilkmanData,
  getCustomerById,
  customerDeleteByMilkMan,
  acceptOrder,
  rejectOrder,
  markAsSeen,
  addCategory,
  editCategory,
  deleteCategory,
  getCategories,
  updateMilkRate,
  getMilkManDetailsToSuperAdmin
} = require("../controller/milkmanController");


const upload = require("../middleware/multer"); // Import multer middleware
const authMiddleware = require("../middleware/authMiddleware"); // Middleware for token decoding

const router = express.Router();

// Register milkman
router.post("/register", registerMilkman);

// Login milkman
router.post("/login", loginMilkman);
router.get("/:id", getCustomerById);
router.delete("/:id", customerDeleteByMilkMan);




// Route to fetch all milkmen
router.get("/get-all/:latitude/:longitude", getAllMilkmen);
router.put("/update", upload.single("profileImage"), updateMilkman);
router.get("/get-milkman", getMilkmanData);

router.post("/accept-order", acceptOrder);

// Reject Order
router.post("/reject-order", rejectOrder);

router.put("/unseen", markAsSeen);

router.post("/category/add", authMiddleware, addCategory);
router.put("/category/edit/:categoryId", authMiddleware, editCategory);
router.delete("/category/delete/:categoryId", authMiddleware, deleteCategory);
router.get("/category/all", authMiddleware, getCategories);
router.post("/update-rate/:id", updateMilkRate);
router.get("/user/:id", getMilkManDetailsToSuperAdmin);




module.exports = router;
