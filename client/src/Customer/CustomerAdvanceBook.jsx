import React, { useState } from "react";
import CustomerSidebar from "../components/CustomerSidebar/CustomerSidebar";
import API from "../api";

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

      alert("Order submitted successfully!");
      setName("");
      setDescription("");
      setPrice("");
      setDealer("");
      setDate(new Date().toISOString().split("T")[0]);
      setDelivery("");
    } catch (error) {
      console.error("Error submitting order:", error.response?.data || error);
      alert("Failed to submit order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <CustomerSidebar />

      <div className="flex-1 p-4 md:p-8 mt-20 lg:ml-64">
        <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Advance Booking Form</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-300"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="3"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-300"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Price</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-300"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Dealer</label>
                <input
                  type="text"
                  value={dealer}
                  onChange={(e) => setDealer(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-300"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Booking Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-300"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Delivered By</label>
                <input
                  type="text"
                  value={delivery}
                  onChange={(e) => setDelivery(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-300"
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
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
