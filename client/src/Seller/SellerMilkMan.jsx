import React, { useEffect, useState } from "react";
import { Mail, User, IndianRupee, MapPin, BadgeInfo } from "lucide-react";
import API from "../api";
import CustomerSidebar from "../components/CustomerSidebar/CustomerSidebar";
import { motion } from "framer-motion";
import SellerSideBar from "../components/SellerSidebar/SellerSidebar";
import Loader from "../components/Loader/Loader";

const infoItems = [
  {
    icon: <User className="text-[#40A1CB]" size={28} />,
    label: "Name",
    key: "name",
  },
  {
    icon: <Mail className="text-[#40A1CB]" size={28} />,
    label: "Email",
    key: "email",
  },
  {
    icon: <IndianRupee className="text-[#40A1CB]" size={28} />,
    label: "UPI ID",
    key: "upiId",
  },
  {
    icon: <BadgeInfo className="text-[#40A1CB]" size={28} />,
    label: "Code",
    key: "enterCode",
  },
  {
    icon: <MapPin className="text-[#40A1CB]" size={28} />,
    label: "Village",
    key: "village",
  },
];

const SellerMilkman = () => {
  const [item, setMilkMen] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMilkMen = async () => {
      try {
        const response = await API.get("/api/auth/user/get-milkman-data-user");
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
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center z-50  bg-opacity-50 backdrop-blur-md">
          <Loader />
        </div>
      )}
      <div className="w-full lg:w-64">
        <CustomerSidebar />
      </div>

      <div className="flex-1 flex items-center justify-center p-4 mt-6 lg:mt-20 overflow-auto">
      <motion.div
        className="w-full sm:max-w-4xl bg-white rounded-2xl shadow-lg p-6 sm:p-8 mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl sm:text-3xl font-semibold text-center text-[#40A1CB] mb-6 sm:mb-8">
          Your Milkman
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {infoItems.map((info, index) => (
            <motion.div
              key={info.key}
              className="flex items-start sm:items-center gap-3 sm:gap-4 border-b pb-3 sm:pb-4 p-2 sm:p-3 rounded-md shadow-sm bg-white hover:bg-gray-50 cursor-default"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 * index, duration: 0.5 }}
              whileHover={{
                scale: 1.03,
                boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
              }}
            >
              {info.icon}
              <div className="flex-grow">
                <p className="text-xs sm:text-sm text-gray-500">
                  {info.label}
                </p>
                <p className="text-sm sm:text-lg font-medium break-words">
                  {item[info.key] || "N/A"}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
    </div>
  );
};

export default SellerMilkman;
