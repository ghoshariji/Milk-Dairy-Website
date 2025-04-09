import React, { useState, useEffect } from "react";
import AdminNav from "../components/Sidebar/Sidebar";
import API from "../api";
import { toast, ToastContainer } from "react-toastify";

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

  return (
    <>
      <AdminNav />
      <ToastContainer />
      <div className="lg:ml-64 mt-20 p-6 bg-gray-100 min-h-screen">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-[#40A1CB]">
            Milkman Products
          </h3>
          <button
            className="bg-[#40A1CB] text-white px-4 py-2 rounded mt-4"
            onClick={() => {
              setIsEditMode(false);
              setIsModalOpen(true);
            }}
          >
            Add Product
          </button>

          <table className="min-w-full mt-4 bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Price</th>
                <th className="border px-4 py-2">Category</th>
                <th className="border px-4 py-2">Image</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allProducts.map((product) => (
                <tr key={product._id} className="border">
                  <td className="px-4 py-2">{product.name}</td>
                  <td className="px-4 py-2">{product.price}</td>
                  <td className="px-4 py-2">{product.category}</td>
                  <td className="px-4 py-2">
                    {" "}
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    ) : (
                      "No Image"
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      className="bg-[#40A1CB] text-white px-3 py-1 rounded mr-2"
                      onClick={() => {
                        setCurrentProduct(product);
                        setIsEditMode(true);
                        setIsModalOpen(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-black text-white px-3 py-1 rounded"
                      onClick={() => handleDeleteProduct(product._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
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
              className="w-full mb-2 p-2 border rounded"
            >
              <option value="">Select Category</option>
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
          </div>
        </div>
      )}
    </>
  );
};

export default MilkManProducts;
