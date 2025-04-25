import React, { useEffect, useState } from "react";
import AdminNav from "../components/Sidebar/Sidebar";
import API from "../api";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const MilkManCustomer = () => {
  const [isBuyer, setIsBuyer] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [buyers, setCustomers] = useState([]);
  const [sellers, setSellers] = useState([]);
  const navigate = useNavigate()
  const [customerTotal,setCustomerTotal] = useState(0)
  const [sellerTotal,setSellerTotal] = useState(0)
  useEffect(() => {
    const validateToken = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await API.post("/api/auth/user/validate-token", {
          token,
        });

        if (response.data.success) {
          const user = response.data.user;
          console.log(response.data.user)
          setCustomerTotal(user.customer.length)
          setSellerTotal(user.seller.length)
          setCustomers(user.customer || []);
          setSellers(user.seller || []);
        } else {
          localStorage.removeItem("token");
        }
      } catch (error) {
        console.error("Token validation error:", error);
        localStorage.removeItem("token");
      }
    };
    validateToken();
  }, []);

  const data = isBuyer ? buyers : sellers;
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminNav />
      <main className="w-full p-6 lg:ml-64 mt-20">
        <div className="max-w-4xl mx-auto">
          {/* Toggle Switch */}
          <div className="flex justify-center items-center gap-4 mb-8">
            <span className="text-2xl font-bold text-gray-700">
              {isBuyer && `Buyer (${customerTotal})`}
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={isBuyer}
                onChange={() => setIsBuyer(!isBuyer)}
              />
              <div className="w-14 h-7 bg-gray-300 rounded-full peer peer-checked:bg-[#40A1CB] transition-all duration-300">
                <div className="absolute w-6 h-6 bg-white rounded-full top-0.5 left-0.5 peer-checked:translate-x-7 transform transition-all duration-300 shadow"></div>
              </div>
            </label>
            <span className="text-2xl font-bold text-gray-700">
              {!isBuyer && `Seller (${sellerTotal})`}
            </span>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow overflow-x-auto">
            <table className="w-full text-sm text-center text-gray-700">
              <thead className="bg-[#40A1CB] text-white text-md">
                <tr>
                  <th className="py-3 px-4">Profile</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Enter Code</th>
                  <th className="py-3 px-4">Phone</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {paginatedData.map((person, index) => (
                    <motion.tr
                      key={person.id || index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="border-b hover:bg-gray-100 hover:cursor-pointer "
                      onClick={() => navigate(`/milkman-customer-details/${person._id}`)}
                    >
                      <td className="py-3 px-4">
                        <div className="w-10 h-10 bg-[#40A1CB] text-white flex items-center justify-center rounded-full font-bold">
                          {person.name?.[0] || "?"}
                        </div>
                      </td>
                      <td className="py-3 px-4">{person.name}</td>
                      <td className="py-3 px-4">{person.enterCode}</td>
                      <td className="py-3 px-4">{person.phone}</td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-full transition hover:cursor-pointer  ${
                currentPage === 1
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-[#40A1CB] text-white hover:bg-[#40A1CB]"
              }`}
            >
              Prev
            </button>
            <span className="text-sm text-gray-600">
              Page <strong>{currentPage}</strong> of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-full transition hover:cursor-pointer   ${
                currentPage === totalPages
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-[#40A1CB] text-white hover:bg-[#40A1CB]"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MilkManCustomer;
