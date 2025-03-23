const express = require("express");
const router = express.Router();
const couponController = require("../controller/couponController");

router.post("/add", couponController.Addcoupon);
router.get("/get",  couponController.getAllCoupon);
router.delete("/delete/:id",  couponController.deleteCoupon);

module.exports = router;
