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

const SuperAdminSidebar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [currentLogo, setCurrentLogo] = useState(logo);

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
    setIsAdmin(adminStatus === "true");
    setLoading(false);
  }, []);

  const firstName = userName ? userName.split(" ")[0] : "User";

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
    return () => window.removeEventListener("resize", updateLogo);
  }, []);

  const handleNavClick = () => {
    if (window.innerWidth <= 768) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div>
      {/* Top Navbar */}
      <nav className="fixed top-0 z-50 w-full  border-gray-200 dark:bg-black dark:border-gray-900">
        <div className="px-3 py-3 lg:px-5 lg:pl-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={toggleSidebar}
                className="inline-flex items-center p-2 text-sm text-white rounded-lg sm:hidden md:block lg:hidden hover:bg-[#3184A6]"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                  />
                </svg>
              </button>
              <Link to="/milkman-dashboard" className="ml-2">
                <img
                  src={currentLogo}
                  onError={(e) => (e.target.src = smallLogo)}
                  alt="Logo"
                  className="w-[100%] h-14"
                />
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#40A1CB] font-bold text-lg">
                {firstName?.charAt(0).toUpperCase()}
              </div>
              <span className="text-white text-lg font-semibold">Welcome {firstName}</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside
        id="logo-sidebar"
        className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform duration-300 ease-in-out bg-[#40A1CB] border-r border-gray-200 dark:bg-[#40A1CB] ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`} // Always show sidebar on large screens
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-4 overflow-y-auto dark:bg-black dark:border-gray-900">
          <ul className="space-y-2 font-medium">
            {/* Sidebar Links */}
            <li>
              <NavLink
                to="/admin-dashboard"
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg transition duration-300 transform ${
                    isActive
                      ? "bg-[#B1D4E0] text-gray-900 dark:text-black"
                      : "text-gray-900 dark:text-white hover:bg-[#40A1CB] dark:hover:bg-[#005F7F] hover:scale-105"
                  }`
                }
              >
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <img src={dashboard} alt="Dashboard" className="w-6 h-6 rounded-full" />
                </div>
                <span className="ms-3">Dashboard</span>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/admin-help-support"
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg transition duration-300 transform ${
                    isActive
                      ? "bg-[#B1D4E0] text-gray-900 dark:text-black"
                      : "text-gray-900 dark:text-white hover:bg-[#40A1CB] dark:hover:bg-[#005F7F] hover:scale-105"
                  }`
                }
              >
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <img src={test} alt="Help & Support" className="w-6 h-6 rounded-full" />
                </div>
                <span className="ms-3">Help & Support</span>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/admin-profile"
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg transition duration-300 transform ${
                    isActive
                      ? "bg-[#B1D4E0] text-gray-900 dark:text-black"
                      : "text-gray-900 dark:text-white hover:bg-[#40A1CB] dark:hover:bg-[#005F7F] hover:scale-105"
                  }`
                }
              >
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <img src={user} alt="Profile" className="w-6 h-6 rounded-full" />
                </div>
                <span className="ms-3">Profile</span>
              </NavLink>
            </li>

            {/* Additional sidebar links */}
            <li>
              <NavLink
                to="/admin-subscription"
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg transition duration-300 transform ${
                    isActive
                      ? "bg-[#B1D4E0] text-gray-900 dark:text-black"
                      : "text-gray-900 dark:text-white hover:bg-[#40A1CB] dark:hover:bg-[#005F7F] hover:scale-105"
                  }`
                }
              >
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <img src={event} alt="Subscription" className="w-6 h-6 rounded-full" />
                </div>
                <span className="ms-3">Subscription</span>
              </NavLink>
            </li>
        
            <li>
              <NavLink
                to="/admin-user-list"
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg transition duration-300 transform ${
                    isActive
                      ? "bg-[#B1D4E0] text-gray-900 dark:text-black"
                      : "text-gray-900 dark:text-white hover:bg-[#40A1CB] dark:hover:bg-[#005F7F] hover:scale-105"
                  }`
                }
              >
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <img src={AddUser} alt="User List" className="w-6 h-6 rounded-full" />
                </div>
                <span className="ms-3">User List</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin-addvertisement"
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg transition duration-300 transform ${
                    isActive
                      ? "bg-[#B1D4E0] text-gray-900 dark:text-black"
                      : "text-gray-900 dark:text-white hover:bg-[#40A1CB] dark:hover:bg-[#005F7F] hover:scale-105"
                  }`
                }
              >
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <img src={contact} alt="User List" className="w-6 h-6 rounded-full" />
                </div>
                <span className="ms-3">Addvertisement</span>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/admin-get-in-touch"
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
                <span className="ms-3">Get In Touch</span>
              </NavLink>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="flex w-full items-center p-2 rounded-lg transition duration-300 transform text-gray-900 dark:text-white hover:bg-[#40A1CB] dark:hover:bg-[#005F7F] hover:scale-105"
              >
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <img src={logoout} alt="Logout" className="w-6 h-6 rounded-full" />
                </div>
                <span className="ms-3">Log out</span>
              </button>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default SuperAdminSidebar;
