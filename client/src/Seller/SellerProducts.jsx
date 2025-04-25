import React, { useEffect, useState } from "react";
import SellerSideBar from "../components/SellerSidebar/SellerSidebar";
import API from "../api";
import Authentication from "../utils/Authentication";

const SellerProducts = () => {
  const [allProducts, setAllProducts] = useState([]);

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
      const blob = new Blob([typedArray], { type: contentType || 'image/jpeg' });
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('Error creating image URL:', error);
      return null;
    }
  };
  

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="flex">
      <SellerSideBar />
      <Authentication />

      <div className="lg:ml-64 w-full mt-20 p-4 bg-gray-100 min-h-screen">
        <h2 className="text-xl font-semibold mb-4">Your Products</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {allProducts.length > 0 ? (
            allProducts.map((product, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow hover:shadow-md transition duration-200 overflow-hidden"
              >
                <img
                  src={
                    product.image?.data?.data                      ? createImageUrl(
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

export default SellerProducts;
