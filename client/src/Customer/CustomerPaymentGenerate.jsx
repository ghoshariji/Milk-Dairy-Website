import React, { useEffect, useState } from "react";
import CustomerSidebar from "../components/CustomerSidebar/CustomerSidebar";
import { ToastContainer, toast } from "react-toastify";
import Authentication from "../utils/Authentication";
import Loader from "../components/Loader/Loader";
import {
  FaCreditCard,
  FaRupeeSign,
  FaWater,
  FaCalendarAlt,
  FaMoneyBillWave
} from "react-icons/fa";
import API from "../api";

const CustomerPaymentGenerate = () => {
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState(null);

  const fetchPaymentData = async () => {
    setLoading(true);
    try {
      const response = await API.get("/api/milkman/payment/get-user");
      if (response.data.success) {
        setPaymentData(response.data.payment);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error fetching payment data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentData();
  }, []);

const handlePayNow = () => {
  const upiId = "merchant@upi"; // Replace with your UPI ID
  const name = "Milk Delivery"; // Optional merchant name
  const amount = paymentData.paymentAmount;

  const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR`;

  window.location.href = upiUrl;
};

  return (
    <div className="flex min-h-screen bg-white text-black">
      <CustomerSidebar />
      <ToastContainer />
      <Authentication />
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50 backdrop-blur-md bg-white">
          <Loader />
        </div>
      )}
      <div className="flex-1 p-4 md:p-8 mt-20 lg:ml-64">
        <h2 className="text-3xl font-bold flex items-center gap-3 mb-6 text-gray-800">
          <FaCreditCard className="text-black" /> Payment Log
        </h2>

        {paymentData ? (
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-black text-base md:text-lg">
            <div className="flex items-center gap-2">
              <FaMoneyBillWave className="text-green-600" />
              <strong>Payment Status:</strong>
              <span className="ml-auto">{paymentData.paymentStatus}</span>
            </div>

            <div className="flex items-center gap-2">
              <FaRupeeSign className="text-yellow-600" />
              <strong>Amount:</strong>
              <span className="ml-auto">₹{paymentData.paymentAmount}</span>
            </div>

            <div className="flex items-center gap-2">
              <FaWater className="text-blue-600" />
              <strong>Total Litre:</strong>
              <span className="ml-auto">{paymentData.totalLitre} L</span>
            </div>

            <div className="flex items-center gap-2">
              <FaRupeeSign className="text-purple-700" />
              <strong>Total Amount:</strong>
              <span className="ml-auto">₹{paymentData.totalAmount}</span>
            </div>

            <div className="flex items-center gap-2">
              <FaCalendarAlt className="text-red-500" />
              <strong>From:</strong>
              <span className="ml-auto">
                {new Date(paymentData.fromDate).toLocaleDateString()}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <FaCalendarAlt className="text-red-500" />
              <strong>To:</strong>
              <span className="ml-auto">
                {new Date(paymentData.toDate).toLocaleDateString()}
              </span>
            </div>

            <div className="col-span-1 md:col-span-2 flex justify-center mt-6">
              <button
                onClick={handlePayNow}
                className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition"
              >
                Pending
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-6 text-gray-500 text-lg">No bill generated yet.</div>
        )}
      </div>
    </div>
  );
};

export default CustomerPaymentGenerate;
