import React, { useState, useEffect, useRef } from "react";
import AdminNav from "../components/Sidebar/Sidebar";
import API from "../api";
import { toast, ToastContainer } from "react-toastify";
import { motion } from "framer-motion";
import Authentication from "../utils/Authentication";
import Loader from "../components/Loader/Loader";

const MilkmanSellMilk = () => {
  const [formData, setFormData] = useState({
    date: new Date(),
    enterCode: "",
    name: "",
    weight: "",
    rate: "",
  });

  const codeRef = useRef(null);
  const weightRef = useRef(null);
  const rateRef = useRef(null);

  const handleKeyNavigation = (e, current) => {
    if (e.key === "ArrowDown" || e.key === "Enter") {
      if (current === codeRef) weightRef.current.focus();
      else if (current === weightRef) rateRef.current.focus();
    } else if (e.key === "ArrowUp") {
      if (current === rateRef) weightRef.current.focus();
      else if (current === weightRef) codeRef.current.focus();
    } else if (e.key === "ArrowRight") {
      if (current === codeRef) weightRef.current.focus();
      else if (current === weightRef) rateRef.current.focus();
    } else if (e.key === "ArrowLeft") {
      if (current === rateRef) weightRef.current.focus();
      else if (current === weightRef) codeRef.current.focus();
    }
  };

  const [productData, setProductData] = useState({
    date: new Date(),
    name: "",
    phone: "",
    deliveryAddress: "",
    code: "",
    item: "",
    quantity: "",
    price: "",
    paymentMode: "",
  });

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await API.get(
          "/api/milkman/product/get-sellMilk-product"
        );
        setProducts(response.data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const handleMilkSubmit = async () => {
    setLoading(true);
    try {
      await API.post("/api/milk/sell-milk-anydate", formData);
      toast.success("Milk updated successfully");
      setFormData({ date: new Date(), enterCode: "", weight: "", rate: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
    setLoading(false);
  };

  const handleProductAdd = async () => {
    setLoading(true);
    if (
      !productData.name ||
      !productData.phone ||
      !productData.deliveryAddress ||
      !productData.code ||
      !productData.item ||
      !productData.quantity ||
      !productData.price ||
      !productData.paymentMode
    ) {
      toast.error("All fields are required!");
      setLoading(false);
      return;
    }
    try {
      await API.post("/api/order/sell-milk-data-add", productData);
      toast.success("Product added successfully");
      setProductData({
        date: new Date(),
        name: "",
        phone: "",
        deliveryAddress: "",
        code: "",
        item: "",
        quantity: "",
        price: "",
        paymentMode: "",
      });
      setSelectedProduct(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
    setLoading(false);
  };

  return (
    <>
      <AdminNav />
      <ToastContainer />
      <Authentication />

      {loading && (
        <div className="fixed inset-0 flex items-center justify-center z-50  bg-opacity-50 backdrop-blur-md">
          <Loader />
        </div>
      )}
      <div className="lg:ml-64 mt-20 p-6 bg-gray-100 min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-200 transition-transform duration-300 hover:scale-[1.01]"
        >
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="text-2xl font-bold text-[#40A1CB] mb-6"
          >
            Sell Milk
          </motion.h3>

          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Enter Code
              </label>
              <input
                ref={codeRef}
                type="text"
                placeholder="E.g. M123"
                value={formData.enterCode}
                onChange={(e) =>
                  setFormData({ ...formData, enterCode: e.target.value })
                }
                onKeyDown={(e) => handleKeyNavigation(e, codeRef)}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40A1CB] transition duration-200"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="grid grid-cols-2 gap-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Weight (litres)
                </label>
                <input
                  ref={weightRef}
                  type="number"
                  placeholder="e.g. 5"
                  value={formData.weight}
                  onChange={(e) =>
                    setFormData({ ...formData, weight: e.target.value })
                  }
                  onKeyDown={(e) => handleKeyNavigation(e, weightRef)}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40A1CB] transition duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rate (per litre)
                </label>
                <input
                  ref={rateRef}
                  type="number"
                  placeholder="e.g. 50"
                  value={formData.rate}
                  onChange={(e) =>
                    setFormData({ ...formData, rate: e.target.value })
                  }
                  onKeyDown={(e) => handleKeyNavigation(e, rateRef)}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40A1CB] transition duration-200"
                />
              </div>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2 }}
              className="w-full bg-[#40A1CB] hover:bg-[#2b89af] text-white text-lg font-semibold py-3 mt-4 rounded-xl transition-all duration-300"
              onClick={handleMilkSubmit}
              disabled={loading}
            >
              {loading ? "Saving..." : "Sell Milk"}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default MilkmanSellMilk;
