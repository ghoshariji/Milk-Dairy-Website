const express = require("express");
const {
  registerUser,
  loginUser,
  validateTokenController,
  AddUser,
  getUserProfile,
  updateProfile,
  changeMilkMan,
  getNotificationCustomer,
  getAdvance,
  getNotificationCount,
  getMilkmanData,
  getProfile,
  getMilkRecords,
  getMilkRecordsBulk,
  getMonth,
  getMilkRecordsSeller,
  getMilkRecordsBulkSeller,
  getMonthSeller,
  milkRecordsFromMilkman,
  superAdminDash,
  getAllMilkManSuperAdmin,
  getMonthDashboard,
  getMilkManDataUser
} = require("../controller/userController");
const upload = require("../middleware/multer"); // Import multer middleware
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Register user
router.post("/register", registerUser);

// Login user
router.post("/login", loginUser);

router.post("/validate-token", validateTokenController);
router.post("/add-user", AddUser);
router.get("/get-profile", getUserProfile);
router.put("/update-profile", upload.single("updateProfile"), updateProfile);
router.post("/select-milkman", changeMilkMan);
router.get("/get-notification", getNotificationCustomer);
router.get("/getadvanceMilkman", getAdvance);
router.get("/getNotificationCount", getNotificationCount);
router.get("/get-milkman", getMilkmanData);
router.get("/profile", getProfile); // Route to get the user's profile

router.get("/getMilkRecord", authMiddleware, getMilkRecords);
router.get("/records", authMiddleware, getMilkRecordsBulk);
router.get("/monthly-records", authMiddleware, getMonth);


router.get("/getMilkRecord-seller", authMiddleware, getMilkRecordsSeller);
router.get("/records-seller", authMiddleware, getMilkRecordsBulkSeller);
router.get("/monthly-records-seller", authMiddleware, getMonthSeller);

router.get("/milk-records-from-milkman", milkRecordsFromMilkman);
router.get("/super-admin", superAdminDash);
router.get("/get-all-user", getAllMilkManSuperAdmin);

router.get("/get-month-dashboard",authMiddleware,getMonthDashboard);
router.get("/get-milkman-data-user", getMilkManDataUser);

module.exports = router;
