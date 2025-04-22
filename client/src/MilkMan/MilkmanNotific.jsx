import React, { useState, useEffect } from "react";
import AdminNav from "../components/Sidebar/Sidebar";
import API from "../api";
import { toast, ToastContainer } from "react-toastify";

const MilkmanNotific = () => {
  const [mergedData, setMergedData] = useState([]);
  const [acceptOrder, setAcceptOrder] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAdvanceBook = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      let orderData = [];
      try {
        const data = await API.get("/api/order/get-milkman-notification");
        orderData = data.data.data;
      } catch (error) {
        console.log("Error fetching milkman notifications:", error);
      }

      const sortedData = [...orderData].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setMergedData(sortedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchAcceptNotification = async () => {
    try {
      const response = await API.get("/api/order/fetch-orders-accept-reject");
      setAcceptOrder(response.data.orders);
    } catch (error) {
      console.error(
        "Error fetching notifications:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    fetchAdvanceBook();
    fetchAcceptNotification();
  }, []);

  const handleAccept = async (id) => {
    try {
      setLoading(true);
      await API.put("/api/order/milkman-accept-order", { orderId: id });
      setLoading(false);
      toast.success("Order Accepted");
      fetchAdvanceBook();
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message || "Something went wrong");
      console.error("Error accepting order:", error);
    }
  };

  return (
    <>
      <AdminNav />
      <ToastContainer />
      <div className="lg:ml-64 mt-20">
      <div className="min-h-screen flex flex-col items-center bg-gray-50 p-8">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-3xl mt-6 border border-gray-200">
          <h3 className="text-2xl font-bold mb-6 text-[#40A1CB]">Milkman Notifications</h3>
    
          {/* New Requests Section */}
          <div className="mb-8">
            <h4 className="text-xl font-semibold text-[#40A1CB] mb-4">New Requests</h4>
            <ul className="space-y-4">
              {mergedData.map((notif) => (
                <li
                  key={notif._id}
                  className="flex justify-between items-center bg-white shadow-md rounded-lg p-4 hover:bg-gray-100 transition-all duration-300"
                >
                  <span className="text-lg text-gray-800">{notif.name} - {notif.phone}</span>
                  <button
                    className="ml-4 bg-[#40A1CB] text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#3185a7] transition"
                    onClick={() => handleAccept(notif._id)}
                  >
                    Accept
                  </button>
                </li>
              ))}
            </ul>
          </div>
    
          {/* Accepted/Rejected Orders Section */}
          <div>
            <h4 className="text-xl font-semibold text-[#40A1CB] mb-4">Accepted/Rejected Orders</h4>
            <ul className="space-y-4">
              {acceptOrder.map((order) => (
                <li
                  key={order._id}
                  className="flex justify-between items-center bg-white shadow-md rounded-lg p-4 hover:bg-gray-100 transition-all duration-300"
                >
                  <span className="text-lg text-gray-800">{order.name} - {order.phone}</span>
                  <span
                    className={
                      order.status === "accepted" ? "text-green-600 font-semibold" : "text-red-600 font-semibold"
                    }
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
    
    </>
  );
};

export default MilkmanNotific;
