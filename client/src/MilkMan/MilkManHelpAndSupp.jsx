// src/components/MilkManHelpAndSupp.jsx
import React, { useState } from "react";
import AdminNav from "../components/Sidebar/Sidebar";
import API from "../api";
import { toast, ToastContainer } from "react-toastify";

const MilkManHelpAndSupp = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    feedback: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post("/api/help/milkman", {
        ...formData,
      });
      setMessage(response.data.message);
      toast.success("Feedback submitted successfully!");
      setFormData({ name: "", phone: "", feedback: "" });
    } catch (error) {
      setMessage("Error submitting feedback");
      toast.error("Error submitting feedback");
    }
  };

  return (
    <>
      <AdminNav />
      <ToastContainer />
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 px-4 ">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold text-center text-[#40A1CB] mb-6">
            Submit Feedback
          </h2>

          {message && (
            <p className="text-green-600 mb-4 text-center">{message}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#40A1CB]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#40A1CB]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Feedback</label>
              <textarea
                name="feedback"
                value={formData.feedback}
                onChange={handleChange}
                required
                rows={4}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#40A1CB]"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-[#40A1CB] text-white py-2 rounded-md hover:bg-[#3495bc] transition"
            >
              Submit Feedback
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default MilkManHelpAndSupp;
