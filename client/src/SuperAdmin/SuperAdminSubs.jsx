import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import SuperAdminSidebar from '../components/SuperSidebar/SuperAdminSidebar';

const SuperAdminSubs = () => {
  const [discount, setDiscount] = useState('');
  const [expiryDate, setExpiryDate] = useState(new Date());
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'dd-MM-yyyy');
  };

  const copyToClipboard = async (text) => {
    await navigator.clipboard.writeText(text);
    alert('Coupon code copied to clipboard.');
  };

  const fetchCoupons = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER}/api/coupon/get`);
      const data = await response.json();
      setCoupons(data);
    } catch (error) {
      console.error('Error fetching coupons:', error);
    }
  };

  const generateCoupon = async () => {
    if (!discount || !expiryDate) {
      alert('Please enter discount and expiry date.');
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_SERVER}/api/coupon/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          discount: Number(discount),
          expiryDate: expiryDate.toISOString().split('T')[0],
        }),
      });
      const data = await response.json();
      if (response.ok) {
        fetchCoupons();
        alert(`Coupon Generated: ${data.coupon.code}`);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error generating coupon:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteCoupon = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER}/api/coupon/delete/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (response.ok) {
        setCoupons(coupons.filter((coupon) => coupon._id !== id));
        alert('Coupon removed successfully.');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error deleting coupon:', error);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  return (
    <div className="flex">
    <SuperAdminSidebar />
    {/* Sidebar */}

    {/* Main Content */}
    <div className=" w-full lg:ml-64 mt-20">
      {/* Main Content */}
      <main className="flex-1 p-6 bg-white">
        <h1 className="text-2xl font-bold mb-4 text-[#40A1CB]">Manage Coupons</h1>

        {/* Form */}
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="number"
            placeholder="Discount Value (%)"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            className="border border-[#40A1CB] p-2 rounded w-full"
          />
          <input
            type="date"
            value={expiryDate.toISOString().split('T')[0]}
            onChange={(e) => setExpiryDate(new Date(e.target.value))}
            className="border border-[#40A1CB] p-2 rounded w-full"
          />
        </div>

        <button
          onClick={generateCoupon}
          disabled={loading}
          className="bg-[#40A1CB] text-white px-4 py-2 rounded mb-6"
        >
          {loading ? 'Generating...' : 'Generate Coupon'}
        </button>

        {/* Coupon List */}
        <h2 className="text-xl font-bold mb-4">All Coupons</h2>
        <div className="grid gap-4">
          {coupons.map((item) => (
            <div key={item._id} className="border p-4 rounded shadow-md">
              <p className="font-bold text-lg">Code: {item.code}</p>
              <p>Discount: {item.discount}%</p>
              <p>Expiry: {formatDate(item.expiryDate)}</p>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => deleteCoupon(item._id)}
                  className="border border-[#40A1CB] text-[#40A1CB] px-4 py-1 rounded"
                >
                  Delete
                </button>
                <button
                  onClick={() => copyToClipboard(item.code)}
                  className="bg-[#40A1CB] text-white px-4 py-1 rounded"
                >
                  Copy
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
    </div>

  );
};

export default SuperAdminSubs;
