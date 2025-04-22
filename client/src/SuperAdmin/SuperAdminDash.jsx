import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { ChevronUp, ChevronDown } from "lucide-react";
import SuperAdminSidebar from "../components/SuperSidebar/SuperAdminSidebar";
import API from "../api";

const activeUsers = 27;
const totalUsers = 80;
const questionsAnswered = 3298;
const avgSession = "2m 34s";
const knowledgeData = {
  starting: 64,
  current: 86,
  gain: 34,
};
const activityData = [
  { name: "FEB", users: 180 },
  { name: "MAR", users: 230 },
  { name: "APR", users: 210 },
  { name: "MAY", users: 400 },
  { name: "JUN", users: 300 },
  { name: "JUL", users: 380 },
  { name: "AUG", users: 420 },
  { name: "SEP", users: 500 },
  { name: "OCT", users: 490 },
  { name: "NOV", users: 580 },
  { name: "DEC", users: 600 },
];
const weakestTopics = [
  { name: "Food Safety", score: 74 },
  { name: "Compliance Basics Procedures", score: 52 },
  { name: "Company Networking", score: 36 },
];
const strongestTopics = [
  { name: "Covid Protocols", score: 95 },
  { name: "Cyber Security Basics", score: 92 },
  { name: "Social Media Policies", score: 88 },
];
const users = [
  { name: "Jesse Thomas", points: 637, correct: 94, position: 1 },
  { name: "Thisal Mahityahagan", points: 625, correct: 89, position: 2 },
];
const groups = [
  { name: "Houston Facility", points: 52, correct: 97, position: 1 },
  { name: "Test Group", points: 52, correct: 95, position: 2 },
];

const StatBox = ({ title, value }) => (
  <div className="p-4 rounded-xl shadow bg-white w-full">
    <p className="text-gray-500 text-sm mb-1">{title}</p>
    <h3 className="text-xl font-semibold">{value}</h3>
  </div>
);

const Box = ({ children }) => (
  <div className="p-4 rounded-xl shadow bg-white w-full">{children}</div>
);

const SuperAdminDash = () => {
  const [stats, setStats] = useState({
    helpRequests: 0,
    milkmenCreated: 0,
    latestUsers: [],
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await API.get(`/api/auth/user/super-admin`);
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };

    fetchStats();
  }, []);
  return (
    <>
      <div className="flex">
        <SuperAdminSidebar />
        {/* Sidebar */}

        {/* Main Content */}
        <div className=" w-full lg:ml-64 mt-20">
          <div className="flex-1  grid grid-cols-1 md:grid-cols-1 gap-6">
            <div className="p-4 md:p-8 bg-gray-100 ">
              <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-6">
                <StatBox
                  title="User List (7 days)"
                  value={stats.milkmenCreated ? stats.milkmenCreated : "0"}
                />
                <StatBox
                  title="Complain (7 Days)"
                  value={`+${stats.helpRequests}`}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Box>
                  <div className="mt-6">
                    <p className="font-medium mb-2">Recent Users</p>
                    {stats.latestUsers.slice(0, 5).map((user, idx) => (
                      <div key={idx} className="mb-2">
                        <p className="text-sm font-medium">{user.name} - {user.email}</p>
                      </div>
                    ))}

                    <div className="mt-4 text-right">
                      <a
                        href="/users"
                        className="inline-block px-4 py-2 bg-[#40A1CB] text-white rounded hover:bg-[#40A1CB] transition"
                      >
                        Show All Users
                      </a>
                    </div>
                  </div>
                </Box>

                <Box>
                  <p className="font-medium mb-2">Manage Subscription Plans</p>
                  <p className="text-sm text-gray-600 mb-4">
                    As an admin, you can manage and assign subscription plans to
                    users. Provide access to premium features tailored to their
                    needs. Click below to explore and configure the available
                    subscription plans.
                  </p>

                  <div className="mt-4 text-right">
                    <a
                      href="/subscriptions"
                      className="inline-block px-4 py-2 bg-[#40A1CB] text-white rounded hover:bg-[#40A1CB] transition"
                    >
                      Configure Plans
                    </a>
                  </div>
                </Box>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SuperAdminDash;
