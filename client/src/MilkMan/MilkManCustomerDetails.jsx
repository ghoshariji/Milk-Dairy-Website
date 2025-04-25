import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api";
import { motion } from "framer-motion";
import AdminNav from "../components/Sidebar/Sidebar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../components/Loader/Loader";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const years = [2023, 2024, 2025];

const MilkManCustomerDetails = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [customerData, setCustomerData] = useState(null);
  const [rate, setRate] = useState("0");
  const [newRate, setNewRate] = useState("0");
  const [isEditingRate, setIsEditingRate] = useState(false);

  const [todayMilk, setTodayMilk] = useState({
    totalLiters: 0,
    totalPrice: 0,
    avgRate: 0,
  });
  const [monthData, setMonthData] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(
    months[new Date().getMonth()]
  );
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const fetchCustomerData = async () => {
      setLoading(true);
      try {
        const response = await API.get(`/api/auth/milkman/${id}`);
        if (response.data.success) {
          const fetchedRate = String(response.data.customer.milkRate);
          setRate(fetchedRate);
          setNewRate(fetchedRate);
          setCustomerData(response.data.customer);
        } else {
          toast.error("Failed to fetch customer data");
        }
      } catch (error) {
        console.error("Error fetching customer data:", error);
        toast.error("Error fetching customer data");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCustomerData();
  }, [id]);

  useEffect(() => {
    // Replace with actual API call to fetch today's milk and monthly data
    setTodayMilk({ totalLiters: 10.5, totalPrice: 315, avgRate: 30 });
    setMonthData({ totalLiters: 300.75, totalAmount: 9022.5, avgRate: 30 });
  }, [selectedMonth, selectedYear]);

  const updateMilkRate = async () => {
    const numericRate = Number(newRate);
    if (isNaN(numericRate)) {
      toast.error("Please enter a valid rate");
      return;
    }

    setUpdating(true);
    try {
      const res = await API.post(`/api/auth/milkman/update-rate/${id}`, {
        rate: numericRate,
      });

      if (res.data) {
        setRate(String(numericRate));
        setIsEditingRate(false);
        toast.success("Milk rate updated successfully!");
      } else {
        toast.error("Failed to update rate.");
      }
    } catch (error) {
      console.error("Error updating milk rate:", error);
      toast.error("Error updating milk rate.");
    } finally {
      setUpdating(false);
    }
  };

  const [milkData, setMilkData] = useState({
    totalLiters: 0,
    totalRate: 0,
    avgRate: 0,
  });
  const fetchUserMilkRecord = async (userId, month) => {
    try {
      setLoading(true);

      const response = await API.get(
        `/api/auth/user/milk-records-from-milkman`,
        {
          params: { userId, month },
        }
      );
      setLoading(false);
      console.log(response.data);
      setMilkData(response.data);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching milk records:", error);
    }
  };
  useEffect(() => {
    if (id) {
      fetchUserMilkRecord(id, selectedMonth);
    }
  }, [id, selectedMonth]);
  const handleDelete = async () => {
    try {
      setLoading(true);

      const response = await API.delete(`/api/auth/milkman/${id}`);
      if (response.status === 200) {
        toast.success("Success", "User deleted successfully");
        navigation.goBack();
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);

      console.error("Error deleting user:", error);
      toast.error("Error", "Failed to delete user");
    }
  };

  const [fromDate, setFromDate] = useState(() => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday;
  });
  const [toDate, setToDate] = useState(new Date());
  const [totalLitres, setTotalLitres] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [avgRate, setAvgRate] = useState(0);

  const getDayToDayList = async () => {
    try {
      const response = await API.get(`/api/milk/milkman-milkrecord/${id}`, {
        params: {
          fromDate: fromDate.toISOString(),
          toDate: toDate.toISOString(),
        },
      });

      console.log(fromDate.toISOString());
      console.log(response.data);
      // handle the response
      if (response.data.success) {
        setTotalLitres(response.data.totalLitres || 0);
        setTotalAmount(response.data.totalAmount || 0);
        setAvgRate(parseFloat(response.data.avgRate) || 0);
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getDayToDayList(); // Fetch data initially with today's date
  }, [fromDate, toDate]);
  return (
    <>
      <AdminNav />
      <ToastContainer />
      {(loading || updating) && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-white/50 backdrop-blur-sm">
          <Loader />
        </div>
      )}

      <div className="lg:ml-64 min-h-screen p-6 mt-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="grid grid-cols-1 xl:grid-cols-2 gap-8"
        >
          {/* Customer Info */}
          <div className="bg-gradient-to-r from-[#eaf4f9] to-[#f9fbfc] border border-gray-200 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 p-8 transform hover:scale-105">
            <h2 className="text-4xl font-bold text-[#40A1CB] mb-6 text-center">
              Customer Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-800">
              <Detail label="Name" value={customerData?.name} />
              <Detail label="Phone" value={customerData?.phone} />
              <Detail label="Email" value={customerData?.email} />
              <Detail
                label="Milk Quantity"
                value={customerData?.milkQuantity}
              />
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-600">
                  Milk Rate
                </span>
                {isEditingRate ? (
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="number"
                      value={newRate}
                      onChange={(e) => setNewRate(e.target.value)}
                      className="border-2 border-[#40A1CB] rounded-lg px-3 py-2 text-sm w-28 font-medium focus:outline-none focus:ring-2 focus:ring-[#40A1CB]"
                    />
                    <button
                      onClick={updateMilkRate}
                      className="text-sm px-4 py-2 bg-[#40A1CB] text-white rounded-lg hover:bg-[#3685a6] font-semibold transition duration-200"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-base font-semibold">{`${rate} ₹/L`}</span>
                    <button
                      onClick={() => setIsEditingRate(true)}
                      className="text-sm text-[#40A1CB] hover:underline font-medium"
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>
              <Detail label="Enter Code" value={customerData?.enterCode} />
              <Detail label="UPI ID" value={customerData?.upiId} />
              <Detail label="Village" value={customerData?.village} />
              <Detail label="User Type" value={customerData?.userType} />
              <Detail label="Milkman ID" value={customerData?.milkman} />
            </div>

            {/* Delete Button */}
            <div className="mt-6 text-center">
              <button
                onClick={handleDelete}
                className="text-sm px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-700 transition duration-200 font-semibold"
              >
                Delete User
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="space-y-6">
            {/* Today's Summary */}
            <div className="bg-[#eaf4f9] p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 min-h-[16rem] transform hover:scale-105">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold text-gray-700">
                    Milk Record
                  </h2>
                  <div className="flex items-end gap-1 mt-2">
                    <span className="text-4xl font-bold text-black">
                      {totalLitres.toFixed(2)}
                    </span>
                    <span className="text-lg text-gray-600">LTR</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    {new Date().toLocaleDateString("en-US", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </p>
                  <p className="text-2xl font-bold text-black">
                    {totalAmount}
                    <span className="text-sm font-medium text-gray-600">
                      {" "}
                      INR
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex justify-between mt-4 text-sm text-gray-700">
                <div>
                  <p className="font-semibold">Fat</p>
                  <p className="text-gray-500">N/A</p>
                </div>
                <div>
                  <p className="font-semibold">Snf</p>
                  <p className="text-gray-500">N/A</p>
                </div>
                <div>
                  <p className="font-semibold">Rate</p>
                  <p>{avgRate.toFixed(2)} INR</p>
                </div>
              </div>

              {/* Date Range Picker */}
              <div className="mt-6">
                <div className="flex justify-between">
                  <div className="flex items-center">
                    <label className="text-sm font-semibold text-gray-600 mr-2">
                      From:
                    </label>
                    <input
                      type="date"
                      value={fromDate.toISOString().split("T")[0]}
                      onChange={(e) => setFromDate(new Date(e.target.value))}
                      className="text-sm text-gray-700 border-2 border-gray-300 rounded px-3 py-2 transition-all duration-300 hover:border-blue-400"
                    />
                  </div>
                  <div className="flex items-center">
                    <label className="text-sm font-semibold text-gray-600 mr-2">
                      To:
                    </label>
                    <input
                      type="date"
                      value={toDate.toISOString().split("T")[0]}
                      onChange={(e) => setToDate(new Date(e.target.value))}
                      className="text-sm text-gray-700 border-2 border-gray-300 rounded px-3 py-2 transition-all duration-300 hover:border-blue-400"
                    />
                  </div>
                </div>
                <div className="text-center mt-4">
                  <button
                    onClick={getDayToDayList}
                    className="px-4 py-2 bg-[#40A1CB] text-white rounded-lg hover:cursor-pointer font-semibold transition duration-200"
                  >
                    Get Milk Records
                  </button>
                </div>
              </div>
            </div>

            {/* Monthly Summary */}
            {milkData ? (
              <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 min-h-[18rem] transform hover:scale-105">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-700">
                      Monthly Record
                    </h2>
                    <p className="text-2xl font-bold text-black mt-2">
                      {milkData.totalRate}
                      <span className="text-sm font-medium text-gray-600">
                        {" "}
                        INR
                      </span>
                    </p>
                  </div>
                  <div className="text-right space-y-2">
                    <div className="flex space-x-2">
                      <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="text-sm text-gray-700 border-2 border-gray-300 rounded px-3 py-2 transition-all duration-300 hover:border-blue-400"
                      >
                        {months.map((month) => (
                          <option key={month} value={month}>
                            {month}
                          </option>
                        ))}
                      </select>
                    </div>
                    <p className="text-2xl font-bold text-black">
                      {milkData.totalLiters?.toFixed(2)}
                      <span className="text-sm font-medium text-gray-600">
                        {" "}
                        LTR
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex justify-center mt-4 text-sm text-gray-700">
                  <div>
                    <p className="font-semibold">Avg. Rate</p>
                    <p>{milkData.avgRate} INR</p>
                  </div>
                </div>
                <p className="text-xs text-center text-gray-500 mt-3">
                  Based on your milk history
                </p>
              </div>
            ) : (
              <div className="flex items-center justify-center h-40">
                <Loader />
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
};

const Detail = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="text-sm font-semibold text-gray-600">{label}</span>
    <span className="text-lg font-bold text-gray-900 mt-1 break-words">
      {value || "—"}
    </span>
  </div>
);

export default MilkManCustomerDetails;
