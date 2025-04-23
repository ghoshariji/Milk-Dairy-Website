import React, { useState } from "react";
import AdminNav from "../components/Sidebar/Sidebar";
import { Toaster, toast } from "react-hot-toast";

const MilkmanWallet = () => {
  const [transactions, setTransactions] = useState([
    { id: 1, type: "Added", amount: 500, date: "2025-04-21" },
    { id: 2, type: "Withdrawn", amount: 300, date: "2025-04-20" },
    { id: 3, type: "Added", amount: 1040.75, date: "2025-04-19" },
    { id: 4, type: "Added", amount: 200, date: "2025-04-18" },
    { id: 5, type: "Withdrawn", amount: 150, date: "2025-04-17" },
    { id: 6, type: "Added", amount: 350, date: "2025-04-16" },
    { id: 7, type: "Withdrawn", amount: 120, date: "2025-04-15" },
    { id: 8, type: "Added", amount: 400, date: "2025-04-14" },
    { id: 9, type: "Added", amount: 400, date: "2025-04-14" },
    { id: 10, type: "Added", amount: 400, date: "2025-04-14" },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const walletBalance = transactions.reduce((total, txn) => {
    return txn.type === "Added" ? total + txn.amount : total - txn.amount;
  }, 0);

  const addTransaction = (type, amount) => {
    const newTransaction = {
      id: transactions.length + 1,
      type,
      amount,
      date: new Date().toISOString().split("T")[0],
    };
    setTransactions([newTransaction, ...transactions]);
    setCurrentPage(1); // Always show newest page first
  };

  const handleAddMoney = () => {
    const amount = 200;
    addTransaction("Added", amount);
    toast.success(`₹${amount} added successfully!`);
  };

  const handleWithdraw = () => {
    const amount = 100;
    if (walletBalance >= amount) {
      addTransaction("Withdrawn", amount);
      toast.success(`₹${amount} withdrawn successfully!`);
    } else {
      toast.error("Insufficient balance!");
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransactions = transactions.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  return (
    <>
      <AdminNav />
      <Toaster position="top-right" />
      <div className="min-h-screen bg-white to-white p-6 max-w-4xl mx-auto mt-22 mr-40">
        <div className="bg-[#40A1CB] text-white p-6 rounded-xl shadow-md text-center">
          <h1 className="text-2xl font-bold mb-2">My Wallet</h1>
          <p className="text-lg">Current Balance</p>
          <p className="text-3xl font-bold mt-1">
            ₹ {walletBalance.toFixed(2)}
          </p>
        </div>

        <div className="flex justify-between gap-4 mt-6">
          <button
            onClick={handleAddMoney}
            className="cursor-pointer flex-1 py-3 rounded-xl bg-[#40A1CB] text-white font-semibold hover:bg-sky-700 transition"
          >
            + Add Money
          </button>
          <button
            onClick={handleWithdraw}
            className="cursor-pointer flex-1 py-3 rounded-xl bg-white border-2 border-[#40A1CB] text-[#40A1CB] font-semibold hover:bg-blue-50 transition"
          >
            Withdraw
          </button>
        </div>

        {/* Transaction History */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold text-[#40A1CB] mb-4">
            Transaction History
          </h2>
          <div className="space-y-4">
            {currentTransactions.map((txn) => (
              <div
                key={txn.id}
                className="flex justify-between items-center bg-white p-4 rounded-xl shadow hover:shadow-md transition"
              >
                <div>
                  <p className="text-gray-800 font-medium">{txn.type}</p>
                  <p className="text-sm text-gray-500">{txn.date}</p>
                </div>
                <div
                  className={`font-semibold ${
                    txn.type === "Added" ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {txn.type === "Added" ? "+" : "-"}₹{txn.amount}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center mt-6 space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="cursor-pointer px-4 py-2 bg-[#40A1CB] text-white rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span className="px-4 py-2 font-medium text-[#40A1CB]">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="cursor-pointer px-4 py-2 bg-[#40A1CB] text-white rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MilkmanWallet;
