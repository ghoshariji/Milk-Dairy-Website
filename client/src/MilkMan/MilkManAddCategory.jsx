import React, { useState, useEffect } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import AdminNav from "../components/Sidebar/Sidebar";
import API from "../api";

const MilkManAddCategory = () => {
  const [categories, setCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

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

  const addCategory = async () => {
    try {
      await API.post("/api/auth/milkman/category/add", { name: categoryName });
      fetchCategories();
      setModalOpen(false);
      setCategoryName("");
    } catch (error) {
      console.error("Error adding category", error);
    }
  };

  const editCategory = async () => {
    if (!selectedCategory) return;
    try {
      await API.put(`/api/auth/milkman/category/edit/${selectedCategory._id}`, {
        name: categoryName,
      });
      fetchCategories();
      setEditModalOpen(false);
      setCategoryName("");
      setSelectedCategory(null);
    } catch (error) {
      console.error("Error editing category", error);
    }
  };

  const deleteCategory = async (categoryId) => {
    try {
      await API.delete(`/api/auth/milkman/category/delete/${categoryId}`);
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category", error);
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <AdminNav />

      {/* Main Content */}
      <div className="p-6 w-full lg:ml-64 mt-20">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Manage Categories</h2>
          <button
            className="bg-[#40A1CB] hover:[#40A1CB] text-white px-4 py-2 rounded"
            onClick={() => setModalOpen(true)}
          >
            Add Category
          </button>
        </div>

        <div className="relative overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="text-xs uppercase bg-gray-100">
              <tr>
                <th className="px-6 py-3">Category Name</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category._id} className="border-b">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {category.name}
                  </td>
                  <td className="px-6 py-4 flex space-x-2">
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() => {
                        setSelectedCategory(category);
                        setCategoryName(category.name);
                        setEditModalOpen(true);
                      }}
                    >
                      <FiEdit size={20} color="#40A1CB"/>
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => deleteCategory(category._id)}
                    >
                      <FiTrash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Category Modal */}
        {modalOpen && (
          <div className="fixed inset-0 flex items-center justify-center ">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
              <h3 className="text-lg font-bold mb-4">Add Category</h3>
              <input
                type="text"
                className="border px-4 py-2 w-full mb-4 rounded"
                placeholder="Enter category name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
              />
              <div className="flex justify-end">
                <button
                  className="bg-[#40A1CB] hover:bg-[#40A1CB] text-white px-4 py-2 rounded mr-2"
                  onClick={addCategory}
                >
                  Save
                </button>
                <button
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Category Modal */}
        {editModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
              <h3 className="text-lg font-bold mb-4">Edit Category</h3>
              <input
                type="text"
                className="border px-4 py-2 w-full mb-4 rounded"
                placeholder="Edit category name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
              />
              <div className="flex justify-end">
                <button
                  className="bg-[#40A1CB] hover:bg-[#40A1CB] text-white px-4 py-2 rounded mr-2"
                  onClick={editCategory}
                >
                  Update
                </button>
                <button
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                  onClick={() => {
                    setEditModalOpen(false);
                    setSelectedCategory(null);
                    setCategoryName("");
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MilkManAddCategory;
