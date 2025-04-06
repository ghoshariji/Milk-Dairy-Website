import React, { useState } from 'react';
import SellerSideBar from '../components/SellerSidebar/SellerSidebar';
import { MapPin, Phone } from 'lucide-react';

const milkmanList = [
  { name: 'Amit Sharma', location: 'Delhi', phone: '9876543210' },
  { name: 'Bhavesh Mehta', location: 'Mumbai', phone: '9823412345' },
  { name: 'Chandan Das', location: 'Kolkata', phone: '9123456780' },
  { name: 'Dinesh Kumar', location: 'Chennai', phone: '9845123456' },
  { name: 'Eshan Verma', location: 'Bangalore', phone: '9712345678' },
];

const SellerChangeMilkMan = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredList = milkmanList.filter((milkman) =>
    milkman.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SellerSideBar />

      <div className="flex-1 p-6 mt-20 lg:ml-64">
        <div className="max-w-3xl mx-auto">
          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search milkman by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 mb-6 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* List */}
          <div className="space-y-4">
            {filteredList.map((milkman, index) => (
              <div
                key={index}
                className="flex items-center bg-white rounded-lg shadow p-4 hover:shadow-md transition duration-300"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-xl">
                  {milkman.name.charAt(0)}
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold">{milkman.name}</h3>
                  <div className="flex items-center text-gray-600 text-sm mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    {milkman.location}
                  </div>
                  <div className="flex items-center text-gray-600 text-sm mt-1">
                    <Phone className="w-4 h-4 mr-1" />
                    {milkman.phone}
                  </div>
                </div>
              </div>
            ))}

            {filteredList.length === 0 && (
              <p className="text-center text-gray-500">No milkman found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerChangeMilkMan;
