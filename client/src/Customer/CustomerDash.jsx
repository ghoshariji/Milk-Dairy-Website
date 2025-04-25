import React, { useEffect, useState } from "react";
import CustomerSidebar from "../components/CustomerSidebar/CustomerSidebar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import API from "../api";
import MilkRecordModal from "../components/SellerCusMilkRecordModal";
import Loader from "../components/Loader/Loader";
import Authentication from "../utils/Authentication";

const CustomerDash = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [milkData, setMilkData] = useState([]);
  const [todayMilk, setTodayMilk] = useState({});
  const [showCalendar, setShowCalendar] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    productsCount: 0,
    ordersCount: 0,
    milkmanCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getWeekStartDate = () => {
    const date = new Date(selectedDate);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const fetchWeekData = async () => {
    // Format selected date as YYYY-MM-DD to send to backend
    const selecDate = new Date(selectedDate).toISOString().split("T")[0]; // Extract only YYYY-MM-DD
  
    try {
      const response = await API.get(
        `/api/auth/user/getMilkRecord-seller?date=${selecDate}` // Pass date as query parameter
      );
      console.log(response.data);  // Debugging log
      setMilkData(response.data.data[0]);  // Assuming data is an array, so take the first record
      setIsModalOpen(true);  // Open modal to display milk data
    } catch (error) {
      console.error("Error fetching milk data:", error);
    }
  };
  
  const fetchTodayMilk = async () => {
    const startDate = new Date().toISOString().split("T")[0];

    const endDate = new Date().toISOString().split("T")[0];

    try {
      const response = await API.get("/api/auth/user/records", {
        params: {
          from: startDate,
          to: endDate,
        },
      });
      console.log(response.data);
      setTodayMilk(response.data);
    } catch (error) {
      console.error("Error fetching today milk:", error);
    }
  };

  const [monthData, setMonthData] = useState(null);

  const [selectedMonth, setSelectedMonth] = useState("February");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const fetchMonthData = async () => {
    try {
      const response = await API.get("/api/auth/user/monthly-records-seller", {
        params: { month: selectedMonth, year: selectedYear },
      });
      console.log(response.data);
      setMonthData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

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

  const years = Array.from(
    { length: 10 },
    (_, i) => new Date().getFullYear() - i
  );
  useEffect(() => {
    fetchWeekData();
  }, [selectedDate]);

  useEffect(() => {
    fetchMonthData();
  }, [selectedYear, selectedMonth]);

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      await Promise.all([
        fetchTodayMilk(),
        fetchMonthData(),
      ]);
      setLoading(false);
    };
    loadAll();
  }, []);

  const [item, setMilkMen] = useState({});

  useEffect(() => {
    const fetchMilkMen = async () => {
      try {
        const response = await API.get("/api/auth/user/get-milkman-data-user");
        console.log(response.data);
        setMilkMen(response.data);
      } catch (error) {
        console.error("Error fetching milkmen:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMilkMen();
  }, []);
  return (
    <div className="flex">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center z-50  bg-opacity-50 backdrop-blur-md">
          <Loader />
        </div>
      )}
      <CustomerSidebar />
      <Authentication />

      <div className="p-4 w-full lg:ml-64 mt-20 bg-white min-h-screen">
        {/* Weekly Trend Line Chart */}

        {/* Graphs Row */}

        {/* Weekly & Today's Milk Record */}
        {loading ? (
          <div className="text-center text-gray-400 mt-10">
            Loading dashboard...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Weekly Milk Box */}
            <div className="bg-white p-5 rounded-2xl shadow-lg relative">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-[#40A1CB]">
                  Milk Data (This Week)
                </h2>
                <button
                  onClick={() => setShowCalendar(!showCalendar)}
                  className="text-[#40A1CB] hover:text-[#2b91ba] transition-colors duration-200"
                >
                  <CalendarIcon className="h-5 w-5" />
                </button>
              </div>

              {showCalendar && (
                <div className="mb-4">
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date) => {
                      setSelectedDate(date);
                      setShowCalendar(false);
                    }}
                    inline
                    calendarClassName="rounded-lg border shadow-md"
                  />
                </div>
              )}

              <div className="mb-1 text-sm text-gray-600 flex flex-wrap gap-2">
                {Array.from({ length: 7 }, (_, i) => {
                  const weekStart = getWeekStartDate();
                  const date = new Date(weekStart);
                  date.setDate(weekStart.getDate() + i);
                  const formatted = date.toLocaleDateString("en-US", {
                    weekday: "short",
                    day: "numeric",
                  });
                  const isToday =
                    date.toDateString() === new Date().toDateString();
                  return (
                    <span
                      key={i}
                      className={`px-3 py-1 rounded-full border ${
                        isToday
                          ? "bg-[#e6f7fc] border-[#40A1CB] font-medium text-[#40A1CB]"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {formatted}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Today's Milk Record */}
            <div className="bg-[#eaf4f9] p-6 rounded-2xl shadow-lg border border-gray-100">
              <h2 className="text-xl font-bold text-[#40A1CB]  mb-4">
                Your MilkMan
              </h2>
              {todayMilk ? (
                <div className="text-gray-700 text-sm space-y-3">
                  <p>
                    <span className="font-semibold text-gray-900">Name :</span>{" "}
                    {item.name}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-900">Email:</span>{" "}
                    <a
                      href={`mailto:${item.email}`}
                      className="text-[#40A1CB] hover:underline"
                    >
                      {item.email}
                    </a>
                  </p>
                  <p>
                    <span className="font-semibold text-gray-900">Code :</span>{" "}
                    {item.enterCode}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-900">
                      Address :
                    </span>{" "}
                    {item.village}
                  </p>
                </div>
              ) : (
                <p className="text-gray-400 italic">No milk recorded today.</p>
              )}
            </div>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* Today's Milk Summary */}
          <div className="bg-[#eaf4f9] p-5 rounded-2xl shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold text-gray-700">
                  Today's Milk Record
                </h2>
                <div className="flex flex-wrap items-end gap-1 mt-2 max-w-full">
                  <span className="text-4xl font-bold text-black break-words">
                    {todayMilk.totalLiters?.toFixed(2)}
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
                </p>{" "}
                <p className="text-2xl font-bold text-black">
                  {todayMilk.totalPrice}
                  <span className="text-sm font-medium text-gray-600">INR</span>
                </p>
              </div>
            </div>
            <div className="flex justify-between mt-4 text-sm text-gray-700">
              <div>
                <p className="font-semibold">Fat</p>
                <p>N/A</p>
              </div>
              <div>
                <p className="font-semibold">Snf</p>
                <p>N/A</p>
              </div>
              <div>
                <p className="font-semibold">Rate</p>
                <p>{todayMilk.avgRate} INR</p>
              </div>
            </div>
          </div>

          {/* Monthly Milk Summary */}
          {monthData ? (
            <div className="bg-white p-5 rounded-2xl shadow-md">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold text-gray-700">
                    Monthly Record
                  </h2>
                  <p className="text-2xl font-bold text-black mt-2">
                    {monthData.totalAmount}
                    <span className="text-sm font-medium text-gray-600">
                      INR
                    </span>
                  </p>
                </div>

                <div className="text-right">
                  <div className="flex items-center space-x-2 mb-2">
                    <select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      className="text-sm text-gray-700 border border-gray-300 rounded px-2 py-1"
                    >
                      {months.map((month) => (
                        <option key={month} value={month}>
                          {month}
                        </option>
                      ))}
                    </select>
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="text-sm text-gray-700 border border-gray-300 rounded px-2 py-1"
                    >
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                  <p className="text-2xl font-bold text-black">
                    {monthData.totalLiters?.toFixed(2)}
                    <span className="text-sm font-medium text-gray-600">
                      LTR
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex justify-center mt-4 text-sm text-gray-700">
                <div>
                  <p className="font-semibold">Avg. Rate</p>
                  <p>{monthData.avgRate} INR</p>
                </div>
              </div>
              <p className="text-xs text-center text-gray-500 mt-3">
                Based on your milk history
              </p>
            </div>
          ) : (
            <div className="fixed inset-0 flex items-center justify-center z-50  bg-opacity-50 backdrop-blur-md">
              <Loader />
            </div>
          )}
        </div>
      </div>
      <MilkRecordModal
        data={milkData}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default CustomerDash;
