import React, { useState } from 'react';
import SellerSideBar from '../components/SellerSidebar/SellerSidebar';
import { FaCalendarAlt } from 'react-icons/fa';
import { FiSearch } from 'react-icons/fi';

const SellerMilkRecord = () => {
  const [fromDate, setFromDate] = useState('2024-08-22');
  const [toDate, setToDate] = useState('2024-09-22');

  return (
    <div className="flex">
      <SellerSideBar />

      <div className="lg:ml-64 w-full mt-20 p-6 bg-gray-100 min-h-screen">
        <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-center">Milk Record</h2>

          {/* Search Section */}


          {/* Date Pickers */}
   {/* Date Pickers */}
<div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
  <div className="flex-1">
    <label className="block text-xs text-gray-500 mb-1">From</label>
    <div className="relative">
      <input
        type="date"
        value={fromDate}
        onChange={(e) => setFromDate(e.target.value)}
        className="w-full border rounded px-3 py-2 pr-10"
      />
      <FaCalendarAlt className="absolute right-3 top-3 text-gray-400" />
    </div>
  </div>
  <div className="flex-1">
    <label className="block text-xs text-gray-500 mb-1">To</label>
    <div className="relative">
      <input
        type="date"
        value={toDate}
        onChange={(e) => setToDate(e.target.value)}
        className="w-full border rounded px-3 py-2 pr-10"
      />
      <FaCalendarAlt className="absolute right-3 top-3 text-gray-400" />
    </div>
  </div>
</div>


          {/* Note Message */}
          <div className="bg-gray-200 text-xs text-gray-600 px-4 py-2 rounded flex justify-between items-center mb-4">
            <span>From date to date difference cannot be greater than 365 days</span>
            <button className="text-gray-500 hover:text-gray-700 text-sm">×</button>
          </div>

          {/* Milk Record Summary Card */}
          <div className="bg-blue-100 text-sm rounded-lg p-4">
            <div className="font-semibold text-gray-700 mb-2">22 August - 22 September</div>
            <div className="flex justify-between items-center mb-2">
              <div className="text-lg font-bold text-gray-800">5600 INR</div>
              <div className="text-lg font-bold text-gray-800">80 <span className="text-sm">LTR</span></div>
            </div>
            <div className="flex justify-between text-gray-700 mt-2">
              <div>
                <div className="text-xs">Avg. Fat</div>
                <div className="font-medium">5.1</div>
              </div>
              <div>
                <div className="text-xs">Avg. Snf</div>
                <div className="font-medium">7.0</div>
              </div>
              <div>
                <div className="text-xs">Avg. Rate</div>
                <div className="font-medium">69 INR</div>
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-2">Based on your milk records</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerMilkRecord;
