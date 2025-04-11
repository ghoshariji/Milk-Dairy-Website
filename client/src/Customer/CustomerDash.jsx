import React, { useEffect, useState } from "react";
import CustomerSidebar from "../components/CustomerSidebar/CustomerSidebar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarIcon } from "@heroicons/react/24/outline";

const CustomerDash = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [milkData, setMilkData] = useState([]);
  const [todayMilk, setTodayMilk] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);

  // Get start of week (Monday)
  const getWeekStartDate = () => {
    const date = new Date();
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Monday as first day
    return new Date(date.setDate(diff));
  };

  // Fetch data for current week
  const fetchWeekData = async () => {
    const startDate = getWeekStartDate().toISOString().split("T")[0];
    const endDate = new Date().toISOString().split("T")[0];

    try {
      const response = await fetch(
        `/api/milk/week?start=${startDate}&end=${endDate}`
      );
      const data = await response.json();
      setMilkData(data);
    } catch (error) {
      console.error("Error fetching milk data:", error);
    }
  };

  // Fetch data for today
  const fetchTodayMilk = async () => {
    const today = new Date().toISOString().split("T")[0];
    try {
      const response = await fetch(`/api/milk/today?date=${today}`);
      const data = await response.json();
      setTodayMilk(data);
    } catch (error) {
      console.error("Error fetching today milk:", error);
    }
  };

  // Fetch by selected calendar date
  const fetchMilkByDate = async (date) => {
    const formatted = date.toISOString().split("T")[0];
    try {
      const response = await fetch(`/api/milk/date?date=${formatted}`);
      const data = await response.json();
      console.log("Milk data for selected date:", data);
      setMilkData(data); // or set a different state if needed
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchWeekData();
    fetchTodayMilk();
  }, []);

  return (
    <div className="flex">
      {/* Sidebar */}
      <CustomerSidebar />

      {/* Main Content */}
      <div className="p-6 w-full lg:ml-64 mt-20">
        <div className="flex-1 p-6 grid grid-cols-1 md:grid-cols-1 gap-6">
          {/* Box 1: Milk Weekly Data */}
          <div className="bg-white p-4 rounded-lg shadow-md relative">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-[#40A1CB]">
                Milk Data (This Week)
              </h2>
              <button
                onClick={() => setShowCalendar(!showCalendar)}
                className="text-[#40A1CB] hover:text-[#2b91ba]"
                title="Pick a date"
              >
                <CalendarIcon className="h-5 w-5" />
              </button>
            </div>
            {showCalendar && (
              <div className="mb-3">
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => {
                    setSelectedDate(date);
                    // fetchDataByDate(date);
                    setShowCalendar(false);
                  }}
                  inline
                />
              </div>
            )}

            {/* Display Date Numbers Below Header */}
            <div className="mb-2 text-sm text-gray-600">
              {Array.from({ length: 7 }, (_, i) => {
                const weekStart = getWeekStartDate();
                const date = new Date(weekStart);
                date.setDate(weekStart.getDate() + i);

                return (
                  <span
                    key={i}
                    className={`px-2 py-1 rounded-md ${
                      date.toISOString().split("T")[0] ===
                      new Date().toISOString().split("T")[0]
                        ? "bg-[#e6f7fc] font-semibold"
                        : ""
                    }`}
                  >
                    {date.getDate()}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Box 2: Today's Milk Record */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-[#40A1CB] mb-2">
              Today’s Milk Record
            </h2>
            {todayMilk ? (
              <div className="text-[#40A1CB] space-y-2 text-sm">
                <p>
                  <strong>Quantity:</strong> {todayMilk.quantity} L
                </p>
                <p>
                  <strong>Type:</strong> {todayMilk.type}
                </p>
                <p>
                  <strong>Recorded At:</strong>{" "}
                  {new Date(todayMilk.createdAt).toLocaleTimeString()}
                </p>
              </div>
            ) : (
              <p>No milk recorded today.</p>
            )}
          </div>

          {/* Box 3 (Placeholder) */}
          <div className="bg-[#eaf4f9] p-4 rounded-xl shadow-md w-full">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-500 text-sm">Today’s Milk Record</span>
              <span className="text-gray-500 text-sm">25 Sep</span>
            </div>
            <div className="flex justify-between items-end border-b border-gray-300 pb-2 mb-2">
              <div>
                <span className="text-3xl font-bold">6</span>
                <span className="text-sm text-gray-600 ml-1">LTR</span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-semibold">420.20</span>
                <span className="text-sm text-gray-600 ml-1">INR</span>
              </div>
            </div>
            <div className="flex justify-between text-center text-sm text-gray-700">
              <div>
                <div className="font-semibold">Fat</div>
                <div>5.1</div>
              </div>
              <div>
                <div className="font-semibold">Snf</div>
                <div>5.1</div>
              </div>
              <div>
                <div className="font-semibold">Rate</div>
                <div>
                  69 <span className="text-xs text-gray-500">INR</span>
                </div>
              </div>
            </div>
          </div>

          {/* Box 4 (Placeholder) */}
          <div className="bg-[#eaf4f9] p-4 rounded-xl shadow-md w-full">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600 text-sm">Monthly Record</span>
              <span className="text-gray-600 text-sm">September ▼</span>
            </div>
            <div className="flex justify-between items-end border-b border-gray-300 pb-2 mb-2">
              <div>
                <span className="text-2xl font-bold">5600</span>
                <span className="text-sm text-gray-600 ml-1">INR</span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold">80</span>
                <span className="text-sm text-gray-600 ml-1">LTR</span>
              </div>
            </div>
            <div className="flex justify-between text-center text-sm text-gray-700 mb-2">
              <div>
                <div className="font-semibold">Avg. Fat</div>
                <div>5.1</div>
              </div>
              <div>
                <div className="font-semibold">Avg. Snf</div>
                <div>7.0</div>
              </div>
              <div>
                <div className="font-semibold">Avg. Rate</div>
                <div>
                  69 <span className="text-xs text-gray-500">INR</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 text-center">
              Based on your milk history
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDash;
