import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

import dashboard from "../../assetss/icons/Dashboard.png";
import milkIcon from "../../assetss/icons/calendar.png";
import productIcon from "../../assetss/icons/faqs.png";
import walletIcon from "../../assetss/icons/review.png";
import paymentHistoryIcon from "../../assetss/icons/contact-list.png";
import profileIcon from "../../assetss/icons/user.png";
import paymentOptionIcon from "../../assetss/icons/add-user.png";
import milkmanIcon from "../../assetss/icons/user.png";
import changeMilkmanIcon from "../../assetss/icons/add-user.png";
import supportIcon from "../../assetss/icons/faqs.png";
import bookingIcon from "../../assetss/icons/calendar.png";
import logoutIcon from "../../assetss/icons/logout.png";

import logo from "../../pages/images/login.png";
import smallLogo from "../../pages/images/login.png";

const CustomerSidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [currentLogo, setCurrentLogo] = useState(logo);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    localStorage.removeItem("name");
    navigate("/login");
  };

  useEffect(() => {
    const adminStatus = localStorage.getItem("admin");
    const name = localStorage.getItem("name");
    setUserName(name || "");
    setAdmin(adminStatus === "true");
    setLoading(false);
  }, []);

  useEffect(() => {
    const updateLogo = () => {
      setCurrentLogo(window.innerWidth <= 768 ? smallLogo : logo);
    };
    updateLogo();
    window.addEventListener("resize", updateLogo);
    return () => window.removeEventListener("resize", updateLogo);
  }, []);

  const firstName = userName ? userName.split(" ")[0] : "User";

  const navItems = [
    { path: "/customer-dashboard", label: "Dashboard", icon: dashboard },
    { path: "/customer-milk-record", label: "Milk Record", icon: milkIcon },
    { path: "/customer-products", label: "Products", icon: productIcon },
    { path: "/customer-wallet", label: "Wallet", icon: walletIcon },
    {
      path: "/customer-payment-history",
      label: "Payment History",
      icon: paymentHistoryIcon,
    },
    { path: "/customer-profile", label: "Profile", icon: profileIcon },
    {
      path: "/customer-payments",
      label: "Payment Options",
      icon: paymentOptionIcon,
    },
    { path: "/customer-milkman", label: "Your Milkman", icon: milkmanIcon },
    {
      path: "/customer-change-milkman",
      label: "Change Milkman",
      icon: changeMilkmanIcon,
    },
    { path: "/customer-help", label: "Help & Support", icon: supportIcon },
    {
      path: "/customer-advance-book",
      label: "Advance Booking",
      icon: bookingIcon,
    },
    {
      path: "/customer-notification",
      label: "Notification",
      icon: bookingIcon,
    },
  ];

  return (
    <>
      {/* Top Navbar */}
      <nav className="fixed top-0 z-50 w-full dark:bg-black dark:border-gray-900 shadow-lg bg-white">
        <div className="px-3 py-3 lg:px-5 lg:pl-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {/* Toggle button visible only on mobile/tablet */}
              <button
                onClick={toggleSidebar}
                className="inline-flex items-center p-2 text-sm text-black rounded-lg lg:hidden hover:bg-[#3184A6]"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                  />
                </svg>
              </button>
              <Link to="/customer-dashboard" className="ml-2">
                <img src={currentLogo} alt="Logo" className="w-[100%] h-14" />
              </Link>
            </div>
            <div className="hidden lg:block">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-[#40A1CB] flex items-center justify-center text-white font-bold text-lg">
                  {firstName?.charAt(0).toUpperCase()}
                </div>
                <span className="text-white text-lg font-semibold">
                  Welcome {firstName}
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black opacity-50 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside
  className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform dark:bg-black dark:border-gray-900 bg-white 
  ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
  lg:translate-x-0`}
  aria-label="Sidebar"
>

        <div className="h-full px-3 pb-4 overflow-y-auto">
          <ul className="space-y-2 font-medium text-black">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center p-2 rounded-lg transition duration-300 transform ${
                      isActive
                        ? "bg-[#B1D4E0] text-gray-900"
                        : "hover:bg-[#3184A6] hover:scale-105"
                    }`
                  }
                >
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <img src={item.icon} alt={item.label} className="w-5 h-5" />
                  </div>
                  <span className="ml-3 text-white">{item.label}</span>
                </NavLink>
              </li>
            ))}
            <li>
              <button
                onClick={handleLogout}
                className="flex w-full items-center p-2 rounded-lg transition duration-300 transform hover:bg-[#3184A6] hover:scale-105 text-white"
              >
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <img src={logoutIcon} alt="Logout" className="w-5 h-5" />
                </div>
                <span className="ml-3 text-white">Log out</span>
              </button>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
};

export default CustomerSidebar;
