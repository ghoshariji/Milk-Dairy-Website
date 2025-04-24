import React, { useEffect, useState } from "react";
import API from "../api";
import SuperAdminSidebar from "../components/SuperSidebar/SuperAdminSidebar";
import Loader from "../components/Loader/Loader";
import { motion } from "framer-motion"; // Import Framer Motion

const SuperAdminHelpPage = () => {
  const [helpData, setHelpData] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [searchText, setSearchText] = useState("");

  const [loading, setLoading] = useState(false);
  
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await API.get("/api/help/all");
      setLoading(false);
      setHelpData(response.data);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching help data:", error);
    }
  };

  const handleSeen = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_SERVER}/api/help/seen/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ unread: false }),
        }
      );
      setLoading(false);

      if (response.ok) fetchData();
    } catch (error) {
      setLoading(false);
      console.error("Error updating seen status:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSeenCall = (id) => {
    handleSeen(id);
    setSelectedChat(null);
  };

  const filteredChats = helpData
    .filter((chat) =>
      chat.name.toLowerCase().includes(searchText.toLowerCase())
    )
    .sort((a, b) => {
      if (a.unread !== b.unread) {
        return b.unread - a.unread; // Unread messages first
      }
      return new Date(b.createdAt) - new Date(a.createdAt); // Most recent first
    });

  return (
    <div className="flex">
      <SuperAdminSidebar />
      {/* Sidebar */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center z-50  bg-opacity-50 backdrop-blur-md">
          <Loader />
        </div>
      )}
      {/* Main Content */}
      <div className="w-full lg:ml-64 mt-20">
        <div className="flex-1 p-6">
          {/* Search Input with fade-in animation */}
          <motion.input
            type="text"
            placeholder="Search complain..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full mb-4 p-2 border-2 border-gray-300 rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />

          <div className="space-y-4">
            {filteredChats.map((chat) => {
              const createdAt = new Date(chat.createdAt);
              const now = new Date();
              const diffInDays = Math.floor(
                (now - createdAt) / (1000 * 60 * 60 * 24)
              );

              let displayTime = `${diffInDays} days ago`;
              if (diffInDays === 0) {
                displayTime = createdAt.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });
              } else if (diffInDays === 1) {
                displayTime = "1 day ago";
              }

              return (
                <motion.div
                  key={chat._id}
                  onClick={() => setSelectedChat(chat)}
                  className="bg-white p-4 rounded shadow flex justify-between items-start cursor-pointer"
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-[#40A1CB] text-white rounded-full flex items-center justify-center font-bold text-lg">
                      {chat.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{chat.name}</p>
                      <p className="text-sm text-gray-600">{chat.feedback}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">{displayTime}</p>
                    {chat.unread && (
                      <motion.span
                        className="inline-block w-6 h-6 bg-red-500 text-white rounded-full text-center font-bold"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                      >
                        !
                      </motion.span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Modal for selected chat with smooth opening and closing */}
          {selectedChat && (
  <motion.div
    className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    <motion.div
      className="bg-white p-6 sm:p-8 rounded-2xl w-11/12 max-w-md shadow-2xl border border-gray-200"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-2xl font-bold text-center text-[#40A1CB] mb-6">
        💬 Chat Details
      </h2>

      <div className="space-y-4 text-sm sm:text-base text-gray-700">
        <div className="flex justify-between">
          <strong>Name:</strong>
          <span>{selectedChat.name}</span>
        </div>
        <div className="flex justify-between">
          <strong>Phone:</strong>
          <a
            href={`tel:${selectedChat.phone}`}
            className="text-[#40A1CB] hover:underline"
          >
            {selectedChat.phone}
          </a>
        </div>
        <div className="flex justify-between">
          <strong>User Type:</strong>
          <span className="capitalize">{selectedChat.type}</span>
        </div>
        <div>
          <strong>Feedback:</strong>
          <p className="mt-1 text-gray-600 border border-gray-200 rounded-lg p-2 bg-gray-50">
            {selectedChat.feedback}
          </p>
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <button
          className="bg-[#40A1CB] hover:bg-[#3692b7] text-white px-6 py-2 rounded-lg shadow-md transition"
          onClick={() => handleSeenCall(selectedChat._id)}
        >
          Close
        </button>
      </div>
    </motion.div>
  </motion.div>
)}

        </div>
      </div>
    </div>
  );
};

export default SuperAdminHelpPage;
