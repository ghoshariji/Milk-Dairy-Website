import React, { useState, useEffect } from "react";
import API from "../api";
import CustomerSidebar from "../components/CustomerSidebar/CustomerSidebar";
import { toast, ToastContainer } from "react-toastify";
import { motion } from "framer-motion";
import Loader from "../components/Loader/Loader";

const CustomerProfile = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    profileImage: null, // blob URL for preview
  });
  const [file, setFile] = useState(null); // actual image file for upload
  const [editing, setEditing] = useState(false);

  const [loading, setLoading] = useState(false);
  // Convert binary image data to a browser blob URL
  const createImageUrl = (imageData, contentType) => {
    try {
      const typedArray = new Uint8Array(imageData);
      const blob = new Blob([typedArray], {
        type: contentType || "image/jpeg",
      });
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error("Error creating image URL:", error);
      return null;
    }
  };

  // Fetch profile on mount
  useEffect(() => {
    setLoading(true);
    const fetchProfile = async () => {
      try {
        const response = await API.get(`/api/auth/user/get-profile`);
        const user = response.data;

        let imageUrl = null;
        if (user.profileImage?.data?.data && user.profileImage?.contentType) {
          imageUrl = createImageUrl(
            user.profileImage.data.data,
            user.profileImage.contentType
          );
        }
        setLoading(false);
        setProfile({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          profileImage: imageUrl,
        });
      } catch (error) {
        setLoading(false);

        console.error("Error fetching profile:", error);
        alert("Failed to fetch profile.");
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setProfile({ ...profile, profileImage: URL.createObjectURL(selectedFile) });
  };

  const updateProfile = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("name", profile.name);
    formData.append("email", profile.email);
    formData.append("phone", profile.phone);

    if (file) {
      formData.append("updateProfile", file);
    }

    try {
      await API.put(`/api/auth/user/update-profile`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setLoading(false);
      toast.success("Profile updated successfully!");
      setEditing(false);
    } catch (error) {
      setLoading(false);

      console.error("Error updating profile:", error);
      toast.error("Failed to update profile.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <CustomerSidebar />
      <ToastContainer />

      {loading && (
        <div className="fixed inset-0 flex items-center justify-center z-50  bg-opacity-50 backdrop-blur-md">
          <Loader />
        </div>
      )}

      <div className="flex-1 flex justify-center items-start pt-15">
        <div className="w-full max-w-3xl   p-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            👤 User Profile
          </h2>

          {/* Profile Image Section */}
          <div className="flex justify-center mb-6">
            {profile.profileImage ? (
              <img
                src={profile.profileImage}
                alt="Profile"
                className="h-32 w-32 object-cover rounded-full shadow"
              />
            ) : (
              <div className="h-32 w-32 bg-gray-300 flex items-center justify-center rounded-full text-sm text-gray-600 shadow">
                No Image
              </div>
            )}
          </div>

          {/* Input Fields */}
          <div className="space-y-4">
            {["name", "email", "phone"].map((field) => (
              <motion.div
                key={field}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <label className="block text-sm font-medium capitalize mb-1">
                  {field}
                </label>
                <input
                  type={field === "email" ? "email" : "text"}
                  name={field}
                  value={profile[field]}
                  onChange={handleChange}
                  disabled={!editing}
                  className="w-full px-4 py-2 border rounded-lg transition duration-200 border-gray-300 focus:ring-2 focus:ring-[#40A1CB] focus:outline-none"
                />
              </motion.div>
            ))}

            {/* Profile Image Update */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <label className="block text-sm font-medium mb-1">
                Profile Image
              </label>
              {editing && (
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              )}
            </motion.div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-6">
            {!editing ? (
              <button
                className="px-5 py-2 bg-[#40A1CB] text-white rounded-lg shadow hover:bg-[#3692b7] transition"
                onClick={() => setEditing(true)}
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  className="px-5 py-2 bg-[#40A1CB] text-white rounded-lg shadow hover:bg-[#3692b7] transition"
                  onClick={updateProfile}
                >
                  Save
                </button>
                <button
                  className="px-5 py-2 bg-gray-400 text-white rounded-lg shadow hover:bg-gray-500 transition"
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;
