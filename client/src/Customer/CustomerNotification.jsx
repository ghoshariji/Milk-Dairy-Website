import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import API from "../api";
import CustomerSidebar from "../components/CustomerSidebar/CustomerSidebar";
import Authentication from "../utils/Authentication";
import {
  XCircleIcon,
  UserIcon,
  TruckIcon,
  CheckCircleIcon,
  CurrencyRupeeIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";
import { FaTimesCircle, FaClock } from "react-icons/fa";

const CustomerNotification = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [filter, setFilter] = useState("all");

  const handleOpenModal = () => setShowPaymentModal(true);
  const handleCloseModal = () => setShowPaymentModal(false);

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

  const filteredNotifications = notifications.filter((item) =>
    filter === "all" ? true : item.status === filter
  );

  return (
    <div className="flex">
      <CustomerSidebar />
      <Authentication />

      <div className="p-4 w-full lg:ml-64 mt-20 bg-white min-h-screen">
        {/* Filter Dropdown */}
        <div className="flex justify-end mb-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Notification List */}
        <div className="mt-6 space-y-4">
          {filteredNotifications.map((item) => (
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
                <p className="text-gray-600 mt-1">
                  {new Date(item.date).toLocaleDateString(
                    "en-IN",
                    {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    }
                  )}
                </p>
              </div>
              <div className="flex items-center">
                {item.status === "accepted" ? (
                  <p
                    className="text-sm text-green-600 font-bold hover:cursor-pointer"
                    onClick={handleOpenModal}
                  >
                    Make Advance Payment
                  </p>
                ) : item.status === "rejected" ? (
                  <>
                    <FaTimesCircle className="text-red-600 mr-2" />
                    <p className="text-sm text-red-600 hover:cursor-pointer">
                      Rejected
                    </p>
                  </>
                ) : item.status === "pending" ? (
                  <>
                    <FaClock className="text-yellow-500 mr-2" />
                    <p className="text-sm text-yellow-500 hover:cursor-pointer">
                      Pending
                    </p>
                  </>
                ) : null}

                {item.status !== "accepted" && (
                  <button
                    onClick={() => openModal(item)}
                    className="ml-4 border border-gray-400 px-4 py-1 rounded-md text-sm hover:bg-gray-100 hover:cursor-pointer"
                  >
                    See Detail
                  </button>
                )}
              </div>
            </motion.div>
          ))}

          {filteredNotifications.length === 0 && (
            <div className="text-center text-gray-500 mt-10">
              No notifications found for the selected filter.
            </div>
          )}
        </div>

        {/* Detail Modal */}
        <AnimatePresence>
          {selectedNotification && (
            <motion.div
              className="fixed inset-0 backdrop-blur-sm bg-black/30 flex justify-center items-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white p-6 rounded-2xl w-full max-w-md shadow-xl border border-gray-200"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-800">
                    {selectedNotification.name}
                  </h3>
                  <button onClick={closeModal}>
                    <XCircleIcon className="h-6 w-6 text-gray-400 hover:text-gray-600 transition" />
                  </button>
                </div>

                <p className="text-center text-gray-600 mb-6 italic">
                  “{selectedNotification.description}”
                </p>
                <div className="flex items-center gap-2">
                  <BanknotesIcon className="h-5 w-5 text-indigo-500" />
                  <span>
                    <span className="font-semibold">Delivery Date:</span>{" "}
                    {new Date(selectedNotification.date).toLocaleDateString(
                      "en-IN",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      }
                    )}
                  </span>
                </div>

                <div className="space-y-3 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <UserIcon className="h-5 w-5 text-blue-500" />
                    <span>
                      <span className="font-semibold">Payment Mode:</span>{" "}
                      {selectedNotification.dealer}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <TruckIcon className="h-5 w-5 text-green-500" />
                    <span>
                      <span className="font-semibold">Delivered By:</span>{" "}
                      {selectedNotification.deliveredBy}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <CheckCircleIcon className="h-5 w-5 text-purple-500" />
                    <span>
                      <span className="font-semibold">Status:</span>{" "}
                      {selectedNotification.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <CurrencyRupeeIcon className="h-5 w-5 text-yellow-500" />
                    <span>
                      <span className="font-semibold">Price:</span> Rs.{" "}
                      {selectedNotification.price}
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex justify-center">
                  <button
                    onClick={closeModal}
                    className="bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-900 transition"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Payment Modal */}
        <AnimatePresence>
          {showPaymentModal && (
            <motion.div
              className="fixed inset-0 backdrop-blur-sm bg-opacity-40 backdrop-blur-sm z-50 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
              >
                <h2 className="text-xl font-bold text-center text-gray-800 mb-4">
                  Advance Payment Required
                </h2>
                <p className="text-gray-700 text-sm text-center mb-4 font-medium">
                  You must make an{" "}
                  <span className="text-red-600 font-semibold">
                    advance payment
                  </span>{" "}
                  if you want to continue with this order. Please contact the
                  outlet for further assistance.
                </p>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={handleCloseModal}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition hover:cursor-pointer"
                  >
                    Cancel
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
