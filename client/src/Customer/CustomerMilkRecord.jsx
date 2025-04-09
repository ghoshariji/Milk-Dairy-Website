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
      console.log(response.data);
      setMilkData(response.data); // enable this now
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (fromDate && toDate) {
      fetchMilkData();
    }
  }, [fromDate, toDate]);
  return (
    <div className="flex">
    <CustomerSidebar />

    <div className="lg:ml-64 w-full mt-20 p-6 bg-gray-100 min-h-screen">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Milk Record
        </h2>

        {/* Date Pickers */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">From</label>
            <div className="relative">
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full border rounded px-3 py-2 pr-10"
              />
              <FaCalendarAlt className="absolute right-3 top-3 text-gray-400" />
            </div>
          </div>

          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">To</label>
            <div className="relative">
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full border rounded px-3 py-2 pr-10"
              />
              <FaCalendarAlt className="absolute right-3 top-3 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Milk Data Table */}
        {milkData && milkData.length > 0 ? (
          <div className="overflow-x-auto mt-4">
            <table className="min-w-full text-sm text-left">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Quantity (Litres)</th>
                  <th className="px-4 py-2">Fat %</th>
                  <th className="px-4 py-2">Price</th>
                </tr>
              </thead>
              <tbody>
                {milkData.map((record, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-2">{record.date}</td>
                    <td className="px-4 py-2">{record.quantity}</td>
                    <td className="px-4 py-2">{record.fat}</td>
                    <td className="px-4 py-2">₹{record.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-4">No records found.</p>
        )}
      </div>
    </div>
  </div>
  )
}

export default CustomerMilkRecord
