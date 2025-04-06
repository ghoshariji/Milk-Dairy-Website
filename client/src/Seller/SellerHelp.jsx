import React, { useState } from 'react';
import SellerSideBar from '../components/SellerSidebar/SellerSidebar';

const SellerHelp = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    complaint: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted data:', formData);
    alert('Your complaint has been submitted!');
    setFormData({ name: '', phone: '', complaint: '' });
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SellerSideBar />
      
      <div className="flex-1 p-6 lg:ml-64 flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-xl p-8 w-full max-w-xl"
        >
          <h2 className="text-2xl font-semibold mb-6 text-center">Help & Support</h2>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
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
              onChange={handleChange}
              required
              pattern="[0-9]{10}"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter 10-digit phone number"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Complaint</label>
            <textarea
              name="complaint"
              value={formData.complaint}
              onChange={handleChange}
              required
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Write your complaint here..."
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default SellerHelp;
