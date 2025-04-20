import React, { useState } from "react";
import AdminNav from "../components/Sidebar/Sidebar";
import API from "../api";
import { toast, ToastContainer } from "react-toastify";



const MilkManAddUser = () => {
  const [userType, setUserType] = useState("Customer"); // Toggle state
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

  const handleChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleToggle = (type) => {
    setUserType(type);
    setNewUser({ ...newUser, userType: type });
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
    } catch (error) {
      console.error("Error adding user:", error);
      toast.error(error.response?.data?.message || "Failed to add user!");
    }
  };

  return (
    <div className="min-h-screen flex flex-col mt-10">
      <AdminNav />
      <ToastContainer />
      <div className="flex flex-grow items-center justify-center mt-5">
        <div className="bg-white p-8 w-full max-w-md ">
          <h2 className="text-2xl font-semibold text-center mb-6">
            Add {userType}
          </h2>

          {/* Toggle Buttons */}
          <div className="flex border border-gray-300 rounded-lg mb-4">
            <button
              className={`w-1/2 py-2 text-center font-medium rounded-l-lg transition ${
                userType === "Customer"
                  ? "bg-[#40A1CB]  text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => handleToggle("Customer")}
            >
              Customer
            </button>
            <button
              className={`w-1/2 py-2 text-center font-medium rounded-r-lg transition ${
                userType === "Seller"
                  ? "bg-[#40A1CB]  text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => handleToggle("Seller")}
            >
              Seller
            </button>
          </div>

          {/* Input Fields */}
          <div className="space-y-4">
            <input
              className="w-full p-3 border rounded-lg"
              name="name"
              placeholder="Name"
              value={newUser.name}
              onChange={handleChange}
            />
            <input
              className="w-full p-3 border rounded-lg"
              name="phone"
              placeholder="Phone"
              value={newUser.phone}
              onChange={handleChange}
            />
            <input
              className="w-full p-3 border rounded-lg"
              name="email"
              placeholder="Email"
              value={newUser.email}
              onChange={handleChange}
            />
            <input
              className="w-full p-3 border rounded-lg"
              name="village"
              placeholder="Village"
              value={newUser.village}
              onChange={handleChange}
            />
            <input
              className="w-full p-3 border rounded-lg"
              name="upiId"
              placeholder="UPI ID"
              value={newUser.upiId}
              onChange={handleChange}
            />
            <input
              className="w-full p-3 border rounded-lg"
              name="enterCode"
              placeholder="Enter Code"
              value={newUser.enterCode}
              onChange={handleChange}
            />
            <input
              className="w-full p-3 border rounded-lg"
              name="password"
              type="password"
              placeholder="Password"
              value={newUser.password}
              onChange={handleChange}
            />
            <button
              className="bg-[#40A1CB] text-white w-full px-4 py-2 rounded-lg hover:bg-[#3185a7] transition"
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
