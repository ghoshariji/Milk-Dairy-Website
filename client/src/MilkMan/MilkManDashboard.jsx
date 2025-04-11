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
  const navigate = useNavigate()
  const [milkData, setMilkData] = useState(null);
  const [mergedData, setMergedData] = useState([]);
  const handleAddMoreClick = () => {
    navigate("/milkman-notofication"); // Adjust this route according to your page structure
  };

  const [load, setLoad] = useState(false);
  const fetchAdvanceBook = async () => {
    setLoad(true);
    try {
      const token = await localStorage.getItem("token"); // Await token retrieval
      if (!token) {
        console.error("No token found");
        setLoad(false);
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
      setLoad(false);
    } catch (error) {
      setLoad(false);
      console.error("Error fetching data:", error);
    }
  };

  const fetchMilkData = async () => {
    try {
      setLoad(true);

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
      setLoad(false);

      setMilkData(response.data.totalLiters);
    } catch (err) {
      setLoad(false);

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
      setLoad(true);

      const response = await API.get("/api/seller/milk/milk-today");

      const { totalKg, totalFat, totalAmount } = response.data;
      setLoad(false);

      setTotals({ totalKg, totalFat, totalAmount }); // Store calculated totals in state
    } catch (error) {
      setLoad(false);

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
  return (
    <div className="flex">
      {/* Sidebar */}
      <AdminNav />

      {/* Main Content */}
      <div className="p-6 w-full lg:ml-64 mt-20">
        <div className="container mx-auto p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Notification Section */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-[#40A1CB] text-xl font-semibold">
                Today Buy Milk
              </h2>
              <p className="mt-2 text-black">{totals.totalKg} kg</p>
            </div>

            {/* Orders Section */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-[#40A1CB] text-xl font-semibold">
                Today Sell Milk
              </h2>
              <p className="mt-2 text-black">{milkData} kg</p>
            </div>

            {/* Feedback Section */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-[#40A1CB] text-xl font-semibold">
                Product New Order
              </h2>
              <p className="mt-2 text-[#40A1CB]">{seenCOunt}</p>
            </div>

            {/* Revenue Section */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-[#40A1CB] text-xl font-semibold">
                  Latest Milkman Notifications
                </h2>
                <button
                  onClick={handleRefresh}
                  className="text-[#40A1CB] hover:text-[#2b91ba] transition"
                  title="Refresh Notifications"
                >
                  <ArrowPathIcon className="h-5 w-5" />
                </button>
              </div>

              {notificationData.length > 0 ? (
                <ul>
                  {notificationData
                    .slice(-2)
                    .reverse()
                    .map((notification, index) => (
                      <li
                        key={index}
                        className="mt-4 text-[#40A1CB] flex space-x-3 items-start"
                      >
                        <span className="font-bold">{index + 1}.</span>
                        <div className="flex flex-col space-y-1">
                          <p>
                            <strong>Name:</strong> {notification.name}
                          </p>
                          <p>
                            <strong>Status:</strong> {notification.status}
                          </p>
                          <p>
                            <strong>Delivery Address:</strong>{" "}
                            {notification.deliveryAddress}
                          </p>
                          <p>
                            <strong>Payment Mode:</strong>{" "}
                            {notification.paymentMode}
                          </p>
                          <p>
                            <strong>Phone:</strong> {notification.phone}
                          </p>
                          <p className="text-sm text-gray-500">
                            {timeAgo(notification.createdAt)}
                          </p>
                        </div>
                      </li>
                    ))}
                </ul>
              ) : (
                <p>No notifications available.</p>
              )}

              {/* Show More Button */}
              {notificationData.length > 2 && (
                <div className="mt-4 text-center">
                  <button
                    onClick={handleAddMoreClick}
                    className="text-white bg-[#40A1CB] hover:bg-[#2b91ba] font-medium px-4 py-2 rounded"
                  >
                    Show More
                  </button>
                </div>
              )}
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md mt-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-[#40A1CB] text-xl font-semibold">
                  Latest Advance Booking
                </h2>
                <button
                  onClick={handleRefresh}
                  className="text-[#40A1CB] hover:text-[#2b91ba] transition"
                  title="Refresh Bookings"
                >
                  <ArrowPathIcon className="h-5 w-5" />
                </button>
              </div>

              {advanceBookingData.length > 0 ? (
                <ul>
                  {advanceBookingData
                    .slice(-2)
                    .reverse()
                    .map((booking, index) => (
                      <li
                        key={index}
                        className="mt-4 text-[#40A1CB] flex space-x-3 items-start"
                      >
                        <span className="font-bold">{index + 1}.</span>
                        <div className="flex flex-col space-y-2">
                          <p>
                            <strong>Booking Name:</strong> {booking.name}
                          </p>
                          <p>
                            <strong>Description:</strong> {booking.description}
                          </p>
                          <p>
                            <strong>Status:</strong> {booking.status}
                          </p>
                          <p>
                            <strong>Price:</strong> ${booking.price}
                          </p>
                          <p>
                            <strong>Required Date:</strong>{" "}
                            {new Date(booking.date).toLocaleDateString()}
                          </p>
                        </div>
                      </li>
                    ))}
                </ul>
              ) : (
                <p>No advance bookings available.</p>
              )}

              {/* Show More Button */}
              <div className="mt-4 flex justify-center">
                <button
                  onClick={handleAddMoreClick}
                  className="px-4 py-2 bg-[#40A1CB] text-white rounded hover:bg-[#2b91ba] transition"
                >
                  Show More
                </button>
              </div>
            </div>

            {/* Sales Data Section with Graphs */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-[#40A1CB] text-xl font-semibold">
                {salesData.title}
              </h2>
              <p className="mt-2 text-[#40A1CB]">{salesData.content}</p>

              {/* Rendering Graph 1 (Black theme) */}
              <div className="mt-4 bg-[#40A1CB] p-4 rounded-lg">
                <h3 className="text-white">Graph 1 - Black Theme</h3>
                <div className="h-32">
                  <Line
                    data={chartData1}
                    options={{ responsive: true, maintainAspectRatio: false }}
                  />
                </div>
              </div>

              {/* Rendering Graph 2 (White theme) */}
              <div className="mt-4 bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-[#40A1CB]">Graph 2 - White Theme</h3>
                <div className="h-32">
                  <Line
                    data={chartData2}
                    options={{ responsive: true, maintainAspectRatio: false }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MilkManDashboard;
