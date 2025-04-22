import React, { useState, useRef } from "react";
import AdminNav from "../components/Sidebar/Sidebar";
import API from "../api";
import { toast, ToastContainer } from "react-toastify";


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

      const response = await API.post("/api/auth/user/add-user", newUser, {
        headers: { Authorization: `Bearer ${token}` },
      });

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
      console.error("Error adding user:", error);
      toast.error(error.response?.data?.message || "Failed to add user!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col mt-15 ml-29">
      <AdminNav />
      <ToastContainer />
      <div className="flex flex-grow items-center justify-center px-4 py-10">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 transition-all">
          <h2 className="text-3xl font-bold text-center text-[#40A1CB] mb-8">
            Add {userType}
          </h2>

          {/* Toggle Buttons */}
          <div className="flex overflow-hidden rounded-xl border border-gray-300 mb-6">
            <button
              className={`w-1/2 py-3 text-lg font-semibold transition-all duration-300 ${
                userType === "Customer"
                  ? "bg-[#40A1CB] text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
              onClick={() => handleToggle("Customer")}
            >
              Customer
            </button>
            <button
              className={`w-1/2 py-3 text-lg font-semibold transition-all duration-300 ${
                userType === "Seller"
                  ? "bg-[#40A1CB] text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
              onClick={() => handleToggle("Seller")}
            >
              Seller
            </button>
          </div>

          {/* Input Fields */}
          <div className="space-y-5">
            {fields.map((field, index) => (
              <input
                key={field.name}
                ref={(el) => (inputRefs.current[index] = el)}
                type={field.type || "text"}
                name={field.name}
                placeholder={field.placeholder}
                value={newUser[field.name]}
                onChange={handleChange}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#40A1CB] transition"
              />
            ))}

            <button
              className="w-full bg-[#40A1CB] text-white text-lg font-semibold py-3 rounded-xl hover:bg-[#3185a7] transition-all duration-300"
              onClick={handleAddUser}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MilkManAddUser;
