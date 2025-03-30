import React, { useState } from "react";
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

  const handleChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
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
    <div>
      <div className="min-h-screen flex flex-col mt-10">
        <AdminNav />
        <ToastContainer />
        <div className="flex flex-grow items-center justify-center mt-5">
          <div className="bg-white p-8 w-full max-w-md ">
            <h2 className="text-2xl font-semibold text-center mb-6">
              Buy Milk
            </h2>

            {/* Input Fields */}
            <div className="space-y-4">
              <input
                className="w-full p-3 border rounded-lg"
                name="enterCode"
                placeholder="Enter Code*"
                value={newUser.enterCode}
                onChange={handleChange}
              />
              <input
                className="w-full p-3 border rounded-lg"
                name="weight"
                placeholder="weight*"
                value={newUser.weight}
                onChange={handleChange}
              />
              <input
                className="w-full p-3 border rounded-lg"
                name="fat"
                placeholder="fat"
                value={newUser.fat}
                onChange={handleChange}
              />
              <input
                className="w-full p-3 border rounded-lg"
                name="snf"
                placeholder="snf"
                value={newUser.snf}
                onChange={handleChange}
              />
              <input
                className="w-full p-3 border rounded-lg"
                name="rate"
                placeholder="rate"
                value={newUser.rate}
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
    </div>
  );
};

export default MilkManBuyMilk;
