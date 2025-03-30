import React, { useEffect, useState } from "react";
import AdminNav from "../components/Sidebar/Sidebar";
import API from "../api";

const MilkManCustomer = () => {
  const [isBuyer, setIsBuyer] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;
  const [buyers, setCustomers] = useState([]);
  const [sellers, setSellers] = useState([]);

  useEffect(() => {
    const validateToken = async () => {
      try {
        const token = await localStorage.getItem("token");

        if (!token) {
          return;
        }

        const response = await API.post("/api/auth/user/validate-token", {
          token,
        });

        if (response.data.success) {
          const user = response.data.user;
          setCustomers(user.customer || []); // Ensure it's an array
          setSellers(user.seller || []); // Ensure it's an array
        } else {
          await localStorage.removeItem("token");
        }
      } catch (error) {
        console.error("Token validation error:", error);
        await localStorage.removeItem("token");
      } finally {
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
    <>
      <div className="min-h-screen flex flex-col mt-10">
        <AdminNav />
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
          {/* Toggle Switch */}
          <div className="flex items-center my-6">
            <span className="text-lg font-semibold mr-2">Buyer</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={!isBuyer}
                onChange={() => setIsBuyer(!isBuyer)}
              />
              <div className="w-12 h-6 bg-gray-300 rounded-full peer peer-checked:bg-[#40A1CB] relative transition-all">
                <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-1 transition-all peer-checked:left-6 peer-checked:translate-x-full"></div>
              </div>
            </label>
            <span className="text-lg font-semibold ml-2">Seller</span>
          </div>

          {/* Table */}
          <div className="w-full max-w-3xl bg-white shadow-md rounded-lg overflow-hidden">
            <table className="w-full border-collapse">
              <thead className="bg-[#40A1CB] text-white">
                <tr>
                  <th className="p-3">
                    Profile ({isBuyer ? "Buyers" : "Sellers"})
                  </th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Enter Code</th>
                  <th className="p-3">Phone</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((person, index) => (
                  <tr key={index} className="border-b text-center">
                    <td className="p-3">
                      <div className="w-10 h-10 bg-[#40A1CB] text-white flex items-center justify-center rounded-full font-bold">
                        {person.name[0]}
                      </div>
                    </td>
                    <td className="p-3">{person.name}</td>
                    <td className="p-3">{person.enterCode}</td>
                    <td className="p-3">{person.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center space-x-2 mt-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className={`px-4 py-2 rounded-lg ${
                currentPage === 1 ? "bg-gray-300" : "bg-blue-600 text-white"
              }`}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            <span className="px-4 py-2 bg-gray-200 rounded-lg">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              className={`px-4 py-2 rounded-lg ${
                currentPage === totalPages
                  ? "bg-gray-300"
                  : "bg-[#40A1CB] text-white"
              }`}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MilkManCustomer;
