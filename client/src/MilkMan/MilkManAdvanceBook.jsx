import React, { useState, useEffect } from "react";
import AdminNav from "../components/Sidebar/Sidebar";
import API from "../api";
import { toast, ToastContainer } from "react-toastify";
import Loader from "../components/Loader/Loader";
import { motion, AnimatePresence } from "framer-motion";

const MilkManAdvanceBook = () => {
  const [loading, setLoading] = useState(false);
  const [advanceBookingProducts, setAdvanceBookingProducts] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null); // Store the selected order for detailed view

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Set number of items per page

  const fetchAdvanceBook = async () => {
    try {
      const token = await localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }
      setLoading(true);

      const response = await API.get(`/api/auth/user/getadvanceMilkman`);
      setLoading(false);

      const reversedOrders = response.data.orders.reverse(); // Reverse the array
      setAdvanceBookingProducts(reversedOrders); // Set reversed data to state
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSeeDetails = async (item) => {
    try {
      setSelectedOrder(item); // Set the selected order to show in modal
      if (item.isSeen) {
        return;
      }
      const data = await API.put(`/api/auth/milkman/unseen?id=${item._id}`);
      fetchAdvanceBook();
      // fetchProducts();
    } catch (error) {}
  };

  const handleAccept = async (id) => {
    try {
      await API.post(`/api/auth/milkman/accept-order?id=${id}`);
      fetchAdvanceBook(); // Fetch updated data
      toast.success("Order Accepted");
      setSelectedOrder(null); // Close the modal after accepting
    } catch (error) {
      console.error(error);
      toast.error("Failed to accept order");
    }
  };

  const handleReject = async (id) => {
    try {
      await API.post(`/api/auth/milkman/reject-order?id=${id}`);
      fetchAdvanceBook(); // Fetch updated data
      toast.success("Order Rejected");
      setSelectedOrder(null); // Close the modal after rejecting
    } catch (error) {
      console.error(error);
      toast.error("Failed to reject order");
    }
  };

  useEffect(() => {
    fetchAdvanceBook();
  }, []);

  // Calculate the items to display based on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = advanceBookingProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Pagination Controls
  const totalPages = Math.ceil(advanceBookingProducts.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <AdminNav />
      <ToastContainer />
      <div className="lg:ml-64 mt-20">
        <div className="min-h-screen flex flex-col items-center bg-gray-50 px-4 sm:px-8 py-8">
          {loading && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50 backdrop-blur-md">
              <Loader />
            </div>
          )}

          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg w-full max-w-6xl border border-gray-200">
            <h3 className="text-3xl font-bold mb-6 text-[#40A1CB] text-center">
              Advance Bookings
            </h3>

            {/* 🔍 Search Bar */}
            <div className="mb-6 w-full">
              <input
                type="text"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#40A1CB] focus:outline-none"
              />
            </div>

            {/* 📦 List of Bookings */}
            <div className="mb-8">
              <ul className="space-y-4">
                <AnimatePresence>
                  {currentItems
                    .filter((notif) =>
                      notif.name
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
                    )
                    .map((notif) => (
                      <motion.li
                        key={notif._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="flex justify-between items-center bg-white shadow-md rounded-lg p-4 hover:bg-gray-100 transition-all duration-300"
                      >
                        <span className="text-lg text-gray-800">
                          {notif.name} - {notif.description}
                          <span className="text-sm text-gray-500 ml-2">
                            {new Date(notif.date).toLocaleDateString()}
                          </span>
                        </span>

                        <button
                          className="ml-4 bg-gray-500 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-gray-600 transition"
                          onClick={() => handleSeeDetails(notif)}
                        >
                          View Details
                        </button>
                      </motion.li>
                    ))}
                </AnimatePresence>
              </ul>
            </div>

            {/* 📄 Pagination */}
            <div className="flex justify-between items-center mt-6">
              <button
                className="bg-[#40A1CB] text-white px-5 py-2 rounded-lg disabled:opacity-50"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className="text-lg font-medium text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                className="bg-[#40A1CB] text-white px-5 py-2 rounded-lg disabled:opacity-50"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>

            {/* 📦 Modal for Order Details */}
            {selectedOrder && (
              <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-40 backdrop-blur-sm z-50">
                <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl max-w-lg w-full border border-gray-200">
                  <h3 className="text-2xl font-bold text-[#40A1CB] mb-6 text-center">
                    Order Details - {selectedOrder.name}
                  </h3>

                  <div className="space-y-3 text-gray-700 text-sm sm:text-base">
                    <div>
                      <strong>Delivered By:</strong> {selectedOrder.deliveredBy}
                    </div>
                    <div>
                      <strong>Description:</strong> {selectedOrder.description}
                    </div>
                    <div>
                      <strong>Price:</strong> ₹{selectedOrder.price}
                    </div>
                    <div>
                      <strong>Status:</strong>{" "}
                      <span
                        className={
                          selectedOrder.status === "accepted"
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {selectedOrder.status}
                      </span>
                    </div>
                    <div>
                      <strong>Payment Mode:</strong> {selectedOrder.dealer}
                    </div>
                    <div>
                      <strong>Delivery Date:</strong>{" "}
                      {new Date(selectedOrder.date).toLocaleString()}
                    </div>
                    <div>
                      <strong>Milkman ID:</strong> {selectedOrder.milkmanId}
                    </div>
                  </div>

                  <div className="flex justify-between mt-6">
                    <button
                      className="bg-[#40A1CB] text-white px-5 py-2 rounded-lg"
                      onClick={() => handleAccept(selectedOrder._id)}
                    >
                      Accept Order
                    </button>
                    <button
                      className="bg-red-500 text-white px-5 py-2 rounded-lg"
                      onClick={() => handleReject(selectedOrder._id)}
                    >
                      Reject Order
                    </button>
                  </div>

                  <div className="mt-4 flex justify-center">
                    <button
                      className="bg-gray-600 text-white px-6 py-2 rounded-lg"
                      onClick={() => setSelectedOrder(null)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MilkManAdvanceBook;
