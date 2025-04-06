import React from 'react';
import SellerSideBar from '../components/SellerSidebar/SellerSidebar';
import { Mail, User, IndianRupee } from 'lucide-react';

const SellerMilkMan = () => {
  const milkman = {
    name: 'Rajeev Kumar',
    email: 'rajeevmilkman@example.com',
    upi: 'rajeev@ybl',
  };

  const handleConnect = () => {
    alert(`Connection request sent to ${milkman.name}`);
  };

  return (
    <div className="flex min-h-screen  bg-gray-100">
      <SellerSideBar />

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-semibold text-center text-blue-600 mb-8">
            Connect with Your Milkman
          </h2>

          <div className="space-y-6">
            <div className="flex items-center gap-4 border-b pb-4">
              <User className="text-blue-500" size={28} />
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="text-lg font-medium">{milkman.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 border-b pb-4">
              <Mail className="text-blue-500" size={28} />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-lg font-medium">{milkman.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <IndianRupee className="text-blue-500" size={28} />
              <div>
                <p className="text-sm text-gray-500">UPI ID</p>
                <p className="text-lg font-medium">{milkman.upi}</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleConnect}
            className="mt-8 w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition font-semibold"
          >
            Connect
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellerMilkMan;
