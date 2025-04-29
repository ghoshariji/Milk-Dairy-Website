import React, { useEffect, useState } from "react";
import AdminNav from "../components/Sidebar/Sidebar";
import Loader from "../components/Loader/Loader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Authentication from "../utils/Authentication";
import axios from "axios";
import { motion } from "framer-motion";
import API from "../api";

const MilkManSetRateGlobal = () => {
  const [loading, setLoading] = useState(false);
  const [milkRates, setMilkRates] = useState([]);
  const [form, setForm] = useState({ milkType: "", snf: "", wnf: "" });
  const [editId, setEditId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const token = localStorage.getItem("token");

  const fetchMilkRates = async () => {
    try {
      setLoading(true);
      const { data } = await API.get(`/api/milk-rate/user?token=${token}`);
      setMilkRates(data.data || []);
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Failed to fetch milk rates"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMilkRates();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm({ milkType: "", snf: "", wnf: "" });
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.milkType.trim() || !form.snf || !form.wnf) {
      toast.error("All fields are required");
      return;
    }

    try {
      setLoading(true);
      if (editId) {
        await API.put(`/api/milk-rate/update/${editId}`, { ...form, token });
        toast.success("Milk rate updated successfully");
      } else {
        await API.post("/api/milk-rate/add", { ...form, token });
        toast.success("Milk rate added successfully");
      }
      resetForm();
      fetchMilkRates();
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (rate) => {
    setForm({ milkType: rate.milkType, snf: rate.snf, wnf: rate.wnf });
    setEditId(rate._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;

    try {
      setLoading(true);
      await API.delete(`/api/milk-rate/delete/${id}?token=${token}`);
      toast.success("Milk rate deleted successfully");
      fetchMilkRates();
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Failed to delete milk rate"
      );
    } finally {
      setLoading(false);
    }
  };

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = milkRates.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(milkRates.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="flex">
      <AdminNav />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />
      <Authentication />

      {loading && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50 backdrop-blur-md">
          <Loader />
        </div>
      )}

      <div className="p-6 w-full lg:ml-64 mt-20">
        {/* Form Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <h2 className="text-2xl font-bold mb-4">
            {editId ? "Edit Milk Rate" : "Add Milk Rate"}
          </h2>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <input
              type="text"
              name="milkType"
              placeholder="Milk Type (e.g., Cow, Buffalo)"
              className="border p-2 rounded"
              value={form.milkType}
              onChange={handleChange}
            />
            <input
              type="number"
              name="snf"
              step="0.01"
              placeholder="SNF"
              className="border p-2 rounded"
              value={form.snf}
              onChange={handleChange}
            />
            <input
              type="number"
              name="wnf"
              step="0.01"
              placeholder="WNF"
              className="border p-2 rounded"
              value={form.wnf}
              onChange={handleChange}
            />
            <button
              type="submit"
              className="bg-[#40A1CB] hover:cursor-pointer text-white p-2 rounded col-span-1 md:col-span-3"
            >
              {editId ? "Update Milk Rate" : "Add Milk Rate"}
            </button>
          </form>
        </motion.div>

        {/* Table Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <h2 className="text-2xl font-bold mb-4">Milk Rates List</h2>
          {milkRates.length === 0 ? (
            <p className="text-gray-600 text-center">
              No milk rates available.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-100 text-gray-700">
                    <th className="p-3">Milk Type</th>
                    <th className="p-3">SNF</th>
                    <th className="p-3">WNF</th>
                    <th className="p-3">Rate</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((rate, index) => (
                    <motion.tr
                      key={rate._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b text-center"
                    >
                      <td className="p-2">{rate.milkType}</td>
                      <td className="p-2">{rate.snf}</td>
                      <td className="p-2">{rate.wnf}</td>
                      <td className="p-2">{rate.rate?.toFixed(2) || "N/A"}</td>
                      <td className="p-2 flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(rate)}
                          className="bg-[#40A1CB] hover:cursor-pointer text-white px-3 py-1 rounded transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(rate._id)}
                          className="bg-gray-500 hover:cursor-pointer text-white px-3 py-1 rounded transition"
                        >
                          Delete
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 gap-2">
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-3 py-1 rounded ${
                    currentPage === index + 1
                      ? "bg-[#40A1CB] text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default MilkManSetRateGlobal;
