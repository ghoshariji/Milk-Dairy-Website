import React, { useState, useEffect } from "react";
import AdminNav from "../components/Sidebar/Sidebar";
import API from "../api";
import { toast, ToastContainer } from "react-toastify";

const MilkManProfile = () => {
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
      const blob = new Blob([typedArray], { type: contentType || 'image/jpeg' });
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('Error creating image URL:', error);
      return null;
    }
  };
  const fetchData = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/api/auth/user/get-milkman");
      console.log(data)
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
  if (loading) {
    return (
      <div className="lg:ml-64 mt-20 p-6 min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg text-gray-600">Loading profile...</p>
      </div>
    );
  }
  return (
    <>
      <AdminNav />
      <ToastContainer />
      <div className="lg:ml-64 mt-30 p-6 bg-gray-50 min-h-screen ">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-3xl mx-auto">
        <h3 className="text-2xl font-semibold text-[#40A1CB] text-center mb-6">
          Milkman Profile
        </h3>
        
        <div className="flex items-center justify-center gap-8">
          <div className="relative">
            <img
              src={profilePhoto ? profilePhoto : "Loading"}
              alt="Profile"
              className="w-40 h-40 rounded-full border-4 border-[#40A1CB] object-cover shadow-lg"
            />
          </div>
    
          <div className="space-y-6">
            <p className="text-xl text-gray-800">
              <strong>Name:</strong> {name}
            </p>
            <p className="text-xl text-gray-800">
              <strong>Email:</strong> {email}
            </p>
            <p className="text-xl text-gray-800">
              <strong>Phone:</strong> {mobileNo}
            </p>
            <button
              className="mt-6 w-full bg-[#40A1CB] text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-[#3185a7] transition duration-300"
              onClick={() => setModalVisible(true)}
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
    

      {isModalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-300 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">
            <h3 className="text-2xl font-semibold text-center mb-6">
              Edit Profile
            </h3>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#40A1CB]"
              />

              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#40A1CB]"
              />

              <input
                type="text"
                placeholder="Phone"
                value={mobileNo}
                onChange={(e) => setMobileNo(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#40A1CB]"
              />

              {/* Image Upload */}
              <label className="block">
                <span className="block mb-1 text-sm font-medium text-gray-700">
                  Profile Picture
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-700 border border-gray-300 rounded-md cursor-pointer file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-[#40A1CB] file:text-white hover:file:bg-[#368bb0]"
                />
              </label>
            </div>

            <div className="flex justify-end mt-6 space-x-3">
              <button
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-md transition"
                onClick={() => setModalVisible(false)}
              >
                Cancel
              </button>
              <button
                className="bg-[#40A1CB] hover:bg-[#368bb0] text-white px-4 py-2 rounded-md transition"
                onClick={handleSave}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MilkManProfile;
