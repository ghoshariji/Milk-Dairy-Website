import React, { useEffect, useState } from "react";
import API from "../api";
import CustomerSidebar from "../components/CustomerSidebar/CustomerSidebar";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import {
  FaCartPlus,
  FaTag,
  FaCheckCircle,
  FaTimesCircle,
  FaEye,
} from "react-icons/fa";
import Loader from "../components/Loader/Loader";
import Authentication from "../utils/Authentication";

const CustomerProducts = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await API.get("/api/milkman/product/getCustomerProduct");
      const products = res.data.products || [];

      const uniqueCategories = [
        ...new Set(products.map((product) => product.category).filter(Boolean)),
      ];
      setCategories(uniqueCategories);
      setAllProducts(products);
      setFilteredProducts(products); // 👈 Initially, show all products
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching products:", error.message);
    }
  };

  const createImageUrl = (data, type) => {
    try {
      const arr = new Uint8Array(data);
      const blob = new Blob([arr], { type: type || "image/jpeg" });
      return URL.createObjectURL(blob);
    } catch {
      return null;
    }
  };

  useEffect(() => {
    fetchProducts();
    const stored = localStorage.getItem("customerCart");
    if (stored) setCartItems(JSON.parse(stored));
  }, []);

  const handleAddToCart = (product) => {
    if (cartItems.some((i) => i._id === product._id)) {
      toast.error(`${product.name} is already in your cart!`);
      return;
    }
    if (cartItems.length >= 20) {
      toast.error("You can only add up to 20 items.");
      return;
    }
    const updated = [...cartItems, { ...product, quantity: 1 }];
    setCartItems(updated);
    localStorage.setItem("customerCart", JSON.stringify(updated));
    toast.success(`${product.name} added to cart!`);
  };
  const handleFilterChange = (selectedCategory) => {
    if (!selectedCategory) {
      // If "All Products" selected, show all
      setFilteredProducts(allProducts);
    } else {
      // Else filter products based on selected category
      const filtered = allProducts.filter(
        (product) => product.category === selectedCategory
      );
      setFilteredProducts(filtered);
    }
  };

  return (
    <div className="flex">
      <Toaster position="top-right" />
      <CustomerSidebar />
      <Authentication />

      {loading && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50 backdrop-blur-md">
          <Loader />
        </div>
      )}

      <main className="lg:ml-64 w-full mt-20 p-6 bg-gray-50 min-h-screen">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Our Products</h1>

          <div className="flex items-center gap-4">
            {/* Dropdown for filtering */}
            <select
              onChange={(e) => handleFilterChange(e.target.value)}
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40A1CB] transition"
            >
              <option value="">All Products</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>

            {/* Cart Button */}
            <button
              onClick={() =>
                navigate("/customer-cart", { state: { cartItems } })
              }
              className="relative bg-[#40A1CB] hover:bg-[#3184A6] text-white px-5 py-2 rounded-lg flex items-center transition"
            >
              <FaCartPlus className="mr-2" /> Cart
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-2 rounded-full">
                  {cartItems.length}
                </span>
              )}
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.length ? (
            filteredProducts.map((p) => (
              <div
                key={p._id}
                className="group relative bg-gradient-to-br from-cyan-100 via-cyan-200 to-cyan-300 rounded-xl shadow hover:shadow-2xl transform hover:scale-[1.02] transition"
              >
                {/* Image + Overlay */}
                <div className="relative h-48 overflow-hidden rounded-t-xl">
                  <img
                    src={
                      p.image?.data?.data
                        ? createImageUrl(p.image.data.data, p.image.contentType)
                        : "https://agrimart.in/uploads/vendor_banner_image/default.jpg"
                    }
                    alt={p.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition" />
                  <button
                    onClick={() => setSelectedProduct(p)}
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 text-white text-2xl"
                    title="View Details"
                  >
                    <FaEye />
                  </button>
                </div>

                {/* Body */}
                <div className="p-4 space-y-2">
                  <h2 className="text-lg font-semibold text-gray-800 line-clamp-2">
                    {p.name}
                  </h2>
                  <p className="text-sm text-gray-600 overflow-hidden h-12">
                    {p.description}
                  </p>
                  <div className="flex items-center text-sm text-gray-700">
                    <FaTag className="mr-1" />{" "}
                    <span className="font-medium">{p.category}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    {p.isAvailable === "true" ? (
                      <FaCheckCircle className="text-green-600 mr-1" />
                    ) : (
                      <FaTimesCircle className="text-red-600 mr-1" />
                    )}{" "}
                    {p.isAvailable === "true" ? "In Stock" : "Out of Stock"}
                  </div>

                  <div className="mt-3 flex justify-between items-center">
                    <span className="text-xl font-bold text-[#40A1CB]">
                      ₹{p.price.toFixed(2)}
                    </span>
                    <button
                      disabled={p.isAvailable !== "true"}
                      onClick={() => handleAddToCart(p)}
                      className={`flex items-center px-3 py-1 rounded-lg text-white transition ${
                        p.isAvailable === "true"
                          ? "bg-[#40A1CB] hover:bg-[#3184A6]"
                          : "bg-gray-400 cursor-not-allowed"
                      }`}
                    >
                      <FaCartPlus className="mr-1" /> Add
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">
              No products found.
            </p>
          )}
        </div>

        {/* Product Modal */}
        {selectedProduct && (
          <div
            onClick={() => setSelectedProduct(null)}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-4"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative"
            >
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl"
              >
                &times;
              </button>

              <img
                src={
                  selectedProduct.image?.data?.data
                    ? createImageUrl(
                        selectedProduct.image.data.data,
                        selectedProduct.image.contentType
                      )
                    : "/placeholder.png"
                }
                alt={selectedProduct.name}
                className="w-full h-48 object-cover rounded-md mb-4"
              />

              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {selectedProduct.name}
              </h2>
              <p className="text-gray-600 mb-2">
                {selectedProduct.description}
              </p>
              <p className="text-gray-800 mb-1">
                <strong>Category:</strong> {selectedProduct.category}
              </p>
              <p className="mb-1">
                <strong>Status:</strong>{" "}
                {selectedProduct.isAvailable === "true" ? (
                  <span className="text-green-600">In Stock</span>
                ) : (
                  <span className="text-red-600">Out of Stock</span>
                )}
              </p>
              <p className="text-xl font-bold text-[#40A1CB] mt-2">
                ₹{selectedProduct.price.toFixed(2)}
              </p>

              <button
                disabled={selectedProduct.isAvailable !== "true"}
                onClick={() => {
                  handleAddToCart(selectedProduct);
                  setSelectedProduct(null);
                }}
                className={`mt-4 w-full py-2 rounded-lg text-white transition ${
                  selectedProduct.isAvailable === "true"
                    ? "bg-[#40A1CB] hover:bg-[#3184A6]"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                <FaCartPlus className="inline mr-2" />
                Add to Cart
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CustomerProducts;
