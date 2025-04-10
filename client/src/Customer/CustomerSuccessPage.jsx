import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api"; // Adjust the path if needed

const CustomerSuccessPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("Customer");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await API.get(`/api/auth/user/get-profile`);
        const user = response.data;
        if (user?.name) {
          setName(user.name);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        // Keep default name if fetch fails
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="flex items-center justify-center h-screen ">
      <div className="bg-white p-8 rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.15)] text-center transition-all duration-300">
        <h2 className="text-2xl font-bold text-[#40A1CB] mb-4">
          Thank you, {name}!
        </h2>
        <p className="text-gray-700 mb-6">
          Your order was placed successfully. 🎉
        </p>
        <button
          onClick={() => navigate("/customer-products")}
          className="bg-[#40A1CB] text-white px-4 py-2 rounded hover:shadow-md hover:scale-[1.03] transition"
        >
          Shop More
        </button>
      </div>
    </div>
  );
};

export default CustomerSuccessPage;
