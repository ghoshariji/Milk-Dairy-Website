import React, { useEffect, useState } from 'react';
import { Mail, User, IndianRupee } from 'lucide-react';
import API from '../api'; // make sure you are importing the correct axios instance
import CustomerSidebar from '../components/CustomerSidebar/CustomerSidebar';

const CustomerMilkman = () => {
  const [item, setMilkMen] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMilkMen = async () => {
      try {
        const response = await API.get('/api/auth/user/get-milkman-data-user');
        console.log(response.data);
        setMilkMen(response.data);
      } catch (error) {
        console.error('Error fetching milkmen:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMilkMen();
  }, []);

  const handleConnect = () => {
    alert(`Connection request sent to ${item.name || 'your milkman'}`);
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-xl">Loading milkman data...</p>
      </div>
    );
  }
  return (
    <div className="flex min-h-screen bg-gray-100">
      <CustomerSidebar />

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-semibold text-center text-blue-600 mb-8">
           Your Milkman
          </h2>

          <div className="space-y-6">
            <div className="flex items-center gap-4 border-b pb-4">
              <User className="text-blue-500" size={28} />
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="text-lg font-medium">{item.name || 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 border-b pb-4">
              <Mail className="text-blue-500" size={28} />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-lg font-medium">{item.email || 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 border-b pb-4">
              <IndianRupee className="text-blue-500" size={28} />
              <div>
                <p className="text-sm text-gray-500">UPI ID</p>
                <p className="text-lg font-medium">{item.upiId || 'N/A'}</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomerMilkman
