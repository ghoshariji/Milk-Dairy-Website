import React, { useState, useEffect } from "react";
import CustomerSidebar from "../components/CustomerSidebar/CustomerSidebar";
import Authentication from "../utils/Authentication";
import Loader from "../components/Loader/Loader";
import axios from "axios";
import API from "../api";
import { toast, ToastContainer } from "react-toastify";

const UserMilkManSupport = () => {
  const [loading, setLoading] = useState(false);
  const [complainDetails, setComplainDetails] = useState("");
  const [complaints, setComplaints] = useState([]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const res = await API.get("/api/auth/user/get-all-complain");
      console.log(res.data)
      setComplaints(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(()=>{
    fetchComplaints()
  },[])

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!complainDetails.trim()) return;
    try {
      setLoading(true);
      await API.post("/api/usermilkman-support", {
        complainDetails,
        seen: false,
        time: new Date(),
      });
      toast.success("Submitted Successfully")
      setComplainDetails("");
      fetchComplaints()
    } catch (err) {
        toast.error("Internal Server Error..")
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50 backdrop-blur-md">
          <Loader />
        </div>
      )}
      <ToastContainer />

      <CustomerSidebar />
      <Authentication />

      <div className="p-4 w-full lg:ml-64 mt-20 bg-white min-h-screen">
        <h2 className="text-2xl font-bold mb-4">Send Complain to MilkMan</h2>

        {/* Complaint Form */}
        <form onSubmit={handleSubmit} className="mb-8 space-y-4">
          <textarea
            value={complainDetails}
            onChange={(e) => setComplainDetails(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            rows={4}
            placeholder="Write your complaint here..."
            required
          />
          <button
            type="submit"
            className="bg-black text-white px-4 py-2 rounded cursor-pointer"
          >
            Submit Complaint
          </button>
        </form>

        {/* Complaints Table */}
        <h3 className="text-xl font-medium mb-2">Your Complaints</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border">#</th>
                <th className="py-2 px-4 border">Complaint</th>
                <th className="py-2 px-4 border">Status</th>
                <th className="py-2 px-4 border">Time</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((item, idx) => (
                <tr key={item._id} className="text-sm">
                  <td className="py-2 px-4 border">{idx + 1}</td>
                  <td className="py-2 px-4 border">{item.complainDetails}</td>
                  <td className="py-2 px-4 border">
                    {item.seen ? "Seen" : "Pending"}
                  </td>
                  <td className="py-2 px-4 border">
                    {new Date(item.time).toLocaleString()}
                  </td>
                </tr>
              ))}
              {complaints.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-4">
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

export default UserMilkManSupport;
