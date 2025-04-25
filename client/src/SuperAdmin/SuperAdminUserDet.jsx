import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import Loader from "../components/Loader/Loader";
import SuperAdminSidebar from "../components/SuperSidebar/SuperAdminSidebar";
import Authentication from "../utils/Authentication";

const SuperAdminUserDet = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserDetails = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER}/api/auth/milkman/user/${userId}`
      );
      const data = await res.json();
      console.log(data);
      setUser(data);
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  if (!user) {
    return <div className="text-center text-red-500">User not found</div>;
  }

  return (
    <>
      <SuperAdminSidebar />
            <Authentication />
      
      <div className="lg:ml-64 mt-20 p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-8"
        >
          <h2 className="text-3xl font-bold text-[#40A1CB] mb-6">
            User Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-800">
            <p>
              <strong>Name:</strong> {user.name}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Phone:</strong> {user.phone}
            </p>
            <p>
              <strong>UPI ID:</strong> {user.upiId}
            </p>
            <p>
              <strong>Village:</strong> {user.village}
            </p>
            <p>
              <strong>Enter Code:</strong> {user.enterCode}
            </p>
            <p>
              <strong>Subscription Code:</strong> {user.subcriptionCode}
            </p>
            <p>
              <strong>Buy Milk:</strong> {user.buyMilk || "N/A"}
            </p>
            <p>
              <strong>Sell Milk:</strong> {user.sellMilk || "N/A"}
            </p>
            <p>
              <strong>Customers:</strong> {user.customer?.length || 0}
            </p>
            <p>
              <strong>Sellers:</strong> {user.seller?.length || 0}
            </p>
            <p>
              <strong>Products:</strong> {user.products?.length || 0}
            </p>
            <p>
              <strong>Category Products:</strong>{" "}
              {user.categoryProduct?.map((c) => c.name).join(", ") || "N/A"}
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default SuperAdminUserDet;
