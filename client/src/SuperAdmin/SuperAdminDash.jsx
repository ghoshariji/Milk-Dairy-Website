import React, { useEffect, useState } from "react";
import SuperAdminSidebar from "../components/SuperSidebar/SuperAdminSidebar";
import API from "../api";

const StatBox = ({ title, value }) => {
  return (
    <div className="bg-[#B1D4E0] text-black p-6 rounded-2xl shadow-md w-full">
      <h4 className="text-sm font-bold mb-2">{title}</h4>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
};

const StatBox1 = ({ title, value }) => {
  return (
    <div className="bg-gray-100 text-black p-6 rounded-2xl shadow-md w-full">
      <h4 className="text-sm font-medium mb-2">{title}</h4>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
};

const Box = ({ children }) => (
  <div className="p-4 rounded-xl shadow bg-gray-100 w-full">{children}</div>
);

const Box1 = ({ children }) => (
  <div className="p-4 rounded-xl shadow bg-[#B1D4E0] w-full">{children}</div>
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
            <div className="p-4 md:p-8 ">
              <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-6">
                <StatBox
                  title="User List (7 days)"
                  value={stats.milkmenCreated ? stats.milkmenCreated : "0"}
                />
                <StatBox1
                  title="Complain (7 Days)"
                  value={`+${stats.helpRequests}`}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Box className="bg-gray-100 p-6 rounded-xl shadow-sm">
                  <div className="mt-4">
                    <p className="text-lg font-bold text-gray-800 mb-4">
                      Recent Users
                    </p>

                    {stats.latestUsers.slice(0, 5).map((user, idx) => (
                      <div key={idx} className="mb-2">
                        <p className="text-sm text-gray-700 font-medium">
                          <span className="text-[#40A1CB]">{user.name}</span> —{" "}
                          {user.email}
                        </p>
                      </div>
                    ))}

                    <div className="mt-6 text-right">
                      <a
                        href="/users"
                        className="inline-block px-5 py-2.5 bg-[#40A1CB] text-white rounded-lg hover:bg-[#3495b8] transition duration-300"
                      >
                        Show All Users
                      </a>
                    </div>
                  </div>
                </Box>

                <Box1 className="flex flex-col justify-between h-full p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 group">
                  <div>
                    <p className="text-xl font-bold mb-4 text-gray-800 group-hover:text-[#40A1CB] transition-colors duration-300">
                      Manage Subscription Plans
                    </p>
                    <p className="text-base text-gray-600 leading-relaxed">
                      As an admin, you can manage and assign subscription plans
                      to users. Provide access to premium features tailored to
                      their needs. Click below to explore and configure the
                      available subscription plans.
                    </p>
                  </div>

                  <div className="mt-10 text-right">
                    <a
                      href="/subscriptions"
                      className="inline-block px-6 py-3 bg-[#40A1CB] text-white rounded-lg shadow-md hover:bg-[#3495b8] hover:shadow-lg transition-all duration-300"
                    >
                      Configure Plans
                    </a>
                  </div>
                </Box1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SuperAdminDash;
