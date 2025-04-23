import React, { useState, useEffect } from "react";
import AdminNav from "../components/Sidebar/Sidebar";
import API from "../api";
import { toast, ToastContainer } from "react-toastify";
import Loader from "../components/Loader/Loader";
import { motion, AnimatePresence } from "framer-motion";

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
      setLoading(true);

      let orderData = [];
      try {
        const data = await API.get("/api/order/get-milkman-notification");
        orderData = data.data.data;
        console.log(orderData);
      } catch (error) {
        console.log("Error fetching milkman notifications:", error);
      }
      setLoading(false);

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
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrder1, setSelectedOrder1] = useState(null);

  const handleOrderClick = (order) => {
    setSelectedOrder1(order); // Set the clicked order to the state
    setModalVisible(true); // Show the modal
  };

  const closeModal = () => {
    setModalVisible(false); // Close the modal
  };

  return (
    <>
      <AdminNav />
      <ToastContainer />

      <div className="lg:ml-64 mt-20">
        <div className="min-h-screen flex flex-col items-center bg-gray-50 p-8">
          {loading && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-500 bg-opacity-50 backdrop-blur-md">
              <Loader />
            </div>
          )}
          <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-3xl border border-gray-200">
            <h3 className="text-2xl font-bold mb-6 text-[#40A1CB] transition-all duration-300 ease-in-out">
              Product Order's
            </h3>

            {/* New Requests Section */}
            <div className="mb-8">
              <h4 className="text-xl font-semibold text-black mb-4 transition-all duration-300 ease-in-out">
                New Requests
              </h4>
              <ul className="space-y-4">
                {mergedData.map((notif) => (
                  <li
                    key={notif._id}
                    className="flex justify-between items-center bg-white shadow-md rounded-lg p-4 hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 ease-in-out"
                  >
                    <span className="text-lg text-gray-800">
                      {notif.name} -
                      <a
                        href={`tel:${notif.phone}`}
                        className="text-black hover:underline"
                      >
                        {notif.phone}
                      </a>
                    </span>
                    <button
                      className="ml-4 bg-[#40A1CB] text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#3185a7] transition transform hover:scale-105 duration-200 ease-in-out"
                      onClick={() => setSelectedOrder(notif)}
                    >
                      View Order
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Accepted/Rejected Orders Section */}
            <div>
              <h4 className="text-xl font-semibold text-black mb-4 transition-all duration-300 ease-in-out">
                Accepted/Rejected Orders
              </h4>
              <ul className="space-y-4">
                {acceptOrder.map((order) => (
                  <li
                    key={order._id}
                    className="flex justify-between items-center bg-white shadow-md rounded-lg p-4 hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 ease-in-out"
                    onClick={() => handleOrderClick(order)} // Click handler to open the modal
                  >
                    <span className="text-lg text-gray-800">
                      {order.name} -
                      <a
                        href={`tel:${order.phone}`}
                        className="text-black hover:underline"
                      >
                        {order.phone}
                      </a>
                    </span>
                    <span
                      className={
                        order.status === "accepted"
                          ? "text-green-600 font-semibold"
                          : "text-red-600 font-semibold"
                      }
                    >
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <AnimatePresence>
            {selectedOrder && (
              <motion.div
                className="fixed top-0 left-0 w-full h-full bg-gray-700 bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-2xl font-bold text-[#40A1CB] mb-4 text-center">
                    Order Details
                  </h3>

                  <div className="space-y-2 text-gray-700 text-sm">
                    <p>
                      <strong>Name:</strong> {selectedOrder.name}
                    </p>
                    <p>
                      <strong>Phone:</strong> {selectedOrder.phone}
                    </p>
                    <p>
                      <strong>Delivery Address:</strong>{" "}
                      {selectedOrder.deliveryAddress}
                    </p>
                    <p>
                      <strong>Delivered By:</strong> {selectedOrder.deliveredBy}
                    </p>
                    <p>
                      <strong>Payment Mode:</strong> {selectedOrder.paymentMode}
                    </p>
                    <p>
                      <strong>Status:</strong> {selectedOrder.status}
                    </p>
                    <p>
                      <strong>Created At:</strong>{" "}
                      {new Date(selectedOrder.createdAt).toLocaleString()}
                    </p>
                    <p>
                      <strong>User Name:</strong> {selectedOrder.userId?.name}
                    </p>
                    <p>
                      <strong>User Phone:</strong> {selectedOrder.userId?.phone}
                    </p>

                    <div>
                      <strong>Products:</strong>
                      <ul className="list-disc ml-5">
                        {selectedOrder.products.map((product, idx) => (
                          <li key={idx}>
                            {product.name} - Rs.{product.price} (
                            {product.quantity})
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      onClick={() => {
                        handleAccept(selectedOrder._id);
                        setSelectedOrder(null);
                      }}
                      className="bg-[#40A1CB] hover:bg-[#3185a7] text-white px-4 py-2 rounded-md font-medium transition"
                    >
                      Accept Order
                    </button>
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition"
                    >
                      Close
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          {modalVisible && selectedOrder1 && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h3 className="text-2xl font-semibold text-[#40A1CB] mb-4">
                  Order Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <strong>Name:</strong> {selectedOrder1.name}
                  </div>
                  <div>
                    <strong>Phone:</strong> {selectedOrder1.phone}
                  </div>
                  <div>
                    <strong>Status:</strong>{" "}
                    <span
                      className={
                        selectedOrder1.status === "accepted"
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {selectedOrder1.status.charAt(0).toUpperCase() +
                        selectedOrder1.status.slice(1)}
                    </span>
                  </div>

                  <div>
                    <strong>Products:</strong>
                    <ul className="ml-4 space-y-2">
                      {selectedOrder1.products.map((product, idx) => (
                        <li key={idx} className="flex justify-between">
                          <span>{product.productId?.name}</span>
                          <span>
                            Rs. {product.productId?.price} x {product.quantity}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <strong>Delivery Address:</strong>{" "}
                    {selectedOrder1.deliveryAddress}
                  </div>
                  <div>
                    <strong>Payment Mode:</strong> {selectedOrder1.paymentMode}
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button
                      className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg"
                      onClick={closeModal}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MilkmanNotific;
