import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import API from "../api"; // Adjust path if needed

const CustomerCartPage = () => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [itemToRemoveIndex, setItemToRemoveIndex] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const initialCart =
    location.state?.cartItems ||
    JSON.parse(localStorage.getItem("customerCart")) ||
    [];

  const [cartItems, setCartItems] = useState(initialCart);

  useEffect(() => {
    localStorage.setItem("customerCart", JSON.stringify(cartItems));
  }, [cartItems]);

  const createImageUrl = (imageData, contentType) => {
    try {
      const typedArray = new Uint8Array(imageData);
      const blob = new Blob([typedArray], {
        type: contentType || "image/jpeg",
      });
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error("Error creating image URL:", error);
      return null;
    }
  };

  const increaseQty = (index) => {
    const updated = [...cartItems];
    updated[index].quantity = (updated[index].quantity || 1) + 1;
    setCartItems(updated);
  };

  const decreaseQty = (index) => {
    const updated = [...cartItems];
    if ((updated[index].quantity || 1) > 1) {
      updated[index].quantity -= 1;
      setCartItems(updated);
    }
  };

  const removeItem = async (index) => {
    const confirmed = window.confirm(
      "Are you sure you want to remove this item?"
    );

    if (confirmed) {
      const itemToRemove = cartItems[index];

      try {
        await API.delete(`/api/milkman/cart/delete/${itemToRemove._id}`);
      } catch (error) {
        console.error("Failed to delete from DB", error);
      }

      const updated = cartItems.filter((_, i) => i !== index);
      setCartItems(updated);
      toast.success(`${itemToRemove.name} removed from cart!`);
    }
  };

  const handleRemoveConfirmed = async () => {
    const index = itemToRemoveIndex;
    const itemToRemove = cartItems[index];

    try {
      await API.delete(`/api/milkman/cart/delete/${itemToRemove._id}`);
    } catch (error) {
      console.error("Failed to delete from DB", error);
    }

    const updated = cartItems.filter((_, i) => i !== index);
    setCartItems(updated);
    toast.success(`${itemToRemove.name} removed from cart!`);
    setShowConfirmModal(false);
    setItemToRemoveIndex(null);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((acc, item) => {
      const price = item.price || 0;
      const quantity = item.quantity || 1;
      return acc + price * quantity;
    }, 0);
  };

  return (
    <>
      <div className="p-4">
        <Toaster position="top-right" reverseOrder={false} />
  
        {/* Header Row */}
{/* Header Row */}
<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
  {/* Back + Title */}
  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 w-full sm:w-auto">
    {/* Back Button */}
    <button
      type="button"
      onClick={() => navigate("/customer-products")}
      className="inline-flex items-center justify-center bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded w-fit"
    >
      ← Back
    </button>

    {/* Title */}
    <h2 className="text-2xl font-semibold text-center sm:text-left mt-2 sm:mt-0">
      Your Cart
    </h2>
  </div>

  {/* Checkout Summary */}
  {cartItems.length > 0 ? (
    <div className="bg-white shadow rounded p-3 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
      <p className="text-lg font-bold">Total: ₹{getTotalPrice().toFixed(2)}</p>
      <button
        onClick={() => navigate("/customer-checkout")}
        className="bg-[#40A1CB] text-white px-4 py-2 rounded w-full sm:w-auto"
      >
        Checkout
      </button>
    </div>
  ) : (
    <div className="w-full sm:w-[180px]"></div>
  )}
</div>


  
        {/* Cart Items */}
        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cartItems.map((item, index) => (
              <div
                key={index}
                className="bg-white p-4 shadow rounded flex flex-col"
              >
                {item.image?.data?.data ? (
                  <img
                    src={createImageUrl(
                      item.image.data.data,
                      item.image.contentType
                    )}
                    alt={item.name}
                    className="w-full h-40 object-cover rounded mb-2"
                  />
                ) : (
                  <div className="w-full h-40 bg-gray-200 flex items-center justify-center text-gray-500 mb-2">
                    No Image
                  </div>
                )}
  
                <h3 className="text-lg font-bold">{item.name}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
                <p className="text-sm text-gray-500 mb-2">
                  Category: {item.category}
                </p>
                <p className="text-[#40A1CB] font-semibold mb-2">
                  Price: ₹{item.price?.toFixed(2) || "0.00"}
                </p>
  
                {/* Quantity & Remove */}
                <div className="flex justify-between items-center mt-auto pt-3 border-t">
                  <div className="flex items-center gap-2">
                    <button
                      className="bg-gray-300 px-2 py-1 rounded text-lg"
                      onClick={() => decreaseQty(index)}
                    >
                      -
                    </button>
                    <span>{item.quantity || 1}</span>
                    <button
                      className="bg-gray-300 px-2 py-1 rounded text-lg"
                      onClick={() => increaseQty(index)}
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="text-red-500 hover:text-red-700 text-xl"
                    onClick={() => {
                      setItemToRemoveIndex(index);
                      setShowConfirmModal(true);
                    }}
                    title="Remove Item"
                  >
                    ❌
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-[60vh]">
            <p className="text-xl text-gray-500 font-semibold">
              🛒 Your cart is empty.
            </p>
          </div>
        )}
      </div>
  
      {/* Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm w-full">
          <h3 className="text-lg font-semibold mb-4">Confirm Removal</h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to remove this item from your cart?
          </p>
          <div className="flex justify-center gap-4">
            <button
              className="bg-[#40A1CB] text-white px-4 py-2 rounded"
              onClick={handleRemoveConfirmed}
            >
              Yes, Remove
            </button>
            <button
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
              onClick={() => setShowConfirmModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      
      )}
    </>
  );
  
};

export default CustomerCartPage;
