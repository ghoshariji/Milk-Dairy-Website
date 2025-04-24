import React, { useState, useEffect } from "react";
import AdminNav from "../components/Sidebar/Sidebar";
import API from "../api";
import { toast, ToastContainer } from "react-toastify";
import { Trash2 } from "lucide-react"; // or "react-icons/fi" -> FiTrash2
import Loader from "../components/Loader/Loader";
import { motion, AnimatePresence } from "framer-motion";

const MilkManUpdateMilk = () => {
  const [searchText, setSearchText] = useState("");
  const [updatedUsers, setUpdatedUsers] = useState([]);
  const [notUpdatedUsers, setNotUpdatedUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newMilkValue, setNewMilkValue] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [activeTab, setActiveTab] = useState("notUpdated");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchData();
  }, []);

  const itemsPerPage = 10;
  const currentList = activeTab === "updated" ? updatedUsers : notUpdatedUsers;
  const totalPages = Math.ceil(currentList.length / itemsPerPage);
  const paginatedUsers = currentList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const fetchData = async () => {
    try {
      setLoading(true);
      const todayDate = new Date().toISOString().split("T")[0];
      const response = await API.get(`/api/milk/all?date=${todayDate}`);
      setUpdatedUsers(response.data.updatedCustomers);
      setNotUpdatedUsers(response.data.notUpdatedCustomers);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const updateMilk = async () => {
    try {
      setLoading(true);
      const todayDate = new Date().toISOString().split("T")[0];
      const milkData = selectedUsers.map((id) => ({
        userId: id,
        date: todayDate,
      }));
      await API.post("/api/milk/bulk-update", { milkData });
      toast.success("Milk data updated successfully");
      fetchData();
      setSelectedUsers([]);
    } catch (error) {
      toast.error("Error updating milk data");
    }
    setLoading(false);
  };

  const saveManualMilkUpdate = async () => {
    try {
      setLoading(true);
      if (editingUser) {
        const todayDate = new Date().toISOString().split("T")[0];
        await API.post("/api/milk/manual-update", {
          userId: editingUser._id,
          date: todayDate,
          milkQuantity: parseInt(newMilkValue),
        });
        toast.success("Milk data updated successfully");
        fetchData();
        setModalVisible(false);
      }
    } catch (error) {
      toast.error("Error updating milk data");
    }
    setLoading(false);
  };
  const deleteUser = async (userId) => {
    try {
      // Create a date object with local date (removing timezone offset)
      const today = new Date();
      today.setMinutes(today.getMinutes() - today.getTimezoneOffset());

      // Format the date to YYYY-MM-DD
      const formattedDate = today.toISOString().split("T")[0];

      const response = await API.delete("/api/milk/delete", {
        data: {
          userId,
          date: formattedDate,
        },
      });
      console.log(response);

      if (response.status === 200) {
        // Remove the deleted user from both lists
        setUpdatedUsers((prev) => prev.filter((user) => user._id !== userId));
        setNotUpdatedUsers((prev) =>
          prev.filter((user) => user._id !== userId)
        );
        toast.success("Updated Successfully")
        fetchData(); // Refresh data
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Internal Server Error....")

      // Optionally show an error toast or message
    }
  };

  return (
    <>
      <AdminNav />
      <ToastContainer />
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center z-50  bg-opacity-50 backdrop-blur-md">
          <Loader />
        </div>
      )}
      <div className="lg:ml-64 mt-20 bg-gray-100 min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white p-6 rounded-lg shadow-md"
        >
          <h3 className="text-lg font-semibold text-[#40A1CB] mb-4">
            Milk Data Management
          </h3>

          <div className="flex mb-4 space-x-2">
            {["updated", "notUpdated"].map((tab) => (
              <motion.button
                key={tab}
                whileHover={{ scale: 1.05 }}
                className={`px-4 py-2 rounded transition-all ${
                  activeTab === tab
                    ? "bg-[#40A1CB] text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
                onClick={() => {
                  setActiveTab(tab);
                  setCurrentPage(1);
                }}
              >
                {tab === "updated" ? "Updated" : "Not Updated"}
              </motion.button>
            ))}
          </div>

          <div className="overflow-y-auto h-96 rounded p-2 space-y-2">
            {paginatedUsers.map((user, index) => (
              <motion.div
                key={user._id}
                whileHover={{ scale: 1.01, backgroundColor: "#f1faff" }}
                className="flex justify-between items-center border-b py-2 px-2 rounded transition"
              >
                <div className="flex items-center">
                  <span className="mr-2 font-semibold">
                    {(currentPage - 1) * itemsPerPage + index + 1}.
                  </span>

                  {activeTab !== "updated" && (
                    <input
                      type="checkbox"
                      className="accent-[#40A1CB] w-4 h-4"
                      onChange={() =>
                        setSelectedUsers((prev) =>
                          prev.includes(user._id)
                            ? prev.filter((id) => id !== user._id)
                            : [...prev, user._id]
                        )
                      }
                    />
                  )}

                  <span
                    className={`ml-2 ${
                      activeTab !== "updated" ? "" : "ml-6"
                    } text-gray-700`}
                  >
                    {user.name} - {user.milkQuantity} Kg
                  </span>
                </div>

                {activeTab === "updated" ? (
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded flex items-center gap-2 transition"
                    onClick={() => deleteUser(user._id)}
                  >
                    <Trash2 size={16} />
                  </button>
                ) : (
                  <button
                    className="bg-[#40A1CB] hover:bg-[#368bb0] text-white px-3 py-1 rounded transition"
                    onClick={() => {
                      setEditingUser(user);
                      setNewMilkValue(user.milkQuantity);
                      setModalVisible(true);
                    }}
                  >
                    Edit
                  </button>
                )}
              </motion.div>
            ))}
          </div>
          {activeTab !== "updated" && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              className="mt-6 w-full bg-[#40A1CB] hover:bg-[#2b89af] text-white px-4 py-2 rounded transition"
              onClick={updateMilk}
              disabled={loading}
            >
              {loading ? "Updating..." : "Bulk Update"}
            </motion.button>
          )}
          {/* Pagination */}
          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </div>
            <div className="space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
              >
                Prev
              </button>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>

          
        </motion.div>
      </div>

      {modalVisible && (
        <AnimatePresence>
          <motion.div
            className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50 backdrop-blur-sm bg-gray-500 bg-opacity-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-lg font-semibold mb-4 text-center text-[#40A1CB]">
                Edit Milk Quantity
              </h3>
              <input
                type="number"
                value={newMilkValue}
                onChange={(e) => setNewMilkValue(e.target.value)}
                className="w-full mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#40A1CB]"
              />
              <div className="flex justify-end space-x-2">
                <button
                  className="bg-[#40A1CB] text-white px-4 py-2 rounded hover:bg-[#368bb0] transition"
                  onClick={saveManualMilkUpdate}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save"}
                </button>
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
                  onClick={() => setModalVisible(false)}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
    </>
  );
};

export default MilkManUpdateMilk;
