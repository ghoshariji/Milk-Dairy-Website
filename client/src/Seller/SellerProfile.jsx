import React, { useState } from 'react';
import { Pencil } from 'lucide-react';
import SellerSideBar from '../components/SellerSidebar/SellerSidebar';

const SellerProfile = () => {
  const [profile, setProfile] = useState({
    name: 'Narender',
    email: 'example@12gmail.com',
    mobile: '+91 95xxxxxx55',
    image: '/images/user1.jpg',
  });

  const [editField, setEditField] = useState(null); // 'name' | 'email' | 'mobile' | 'image'
  const [editValue, setEditValue] = useState('');

  const openEditModal = (field) => {
    setEditField(field);
    setEditValue(profile[field]);
  };

  const handleSave = () => {
    setProfile((prev) => ({ ...prev, [editField]: editValue }));
    setEditField(null);
  };

  return (
    <div className="flex">
      <SellerSideBar />

      <div className="lg:ml-64 w-full mt-16 p-4 flex justify-center items-start bg-gray-100 min-h-screen">
        <div className="bg-white rounded-lg shadow border p-4 w-full max-w-md">
          {/* Profile Card */}
          <div className="space-y-4">
            {/* Profile Image */}
            <div className="flex items-center justify-between border border-dotted border-blue-500 p-2 rounded">
              <div className="flex items-center gap-2">
                <img
                  src={profile.image}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-semibold">Profile Photo</p>
                </div>
              </div>
              <Pencil
                size={18}
                className="text-blue-500 cursor-pointer"
                onClick={() => openEditModal('image')}
              />
            </div>

            {/* Name */}
            <div className="flex items-center justify-between border border-dotted border-blue-500 p-2 rounded">
              <div className="flex items-center gap-2">
                <span className="text-blue-500">👤</span>
                <div>
                  <p className="text-sm font-semibold">Name</p>
                  <p className="text-xs text-gray-600">{profile.name}</p>
                </div>
              </div>
              <Pencil
                size={18}
                className="text-blue-500 cursor-pointer"
                onClick={() => openEditModal('name')}
              />
            </div>

            {/* Email */}
            <div className="flex items-center justify-between border border-dotted border-blue-500 p-2 rounded">
              <div className="flex items-center gap-2">
                <span className="text-blue-500">📧</span>
                <div>
                  <p className="text-sm font-semibold">Email</p>
                  <p className="text-xs text-gray-600">{profile.email}</p>
                </div>
              </div>
              <Pencil
                size={18}
                className="text-blue-500 cursor-pointer"
                onClick={() => openEditModal('email')}
              />
            </div>

            {/* Mobile */}
            <div className="flex items-center justify-between border border-dotted border-blue-500 p-2 rounded">
              <div className="flex items-center gap-2">
                <span className="text-blue-500">📞</span>
                <div>
                  <p className="text-sm font-semibold">Mobile No.</p>
                  <p className="text-xs text-gray-600">{profile.mobile}</p>
                </div>
              </div>
              <Pencil
                size={18}
                className="text-blue-500 cursor-pointer"
                onClick={() => openEditModal('mobile')}
              />
            </div>
          </div>
        </div>

        {/* Modal */}
        {editField && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow w-full max-w-md">
              <h2 className="text-lg font-semibold mb-4">Edit {editField.charAt(0).toUpperCase() + editField.slice(1)}</h2>
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="w-full border p-2 rounded"
              />
              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => setEditField(null)}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerProfile;
