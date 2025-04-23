import React, { useEffect, useState } from "react";
import API from "../api";
import SuperAdminSidebar from "../components/SuperSidebar/SuperAdminSidebar";
import Loader from "../components/Loader/Loader";

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
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-500 bg-opacity-50 backdrop-blur-md">
          <Loader />
        </div>
      )}
      {/* Main Content */}
      <div className=" w-full lg:ml-64 mt-20">
        <div className="flex-1 p-6">
          <input
            type="text"
            placeholder="Search complain..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full mb-4 p-2 border border-gray-300 rounded-lg"
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
                <div
                  key={chat._id}
                  onClick={() => setSelectedChat(chat)}
                  className="bg-white p-4 rounded shadow flex justify-between items-start cursor-pointer"
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
                      <span className="inline-block w-6 h-6 bg-red-500 text-white rounded-full text-center font-bold">
                        !
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {selectedChat && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg w-96">
                <h2 className="text-xl font-bold mb-4">Chat Details</h2>
                <p>
                  <strong>Name:</strong> {selectedChat.name}
                </p>
                <p>
                  <strong>Feedback:</strong> {selectedChat.feedback}
                </p>
                <p>
                  <strong>Phone:</strong> {selectedChat.phone}
                </p>
                <p>
                  <strong>User Type:</strong> {selectedChat.type}
                </p>
                <button
                  className="mt-4 bg-[#40A1CB] text-white px-4 py-2 rounded hover:bg-[#40A1CB]"
                  onClick={() => handleSeenCall(selectedChat._id)}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuperAdminHelpPage;
