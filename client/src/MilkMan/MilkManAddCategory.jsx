import React, { useState, useEffect } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import AdminNav from "../components/Sidebar/Sidebar";
import API from "../api";
import { motion } from "framer-motion";
import Loader from "../components/Loader/Loader";
import { toast, ToastContainer } from "react-toastify";

const MilkManAddCategory = () => {
  const [categories, setCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await API.get("/api/auth/milkman/category/all");
      setLoading(false);

      setCategories(res.data.categories);
    } catch (error) {
      setLoading(false);

      console.error("Error fetching categories", error);
    }
  };

  const addCategory = async () => {
    try {
      setLoading(true);

      await API.post("/api/auth/milkman/category/add", { name: categoryName });
      setLoading(false);

      fetchCategories();

      toast.success("Category Added Successfully");
      setModalOpen(false);
      setCategoryName("");
    } catch (error) {
      setLoading(false);
      toast.error("Internal Server Error...");

      console.error("Error adding category", error);
    }
  };

  const editCategory = async () => {
    if (!selectedCategory) return;
    setLoading(true);

    try {
      await API.put(`/api/auth/milkman/category/edit/${selectedCategory._id}`, {
        name: categoryName,
      });
      toast.success("Category Edited Successfully");
      setLoading(false);

      fetchCategories();
      setEditModalOpen(false);
      setCategoryName("");
      setSelectedCategory(null);
    } catch (error) {
      setLoading(false);
      toast.error("Internal Server Error...");

      console.error("Error editing category", error);
    }
  };

  const deleteCategory = async (categoryId) => {
    try {
      setLoading(true);

      await API.delete(`/api/auth/milkman/category/delete/${categoryId}`);
      setLoading(false);

      toast.success("Category Deleted Successfully");

      fetchCategories();
    } catch (error) {
      setLoading(false);
      toast.error("Internal Server Error...");

      console.error("Error deleting category", error);
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <AdminNav />
      <ToastContainer />
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center z-50  bg-opacity-50 backdrop-blur-md">
          <Loader />
        </div>
      )}
      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="p-6 w-full lg:ml-64 mt-20"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-bold hover:text-[#40A1CB] text-[#40A1CB] transition duration-300">
            Manage Categories
          </h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="bg-[#40A1CB] hover:bg-[#3185a7] text-white px-4 py-2 rounded transition  hover:cursor-pointer"
            onClick={() => setModalOpen(true)}
          >
            Add Category
          </motion.button>
        </div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="relative overflow-x-auto bg-white shadow-md rounded-lg"
        >
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="text-xs uppercase bg-gray-100">
              <tr>
                <th className="px-6 py-3">Category Name</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <motion.tr
                  key={category._id}
                  className="border-b"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {category.name}
                  </td>
                  <td className="px-6 py-4 flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      className="text-blue-500 hover:text-blue-700 transition"
                      onClick={() => {
                        setSelectedCategory(category);
                        setCategoryName(category.name);
                        setEditModalOpen(true);
                      }}
                    >
                      <FiEdit size={20} color="#40A1CB" className="hover:cursor-pointer" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      className="text-red-500 hover:text-red-700 transition"
                      onClick={() => deleteCategory(category._id)}
                    >
                      <FiTrash2 size={20} className="hover:cursor-pointer" />
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Add Category Modal */}
        {modalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Hazy Light Gray Background with Blur */}
            <div className="absolute inset-0 bg-transparent bg-opacity-40 backdrop-blur-sm"></div>

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="relative bg-white p-6 rounded-lg shadow-xl w-full max-w-md z-10"
            >
              <h3 className="text-lg font-bold mb-4">Add Category</h3>
              <input
                type="text"
                className="border px-4 py-2 w-full mb-4 rounded focus:outline-none focus:ring-2 focus:ring-[#40A1CB] transition"
                placeholder="Enter category name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
              />
              <div className="flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="bg-[#40A1CB] hover:bg-[#3185a7]  hover:cursor-pointer text-white px-4 py-2 rounded mr-2 transition"
                  onClick={addCategory}
                >
                  Save
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="bg-gray-500 hover:bg-gray-600  hover:cursor-pointer text-white px-4 py-2 rounded transition"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Edit Category Modal */}
        {editModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Background with transparent haze and blur effect */}
            <div className="absolute inset-0 bg-transparent bg-opacity-40 backdrop-blur-sm"></div>

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="relative bg-white p-6 rounded-lg shadow-xl w-full max-w-md z-10"
            >
              <h3 className="text-lg font-bold mb-4 text-center">
                Edit Category
              </h3>

              {/* Input Field */}
              <input
                type="text"
                className="border px-4 py-2 w-full mb-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40A1CB] transition"
                placeholder="Edit category name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
              />

              {/* Button Group */}
              <div className="flex justify-between">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="bg-[#40A1CB] hover:bg-[#3185a7]  hover:cursor-pointer text-white px-6 py-2 rounded-lg transition"
                  onClick={editCategory}
                >
                  Update
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="bg-gray-500 hover:bg-gray-600  hover:cursor-pointer text-white px-6 py-2 rounded-lg transition"
                  onClick={() => {
                    setEditModalOpen(false);
                    setSelectedCategory(null);
                    setCategoryName("");
                  }}
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default MilkManAddCategory;
