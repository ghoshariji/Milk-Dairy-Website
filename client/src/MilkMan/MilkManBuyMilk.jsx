import React, { useState, useRef, useEffect } from "react";
import AdminNav from "../components/Sidebar/Sidebar";
import API from "../api";
import { toast, ToastContainer } from "react-toastify";
import { motion } from "framer-motion"; // For animations
import { FiShoppingCart, FiTag, FiCheckCircle } from "react-icons/fi";
const MilkManBuyMilk = () => {
  const [newUser, setNewUser] = useState({
    enterCode: "",
    weight: "",
    rate: "",
    snf: "",
    fat: "",
  });

  const inputRefs = useRef([]);

  const handleChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "ArrowDown" && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    } else if (e.key === "ArrowUp" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleAddUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Unauthorized! Please log in.");
        return;
      }

      const response = await API.post("/api/seller/milk/add-milk", newUser, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(response.data.message);
      setNewUser({
        enterCode: "",
        weight: "",
        rate: "",
        snf: "",
        fat: "",
      });
    } catch (error) {
      console.error("Error adding user:", error);
      toast.error(error.response?.data?.message || "Failed to add user!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      <ToastContainer />
      <div className="flex justify-center items-center py-10 px-4 mt-17 ml-27">
        <motion.div
          className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 className="text-3xl font-bold text-center text-[#40A1CB] mb-8">
            Buy Milk
          </h2>

          <div className="space-y-5">
            {[
              {
                name: "enterCode",
                placeholder: "Enter Code*",
                icon: <FiShoppingCart size={20} color="#40A1CB" />,
              },
              {
                name: "weight",
                placeholder: "Weight*",
                icon: <FiTag size={20} color="#40A1CB" />,
              },
              {
                name: "fat",
                placeholder: "Fat",
                icon: <FiCheckCircle size={20} color="#40A1CB" />,
              },
              {
                name: "snf",
                placeholder: "SNF",
                icon: <FiCheckCircle size={20} color="#40A1CB" />,
              },
              {
                name: "rate",
                placeholder: "Rate",
                icon: <FiTag size={20} color="#40A1CB" />,
              },
            ].map((field, index) => (
              <motion.div
                key={field.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2, duration: 0.4 }}
                className="flex items-center border rounded-xl p-2 focus-within:ring-2 focus-within:ring-[#40A1CB]"
              >
                <div className="mr-3">{field.icon}</div>
                <input
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  name={field.name}
                  placeholder={field.placeholder}
                  value={newUser[field.name] || ""}
                  onChange={handleChange}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-full px-4 py-3 bg-transparent border-none focus:outline-none"
                />
              </motion.div>
            ))}

            <motion.button
              onClick={handleAddUser}
              className="w-full bg-[#40A1CB] text-white hover:cursor-pointer font-medium py-3 rounded-xl hover:bg-[#3185a7] transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              Save
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MilkManBuyMilk;
