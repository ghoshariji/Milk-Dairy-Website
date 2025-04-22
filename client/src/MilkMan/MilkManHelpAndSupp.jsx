import React, { useState, useRef } from "react";
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

  const nameRef = useRef(null);
  const phoneRef = useRef(null);
  const feedbackRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleKeyDown = (e, field) => {
    if (e.key === "ArrowDown") {
      if (field === "name") phoneRef.current.focus();
      else if (field === "phone") feedbackRef.current.focus();
    } else if (e.key === "ArrowUp") {
      if (field === "feedback") phoneRef.current.focus();
      else if (field === "phone") nameRef.current.focus();
    }
    // Optional: add ArrowLeft / ArrowRight logic if needed
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
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 px-5 mt-10 ml-50">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md transition-transform duration-300 hover:scale-[1.01] animate-fadeInUp">
          <h2 className="text-3xl font-bold text-center text-[#40A1CB] mb-6 tracking-wide">
            Submit Feedback
          </h2>

          {message && (
            <p className="text-green-600 mb-4 text-center animate-pulse">
              {message}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="group">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                ref={nameRef}
                value={formData.name}
                onChange={handleChange}
                onKeyDown={(e) => handleKeyDown(e, "name")}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40A1CB] transition-all duration-200"
              />
            </div>

            <div className="group">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Phone
              </label>
              <input
                type="text"
                name="phone"
                ref={phoneRef}
                value={formData.phone}
                onChange={handleChange}
                onKeyDown={(e) => handleKeyDown(e, "phone")}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40A1CB] transition-all duration-200"
              />
            </div>

            <div className="group">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Feedback
              </label>
              <textarea
                name="feedback"
                ref={feedbackRef}
                value={formData.feedback}
                onChange={handleChange}
                onKeyDown={(e) => handleKeyDown(e, "feedback")}
                required
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40A1CB] transition-all duration-200"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-[#40A1CB] text-white py-3 rounded-lg hover:bg-[#3495bc] font-semibold text-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-95"
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
