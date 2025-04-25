import React, { useEffect, useState } from "react";
import AdminNav from "../components/Sidebar/Sidebar";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import API from "../api";
import { ArrowPathIcon } from "@heroicons/react/24/outline"; // refresh icon
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Loader from "../components/Loader/Loader";
import { XMarkIcon } from "@heroicons/react/24/outline";

import {
  UserIcon,
  CheckCircleIcon,
  MapPinIcon,
  CreditCardIcon,
  PhoneIcon,
  ClockIcon,
  ClipboardDocumentIcon,
  CurrencyDollarIcon,
  CalendarIcon,
} from "@heroicons/react/24/solid";
import Authentication from "../utils/Authentication";

// Register chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Sample data for each section
const notificationData = {
  title: "Notification",
  content: "You have 5 new notifications",
};
const ordersData = { title: "Orders", content: "50 orders this month" };
const feedbackData = { title: "Feedback", content: "4.5/5 rating" };
const revenueData = {
  title: "Revenue",
  content: "Total revenue this month: $5000",
};
const tasksData = { title: "Tasks", content: "3 pending tasks" };
const salesData = {
  title: "Sales Data",
  content: "Graph data here",
  isGraph: true,
};

// Sample data for the graphs
const graphData1 = [
  { label: "January", value: 40 },
  { label: "February", value: 30 },
  { label: "March", value: 70 },
];

const graphData2 = [
  { label: "April", value: 50 },
  { label: "May", value: 20 },
  { label: "June", value: 80 },
];

// Chart.js data format for Graph 1 (Black theme)
const chartData1 = {
  labels: graphData1.map((data) => data.label),
  datasets: [
    {
      label: "Sales Data - Black Theme",
      data: graphData1.map((data) => data.value),
      borderColor: "#40A1CB", // Set the theme color
      backgroundColor: "transparent",
      tension: 0.4,
    },
  ],
};

// Chart.js data format for Graph 2 (White theme)
const chartData2 = {
  labels: graphData2.map((data) => data.label),
  datasets: [
    {
      label: "Sales Data - White Theme",
      data: graphData2.map((data) => data.value),
      borderColor: "#40A1CB", // Set the theme color
      backgroundColor: "transparent",
      tension: 0.4,
    },
  ],
};

const MilkManDashboard = () => {
  const navigate = useNavigate();
  const [milkData, setMilkData] = useState(null);
  const [mergedData, setMergedData] = useState([]);
  const handleAddMoreClick = () => {
    navigate("/milkman-notofication"); // Adjust this route according to your page structure
  };

  const [loading, setLoading] = useState(false);
  const fetchAdvanceBook = async () => {
    setLoading(true);
    try {
      const token = await localStorage.getItem("token"); // Await token retrieval
      if (!token) {
        console.error("No token found");
        setLoading(false);
        return;
      }

      let orderData = [];
      let advanceBookingProducts = [];

      try {
        // Fetch milkman notifications
        const data = await API.get("/api/order/get-milkman-notification");
        orderData = data.data.data;
        console.log(data.data.data);
        setNotificationData(orderData); // Set the notifications data separately
      } catch (error) {
        console.log("Error fetching milkman notifications:", error);
      }

      try {
        // Fetch advance booking data
        const response = await API.get(`/api/auth/user/getadvanceMilkman`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        advanceBookingProducts = response.data.orders;
        console.log(advanceBookingProducts);
        setAdvanceBookingData(advanceBookingProducts); // Set the advance booking data separately
      } catch (error) {
        console.error("Error fetching advance booking data:", error);
      }

      // Merge both arrays and sort by `createdAt` (recent first)
      const mergedData = [...orderData, ...advanceBookingProducts].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setMergedData(mergedData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  const fetchMilkData = async () => {
    try {
      setLoading(true);

      const token = await localStorage.getItem("token");

      if (!token) {
        console.error("Token not found, please log in again.");
        return;
      }

      const response = await API.get(`/get-milk-today`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setLoading(false);

      setMilkData(response.data.totalLiters);
    } catch (err) {
      setLoading(false);

      console.error(
        "Error fetching milk data:",
        err.response?.data || err.message
      );
    }
  };

  const [totals, setTotals] = useState({
    totalKg: 0,
    totalFat: 0,
    totalAmount: 0,
  });
  const [advanceBookingData, setAdvanceBookingData] = useState([]);
  const [notificationData, setNotificationData] = useState([]);
  const fetchdataMilkSBuyMilk = async () => {
    try {
      setLoading(true);

      const response = await API.get("/api/seller/milk/milk-today");

      const { totalKg, totalFat, totalAmount } = response.data;
      setLoading(false);

      setTotals({ totalKg, totalFat, totalAmount }); // Store calculated totals in state
    } catch (error) {
      setLoading(false);

      console.error("Error fetching milk records:", error);
    }
  };

  useEffect(() => {
    fetchMilkData();
    fetchdataMilkSBuyMilk();
  }, []);
  useEffect(() => {
    fetchAdvanceBook();
  }, []);
  const timeAgo = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);

    if (date > now) {
      return "In the future";
    }

    const timeDifference = now - date;

    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    return `${seconds} second${seconds !== 1 ? "s" : ""} ago`;
  };

  const [seenCOunt, setSeenCount] = useState("");
  const fetchData = async () => {
    try {
      const data = await API.get("/api/auth/user/getNotificationCount");
      setSeenCount(data.data);
    } catch (error) {}
  };

  useEffect(() => {
    fetchData();
  }, []);
  const handleRefresh = async () => {
    await fetchAdvanceBook();
    await fetchMilkData();
    await fetchdataMilkSBuyMilk();
  };
  const [showNote, setShowNote] = useState(true);


  return (
    <div className="flex">
      {/* Sidebar */}
      <AdminNav />
      <Authentication />

      {loading && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50 backdrop-blur-md">
          <Loader />
        </div>
      )}
      {/* Main Content */}
      <div className="p-6 w-full lg:ml-64 mt-20 ">
        <div className="container mx-auto ">
          {showNote && (
            <div className="col-span-1 mb-5 relative bg-white  rounded-lg p-4 shadow-sm">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition"
                onClick={() => setShowNote(false)}
                title="Close"
              >
                <XMarkIcon
                  className="h-5 w-5 hover:cursor-pointer"
                  color="red"
                />
              </button>
              <p id="note" name="note" className="text-gray-700 text-sm">
                <span className="font-semibold text-red-500">"Buy Milk"</span>{" "}
                refers to the quantity of milk you have purchased today from
                your suppliers.{" "}
                <span className="font-semibold text-red-500">"Sell Milk"</span>{" "}
                represents the amount of milk you have sold to your customers.
                This note helps track the daily milk intake and distribution for
                better inventory and sales management.
                <span className="font-semibold text-red-500">
                  {" "}
                  - Powered By Hallo Dairy
                </span>
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Notification Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              whileHover={{ scale: 1.05 }} // Adds a slight scale effect on hover
              className="bg-gray-100 p-6 rounded-xl shadow-lg hover:bg-gray-200 transition-all"
            >
              <h2 className="text-black text-2xl font-bold">Today Buy Milk</h2>
              <p className="mt-3 text-black text-xl">{totals.totalKg} kg</p>
            </motion.div>

            {/* Orders Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              whileHover={{ scale: 1.05 }} // Slight scale on hover
              className="bg-[#40A1CB] p-6 rounded-xl shadow-lg hover:bg-[#348AA1] transition-all"
            >
              <h2 className="text-white text-2xl font-bold">Today Sell Milk</h2>
              <p className="mt-3 text-white text-xl">{milkData} kg</p>
            </motion.div>

            {/* Feedback Section */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              whileHover={{ scale: 1.05 }} // Slightly scales up the element on hover
              className="bg-gray-100 p-6 rounded-xl shadow-lg hover:bg-gray-200 transition-all"
            >
              <h2 className="text-black text-2xl font-bold">
                New Advance Booking
              </h2>
              <p className="mt-3 text-black text-xl font-semibold">
                {seenCOunt}
              </p>
            </motion.div>

            {/* Revenue Section */}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              whileHover={{ scale: 1.05 }} // Slight scaling effect on hover
              className="bg-[#40A1CB] p-6 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.2)] border border-white/10 hover:shadow-[0_20px_40px_rgba(0,0,0,0.25)] transition-all"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-white text-2xl font-bold tracking-wide drop-shadow-sm">
                  Latest Notifications
                </h2>
                <motion.button
                  whileTap={{ rotate: 180 }}
                  onClick={handleRefresh}
                  className="text-white hover:text-white/90 transition duration-200"
                  title="Refresh Notifications"
                >
                  <ArrowPathIcon className="h-6 w-6 hover:cursor-pointer" />
                </motion.button>
              </div>

              {notificationData.length > 0 ? (
                <ul>
                  {notificationData
                    .slice(-2)
                    .reverse()
                    .map((notification, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="mt-4 text-white/90 flex space-x-3 items-start hover:bg-white/10 transition-all rounded-lg"
                      >
                        <span className="font-bold">{index + 1}.</span>
                        <div className="flex flex-col space-y-2 text-sm">
                          <p className="flex items-center gap-2">
                            <UserIcon className="h-4 w-4 text-white" />
                            <strong className="text-white">Name:</strong>{" "}
                            {notification.name}
                          </p>
                          <p className="flex items-center gap-2">
                            <CheckCircleIcon className="h-4 w-4 text-white" />
                            <strong className="text-white">Status:</strong>{" "}
                            {notification.status}
                          </p>
                          <p className="flex items-center gap-2">
                            <MapPinIcon className="h-4 w-4 text-white" />
                            <strong className="text-white">
                              Delivery Address:
                            </strong>{" "}
                            {notification.deliveryAddress}
                          </p>
                          <p className="flex items-center gap-2">
                            <CreditCardIcon className="h-4 w-4 text-white" />
                            <strong className="text-white">
                              Payment Mode:
                            </strong>{" "}
                            {notification.paymentMode}
                          </p>
                          <p className="flex items-center gap-2">
                            <PhoneIcon className="h-4 w-4 text-white" />
                            <strong className="text-white">Phone:</strong>{" "}
                            {notification.phone}
                          </p>
                          <p className="text-xs text-white/70 italic flex items-center gap-2">
                            <ClockIcon className="h-4 w-4 text-white/70" />
                            {timeAgo(notification.createdAt)}
                          </p>
                        </div>
                      </motion.li>
                    ))}
                </ul>
              ) : (
                <p className="text-white/90">No notifications available.</p>
              )}

              {notificationData.length > 2 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mt-6 text-center"
                >
                  <button
                    onClick={handleAddMoreClick}
                    className="bg-white text-[#40A1CB] hover:cursor-pointer font-semibold px-5 py-2 rounded-xl shadow-md transition duration-200"
                  >
                    Show More
                  </button>
                </motion.div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              whileHover={{ scale: 1.05 }} // Scaling effect on hover for the container
              className="bg-gray-100 p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-black text-2xl font-bold">
                  Latest Booking(adv)
                </h2>
                <motion.button
                  whileTap={{ rotate: 180 }}
                  onClick={handleRefresh}
                  className="text-black hover:text-[#2b91ba] transition duration-200 "
                  title="Refresh Bookings"
                >
                  <ArrowPathIcon className="h-5 w-5 hover:cursor-pointer" />
                </motion.button>
              </div>

              {advanceBookingData.length > 0 ? (
                <ul>
                  {advanceBookingData
                    .slice(-2)
                    .reverse()
                    .map((booking, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="mt-4 text-black flex space-x-3 items-start hover:bg-gray-200 transition-all rounded-lg"
                      >
                        <span className="font-bold">{index + 1}.</span>
                        <div className="flex flex-col space-y-2 text-sm">
                          <p className="flex items-center gap-2">
                            <UserIcon className="h-4 w-4 text-black" />
                            <strong>Booking Name:</strong> {booking.name}
                          </p>
                          <p className="flex items-center gap-2">
                            <ClipboardDocumentIcon className="h-4 w-4 text-black" />
                            <strong>Description:</strong> {booking.description}
                          </p>
                          <p className="flex items-center gap-2">
                            <CheckCircleIcon className="h-4 w-4 text-black" />
                            <strong>Status:</strong> {booking.status}
                          </p>
                          <p className="flex items-center gap-2">
                            <CurrencyDollarIcon className="h-4 w-4 text-black" />
                            <strong>Price:</strong> {booking.price} /-
                          </p>
                          <p className="flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4 text-black" />
                            <strong>Required Date:</strong>{" "}
                            {new Date(booking.date).toLocaleDateString()}
                          </p>
                        </div>
                      </motion.li>
                    ))}
                </ul>
              ) : (
                <p className="text-[#40A1CB]">No advance bookings available.</p>
              )}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-6 text-center"
              >
                <button
                  onClick={handleAddMoreClick}
                  className="px-5 py-2 bg-[#40A1CB] mt-8 hover:cursor-pointer text-white rounded-xl shadow-md hover:bg-[#2b91ba] transition duration-200"
                >
                  Show More
                </button>
              </motion.div>
            </motion.div>

            {/* Sales Data Section with Graphs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="bg-[#40A1CB] p-6 rounded-xl shadow-lg"
            >
              {/* Graph 1: Black Theme */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="mt-6 bg-[#40A1CB] p-4 rounded-lg shadow-xl"
              >
                <h3 className="text-white text-xl font-semibold">Payment</h3>
                <div className="h-32 mt-2 rounded-lg overflow-hidden shadow-md bg-[#2b91ba]">
                  <Line
                    data={chartData1}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          labels: {
                            color: "white",
                          },
                        },
                      },
                    }}
                  />
                </div>
              </motion.div>

              {/* Graph 2: White Theme */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="mt-6 bg-[#40A1CB] p-4 rounded-lg shadow-xl"
              >
                <h3 className="text-white text-xl font-semibold">Products</h3>
                <div className="h-32 mt-2 rounded-lg overflow-hidden shadow-md bg-[#f1f5f9]">
                  <Line
                    data={chartData2}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          labels: {
                            color: "#40A1CB",
                          },
                        },
                      },
                    }}
                  />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MilkManDashboard;
