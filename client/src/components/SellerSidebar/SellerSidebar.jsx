import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import dashboard from "../../assetss/icons/Dashboard.png";
import contact from "../../assetss/icons/contact-list.png";
import AddUser from "../../assetss/icons/add-user.png";
import user from "../../assetss/icons/user.png";
import logo from "../../pages/images/login.png";
import smallLogo from "../../pages/images/login.png";
import logoout from "../../assetss/icons/logout.png";
import event from "../../assetss/icons/calendar.png";
import test from "../../assetss/icons/faqs.png";
import faq from "../../assetss/icons/review.png";

const SellerSideBar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [admin, isAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [userName, setUserName] = useState(false);
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
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
    setUserName(name);
    isAdmin(adminStatus === "true");
    setLoading(false);
  }, []);
  const firstName = userName ? userName.split(" ")[0] : "User";

  const [currentLogo, setCurrentLogo] = useState(logo);

  useEffect(() => {
    const updateLogo = () => {
      if (window.innerWidth <= 768) {
        setCurrentLogo(smallLogo);
      } else {
        setCurrentLogo(logo);
      }
    };

    updateLogo();
    window.addEventListener("resize", updateLogo);

    return () => {
      window.removeEventListener("resize", updateLogo);
    };
  }, []);

  return (
    <div>
      <nav className="fixed top-0 z-50 w-full bg-[#40A1CB] dark:bg-[#40A1CB] ">
        <div className="px-3 py-3 lg:px-5 lg:pl-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start">
              <button
                onClick={toggleSidebar}
                type="button"
                className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              >
                <span className="sr-only">Open sidebar</span>
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                  />
                </svg>
              </button>
              <Link to="/milkman-dashboard" className="flex items-center ms-2 md:me-24">
                <img
                  src={currentLogo}
                  alt="FoxTech Logo"
                  className="w-[80%] h-14 mr-2"
                />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <aside
        id="logo-sidebar"
        className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform bg-[#40A1CB] border-r border-gray-200 dark:bg-[#40A1CB] ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-4 overflow-y-auto bg-[#40A1CB] dark:bg-[#40A1CB]">
          <ul className="space-y-2 font-medium">
            <li>
              <NavLink
                to="/seller-dashboard"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg transition duration-300 transform ${
                    isActive
                      ? "bg-[#B1D4E0] text-gray-900 dark:text-black"
                      : "text-gray-900 dark:text-white hover:bg-[#40A1CB] dark:hover:bg-[#005F7F] hover:scale-105"
                  }`
                }
              >
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <img
                    src={dashboard}
                    alt="Profile"
                    className="w-6 h-6 rounded-full"
                  />
                </div>
                <span className="ms-3">Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/seller-milk-record"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg transition duration-300 transform ${
                    isActive
                      ? "bg-[#B1D4E0] text-gray-900 dark:text-black"
                      : "text-gray-900 dark:text-white hover:bg-[#40A1CB] dark:hover:bg-[#005F7F] hover:scale-105"
                  }`
                }
              >
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <img
                    src={dashboard}
                    alt="Profile"
                    className="w-6 h-6 rounded-full"
                  />
                </div>
                <span className="ms-3">Milk Record</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/seller-products"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg transition duration-300 transform ${
                    isActive
                      ? "bg-[#B1D4E0] text-gray-900 dark:text-black"
                      : "text-gray-900 dark:text-white hover:bg-[#40A1CB] dark:hover:bg-[#005F7F] hover:scale-105"
                  }`
                }
              >
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <img
                    src={dashboard}
                    alt="Profile"
                    className="w-6 h-6 rounded-full"
                  />
                </div>
                <span className="ms-3">Products</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/seller-wallet"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg transition duration-300 transform ${
                    isActive
                      ? "bg-[#B1D4E0] text-gray-900 dark:text-black"
                      : "text-gray-900 dark:text-white hover:bg-[#40A1CB] dark:hover:bg-[#005F7F] hover:scale-105"
                  }`
                }
              >
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <img
                    src={dashboard}
                    alt="Profile"
                    className="w-6 h-6 rounded-full"
                  />
                </div>
                <span className="ms-3">Wallet</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/seller-payment-history"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg transition duration-300 transform ${
                    isActive
                      ? "bg-[#B1D4E0] text-gray-900 dark:text-black"
                      : "text-gray-900 dark:text-white hover:bg-[#40A1CB] dark:hover:bg-[#005F7F] hover:scale-105"
                  }`
                }
              >
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <img
                    src={dashboard}
                    alt="Profile"
                    className="w-6 h-6 rounded-full"
                  />
                </div>
                <span className="ms-3">Payment History</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/seller-profile"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg transition duration-300 transform ${
                    isActive
                      ? "bg-[#B1D4E0] text-gray-900 dark:text-black"
                      : "text-gray-900 dark:text-white hover:bg-[#40A1CB] dark:hover:bg-[#005F7F] hover:scale-105"
                  }`
                }
              >
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <img
                    src={dashboard}
                    alt="Profile"
                    className="w-6 h-6 rounded-full"
                  />
                </div>
                <span className="ms-3">Profile</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/seller-payments"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg transition duration-300 transform ${
                    isActive
                      ? "bg-[#B1D4E0] text-gray-900 dark:text-black"
                      : "text-gray-900 dark:text-white hover:bg-[#40A1CB] dark:hover:bg-[#005F7F] hover:scale-105"
                  }`
                }
              >
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <img
                    src={dashboard}
                    alt="Profile"
                    className="w-6 h-6 rounded-full"
                  />
                </div>
                <span className="ms-3">Payment Options</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/seller-milkman"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg transition duration-300 transform ${
                    isActive
                      ? "bg-[#B1D4E0] text-gray-900 dark:text-black"
                      : "text-gray-900 dark:text-white hover:bg-[#40A1CB] dark:hover:bg-[#005F7F] hover:scale-105"
                  }`
                }
              >
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <img
                    src={dashboard}
                    alt="Profile"
                    className="w-6 h-6 rounded-full"
                  />
                </div>
                <span className="ms-3">Your Milkman</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/seller-change-milkman"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg transition duration-300 transform ${
                    isActive
                      ? "bg-[#B1D4E0] text-gray-900 dark:text-black"
                      : "text-gray-900 dark:text-white hover:bg-[#40A1CB] dark:hover:bg-[#005F7F] hover:scale-105"
                  }`
                }
              >
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <img
                    src={dashboard}
                    alt="Profile"
                    className="w-6 h-6 rounded-full"
                  />
                </div>
                <span className="ms-3">Change Milkman</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/seller-help"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg transition duration-300 transform ${
                    isActive
                      ? "bg-[#B1D4E0] text-gray-900 dark:text-black"
                      : "text-gray-900 dark:text-white hover:bg-[#40A1CB] dark:hover:bg-[#005F7F] hover:scale-105"
                  }`
                }
              >
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <img
                    src={dashboard}
                    alt="Profile"
                    className="w-6 h-6 rounded-full"
                  />
                </div>
                <span className="ms-3">Help & Support</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/milkman-set-rate"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg transition duration-300 transform ${
                    isActive
                      ? "bg-[#B1D4E0] text-gray-900 dark:text-black"
                      : "text-gray-900 dark:text-white hover:bg-[#40A1CB] dark:hover:bg-[#005F7F] hover:scale-105"
                  }`
                }
              >
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <img
                    src={dashboard}
                    alt="Profile"
                    className="w-6 h-6 rounded-full"
                  />
                </div>
                <span className="ms-3">Log out</span>
              </NavLink>
            </li>

          </ul>
        </div>
      </aside>
    </div>
  );
};

export default SellerSideBar;
