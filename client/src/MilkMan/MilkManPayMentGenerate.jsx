import React, { useEffect, useState } from "react";
import Loader from "../components/Loader/Loader";
import { ToastContainer, toast } from "react-toastify";
import AdminNav from "../components/Sidebar/Sidebar";
import Authentication from "../utils/Authentication";
import API from "../api";
import { FaEdit } from "react-icons/fa";

const MilkManPayMentGenerate = () => {
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleGenerateBill = async () => {
    try {
      setLoading(true);
      const response = await API.post("/api/milkman/payment/generate", {
        startDate,
        endDate,
      });
      toast.success("Bill generated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate bill!");
    } finally {
      setLoading(false);
    }
  };
  const fetchAllData = async () => {
    try {
      const response = await API.get("/api/milkman/payment");
      console.log(response.data);
      setPaymentData(response.data);
    } catch (err) {
      console.error("Error fetching payments:", err);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);
const handleStatusUpdate = async (paymentId) => {
  try {
    // Implement your logic for updating the payment status
    console.log("Update status for payment ID:", paymentId);
    // For example, you can call an API to update the status
  } catch (err) {
    console.error("Error updating status:", err);
  }
};

  return (
    <div className="flex">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50 backdrop-blur-md">
          <Loader />
        </div>
      )}
      <ToastContainer />
      <AdminNav />
      <Authentication />

      <div className="p-4 w-full lg:ml-64 mt-20 bg-white min-h-screen">
        <div className="flex space-x-4 mb-4 w-full">
          {/* Start Date Label and Input */}
          <div className="flex-1">
            <label
              htmlFor="startDate"
              className="block text-sm font-medium mb-1"
            >
              Start Date
            </label>
            <input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2 border rounded"
            />
          </div>

          {/* End Date Label and Input */}
          <div className="flex-1">
            <label htmlFor="endDate" className="block text-sm font-medium mb-1">
              End Date
            </label>
            <input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2 border rounded"
            />
          </div>

          <button
            onClick={handleGenerateBill}
            className="bg-[#40A1CB] text-white px-6 py-2 rounded hover:cursor-pointer"
          >
            Generate Bill
          </button>
        </div>

        {/* Table */}
        {paymentData.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border border-gray-300 text-sm">
              <thead className="bg-[#40A1CB] text-left">
                <tr>
                  <th className="px-4 py-2 border text-white">Username</th>
                  <th className="px-4 py-2 border text-white">Email</th>
                  <th className="px-4 py-2 border text-white">Phone</th>
                  <th className="px-4 py-2 border text-white">User Code</th>
                  <th className="px-4 py-2 border text-white">Total Litre</th>
                  <th className="px-4 py-2 border text-white">
                    Payment Amount
                  </th>
                  <th className="px-4 py-2 border text-white">
                    Payment Status
                  </th>
                  <th className="px-4 py-2 border text-white">Action</th>
                </tr>
              </thead>
              <tbody>
                {paymentData.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border">{item.userId.name}</td>
                    <td className="px-4 py-2 border">{item.userId.email}</td>
                    <td className="px-4 py-2 border">{item.userId.phone}</td>
                    <td className="px-4 py-2 border">
                      {item.userId.enterCode}
                    </td>
                    <td className="px-4 py-2 border">{item.totalLitre}</td>
                    <td className="px-4 py-2 border">{item.paymentAmount}</td>
                    <td className="px-4 py-2 border">{item.paymentStatus}</td>
                    <td className="px-4 py-2 border text-center">
                      <button
                        onClick={() => handleStatusUpdate(item._id)}
                        className="text-black"
                        title="Update Status"
                      >
                        <FaEdit size={20} />
                      </button>
                    </td>{" "}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MilkManPayMentGenerate;
