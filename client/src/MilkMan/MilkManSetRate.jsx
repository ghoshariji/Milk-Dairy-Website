import React, { useState } from "react";
import AdminNav from "../components/Sidebar/Sidebar";
import API from "../api";
import { Toaster, toast } from "react-hot-toast";
import upArrow from "../image/upArrow.jpg";
import downArrow from "../image/downArrow.jpg";

const MilkmanSetRate = () => {
  const [buffaloFactor, setBuffaloFactor] = useState(0);
  const [cowFactor, setCowFactor] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);

  const updateBuffaloFactor = (value) => {
    setBuffaloFactor((prev) => Math.max(0, prev + value));
  };

  const updateCowFactor = (value) => {
    setCowFactor((prev) => Math.max(0, prev + value));
  };

  const buffaloRate = (buffaloFactor * 248) / 100;
  const cowRate = (cowFactor * 284) / 100;

  const handleCancelPress = () => setModalVisible(true);

  const handleCloseModal = () => setModalVisible(false);

  const handleAddRate = () => {
    setAddModalVisible(true);
  };

  const handleConfirmCancel = () => {
    setBuffaloFactor(0);
    setCowFactor(0);
    setModalVisible(false);
    toast.error("Rate reset canceled!");
  };

  const handleConfirmAdd = () => {
    toast.success("Milk rate added successfully!");
    setAddModalVisible(false);
  };

  const handleCancelAdd = () => {
    toast.error("Add action canceled!");
    setAddModalVisible(false);
  };

  return (
    <>
      <AdminNav />
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white p-6 max-w-4xl mx-auto mr-40 mt-24">

        {/* Header */}
        <div className="flex items-center bg-[#40A1CB] text-white px-6 py-4 rounded-xl shadow-md">
          <h1 className="text-2xl font-bold text-center w-full">Set Milk Rate</h1>
        </div>

        <div className="space-y-8 mt-8">
          {[{
            label: "Buffalo Milk",
            factor: buffaloFactor,
            setFactor: setBuffaloFactor,
            updateFactor: updateBuffaloFactor,
            rate: buffaloRate,
            divider: "248/100"
          }, {
            label: "Cow Milk",
            factor: cowFactor,
            setFactor: setCowFactor,
            updateFactor: updateCowFactor,
            rate: cowRate,
            divider: "284/100"
          }].map((milk, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg p-6 transition-transform hover:scale-[1.01]">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">{milk.label}</h2>
              <div className="flex items-center justify-center gap-4">
                <span className="text-gray-700 text-base">Snf × Fat ×</span>

                <div className="flex items-center border border-gray-300 rounded-lg bg-gray-100 px-3 w-24 h-14 justify-between">
                  <input
                    type="number"
                    value={milk.factor}
                    onChange={(e) => milk.setFactor(Number(e.target.value) || 0)}
                    className="w-full text-center text-lg text-gray-800 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-[#40A1CB] rounded"
                  />
                  <div className="flex flex-col items-center ml-1">
                    <button onClick={() => milk.updateFactor(1)} className="p-1">
                      <img src={upArrow} alt="Up" className="w-4 h-4 object-contain" />
                    </button>
                    <button onClick={() => milk.updateFactor(-1)} className="p-1">
                      <img src={downArrow} alt="Down" className="w-4 h-4 object-contain" />
                    </button>
                  </div>
                </div>

                <span className="text-gray-700 text-base">= {milk.divider}</span>
              </div>

              <div className="mt-4 bg-sky-100 text-center rounded-lg py-2 text-sky-800 font-medium">
                Rate = {milk.rate.toFixed(2)} rs/lt
              </div>
            </div>
          ))}

          {/* Buttons */}
          <div className="flex justify-between gap-6 mt-10">
            <button
              onClick={handleCancelPress}
              className="w-full py-3 rounded-full bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleAddRate}
              className="w-full py-3 rounded-full bg-[#40A1CB] text-white font-semibold hover:bg-sky-700 transition"
            >
              + Add
            </button>
          </div>
        </div>

        {/* Cancel Modal */}
        {modalVisible && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-transparent bg-opacity-40 backdrop-blur-sm"></div>
            <div className="bg-white p-8 rounded-2xl w-80 shadow-xl text-center z-50">
              <p className="text-xl font-semibold text-gray-800 mb-6">
                Are you sure you want to cancel?
              </p>
              <div className="flex justify-around">
                <button
                  onClick={handleConfirmCancel}
                  className="bg-[#40A1CB] text-white px-4 py-2 rounded-lg font-medium hover:bg-sky-700 transition"
                >
                  Yes
                </button>
                <button
                  onClick={handleCloseModal}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Modal */}
        {addModalVisible && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-transparent bg-opacity-40 backdrop-blur-sm"></div>

            <div className="bg-white p-8 rounded-2xl w-80 shadow-xl text-center z-50">
              <p className="text-xl font-semibold text-gray-800 mb-6">
                Are you sure you want to add this rate?
                </p>
              <div className="flex justify-around">
                <button
                  onClick={handleConfirmAdd}
                  className="bg-[#40A1CB] text-white px-4 py-2 rounded-lg font-medium hover:bg-sky-700 transition"
                >
                  Yes
                </button>
                <button
                  onClick={handleCancelAdd}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MilkmanSetRate;
