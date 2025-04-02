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
      const blob = new Blob([imageData], { type: contentType || "image/jpeg" });
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
      setLoading(false);
      if (data && data.milkman) {
        setName(data.milkman.name);
        setEmail(data.milkman.email);
        setMobileNo(data.milkman.phone);
        setProfilePhoto(createImageUrl(data.milkman.profileImage.data.data,data.milkman.profileImage.contentType));
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
      <AdminNav />
      <ToastContainer />
      <div className="lg:ml-64 mt-20 p-6 bg-gray-100 min-h-screen">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-[#40A1CB]">Milkman Profile</h3>
          <div className="flex items-center mt-4">
            <img
              src={profilePhoto}
              alt="Profile"
              className="w-24 h-24 rounded-full border"
            />
            <div className="ml-4">
              <p className="text-gray-700"><strong>Name:</strong> {name}</p>
              <p className="text-gray-700"><strong>Email:</strong> {email}</p>
              <p className="text-gray-700"><strong>Phone:</strong> {mobileNo}</p>
              <button
                className="mt-2 bg-[#40A1CB] text-white px-4 py-2 rounded"
                onClick={() => setModalVisible(true)}
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {isModalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Edit Profile</h3>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Phone"
              value={mobileNo}
              onChange={(e) => setMobileNo(e.target.value)}
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full mb-2 p-2 border rounded"
            />
            <div className="flex justify-end">
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded mr-2"
                onClick={() => setModalVisible(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
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
