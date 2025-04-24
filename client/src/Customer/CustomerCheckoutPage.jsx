import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Loader from "../components/Loader/Loader";

const CustomerCheckoutPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    paymentMode: "cash on", // default
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("customerCart")) || [];
    setCartItems(storedCart);
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const getTotalPrice = () => {
    return cartItems.reduce(
      (acc, item) => acc + (item.price || 0) * (item.quantity || 1),
      0
    );
  };

  const handleSubmit = async (e) => {
    try {
      setLoading(true);
      e.preventDefault();
      console.log("Order Info:", { ...form, cartItems });
      const products = JSON.parse(localStorage.getItem("customerCart")) || [];
      const token = localStorage.getItem("token");
      const orderData = {
        name: form.name,
        phone: form.phone,
        deliveryAddress: form.address,
        products: products.map((product) => ({
          productId: product._id,
          name: product.name,
          price: product.price,
          quantity: product.quantity,
        })),
        paymentMode: form.paymentMode.toLowerCase(),
      };

      const response = await fetch(
        `${import.meta.env.VITE_SERVER}/api/order/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(orderData),
        }
      );
      setLoading(false);

      const result = await response.json();
      if (response.ok) {
        toast.success("Order placed successfully!");
        localStorage.removeItem("customerCart");
        navigate("/customer-success", { state: { name: form.name } });
      } else {
        toast.error(result.message || "Failed to place order");
      }
    } catch (error) {
      setLoading(false);

      toast.error("Internal Server Error...");
      console.log("Error" + error);
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <ToastContainer />
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50 backdrop-blur-md">
          <Loader />
        </div>
      )}
      <h2 className="text-2xl font-bold mb-4 text-center">Checkout</h2>

      {/* Bill Summary */}
      <div className="bg-gray-100 p-4 rounded shadow mb-6">
        <h3 className="text-lg font-semibold mb-2">Bill Summary</h3>
        <ul className="space-y-2">
          {cartItems.map((item, index) => (
            <li key={index} className="flex justify-between">
              <span>
                {item.name} × {item.quantity || 1}
              </span>
              <span>₹{(item.price * (item.quantity || 1)).toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <hr className="my-2" />
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>₹{getTotalPrice().toFixed(2)}</span>
        </div>
      </div>

      {/* Customer Details Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 shadow rounded space-y-4"
      >
        <div>
          <label className="block font-medium">Name</label>
          <input
            type="text"
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block font-medium">Phone Number</label>
          <input
            type="text"
            name="phone"
            required
            value={form.phone}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block font-medium">Address</label>
          <textarea
            name="address"
            required
            value={form.address}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Payment Mode</label>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="paymentMode"
                value="cash on"
                checked={form.paymentMode === "cash on"}
                onChange={handleChange}
              />
              Cash on Delivery
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="paymentMode"
                value="online"
                checked={form.paymentMode === "online"}
                onChange={handleChange}
              />
              Online Payment
            </label>
          </div>
        </div>

        <div className="text-right">
          <button
            type="submit"
            className="bg-[#40A1CB]  text-white px-6 py-2 rounded"
          >
            Proceed
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomerCheckoutPage;
