import React, { useState, useEffect } from "react";
import AdminNav from "../components/Sidebar/Sidebar";
import API from "../api";
import { toast, ToastContainer } from "react-toastify";
import SuperAdminSidebar from "../components/SuperSidebar/SuperAdminSidebar";
import Loader from "../components/Loader/Loader";
import { motion, AnimatePresence } from "framer-motion";

const SuperAdminProfile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);
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
  const fetchData = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/api/auth/user/get-milkman");
      console.log(data);
      setLoading(false);
      if (data && data.milkman) {
        setName(data.milkman.name);
        setEmail(data.milkman.email);
        setMobileNo(data.milkman.phone);
        setProfilePhoto(
          createImageUrl(
            data.milkman.profileImage.data.data,
            data.milkman.profileImage.contentType
          )
        );
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data", error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setProfilePhoto(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", mobileNo);
    if (imageFile) {
      formData.append("profileImage", imageFile);
    }

    try {
      await API.put("/api/auth/milkman/update", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Profile updated successfully");
      fetchData();
    } catch (error) {
      toast.error("Error updating profile");
      console.error("Error updating profile:", error);
    }
    setLoading(false);
    setModalVisible(false);
  };
  return (
    <>
      <SuperAdminSidebar />
      <ToastContainer />
      {/* Sidebar */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center z-50  bg-opacity-50 backdrop-blur-md">
          <Loader />
        </div>
      )}
      <div className="lg:ml-64 mt-20 p-6 bg-gray-100 min-h-screen">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
          <motion.h3
            className="text-2xl font-semibold text-[#40A1CB] mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Milkman Profile
          </motion.h3>

          <div className="flex items-center space-x-6">
            <motion.img
              src={profilePhoto ? profilePhoto : "Loading"}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-[#40A1CB] object-cover"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            />

            <motion.div
              className="ml-4 space-y-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <p className="text-xl text-gray-700">
                <strong>Name:</strong> {name}
              </p>
              <p className="text-xl text-gray-700">
                <strong>Email:</strong> {email}
              </p>
              <p className="text-xl text-gray-700">
                <strong>Phone:</strong> {mobileNo}
              </p>
              <motion.button
                className="mt-4 bg-[#40A1CB] text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-[#3185a7] transition duration-300"
                onClick={() => setModalVisible(true)}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                Edit Profile
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>

      {isModalVisible && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-opacity-50 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md"
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <motion.h3
              className="text-2xl font-semibold text-center mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              Edit Profile
            </motion.h3>

            <div className="space-y-4">
              <motion.input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#40A1CB]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              />

              <motion.input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#40A1CB]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              />

              <motion.input
                type="text"
                placeholder="Phone"
                value={mobileNo}
                onChange={(e) => setMobileNo(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#40A1CB]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.5 }}
              />

              {/* Image Upload */}
              <motion.label
                className="block"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.6 }}
              >
                <span className="block mb-1 text-sm font-medium text-gray-700">
                  Profile Picture
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-700 border border-gray-300 rounded-md cursor-pointer file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-[#40A1CB] file:text-white hover:file:bg-[#368bb0]"
                />
              </motion.label>
            </div>

            <div className="flex justify-end mt-6 space-x-3">
              <motion.button
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-md transition"
                onClick={() => setModalVisible(false)}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                Cancel
              </motion.button>
              <motion.button
                className="bg-[#40A1CB] hover:bg-[#368bb0] text-white px-4 py-2 rounded-md transition"
                onClick={handleSave}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                Save Changes
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default SuperAdminProfile;
