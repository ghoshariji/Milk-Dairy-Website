import React, { useState } from "react";

const MilkRecordModal = ({ data, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
      <div className="bg-white rounded-2xl shadow-xl w-[90%] max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
        >
          &times;
        </button>

        <h2 className="text-xl font-bold text-[#40A1CB] mb-4">Milk Record</h2>

        {data ? (
          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex items-center">
              <span className="mr-2">📅</span>
              <span>{new Date(data.date).toDateString()}</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2">🥛 Kg:</span>
              <span>{data.kg} kg</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2">💰 Rate:</span>
              <span>₹{data.rate} per kg</span>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No data found</p>
        )}
      </div>
    </div>
  );
};

export default MilkRecordModal;
