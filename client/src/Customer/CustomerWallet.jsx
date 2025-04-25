import React from 'react';
import { FaArrowUp, FaArrowDown, FaFilter } from 'react-icons/fa';
import CustomerSidebar from '../components/CustomerSidebar/CustomerSidebar';
import Authentication from '../utils/Authentication';

const transactions = [
  {
    id: 1,
    name: 'Narender',
    amount: '5000 INR',
    time: '9:47 AM',
    date: '24 Aug 2024',
    img: '/images/user1.jpg',
  },
  {
    id: 2,
    name: 'Narender',
    amount: '5000 INR',
    time: '12:47 AM',
    date: '2 Aug 2024',
    img: '/images/user1.jpg',
  },
];
const CustomerWallet = () => {
  return (
    <div className="flex">
    <CustomerSidebar />
    <Authentication />

    <div className="lg:ml-64 w-full mt-20 p-4 bg-gray-100 min-h-screen">
      <div className="max-w-md mx-auto space-y-6">
        {/* Balance Card */}
        <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-500">Available balance</p>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Rs 124910</h2>
          <div className="flex justify-between text-sm text-blue-600 font-medium">
            <button className="flex items-center gap-1 hover:underline">
              <FaArrowDown /> Top up
            </button>
            <button className="flex items-center gap-1 hover:underline">
              <FaArrowUp /> Withdrawal
            </button>
          </div>
        </div>

        {/* Payment History */}
        <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold">Payment history</h3>
            <FaFilter className="text-gray-400 cursor-pointer" />
          </div>
          <div className="space-y-4">
            {transactions.map((txn) => (
              <div
                key={txn.id}
                className="flex items-center justify-between border-b pb-2"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={txn.img}
                    alt={txn.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium">{txn.name}</p>
                    <p className="text-xs text-gray-500">
                      {txn.time} &nbsp; {txn.date}
                    </p>
                  </div>
                </div>
                <div className="text-green-600 font-medium">{txn.amount}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Download Button */}
        <div className="text-center">
          <button className="px-4 py-2 bg-white border rounded shadow hover:bg-gray-100">
            Downloads Payment History <span className="ml-2 text-xs bg-gray-200 px-2 py-1 rounded">in pdf</span>
          </button>
        </div>
      </div>
    </div>
  </div>
  )
}

export default CustomerWallet
