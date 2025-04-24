import React, { useState, useEffect } from "react";
import SuperAdminSidebar from "../components/SuperSidebar/SuperAdminSidebar";
import Loader from "../components/Loader/Loader";
import { Dialog } from "@headlessui/react";
import { toast, ToastContainer } from "react-toastify";

const SuperAdminAddvertise = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    description: "",
    expiryDate: "",
    media: null,
  });

  const fetchAds = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER}/api/add/media`);
      const data = await res.json();

      const adsWithUrls = data.map((ad) => {
        if (ad.media && ad.media.data && ad.media.contentType) {
          const uint8Array = new Uint8Array(ad.media.data.data);
          const blob = new Blob([uint8Array], { type: ad.media.contentType });
          const mediaUrl = URL.createObjectURL(blob);
          return { ...ad, mediaUrl };
        } else {
          return { ...ad, mediaUrl: null }; // fallback if no media
        }
      });

      setAds(adsWithUrls);
    } catch (error) {
      console.error("Failed to fetch ads:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const handleAddAd = async () => {
    const form = new FormData();
    setLoading(true);
    form.append("description", formData.description);
    form.append("expiryDate", formData.expiryDate);
    form.append("media", formData.media);

    const file = formData.media;
    if (file && file.type.startsWith("video") && file.duration > 20) {
      alert("Video must be 20 seconds or less.");
      return;
    }
    setLoading(true);

    const res = await fetch(`${import.meta.env.VITE_SERVER}/api/add`, {
      method: "POST",
      body: form,
    });
    setLoading(false);
    if (res.ok) {
      fetchAds();
      toast.success("Uploaded Successfully");
      setIsModalOpen(false);
    }
  };

  const handleDelete = async (id) => {
    await fetch(`${import.meta.env.VITE_SERVER}/api/ads/${id}`, {
      method: "DELETE",
    });
    fetchAds();
  };

  return (
    <div>
      <SuperAdminSidebar />
      <ToastContainer />
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-500 bg-opacity-50 backdrop-blur-md">
          <Loader />
        </div>
      )}
      <div className="lg:ml-64 mt-20 bg-gray-100 min-h-screen p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">All Advertisements</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#40A1CB] text-white px-4 py-2 rounded-lg shadow"
          >
            + Add Advertisement
          </button>
        </div>

        <table className="w-full bg-white rounded-xl shadow overflow-hidden">
          <thead className="bg-[#40A1CB] text-white">
            <tr>
              <th className="p-4">Media</th>
              <th className="p-4">Description</th>
              <th className="p-4">Expiry Date</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {ads.map((ad) => (
              <tr key={ad._id} className="border-t">
                <td className="p-4">
                  {ad.mediaType === "video" ? (
                    <video src={ad.mediaUrl} className="w-32 h-20" controls />
                  ) : (
                    <img
                      src={ad.mediaUrl}
                      className="w-32 h-20 object-cover"
                      alt="Ad"
                    />
                  )}
                </td>
                <td className="p-4">{ad.description}</td>
                <td className="p-4">
                  {new Date(ad.expiryDate).toLocaleDateString()}
                </td>
                <td className="p-4 space-x-2">
                  <button className="text-blue-600">Edit</button>
                  <button
                    onClick={() => handleDelete(ad._id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="fixed inset-0 z-50 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen px-4">
          <Dialog.Panel className="relative bg-white rounded-xl p-6 shadow-lg w-full max-w-lg">
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
              aria-label="Close"
            >
              &times;
            </button>

            <Dialog.Title className="text-xl font-bold mb-4">
              Add Advertisement
            </Dialog.Title>

            <input
              type="file"
              accept="image/*,video/*"
              onChange={(e) =>
                setFormData({ ...formData, media: e.target.files[0] })
              }
              className="mb-4 w-full"
            />

            <input
              type="text"
              placeholder="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full mb-4 px-4 py-2 border rounded"
            />

            <input
              type="date"
              value={formData.expiryDate}
              placeholder="Enter Expiry Date"
              onChange={(e) =>
                setFormData({ ...formData, expiryDate: e.target.value })
              }
              className="w-full mb-4 px-4 py-2 border rounded"
            />

            <button
              onClick={handleAddAd}
              className="bg-[#40A1CB] text-white px-4 py-2 rounded"
            >
              Submit
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default SuperAdminAddvertise;
