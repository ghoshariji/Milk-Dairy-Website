import React, { useState } from "react";
import CustomerSidebar from "../components/CustomerSidebar/CustomerSidebar";
import API from "../api";
import { toast, ToastContainer } from "react-toastify";
import Loader from "../components/Loader/Loader";
import Authentication from "../utils/Authentication";

const CustomerAdvanceBook = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [dealer, setDealer] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [delivery, setDelivery] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !description || !price || !dealer || !date) {
      alert("Please fill all required fields.");
      return;
    }

    setLoading(true);
    try {
      const response = await API.post("/api/advance/submit", {
        name,
        description,
        price,
        dealer,
        date,
        deliveredBy: delivery,
      });

      toast.success("Order submitted successfully!");
      setName("");
      setDescription("");
      setPrice("");
      setDealer("");
      setDate(new Date().toISOString().split("T")[0]);
      setDelivery("");
    } catch (error) {
      console.error("Error submitting order:", error.response?.data || error);
      toast.error("Failed to submit order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <CustomerSidebar />
      <ToastContainer />
      <Authentication />
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50 backdrop-blur-md">
          <Loader />
        </div>
      )}
      <div className="flex-1 p-4 md:p-8 mt-20 lg:ml-64">
        <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Advance Booking Form
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                value={name}
                placeholder="Enter Your Name..."
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-300"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="3"
                placeholder="Write about product buying details, customization requests, or any specific requirements..."
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-300"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Quantity
                </label>
                <input
                  type="number"
                  value={price}
                  placeholder="eg : 1,2,3"
                  onChange={(e) => setPrice(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-300"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Payment Mode
                </label>
                <input
                  type="text"
                  value={dealer}
                  onChange={(e) => setDealer(e.target.value)}
                  placeholder="Online / Cash"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-300"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Delivery Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-300"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Delivered By
                </label>
                <input
                  type="text"
                  value={delivery}
                  placeholder="Home Delivery / Take In "
                  onChange={(e) => setDelivery(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-300"
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#40A1CB] hover:cursor-pointer text-white py-2 rounded-md transition disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Submit Booking"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CustomerAdvanceBook;
