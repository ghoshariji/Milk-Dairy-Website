import React, { useState } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import API from "../api";
import Loader from "../components/Loader/Loader";
import CustomerSidebar from "../components/CustomerSidebar/CustomerSidebar";
import Authentication from "../utils/Authentication";

const CustomerMilkRecord = () => {
  const today = new Date().toISOString().split("T")[0];
  const lastMonth = new Date(new Date().setMonth(new Date().getMonth() - 1))
    .toISOString()
    .split("T")[0];

  const [fromDate, setFromDate] = useState(lastMonth);
  const [toDate, setToDate] = useState(today);
  const [milkData, setMilkData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMilkData = async (e) => {
    e.preventDefault();
    if (!fromDate || !toDate) return;

    try {
      setLoading(true);
      const response = await API.get("/api/auth/user/records-seller", {
        params: {
          from: fromDate,
          to: toDate,
        },
      });
      console.log(response.data);
      setMilkData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      <CustomerSidebar />
      <Authentication />

      {loading && (
        <div className="fixed inset-0 flex items-center justify-center z-50  bg-opacity-50 backdrop-blur-md">
          <Loader />
        </div>
      )}
      <div className="lg:ml-64 w-full min-h-screen bg-white pt-24 px-4 flex justify-center items-start">
        <div className="w-full max-w-4xl bg-white shadow-2xl rounded-2xl p-8">
          {/* Header */}
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6 border-b pb-2">
            🥛 Milk Record Dashboard
          </h2>

          {/* Date Range Selector */}
          <form
            onSubmit={fetchMilkData}
            className="flex flex-col sm:flex-row justify-between gap-6 mb-8"
          >
            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-1">
                From Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  max={toDate}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:ring-2 focus:ring-green-300"
                />
                <FaCalendarAlt className="absolute right-3 top-3 text-gray-400" />
              </div>
            </div>

            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-1">
                To Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  min={fromDate}
                  max={today}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:ring-2 focus:ring-green-300"
                />
                <FaCalendarAlt className="absolute right-3 top-3 text-gray-400" />
              </div>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="bg-[#40A1CB] text-white font-semibold px-6 py-2 rounded-lg mt-6"
              >
                {loading ? "Loading..." : "Search"}
              </button>
            </div>
          </form>
          {milkData?.records && milkData.records.length > 0 ? (
            <>
              {/* Summary Section */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 text-center">
                <div className="bg-[#B1D4E0] p-4 rounded-xl">
                  <p className="text-sm text-black font-medium">
                    Total Litres
                  </p>
                  <p className="text-xl font-bold text-black">
                    {milkData.totalLiters.toFixed(2)} L
                  </p>
                </div>
                <div className="bg-[#B1D4E0] p-4 rounded-xl">
                  <p className="text-sm text-black font-medium">
                    Total Price
                  </p>
                  <p className="text-xl font-bold text-black">
                    ₹{milkData.totalPrice}
                  </p>
                </div>
                <div className="bg-[#B1D4E0] p-4 rounded-xl">
                  <p className="text-sm text-black font-medium">
                    Average Rate
                  </p>
                  <p className="text-xl font-bold text-black">
                    ₹{milkData.avgRate} /L
                  </p>
                </div>
              </div>

              {/* Milk Data Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-xl text-sm shadow-md">
                  <thead>
                    <tr className="bg-[#B1D4E0] text-gray-700 text-sm uppercase">
                      <th className="px-5 py-3 text-left">Date</th>
                      <th className="px-5 py-3 text-left">Quantity (Kg)</th>
                      <th className="px-5 py-3 text-left">Fat %</th>
                      <th className="px-5 py-3 text-left">Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {milkData.records.map((record, index) => (
                      <tr
                        key={index}
                        className="border-t hover:bg-green-50 transition duration-200"
                      >
                        <td className="px-5 py-3">
                          {new Date(record.date).toLocaleDateString()}
                        </td>
                        <td className="px-5 py-3">{record.kg} kg</td>
                        <td className="px-5 py-3">{record.fat}</td>
                        <td className="px-5 py-3 font-semibold text-green-700">
                          ₹{record.rate}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <p className="text-center text-gray-600 mt-6">
              {loading
                ? "Fetching records..."
                : "No milk records found for the selected range."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerMilkRecord;
