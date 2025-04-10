import React, { useEffect, useState } from "react";
import API from "../api";
import CustomerSidebar from "../components/CustomerSidebar/CustomerSidebar";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";

const CustomerProducts = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const res = await API.get("/api/milkman/product/getCustomerProduct");
      setAllProducts(res.data.products || []);
      console.log(res.data.products);
    } catch (error) {
      console.error("Error fetching products:", error.message);
    }
  };

  const createImageUrl = (imageData, contentType) => {
    try {
      // Convert normal array to Uint8Array
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

  useEffect(() => {
    fetchProducts();

    const storedCart = localStorage.getItem("customerCart");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  const handleAddToCart = (product) => {
    // Check if the product is already in the cart
    const alreadyInCart = cartItems.some((item) => item._id === product._id);
    if (alreadyInCart) {
      toast.error(`${product.name} is already in your cart!`);
      return;
    }

    // Check if cart limit has been reached
    if (cartItems.length >= 20) {
      toast.error("You can only add up to 20 products in the cart.");
      return;
    }

    // Add product to cart
    const updatedCart = [...cartItems, product];
    setCartItems(updatedCart);
    localStorage.setItem("customerCart", JSON.stringify(updatedCart));
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="flex">
      <Toaster position="top-right" reverseOrder={false} />
      <CustomerSidebar />

      <div className="lg:ml-64 w-full mt-20 p-4 bg-gray-100 min-h-screen">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Your Products</h2>
          <div className="relative">
            <button
              className="bg-[#40A1CB] text-white text-xl font-semibold px-4 py-2 rounded-lg  transition duration-300"
              onClick={() =>
                navigate("/customer-cart", { state: { cartItems } })
              }
            >
              Cart
            </button>
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {cartItems.length}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {allProducts.length > 0 ? (
            allProducts.map((product, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow hover:shadow-md transition duration-200 overflow-hidden"
              >
                <img
                  src={
                    product.image?.data?.data
                      ? createImageUrl(
                          product.image.data.data,
                          product.image.contentType
                        )
                      : "No Image Found" // 👈 Make sure this image exists in your public/images folder
                  }
                  alt={product.name || "No image"}
                  className="w-full h-48 object-cover"
                />

                <div className="p-4">
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <p className="text-sm text-gray-600">{product.description}</p>
                  <p className="text-sm mt-1 text-gray-800">
                    Category:{" "}
                    <span className="font-medium">{product.category}</span>
                  </p>
                  <p className="text-green-700 font-semibold">
                    {product.isAvailable === "true"
                      ? "Available"
                      : "Not Available"}
                  </p>
                  <button
                    className="mt-2 bg-[#40A1CB] text-white px-3 py-1 rounded  transition duration-300"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 col-span-full text-center">
              No products found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerProducts;
