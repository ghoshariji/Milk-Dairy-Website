import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import SuperAdminSidebar from "../components/SuperSidebar/SuperAdminSidebar";
import API from "../api";
import { toast, ToastContainer } from "react-toastify";
import Loader from "../components/Loader/Loader";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Authentication from "../utils/Authentication";
const GetInTouch = () => {
  const [messages, setMessages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 10;
  const [loading, setLoading] = useState(false);
  const handleExport = () => {
    const exportData = messages.map((msg) => ({
      Name: msg.name,
      Email: msg.email,
      Message: msg.message,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Messages");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, `get_in_touch_messages_${new Date().toISOString()}.xlsx`);
  };
  useEffect(() => {
    API.get("/api/get-in/all").then((res) => {
      setMessages(res.data);
    });
  }, []);
  const [showModal, setShowModal] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [replyText, setReplyText] = useState("");

  const handleReply = (email) => {
    setSelectedEmail(email);
    setReplyText("");
    setShowModal(true);
  };

  const sendReply = async () => {
    if (!replyText.trim()) {
      toast.error("Please write a message.");
      return;
    }

    setLoading(true);
    try {
      setShowModal(false);

      await API.post("/api/get-in/reply", {
        email: selectedEmail,
        replyText,
      });
      toast.success("Reply sent!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to send reply.");
    }
    setLoading(false);
  };

  // Filtered and reversed messages
  const filteredMessages = messages
    .filter(
      (msg) =>
        msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice()
    .reverse();

  const totalPages = Math.ceil(filteredMessages.length / itemsPerPage);
  const paginatedMessages = filteredMessages.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <div>
      <SuperAdminSidebar />
      <Authentication />

      {loading && (
        <div className="fixed inset-0 flex items-center justify-center z-50  bg-opacity-50 backdrop-blur-md">
          <Loader />
        </div>
      )}
      <div className="lg:ml-64 mt-20 bg-gray-100 min-h-screen p-6">
        <ToastContainer />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Search Bar */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search by name or email"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // reset to first page
              }}
              className="px-4 py-2 border border-gray-800 rounded w-full"
            />
          </div>
          <div className="flex justify-end mb-4">
            <button
              onClick={handleExport}
              className="bg-[#40A1CB] text-white px-4 py-2 rounded hover:cursor-pointer"
            >
              Export as XLSX
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-gray-200 text-gray-600 uppercase text-sm">
                  <th className="py-3 px-6 text-left">Name</th>
                  <th className="py-3 px-6 text-left">Email</th>
                  <th className="py-3 px-6 text-left">Message</th>
                  <th className="py-3 px-6 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedMessages.map((msg, i) => (
                  <tr key={i} className="border-b hover:bg-gray-100">
                    <td className="py-3 px-6">{msg.name}</td>
                    <td className="py-3 px-6">{msg.email}</td>
                    <td className="py-3 px-6">{msg.message}</td>
                    <td className="py-3 px-6">
                      <button
                        onClick={() => handleReply(msg.email)}
                        className="bg-[#40A1CB] text-white px-3 py-1 rounded hover:cursor-pointer"
                      >
                        Reply
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="flex justify-center mt-6 space-x-2">
              <button
                onClick={handlePrev}
                className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50 hover:cursor-pointer"
                disabled={currentPage === 1}
              >
                Prev
              </button>
              <span className="px-4 py-1">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={handleNext}
                className="bg-[#40A1CB] text-white px-3 py-1 rounded disabled:opacity-50 hover:cursor-pointer"
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </motion.div>

        {showModal && (
          <div className="fixed inset-0 bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50">
            <motion.div
              className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg relative"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-semibold mb-4">Reply to User</h2>
              <textarea
                autoFocus
                className="w-full border border-gray-300 rounded p-3 mb-4 resize-none"
                rows={5}
                placeholder="Write your message here..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 hover:cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={sendReply}
                  className="bg-[#40A1CB] text-white px-4 py-2 rounded hover:bg-[#368fb4] hover:cursor-pointer"
                >
                  Send
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GetInTouch;
