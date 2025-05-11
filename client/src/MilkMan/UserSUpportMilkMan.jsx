import React, { useEffect, useState } from "react";
import Loader from "../components/Loader/Loader";
import { ToastContainer } from "react-toastify";
import AdminNav from "../components/Sidebar/Sidebar";
import Authentication from "../utils/Authentication";
import API from "../api";

const UserSupportMilkMan = () => {
  const [loading, setLoading] = useState(true);
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await API.get("/api/auth/user/milkman");
        console.log(response.data);
        setComplaints(response.data);
      } catch (error) {
        console.error("Error fetching complaints:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  return (
    <div className="flex">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50 backdrop-blur-md">
          <Loader />
        </div>
      )}
      <ToastContainer />
      <AdminNav />
      <Authentication />

      <div className="p-4 w-full lg:ml-64 mt-20 bg-white min-h-screen">
        <h2 className="text-2xl font-semibold mb-4">User Complaints</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead className="bg-[#40A1CB]">
              <tr>
                <th className="text-left p-3 border text-white">#</th>
                <th className="text-left p-3 border text-white">Complain Details</th>
                <th className="text-left p-3 border text-white">User Name - Code</th>
                <th className="text-left p-3 border text-white">Seen</th>
                <th className="text-left p-3 border text-white">Time</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((item, index) => (
                <tr key={item._id} className="border-t">
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">{item.complainDetails}</td>
                  <td className="p-3">
                    {item.userId?.name && item.userId?.enterCode
                      ? `${item.userId.name} - ${item.userId.enterCode}`
                      : "N/A"}{" "}
                  </td>
                  <td className="p-3">{item.seen ? "Yes" : "No"}</td>
                  <td className="p-3">
                    {new Date(item.time).toLocaleString()}
                  </td>
                </tr>
              ))}
              {complaints.length === 0 && !loading && (
                <tr>
                  <td colSpan="5" className="text-center p-4">
                    No complaints found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserSupportMilkMan;
