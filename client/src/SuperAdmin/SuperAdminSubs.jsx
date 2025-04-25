import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import SuperAdminSidebar from "../components/SuperSidebar/SuperAdminSidebar";
import Loader from "../components/Loader/Loader";
import { toast, ToastContainer } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

const SuperAdminSubs = () => {
  const [discount, setDiscount] = useState("");
  const [expiryDate, setExpiryDate] = useState(new Date());
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);

  const formatDate = (dateString) => {
    return format(new Date(dateString), "dd-MM-yyyy");
  };

  const copyToClipboard = async (text) => {
    await navigator.clipboard.writeText(text);
    toast.success("Coupon code copied to clipboard.");
  };

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_SERVER}/api/coupon/get`
      );
      const data = await response.json();
      setLoading(false);

      setCoupons(data);
    } catch (error) {
      setLoading(false);

      console.error("Error fetching coupons:", error);
    }
  };

  const generateCoupon = async () => {
    if (!discount || !expiryDate) {
      toast.info("Please enter discount and expiry date.");
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_SERVER}/api/coupon/add`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            discount: Number(discount),
            expiryDate: expiryDate.toISOString().split("T")[0],
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        fetchCoupons();
        toast.success(`Coupon Generated: ${data.coupon.code}`);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Internal Server Error...");

      console.error("Error generating coupon:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteCoupon = async (id) => {
    try {
      setLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_SERVER}/api/coupon/delete/${id}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        setCoupons(coupons.filter((coupon) => coupon._id !== id));
        toast.success("Coupon removed successfully.");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      setLoading(false);
      toast.error("Internal Server Error...");

      console.error("Error deleting coupon:", error);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  return (
    <div className="flex">
      <SuperAdminSidebar />
      <ToastContainer />
      {/* Sidebar */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center z-50  bg-opacity-50 backdrop-blur-md">
          <Loader />
        </div>
      )}

    <div className="w-full lg:ml-64 mt-20">
      {/* Main Content */}
      <main className="flex-1 p-6 bg-white">
        <motion.h1
          className="text-3xl font-bold mb-4 text-[#40A1CB]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Manage Coupons
        </motion.h1>

        {/* Form */}
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <label htmlFor="discount" className="block mb-2 text-sm font-semibold text-gray-700">
              Discount Value (%)
            </label>
            <input
              id="discount"
              type="number"
              placeholder="Discount Value (%)"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              className="border border-[#40A1CB] p-2 rounded w-full"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <label htmlFor="expiryDate" className="block mb-2 text-sm font-semibold text-gray-700">
              Expiry Date
            </label>
            <input
              id="expiryDate"
              type="date"
              value={expiryDate.toISOString().split("T")[0]}
              onChange={(e) => setExpiryDate(new Date(e.target.value))}
              className="border border-[#40A1CB] p-2 rounded w-full"
            />
          </motion.div>
        </div>

        <motion.button
          onClick={generateCoupon}
          disabled={loading}
          className="bg-[#40A1CB] text-white px-4 py-2 rounded mb-6 hover:cursor-pointer"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          {loading ? "Generating..." : "Generate Coupon"}
        </motion.button>

        {/* Coupon List */}
        <motion.h2
          className="text-xl font-bold mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          All Coupons
        </motion.h2>

        <motion.div
          className="grid gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          {coupons.map((item) => (
            <motion.div
              key={item._id}
              className="border p-4 rounded shadow-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <p className="font-bold text-lg">Code: {item.code}</p>
              <p>Discount: {item.discount}%</p>
              <p>Expiry: {formatDate(item.expiryDate)}</p>
              <div className="flex gap-2 mt-4">
                <motion.button
                  onClick={() => deleteCoupon(item._id)}
                  className="border border-[#40A1CB] text-[#40A1CB] px-4 py-1 rounded hover:cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  Delete
                </motion.button>
                <motion.button
                  onClick={() => copyToClipboard(item.code)}
                  className="bg-[#40A1CB] text-white px-4 py-1 rounded hover:cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  Copy
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>

    </div>
  );
};

export default SuperAdminSubs;
