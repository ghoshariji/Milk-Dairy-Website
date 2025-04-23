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
      const token = await localStorage.getItem("token"); // Await token retrieval
      if (!token) {
        console.error("No token found");
        return;
      }
      setLoading(true);

      const response = await API.get(`/api/auth/user/getadvanceMilkman`);
      setLoading(false);
      console.log(response.data.orders);
      setAdvanceBookingProducts(response.data.orders);
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

          <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-3xl  border border-gray-200">
            <h3 className="text-2xl font-bold mb-6 text-black">
              Advance Book
            </h3>

            {/* New Requests Section */}
            <div className="mb-8">
  <ul className="space-y-4">
    <AnimatePresence>
      {currentItems.map((notif) => (
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

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-6">
              <button
                className="bg-[#40A1CB] text-white px-5 py-2 rounded-lg"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className="text-lg">{`Page ${currentPage} of ${totalPages}`}</span>
              <button
                className="bg-[#40A1CB] text-white px-5 py-2 rounded-lg"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>

            {/* Modal for Viewing Detailed Order */}
            {selectedOrder && (
              <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 backdrop-blur-md z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
                  <h3 className="text-2xl font-bold text-[#40A1CB] mb-4">
                    Order Details - {selectedOrder.name}
                  </h3>
                  <div className="mb-4">
                    <strong>Dealer:</strong> {selectedOrder.dealer}
                  </div>
                  <div className="mb-4">
                    <strong>Delivered By:</strong> {selectedOrder.deliveredBy}
                  </div>
                  <div className="mb-4">
                    <strong>Description:</strong> {selectedOrder.description}
                  </div>
                  <div className="mb-4">
                    <strong>Price:</strong> Rs. {selectedOrder.price}
                  </div>
                  <div className="mb-4">
                    <strong>Status:</strong>
                    <span
                      className={
                        selectedOrder.status === "accepted"
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {selectedOrder.status.charAt(0).toUpperCase() +
                        selectedOrder.status.slice(1)}
                    </span>
                  </div>
                  <div className="mb-4">
                    <strong>Date:</strong>{" "}
                    {new Date(selectedOrder.date).toLocaleString()}
                  </div>
                  <div className="mb-4">
                    <strong>Is Delivered:</strong>{" "}
                    {selectedOrder.isDelivered ? "Yes" : "No"}
                  </div>
                  <div className="mb-4">
                    <strong>Is Seen:</strong>{" "}
                    {selectedOrder.isSeen ? "Yes" : "No"}
                  </div>
                  <div className="mb-4">
                    <strong>Milkman ID:</strong> {selectedOrder.milkmanId}
                  </div>

                  {/* Accept and Reject Buttons inside Modal */}
                  <div className="flex justify-between mt-4">
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

                  <button
                    className="bg-[#40A1CB] text-white px-5 py-2 rounded-lg mt-4"
                    onClick={() => setSelectedOrder(null)} // Close the modal
                  >
                    Close
                  </button>
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
