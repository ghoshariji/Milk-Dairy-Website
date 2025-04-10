import React, { useState, useEffect } from "react";
import API from "../api";
import { toast, ToastContainer } from "react-toastify";
import SellerSideBar from "../components/SellerSidebar/SellerSidebar";

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    profileImage: null, // blob URL for preview
  });
  const [file, setFile] = useState(null); // actual image file for upload
  const [editing, setEditing] = useState(false);

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

        setProfile({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          profileImage: imageUrl,
        });
      } catch (error) {
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
  
      toast.success("Profile updated successfully!");
      setEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile.");
    }
  };
  
  return (
    <>
      <SellerSideBar />
      <ToastContainer />
      <div className="max-w-xl mx-auto mt-10 p-4 bg-white shadow-md rounded-lg lg:mt-24 mt-20">
        <h2 className="text-2xl font-semibold mb-4">User Profile</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
            disabled={!editing}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            disabled={!editing}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Phone</label>
          <input
            type="text"
            name="phone"
            value={profile.phone}
            onChange={handleChange}
            disabled={!editing}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Profile Image
          </label>
          {profile.profileImage ? (
            <img
              src={profile.profileImage}
              alt="Profile"
              className="h-32 w-32 object-cover rounded-full mb-2"
            />
          ) : (
            <div className="h-32 w-32 bg-gray-300 flex items-center justify-center rounded-full mb-2">
              No Image Found
            </div>
          )}

          {editing && (
            <input type="file" accept="image/*" onChange={handleImageChange} />
          )}
        </div>

        <div className="flex justify-between mt-4">
          {!editing ? (
            <button
              className="px-4 py-2 bg-[#40A1CB] text-white rounded "
              onClick={() => setEditing(true)}
            >
              Edit Profile
            </button>
          ) : (
            <>
              <button
                className="px-4 py-2 bg-[#40A1CB] text-white rounded "
                onClick={updateProfile}
              >
                Save
              </button>
              <button
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                onClick={() => setEditing(false)}
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
