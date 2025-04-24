import React, { useState, useEffect } from "react";
import AdminNav from "../components/Sidebar/Sidebar";
import API from "../api";
import { toast, ToastContainer } from "react-toastify";
import Loader from "../components/Loader/Loader";
import { motion } from "framer-motion"; // Import motion from framer-motion

const MilkManProducts = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const [currentProduct, setCurrentProduct] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [imageUri, setImageUri] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/api/milkman/product");
      setAllProducts(data.products);
      console.log(data.products);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching products:", error.message);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await API.get("/api/auth/milkman/category/all");
      setCategories(res.data.categories);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };

  const handleAddEditProduct = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("name", currentProduct?.name);
    formData.append("price", currentProduct?.price);
    formData.append("category", currentProduct?.category);
    formData.append("description", currentProduct?.description);

    if (imageUri) {
      formData.append("image", imageUri);
    }

    try {
      const url = isEditMode
        ? `/api/milkman/product/${currentProduct._id}`
        : "/api/milkman/product";
      const method = isEditMode ? "put" : "post";

      await API[method](url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(`Product ${isEditMode ? "edited" : "added"} successfully`);
      fetchProducts();
      setCurrentProduct({ name: "", price: "", category: "", description: "" });
      setImageUri(null);
      setIsEditMode(false);
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Error saving product");
      console.error("Error saving product:", error.message);
    }
    setLoading(false);
  };
  const createImageUrl = (imageData, contentType) => {
    try {
      const blob = new Blob([imageData], { type: contentType || "image/jpeg" });
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error("Error creating image URL:", error);
      return null;
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      setLoading(true);
      await API.delete(`/api/milkman/product/${id}`);
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (error) {
      toast.error("Error deleting product");
      console.error("Error deleting product:", error.message);
    }
    setLoading(false);
  };
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10; // Change this number to control the number of products per page
  const totalPages = Math.ceil(allProducts.length / productsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const currentProducts = allProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  return (
    <>
      <AdminNav />
      <ToastContainer />
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50 backdrop-blur-md">
          <Loader />
        </div>
      )}
        <div className="lg:ml-64 mt-20 p-6 bg-gray-100 min-h-screen">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50 backdrop-blur-md">
          <Loader />
        </div>
      )}
      <motion.div
        className="bg-white p-6 rounded-lg shadow-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.button
          className="bg-[#40A1CB] text-white px-4 py-2 rounded mt-4"
          onClick={() => {
            setIsEditMode(false);
            setIsModalOpen(true);
          }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          Add Product
        </motion.button>

        <motion.table
          className="min-w-full mt-4 bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <thead>
            <tr className="bg-[#40A1CB] text-white text-left text-sm uppercase tracking-wider">
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Price</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Image</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {currentProducts.map((product, index) => (
              <motion.tr
                key={product._id}
                className="hover:bg-[#e6f5fb] border-t border-gray-200 transition-colors duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                <td className="px-6 py-4 font-medium">{product.name}</td>
                <td className="px-6 py-4">{product.price}</td>
                <td className="px-6 py-4">{product.category}</td>
                <td className="px-6 py-4">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-14 h-14 object-cover rounded-md border border-gray-300"
                    />
                  ) : (
                    <span className="text-sm text-gray-400 italic">
                      No Image
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 space-x-2">
                  <motion.button
                    className="bg-[#40A1CB] hover:bg-[#3185a7] text-white px-4 py-2 rounded-md text-sm shadow-sm transition"
                    onClick={() => {
                      setCurrentProduct(product);
                      setIsEditMode(true);
                      setIsModalOpen(true);
                    }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    Edit
                  </motion.button>
                  <motion.button
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm shadow-sm transition"
                    onClick={() => handleDeleteProduct(product._id)}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    Delete
                  </motion.button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </motion.table>

        {/* Pagination Controls */}
        <div className="mt-4 flex justify-between items-center">
          <motion.button
            className="bg-[#40A1CB] text-white px-6 py-2 rounded-md text-sm shadow-sm transition"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            Previous
          </motion.button>
          <p className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </p>
          <motion.button
            className="bg-[#40A1CB] text-white px-6 py-2 rounded-md text-sm shadow-sm transition"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            Next
          </motion.button>
        </div>
      </motion.div>
    </div>


      {isModalOpen && (
        <motion.div
          className="fixed inset-0 backdrop-blur-sm  bg-opacity-50 flex justify-center items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="bg-white p-6 rounded-lg shadow-lg w-96"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-lg font-semibold mb-4">
              {isEditMode ? "Edit Product" : "Add Product"}
            </h3>
            <input
              type="text"
              placeholder="Name"
              value={currentProduct.name}
              onChange={(e) =>
                setCurrentProduct({ ...currentProduct, name: e.target.value })
              }
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="number"
              placeholder="Price"
              value={currentProduct.price}
              onChange={(e) =>
                setCurrentProduct({ ...currentProduct, price: e.target.value })
              }
              className="w-full mb-2 p-2 border rounded"
            />
            <select
              value={currentProduct.category}
              onChange={(e) =>
                setCurrentProduct({
                  ...currentProduct,
                  category: e.target.value,
                })
              }
              className="w-full mb-2 p-2 border rounded text-[#40A1CB] border-[#40A1CB] focus:ring-2 focus:ring-[#40A1CB] focus:outline-none"
            >
              <option value="" className="text-gray-500">
                Select Category
              </option>
              {categories.map((cat, idx) => (
                <option key={idx} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
            <textarea
              placeholder="Description"
              value={currentProduct.description}
              onChange={(e) =>
                setCurrentProduct({
                  ...currentProduct,
                  description: e.target.value,
                })
              }
              className="w-full mb-2 p-2 border rounded"
            ></textarea>
            <input
              type="file"
              onChange={(e) => setImageUri(e.target.files[0])}
              className="w-full mb-2"
            />
            <div className="flex justify-end">
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded mr-2"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-[#40A1CB] text-white px-4 py-2 rounded"
                onClick={handleAddEditProduct}
              >
                {isEditMode ? "Update" : "Add"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default MilkManProducts;
