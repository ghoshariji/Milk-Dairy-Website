import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import dashboard from "../../assetss/icons/Dashboard.png";
import logo from "../../pages/images/login.png";
import smallLogo from "../../pages/images/login.png";
import API from "../../api";

const AdminNav = () => {
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

  const [seenCOunt, setSeenCount] = useState('');
  const fetchData = async () => {
    try {
      const data = await API.get(
        '/api/auth/user/getNotificationCount',
      );
      setSeenCount(data.data);
    } catch (error) {}
  };

  const [countOrder, setCountOrder] = useState(0);
  const fetchAdvanceBook = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }
      setLoading(true);

      let orderData = [];
      try {
        const data = await API.get("/api/order/get-milkman-notification");
        orderData = data.data.data;
        setCountOrder(orderData.length);
        console.log(orderData);
      } catch (error) {
        console.log("Error fetching milkman notifications:", error);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchAdvanceBook();
    fetchData()
  }, []);
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
      <nav className="fixed top-0 z-50 w-full dark:bg-black dark:border-gray-900 ">
        <div className="px-3 py-3 lg:px-5 lg:pl-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={toggleSidebar}
                className="inline-flex items-center p-2 text-sm text-white rounded-lg sm:hidden md:block lg:hidden hover:bg-[#3184A6]"
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
              <Link to="/milkman-dashboard" className="ml-2">
                <img src={currentLogo} alt="Logo" className="w-[100%] h-14" />
              </Link>
            </div>
            <div className="hidden lg:block">
              <div className="flex items-center space-x-4">
                {/* Profile Icon Circle */}
                <div className="w-10 h-10 rounded-full bg-[#40A1CB] flex items-center justify-center text-white font-bold text-lg">
                  {firstName?.charAt(0).toUpperCase()}
                </div>

                {/* Welcome Message */}
                <span className="text-white text-lg font-semibold">
                  Welcome {firstName}
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <aside
        id="logo-sidebar"
        className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform dark:bg-black dark:border-gray-900 border-r border-gray-200  ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-4 overflow-y-auto dark:bg-black dark:border-gray-900">
          <ul className="space-y-2 font-medium">
            <li>
              <NavLink
                to="/milkman-dashboard"
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
                to="/milkman-add-category"
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
                <span className="ms-3">Add Category</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/milkman-add-customer"
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
                <span className="ms-3">Add Customer/Seller</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/milkman-buy-milk"
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
                <span className="ms-3">Buy Milk</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/milkman-customer"
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
                <span className="ms-3">Customer</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/milkman-help"
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
                to="/milkman-notification"
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
                <span className="ms-3">Products Order's ({countOrder})</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/milkman-advance-book"
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
                <span className="ms-3">Advance Booking ({seenCOunt})</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/milkman-products"
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
                to="/milkman-profile"
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
                to="/milkman-sell-milk"
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
                <span className="ms-3">Sell Milk</span>
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
                <span className="ms-3">Set Rate</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/milkman-subscription"
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
                <span className="ms-3">Subscription</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/milkman-update-milk"
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
                <span className="ms-3">Update Milk</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/milkman-walltet"
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
              <button
                onClick={handleLogout}
                className="w-full text-left flex items-center p-2 rounded-lg transition duration-300 transform text-gray-900 dark:text-white hover:bg-[#40A1CB] dark:hover:bg-[#005F7F] hover:scale-105"
              >
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <img
                    src={dashboard}
                    alt="Profile"
                    className="w-6 h-6 rounded-full"
                  />
                </div>
                <span className="ms-3">Logout</span>
              </button>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default AdminNav;
