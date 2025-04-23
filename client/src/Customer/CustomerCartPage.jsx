import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { Trash2, Plus, Minus } from "lucide-react";
import API from "../api"; // Adjust if needed

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
    localStorage.setItem("customerCart", JSON.stringify(updated));

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
      <div className="p-6 bg-gray-50 min-h-screen">
        <Toaster position="top-right" reverseOrder={false} />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 w-full sm:w-auto">
   
            <h2 className="text-3xl font-semibold text-gray-900 mt-2 sm:mt-0">
              Your Cart
            </h2>
          </div>

          {/* Total and Checkout */}
          {cartItems.length > 0 ? (
            <div className="bg-white shadow-lg rounded-lg p-4 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <p className="text-xl font-bold text-gray-900">
                Total: ₹{getTotalPrice().toFixed(2)}
              </p>
              <button
                onClick={() => navigate("/customer-checkout")}
                className="bg-[#40A1CB] text-white px-6 py-3 rounded-lg text-lg w-full sm:w-auto"
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cartItems.map((item, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-[#e0f7fa] to-[#4dd0e1] p-6 shadow-xl rounded-2xl transition-transform transform hover:scale-105"
              >
                {item.image?.data?.data ? (
                  <img
                    src={createImageUrl(
                      item.image.data.data,
                      item.image.contentType
                    )}
                    alt={item.name}
                    className="w-full h-48 object-cover rounded-lg mb-4 shadow-md"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500 rounded-lg mb-4">
                    No Image
                  </div>
                )}

                <h3 className="text-xl font-bold text-gray-800">{item.name}</h3>
                <p className="text-sm text-gray-700 mt-1">{item.description}</p>
                <p className="text-sm text-gray-600 mb-2 mt-2">
                  Category: {item.category}
                </p>
                <p className="text-[#007e99] font-semibold text-lg mb-3">
                  ₹{item.price?.toFixed(2) || "0.00"}
                </p>

                {/* Quantity & Remove */}
                <div className="flex justify-between items-center mt-4 border-t pt-4">
                  <div className="flex items-center gap-2">
                    <button
                      className="bg-white text-gray-800 p-2 rounded-full shadow hover:bg-gray-100 hover:scale-110 transition"
                      onClick={() => decreaseQty(index)}
                    >
                      <Minus size={18} />
                    </button>
                    <span className="text-lg font-medium px-2">
                      {item.quantity || 1}
                    </span>
                    <button
                      className="bg-white text-gray-800 p-2 rounded-full shadow hover:bg-gray-100 hover:scale-110 transition"
                      onClick={() => increaseQty(index)}
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                  <button
                    className="text-red-600 hover:text-red-800 transition"
                    onClick={() => {
                      setItemToRemoveIndex(index);
                      setShowConfirmModal(true);
                    }}
                    title="Remove Item"
                  >
                    <Trash2 size={22} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-[60vh]">
            <p className="text-2xl text-gray-500 font-semibold">
              🛒 Your cart is empty.
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-sm w-full">
            <h3 className="text-xl font-semibold mb-4">Confirm Removal</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to remove this item from your cart?
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="bg-[#40A1CB] text-white px-6 py-3 rounded-lg"
                onClick={handleRemoveConfirmed}
              >
                Yes, Remove
              </button>
              <button
                className="bg-gray-300 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-400"
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
