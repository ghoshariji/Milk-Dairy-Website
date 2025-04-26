import React, { useState, useEffect } from "react";
import SuperAdminSidebar from "../components/SuperSidebar/SuperAdminSidebar";
import Authentication from "../utils/Authentication";
import Loader from "../components/Loader/Loader";
import API from "../api";

const SuperAdminManageSubs = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [subscriptionType, setSubscriptionType] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editSubscriptionId, setEditSubscriptionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const response = await API.get("/api/subscription");
      setSubscriptions(response.data);
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const subscriptionData = { subscriptionType, price, description };

    setLoading(true);
    try {
      if (isEditing) {
        await API.put(
          `/api/subscription/${editSubscriptionId}`,
          subscriptionData
        );
      } else {
        await API.post("/api/subscription", subscriptionData);
      }
      fetchSubscriptions();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error submitting subscription:", error);
    } finally {
      setLoading(false);
      setIsEditing(false);
      setSubscriptionType("");
      setPrice("");
      setDescription("");
      setEditSubscriptionId(null);
    }
  };

  const handleEdit = (subscription) => {
    setIsEditing(true);
    setSubscriptionType(subscription.subscriptionType);
    setPrice(subscription.price);
    setDescription(subscription.description);
    setEditSubscriptionId(subscription._id);
    setIsModalOpen(true); // important: open modal when editing
  };

  const handleDelete = async (subscriptionId) => {
    setLoading(true);
    try {
      await API.delete(`/api/subscription/${subscriptionId}`);
      fetchSubscriptions();
    } catch (error) {
      console.error("Error deleting subscription:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50 backdrop-blur-md">
          <Loader />
        </div>
      )}
      <SuperAdminSidebar />
      <Authentication />
      <div className="lg:ml-64 mt-20 p-6">
        {/* Add Subscription Button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => {
              setIsModalOpen(true);
              setIsEditing(false);
              setSubscriptionType("");
              setPrice("");
              setDescription("");
            }}
            className="bg-[#40A1CB]  text-white px-6 py-3 rounded-md hover:scale-105 transition-transform"
          >
            Add Subscription
          </button>
        </div>

        {/* Subscription Table */}
        <div className="overflow-x-auto shadow-lg rounded-lg">
          <table className="min-w-full bg-white">
            <thead className="bg-[#40A1CB]  text-white">
              <tr>
                <th className="py-4 px-6 text-left">Subscription Type</th>
                <th className="py-4 px-6 text-left">Price</th>
                <th className="py-4 px-6 text-left">Description</th>
                <th className="py-4 px-6 text-left">Actions</th>
              </tr>
            </thead>

            {subscriptions.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan="4" className="text-center py-8 text-gray-500">
                    No records found.
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody className="divide-y divide-gray-200">
                {subscriptions.map((subscription) => (
                  <tr key={subscription._id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      {subscription.subscriptionType}
                    </td>
                    <td className="py-4 px-6">Rs.{subscription.price}</td>
                    <td className="py-4 px-6">
                      {subscription.description || "No description"}
                    </td>
                    <td className="py-4 px-6 flex space-x-4">
                      <button
                        onClick={() => handleEdit(subscription)}
                        className="text-[#40A1CB] 0  font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(subscription._id)}
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl p-8 w-96 animate-fade-in">
            <h2 className="text-2xl font-bold text-center text-[#40A1CB]  mb-6">
              {isEditing ? "Edit Subscription" : "Add Subscription"}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block mb-1 font-medium text-gray-700">
                  Subscription Type
                </label>
                <select
                  value={subscriptionType}
                  onChange={(e) => setSubscriptionType(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-3 focus:border-blue-400 focus:ring-2 focus:ring-blue-300"
                  required
                >
                  <option value="">Select Subscription</option>
                  <option value="1 Year">1 Year</option>
                  <option value="6 Months">6 Months</option>
                  <option value="3 Months">3 Months</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block mb-1 font-medium text-gray-700">
                  Price
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-3 focus:border-blue-400 focus:ring-2 focus:ring-blue-300"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block mb-1 font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-3 focus:border-blue-400 focus:ring-2 focus:ring-blue-300"
                  rows="3"
                />
              </div>

              <div className="flex justify-between">
                <button
                  type="submit"
                  className="bg-[#40A1CB]  text-white px-5 py-2 rounded-md font-medium transition"
                >
                  {isEditing ? "Save Changes" : "Add Subscription"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-5 py-2 rounded-md font-medium transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminManageSubs;
