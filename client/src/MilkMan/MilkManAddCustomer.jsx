import React, { useState, useRef } from "react";
import AdminNav from "../components/Sidebar/Sidebar";
import API from "../api";
import { toast, ToastContainer } from "react-toastify";
import { motion } from "framer-motion";
import { FiEdit, FiTrash2 } from "react-icons/fi"; // Import icons for the button
import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaUniversity,
  FaKey,
  FaLock,
} from "react-icons/fa";
import Authentication from "../utils/Authentication";


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
    {
      name: "name",
      placeholder: "Enter Full Name (e.g., Ramesh Kumar)*",
    },
    {
      name: "phone",
      placeholder: "Phone Number (e.g., 9876543210)*",
    },
    {
      name: "email",
      placeholder: "Email Address (e.g., user@example.com)*",
    },
    {
      name: "village",
      placeholder: "Village Name (e.g., Rampur)*",
    },
    {
      name: "upiId",
      placeholder: "UPI ID (e.g., ramesh@ybl)*",
    },
    {
      name: "enterCode",
      placeholder: "Enter Code (unique)*",
    },
    {
      name: "password",
      placeholder: "Create Password*",
      type: "password",
    },
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

      <div className="min-h-screen bg-gray-50 flex flex-col mt-15 lg:ml-35">
        <ToastContainer />
        {loading && (
          <div className="fixed inset-0 flex items-center justify-center z-50  bg-opacity-50 backdrop-blur-md">
            <Loader />
          </div>
        )}

<Authentication />

        <div className="flex flex-grow items-center justify-center px-4 py-10 sm:px-6 lg:px-8 lg:ml-8">
          <motion.div
            className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-6 sm:p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#40A1CB] mb-6 sm:mb-8">
              Add {userType}
            </h2>

            {/* Toggle Buttons */}
            <motion.div
              className="flex rounded-xl border border-gray-300 mb-6 overflow-hidden"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {["Customer", "Seller"].map((type) => (
                <motion.button
                  key={type}
                  className={`w-1/2 py-3 text-sm sm:text-lg font-semibold transition-all duration-300 hover:cursor-pointer ${
                    userType === type
                      ? "bg-[#40A1CB] text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                  onClick={() => handleToggle(type)}
                  whileTap={{ scale: 0.95 }}
                >
                  {type}
                </motion.button>
              ))}
            </motion.div>

            {/* Input Fields */}
            <motion.div
              className="flex flex-wrap -mx-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              {fields.map((field, index) => {
                const getIcon = (name) => {
                  switch (name) {
                    case "name":
                      return <FaUser className="text-gray-400" />;
                    case "phone":
                      return <FaPhone className="text-gray-400" />;
                    case "email":
                      return <FaEnvelope className="text-gray-400" />;
                    case "village":
                      return <FaMapMarkerAlt className="text-gray-400" />;
                    case "upiId":
                      return <FaUniversity className="text-gray-400" />;
                    case "enterCode":
                      return <FaKey className="text-gray-400" />;
                    case "password":
                      return <FaLock className="text-gray-400" />;
                    default:
                      return null;
                  }
                };

                return (
                  <motion.div
                    key={field.name}
                    className="w-full md:w-1/2 px-2 mb-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                  >
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        {getIcon(field.name)}
                      </span>
                      <input
                        ref={(el) => (inputRefs.current[index] = el)}
                        type={field.type || "text"}
                        name={field.name}
                        placeholder={field.placeholder}
                        value={newUser[field.name] || ""}
                        onChange={handleChange}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#40A1CB] transition"
                      />
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Save Button */}
            <motion.button
              className="w-full bg-[#40A1CB] text-white text-base hover:cursor-pointer sm:text-lg font-semibold py-3 rounded-xl hover:bg-[#3185a7] transition-all duration-300 mt-4"
              onClick={handleAddUser}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              Save
            </motion.button>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default MilkManAddUser;
