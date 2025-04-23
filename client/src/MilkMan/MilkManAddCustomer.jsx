import React, { useState, useRef } from "react";
import AdminNav from "../components/Sidebar/Sidebar";
import API from "../api";
import { toast, ToastContainer } from "react-toastify";
import { motion } from "framer-motion";
import { FiEdit, FiTrash2 } from "react-icons/fi"; // Import icons for the button



const MilkManAddUser = () => {
  const [userType, setUserType] = useState("Customer");
  const [newUser, setNewUser] = useState({
    name: "",
    phone: "",
    email: "",
    village: "",
    upiId: "",
    enterCode: "",
    password: "",
    userType: "Customer",
  });
  const [loading, setLoading] = useState(false);
  const fields = [
    { name: "name", placeholder: "Full Name" },
    { name: "phone", placeholder: "Phone" },
    { name: "email", placeholder: "Email" },
    { name: "village", placeholder: "Village" },
    { name: "upiId", placeholder: "UPI ID" },
    { name: "enterCode", placeholder: "Enter Code" },
    { name: "password", placeholder: "Password", type: "password" },
  ];

  // Refs for input focus
  const inputRefs = useRef([]);

  const handleChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleToggle = (type) => {
    setUserType(type);
    setNewUser({ ...newUser, userType: type });
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "ArrowDown" || e.key === "Enter") {
      e.preventDefault();
      if (index < inputRefs.current.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleAddUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Unauthorized! Please log in.");
        return;
      }
      setLoading(true);

      const response = await API.post("/api/auth/user/add-user", newUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLoading(false);

      toast.success(response.data.message || `User added as ${userType}!`);
      setNewUser({
        name: "",
        phone: "",
        email: "",
        village: "",
        upiId: "",
        enterCode: "",
        password: "",
        userType,
      });
      inputRefs.current[0]?.focus(); // Reset focus to first input
    } catch (error) {
      setLoading(false);

      console.error("Error adding user:", error);
      toast.error(error.response?.data?.message || "Failed to add user!");
    }
  };

  return (
    <>
      <AdminNav />

      <div className="min-h-screen bg-gray-50 flex flex-col mt-15 ml-29">
        <ToastContainer />
        {loading && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-500 bg-opacity-50 backdrop-blur-md">
            <Loader />
          </div>
        )}
        <div className="flex flex-grow items-center justify-center px-4 py-10">
          <motion.div
            className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h2 className="text-3xl font-bold text-center text-[#40A1CB] mb-8">
              Add {userType}
            </h2>

            {/* Toggle Buttons with hover animation */}
            <motion.div
              className="flex overflow-hidden rounded-xl border border-gray-300 mb-6"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.button
                className={`w-1/2 py-3 text-lg font-semibold transition-all duration-300 ${
                  userType === "Customer"
                    ? "bg-[#40A1CB] text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
                onClick={() => handleToggle("Customer")}
                whileTap={{ scale: 0.95 }}
              >
                Customer
              </motion.button>
              <motion.button
                className={`w-1/2 py-3 text-lg font-semibold transition-all duration-300 ${
                  userType === "Seller"
                    ? "bg-[#40A1CB] text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
                onClick={() => handleToggle("Seller")}
                whileTap={{ scale: 0.95 }}
              >
                Seller
              </motion.button>
            </motion.div>

            {/* Input Fields with animation */}
            <motion.div
              className="space-y-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              {fields.map((field, index) => (
                <motion.input
                  key={field.name}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type={field.type || "text"}
                  name={field.name}
                  placeholder={field.placeholder}
                  value={newUser[field.name] || ""}
                  onChange={handleChange}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#40A1CB] transition"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                />
              ))}

              {/* Save Button with hover animation */}
              <motion.button
                className="w-full bg-[#40A1CB] text-white text-lg font-semibold py-3 rounded-xl hover:bg-[#3185a7] transition-all duration-300"
                onClick={handleAddUser}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                Save
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default MilkManAddUser;
