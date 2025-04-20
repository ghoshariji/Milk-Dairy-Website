import React, { useState, useEffect } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import API from "../api";
import CustomerSidebar from "../components/CustomerSidebar/CustomerSidebar";

const CustomerMilkRecord = () => {
  const [fromDate, setFromDate] = useState("2024-08-22");
  const [toDate, setToDate] = useState("2024-09-22");
  const [milkData, setMilkData] = useState([]);

  const fetchMilkData = async () => {
    if (!fromDate || !toDate) return;
    try {
      const response = await API.get("/api/auth/user/records-seller", {
        params: {
          from: fromDate,
          to: toDate,
        },
      });
      setMilkData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchMilkData();
  }, [fromDate, toDate]);

  return (
    <div className="flex">
      <CustomerSidebar />

      <div className="lg:ml-64 w-full min-h-screen bg-white pt-24 px-4 flex justify-center items-start">
        <div className="w-full max-w-4xl bg-white shadow-2xl rounded-2xl p-8">
          {/* Header */}
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6 border-b pb-2">
            🥛 Milk Record Dashboard
          </h2>

          {/* Date Range Selector */}
          <div className="flex flex-col sm:flex-row justify-between gap-6 mb-8">
            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-1">From Date</label>
              <div className="relative">
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:ring-2 focus:ring-green-300"
                />
                <FaCalendarAlt className="absolute right-3 top-3 text-gray-400" />
              </div>
            </div>

            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-1">To Date</label>
              <div className="relative">
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:ring-2 focus:ring-green-300"
                />
                <FaCalendarAlt className="absolute right-3 top-3 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Milk Data Table */}
          {milkData && milkData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-xl text-sm shadow-md">
                <thead>
                  <tr className="bg-green-200 text-gray-700 text-sm uppercase">
                    <th className="px-5 py-3 text-left">Date</th>
                    <th className="px-5 py-3 text-left">Quantity (Litres)</th>
                    <th className="px-5 py-3 text-left">Fat %</th>
                    <th className="px-5 py-3 text-left">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {milkData.map((record, index) => (
                    <tr
                      key={index}
                      className="border-t hover:bg-green-50 transition duration-200"
                    >
                      <td className="px-5 py-3">{record.date}</td>
                      <td className="px-5 py-3">{record.quantity}</td>
                      <td className="px-5 py-3">{record.fat}</td>
                      <td className="px-5 py-3 font-semibold text-green-700">
                        ₹{record.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-gray-600 mt-6">
              No milk records found for the selected range.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerMilkRecord;
