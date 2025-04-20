import React, { useEffect, useState } from "react";
import CustomerSidebar from "../components/CustomerSidebar/CustomerSidebar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  BarChart,
  Bar,
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const CustomerDash = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [milkData, setMilkData] = useState([]);
  const [todayMilk, setTodayMilk] = useState(null);
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

  const fetchDashboardData = async () => {
    try {
      const res = await axios.get("/api/analytics/dashboard-metrics");
      setDashboardData(res.data);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    }
  };

  const fetchWeekData = async () => {
    const startDate = getWeekStartDate().toISOString().split("T")[0];
    const endDate = new Date(selectedDate).toISOString().split("T")[0];
    try {
      const response = await axios.get(`/api/milk/week?start=${startDate}&end=${endDate}`);
      setMilkData(response.data);
    } catch (error) {
      console.error("Error fetching milk data:", error);
    }
  };

  const fetchTodayMilk = async () => {
    const today = new Date().toISOString().split("T")[0];
    try {
      const response = await axios.get(`/api/milk/today?date=${today}`);
      setTodayMilk(response.data);
    } catch (error) {
      console.error("Error fetching today milk:", error);
    }
  };

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      await Promise.all([fetchWeekData(), fetchTodayMilk(), fetchDashboardData()]);
      setLoading(false);
    };
    loadAll();
  }, [selectedDate]);

  const graphData = [
    { name: "Products", count: dashboardData.productsCount, link: "/customer-products" },
    { name: "Orders", count: dashboardData.ordersCount, link: "/orders" },
    { name: "Milkmans", count: dashboardData.milkmanCount, link: "/customer-milk-record" },
  ];

  const lineChartData = [
    { day: "Mon", Products: 12, Orders: 9, Milkmans: 3 },
    { day: "Tue", Products: 18, Orders: 14, Milkmans: 4 },
    { day: "Wed", Products: 15, Orders: 11, Milkmans: 5 },
    { day: "Thu", Products: 20, Orders: 17, Milkmans: 4 },
    { day: "Fri", Products: 25, Orders: 21, Milkmans: 6 },
    { day: "Sat", Products: 23, Orders: 19, Milkmans: 7 },
    { day: "Sun", Products: 30, Orders: 25, Milkmans: 8 },
  ];

  return (
    <div className="flex">
      <CustomerSidebar />
      <div className="p-4 w-full lg:ml-64 mt-20 bg-white min-h-screen">
        {/* Weekly Trend Line Chart */}
        <div className="mb-6 bg-white p-4 rounded-xl shadow">
          <h2 className="text-lg font-semibold text-[#40A1CB] mb-4">Weekly Overview</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={lineChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="Products" stroke="#40A1CB" />
              <Line type="monotone" dataKey="Orders" stroke="#7DD3FC" />
              <Line type="monotone" dataKey="Milkmans" stroke="#60A5FA" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Graphs Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {graphData.every(item => item.count === 0) ? (
            <p className="text-center col-span-3 text-gray-400">No dashboard metrics available.</p>
          ) : (
            graphData.map((item, index) => (
              <div
                key={index}
                onClick={() => navigate(item.link)}
                className="bg-[#eaf4f9] p-4 rounded-xl shadow cursor-pointer hover:bg-[#d3eaf4] transition"
              >
                <h3 className="text-center text-[#40A1CB] font-semibold mb-2">{item.name}</h3>
                <ResponsiveContainer width="100%" height={150}>
                  <BarChart data={[item]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#40A1CB" barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ))
          )}
        </div>

        {/* Weekly & Today's Milk Record */}
        {loading ? (
          <div className="text-center text-gray-400 mt-10">Loading dashboard...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Weekly Milk Box */}
            <div className="bg-white p-4 rounded-lg shadow-md relative">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold text-[#40A1CB]">Milk Data (This Week)</h2>
                <button
                  onClick={() => setShowCalendar(!showCalendar)}
                  className="text-[#40A1CB] hover:text-[#2b91ba]"
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
                      setShowCalendar(false);
                    }}
                    inline
                  />
                </div>
              )}
              <div className="mb-2 text-sm text-gray-600 flex flex-wrap gap-2">
                {Array.from({ length: 7 }, (_, i) => {
                  const weekStart = getWeekStartDate();
                  const date = new Date(weekStart);
                  date.setDate(weekStart.getDate() + i);
                  const formatted = date.toLocaleDateString("en-US", {
                    weekday: "short",
                    day: "numeric",
                  });
                  const isToday = date.toDateString() === new Date().toDateString();
                  return (
                    <span
                      key={i}
                      className={`px-2 py-1 rounded-md ${
                        isToday ? "bg-[#e6f7fc] font-semibold text-[#40A1CB]" : ""
                      }`}
                    >
                      {formatted}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Today's Milk Record */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-[#40A1CB] mb-2">Today’s Milk Record</h2>
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
                <p className="text-gray-500">No milk recorded today.</p>
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
                <h2 className="text-lg font-semibold text-gray-700">Today's Milk Record</h2>
                <div className="flex items-end gap-1 mt-2">
                  <span className="text-4xl font-bold text-black">6</span>
                  <span className="text-lg text-gray-600">LTR</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">25 Sep</p>
                <p className="text-2xl font-bold text-black">420.20 <span className="text-sm font-medium text-gray-600">INR</span></p>
              </div>
            </div>
            <div className="flex justify-between mt-4 text-sm text-gray-700">
              <div><p className="font-semibold">Fat</p><p>5.1</p></div>
              <div><p className="font-semibold">Snf</p><p>5.1</p></div>
              <div><p className="font-semibold">Rate</p><p>69 INR</p></div>
            </div>
          </div>

          {/* Monthly Milk Summary */}
          <div className="bg-[#eaf4f9] p-5 rounded-2xl shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold text-gray-700">Monthly Record</h2>
                <p className="text-2xl font-bold text-black mt-2">5600 <span className="text-sm font-medium text-gray-600">INR</span></p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">September ▼</p>
                <p className="text-2xl font-bold text-black mt-2">80 <span className="text-sm font-medium text-gray-600">LTR</span></p>
              </div>
            </div>
            <div className="flex justify-between mt-4 text-sm text-gray-700">
              <div><p className="font-semibold">Avg. Fat</p><p>5.1</p></div>
              <div><p className="font-semibold">Avg. Snf</p><p>7.0</p></div>
              <div><p className="font-semibold">Avg. Rate</p><p>69 INR</p></div>
            </div>
            <p className="text-xs text-center text-gray-500 mt-3">Based on your milk history</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDash;
