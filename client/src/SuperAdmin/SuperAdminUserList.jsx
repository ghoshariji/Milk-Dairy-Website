import React, { useState, useEffect } from "react";
import SuperAdminSidebar from "../components/SuperSidebar/SuperAdminSidebar";
import Loader from "../components/Loader/Loader";
import { useNavigate } from "react-router-dom";

const SuperAdminUserList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_SERVER}/api/auth/user/get-all-user`
      );
      const data = await response.json();
      setUsers(data);
      setFilteredUsers(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const navigate = useNavigate();

  const handleUserClick = (id) => {
    navigate(`/admin-user-details/${id}`);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);

    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  return (
    <div className="flex">
      <SuperAdminSidebar />
      {/* Sidebar */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50 backdrop-blur-md">
          <Loader />
        </div>
      )}
      {/* Main Content */}
      <div className="w-full lg:ml-64 mt-20">
        <div className="flex-1 p-6 bg-white">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full max-w-full px-4 py-2 border border-[#40A1CB] rounded-lg mb-4 text-gray-900 placeholder-[#40A1CB]"
          />

          <p className="text-sm text-gray-600 mb-2">
            Showing {filteredUsers.length} of {users.length} users
          </p>

          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-[#40A1CB]"></div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <p className="text-center text-gray-500">No results found</p>
          ) : (
            <div className="grid gap-4">
              {filteredUsers.map((user) => (
                <div
                  key={user._id}
                  onClick={() => handleUserClick(user._id)}
                  className="flex items-center border border-gray-200 p-4 rounded-lg shadow-sm hover:cursor-pointer hover:bg-gray-200 hover:text-white transition-colors duration-300"
                >
                  <div className="w-10 h-10 rounded-full bg-[#40A1CB] flex items-center justify-center text-white font-bold mr-4">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-base font-semibold text-gray-900">
                      {user.name}
                    </p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuperAdminUserList;
