import React, { useState, useEffect } from "react";
import AdminNav from "../components/Sidebar/Sidebar";
import API from "../api";
import { toast, ToastContainer } from "react-toastify";

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

  useEffect(() => {
    fetchData();
  }, []);

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

  return (
    <>
      <AdminNav />
      <ToastContainer />
      <div className="lg:ml-64 mt-20 p-6 bg-gray-100 min-h-screen">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-[#40A1CB]">
            Milk Data Management
          </h3>
          <input
            type="text"
            placeholder="Search Users"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full mb-2 p-2 border rounded"
          />
          <div className="flex mb-4">
            <button
              className={
                activeTab === "updated"
                  ? "bg-blue-500 text-white px-4 py-2"
                  : "px-4 py-2"
              }
              onClick={() => setActiveTab("updated")}
            >
              Updated
            </button>
            <button
              className={
                activeTab === "notUpdated"
                  ? "bg-blue-500 text-white px-4 py-2"
                  : "px-4 py-2"
              }
              onClick={() => setActiveTab("notUpdated")}
            >
              Not Updated
            </button>
          </div>
          <div className="overflow-y-auto h-96 border rounded p-4">
            {(activeTab === "updated" ? updatedUsers : notUpdatedUsers).map(
              (user) => (
                <div
                  key={user._id}
                  className="flex justify-between items-center border-b py-2"
                >
                  <div>
                    <input
                      type="checkbox"
                      onChange={() =>
                        setSelectedUsers((prev) =>
                          prev.includes(user._id)
                            ? prev.filter((id) => id !== user._id)
                            : [...prev, user._id]
                        )
                      }
                    />
                    <span className="ml-2">
                      {user.name} - {user.milkQuantity} Kg
                    </span>
                  </div>
                  <button
                    className="bg-green-500 text-white px-3 py-1 rounded"
                    onClick={() => {
                      setEditingUser(user);
                      setNewMilkValue(user.milkQuantity);
                      setModalVisible(true);
                    }}
                  >
                    Edit
                  </button>
                </div>
              )
            )}
          </div>
          <button
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            onClick={updateMilk}
            disabled={loading}
          >
            {loading ? "Updating..." : "Bulk Update"}
          </button>
        </div>
      </div>
      {modalVisible && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-lg font-semibold">Edit Milk Quantity</h3>
            <input
              type="number"
              value={newMilkValue}
              onChange={(e) => setNewMilkValue(e.target.value)}
              className="w-full mb-2 p-2 border rounded"
            />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={saveManualMilkUpdate}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
            <button
              className="ml-2 bg-gray-500 text-white px-4 py-2 rounded"
              onClick={() => setModalVisible(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default MilkManUpdateMilk;
