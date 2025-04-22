import React, { useState, useRef, useEffect } from "react";
import AdminNav from "../components/Sidebar/Sidebar";
import API from "../api";
import { toast, ToastContainer } from "react-toastify";

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
        <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-3xl font-bold text-center text-[#40A1CB] mb-8">
            Buy Milk
          </h2>

          <div className="space-y-5">
            {[
              { name: "enterCode", placeholder: "Enter Code*" },
              { name: "weight", placeholder: "Weight*" },
              { name: "fat", placeholder: "Fat" },
              { name: "snf", placeholder: "SNF" },
              { name: "rate", placeholder: "Rate" },
            ].map((field, index) => (
              <input
                key={field.name}
                ref={(el) => (inputRefs.current[index] = el)}
                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#40A1CB]"
                name={field.name}
                placeholder={field.placeholder}
                value={newUser[field.name]}
                onChange={handleChange}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}

            <button
              onClick={handleAddUser}
              className="w-full bg-[#40A1CB] text-white font-medium py-3 rounded-xl hover:bg-[#3185a7] transition"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MilkManBuyMilk;
