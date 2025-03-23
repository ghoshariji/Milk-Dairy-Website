const Coupon = require("../modal/couponModal");

// Create a new coupon
exports.Addcoupon = async (req, res) => {
  try {
    const { discount, expiryDate } = req.body;
    const code = `COUPON-${Math.random()
      .toString(36)
      .substr(2, 6)
      .toUpperCase()}`;

    const newCoupon = new Coupon({ code, discount, expiryDate });
    await newCoupon.save();

    res
      .status(201)
      .json({ message: "Coupon created successfully", coupon: newCoupon });
  } catch (error) {
    console.error("Error creating coupon:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all coupons
exports.getAllCoupon = async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.status(200).json(coupons);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a coupon
exports.deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCoupon = await Coupon.findByIdAndDelete(id);
    if (!deletedCoupon)
      return res.status(404).json({ message: "Coupon not found" });

    res
      .status(200)
      .json({ message: "Coupon deleted successfully", deletedCoupon });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

