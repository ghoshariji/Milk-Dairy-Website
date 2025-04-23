import React, { useState } from 'react';
import SellerSideBar from '../components/SellerSidebar/SellerSidebar';
import axios from 'axios';
import API from '../api';
import Loader from '../components/Loader/Loader';
import { toast, ToastContainer } from 'react-toastify';

const SellerHelp = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    feedback: '',
  });

  const [loading,setLoading] = useState(false)
  const [errors, setErrors] = useState({ phone: '' });
  const [successMsg, setSuccessMsg] = useState('');

  const handleInputChange = (field, value) => {
    if (field === 'feedback') {
      const words = value.trim().split(/\s+/);
      if (words.length > 20) return;
    }

    if (field === 'phone') {
      if (!/^\d{0,10}$/.test(value)) {
        return; // Prevent entering more than 10 digits
      }
      if (value.length === 10) {
        setErrors((prev) => ({ ...prev, phone: '' }));
      } else {
        setErrors((prev) => ({ ...prev, phone: 'Phone number must be 10 digits' }));
      }
    }

    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.feedback) {
      alert('All fields are required!');
      return;
    }
    if (formData.phone.length !== 10) {
      setErrors((prev) => ({
        ...prev,
        phone: 'Phone number must be exactly 10 digits',
      }));
      return;
    }
    setLoading(true)

    try {
      const response = await API.post(
        `/api/help/seller`,
        formData
      );
      setLoading(false)
      setSuccessMsg(response.data.message || 'Feedback submitted successfully');
      toast.success(response.data.message || 'Feedback submitted successfully')
      setFormData({ name: '', phone: '', feedback: '' });
    } catch (error) {
      toast.error('Failed to submit feedback: ' + error.message);
      setLoading(false)

    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SellerSideBar />
      <ToastContainer />
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-500 bg-opacity-50 backdrop-blur-md">
          <Loader />
        </div>
      )}
      <div className="flex-1 p-6 lg:ml-64 flex items-center justify-center mt-15">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-xl p-8 w-full max-w-xl"
        >
          <h2 className="text-2xl font-semibold mb-6 text-center">Help & Support</h2>

          {successMsg && (
            <p className="text-green-600 font-medium mb-4 text-center">{successMsg}</p>
          )}

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="Enter 10-digit phone number"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Complaint</label>
            <textarea
              name="feedback"
              value={formData.feedback}
              onChange={(e) => handleInputChange('feedback', e.target.value)}
              placeholder="Max 20 words"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              rows={4}
            />
            <p className="text-sm text-gray-500">
              Words: {formData.feedback.trim().split(/\s+/).filter(Boolean).length}/20
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-[#40A1CB] text-white py-2 rounded-lg transition"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default SellerHelp;
