import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import API from "../api";
import CustomerSidebar from "../components/CustomerSidebar/CustomerSidebar";
import { FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa"; // Example icons
import Authentication from "../utils/Authentication";

const CustomerNotification = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get("/api/auth/user/get-notification");
        setNotifications(res.data);
      } catch (err) {
        console.error("Error fetching notifications", err);
      }
    };
    fetchData();
  }, []);

  const openModal = (notification) => {
    setSelectedNotification(notification);
  };

  const closeModal = () => {
    setSelectedNotification(null);
  };

  return (
    <div className="flex">
      {/* Header */}
      <CustomerSidebar />
      <Authentication />

      <div className="p-4 w-full lg:ml-64 mt-20 bg-white min-h-screen">
        {/* Notification List */}
        <div className="mt-6 space-y-4">
          {notifications.map((item) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-[#E9F4F8] p-4 rounded-lg shadow-sm flex justify-between items-start"
            >
              <div>
                <h3 className="font-bold text-lg text-black">{item.name}</h3>
                <p className="text-gray-600 mt-1">{item.description}</p>
              </div>
              <div className="flex items-center">
                {item.status === "accepted" ? (
                  <p className="text-sm text-green-600 font-bold">
                    Make Advance Payment
                  </p>
                ) : item.status === "rejected" ? (
                  <>
                    <FaTimesCircle className="text-red-600 mr-2" />{" "}
                    {/* Rejected Icon */}
                    <p className="text-sm text-red-600">Rejected</p>
                  </>
                ) : item.status === "pending" ? (
                  <>
                    <FaClock className="text-yellow-500 mr-2" />{" "}
                    {/* Pending Icon */}
                    <p className="text-sm text-yellow-500">Pending</p>
                  </>
                ) : null}

                {item.status !== "accepted" && (
                  <button
                    onClick={() => openModal(item)}
                    className="ml-4 border border-gray-400 px-4 py-1 rounded-md text-sm hover:bg-gray-100"
                  >
                    See Detail
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Modal */}
        <AnimatePresence>
          {selectedNotification && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
              >
                <h3 className="text-xl font-bold mb-2 text-center">
                  {selectedNotification.name}
                </h3>
                <p className="text-center text-gray-600 mb-4">
                  {selectedNotification.description}
                </p>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-semibold">Dealer:</span>{" "}
                    {selectedNotification.dealer}
                  </p>
                  <p>
                    <span className="font-semibold">Delivered By:</span>{" "}
                    {selectedNotification.deliveredBy}
                  </p>
                  <p>
                    <span className="font-semibold">Status:</span>{" "}
                    {selectedNotification.status}
                  </p>
                  <p>
                    <span className="font-semibold">Price:</span> Rs.{" "}
                    {selectedNotification.price}
                  </p>
                </div>
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={closeModal}
                    className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CustomerNotification;
