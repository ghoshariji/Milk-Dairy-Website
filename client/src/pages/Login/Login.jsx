import axios from "axios";
import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import login12 from "./logo_new.png";
import smalllogo from "./logo_new.png";
import Loader from "../../components/Loader/Loader";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { motion } from "framer-motion";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState({ enterCode: "", password: "" });
  const [role, setRole] = useState("customer");
  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [resetCode, setResetCode] = useState("");

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleInput = (e) => {
    setPost({ ...post, [e.target.name]: e.target.value });
  };

  const login = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const config = { headers: { "Content-Type": "application/json" } };

      let apiUrl = `${import.meta.env.VITE_SERVER}/api/auth/user/login`;
      if (role === "milkman") {
        apiUrl = `${import.meta.env.VITE_SERVER}/api/auth/milkman/login`;
      }

      const response = await axios.post(apiUrl, post, config);
      setLoading(false);


      if (response.data.message === "Login successful!") {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("name", response.data.name);
        toast.success("Login successful!");
        setTimeout(() => {
          if (role === "milkman") {
            if (post.enterCode == 98) {
              navigate("/admin-dashboard");
            } else {
              navigate("/milkman-dashboard");
            }
          } else if (response.data.userType === "Customer") {
            navigate("/customer-dashboard");
          } else if (response.data.userType === "Seller") {
            navigate("/seller-dashboard");
          }
        }, 2000);
      } else {
        toast.error(response.data.message || "Invalid credentials!");
      }
    } catch (error) {
      setLoading(false);
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
  };

  const handleForgotPassword = async () => {
    if (!resetCode) return toast.error("Please enter your code");
    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER}/api/auth/user/forgot-password`,
        { enterCode: resetCode }
      );
      toast.success(res.data.message);
      setShowModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center z-50  bg-opacity-50 backdrop-blur-md">
          <Loader />
        </div>
      )}

      <div className="flex flex-col md:flex-row min-h-screen justify-center items-center bg-white px-4 py-6">
        {/* Left Image for all screen sizes */}
        {/* Desktop Image with animation */}
        {/* Desktop Image with slide-in from left */}
        <motion.div
          className="flex-1 flex justify-center items-center hidden md:block ml-24"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <img
            src={login12}
            alt="Login Visual"
            className="w-3/4 lg:w-2/3 xl:w-1/2 object-contain"
          />
        </motion.div>

        {/* Mobile Logo with slide-in from top */}
        <motion.div
          className="md:hidden w-full flex justify-center items-center mt-4"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <img
            src={smalllogo}
            alt="Small Logo"
            className="w-1/2 max-w-xs object-contain"
          />
        </motion.div>

        {/* Login Form */}
        <motion.div
          className="flex-1 flex flex-col items-center w-full px-4 sm:px-8 md:px-12 lg:px-20 py-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <form onSubmit={login}>
              {/* Enter Code */}
              <div className="mb-6">
                <label
                  htmlFor="enterCode"
                  className="block text-base font-semibold text-gray-700 mb-1"
                >
                  Enter Code*
                </label>
                <input
                  type="text"
                  id="enterCode"
                  name="enterCode"
                  value={post.enterCode}
                  onChange={handleInput}
                  className="mt-1 w-full px-4 py-3 text-base border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-[#40A1CB] focus:border-[#40A1CB] transition"
                  placeholder="Enter your code"
                  required
                />
              </div>

              {/* Password */}
              <div className="mb-6 relative">
                <label
                  htmlFor="password"
                  className="block text-base font-semibold text-gray-700 mb-1"
                >
                  Password*
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={post.password}
                    onChange={handleInput}
                    className="mt-1 w-full px-4 py-3 text-base border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-[#40A1CB] focus:border-[#40A1CB] transition"
                    placeholder="••••••••"
                    required
                  />
                  <motion.button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-[#40A1CB] focus:outline-none sm:right-4"
                    whileTap={{ scale: 0.9 }}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="w-5 h-5 sm:w-6 sm:h-6" />
                    ) : (
                      <FaEye className="w-5 h-5 sm:w-6 sm:h-6" />
                    )}
                  </motion.button>
                </div>
              </div>

              {/* Role Selection */}
              <div className="mb-6">
                <label className="block text-base font-semibold text-gray-700 mb-2">
                  Select Role:
                </label>
                <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-3 sm:space-y-0">
                  {["customer", "seller", "milkman"].map((r) => (
                    <label
                      key={r}
                      className="flex items-center text-base cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="role"
                        value={r}
                        checked={role === r}
                        onChange={() => setRole(r)}
                        className="mr-2 accent-[#40A1CB] w-5 h-5"
                      />
                      {r.charAt(0).toUpperCase() + r.slice(1)}
                    </label>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                className="w-full py-3 px-4 text-lg font-medium bg-[#40A1CB] text-white rounded-lg hover:bg-[#3693b7] transition"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                Log in
              </motion.button>
            </form>

            {/* Footer Links */}
            <div className="mt-6 text-center space-y-3">
              <Link to="/register">
                <motion.p
                  className="text-base text-[#40A1CB] hover:underline cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                >
                  Don't have an account? Register
                </motion.p>
              </Link>
              <motion.p
                className="text-base text-[#40A1CB] hover:underline cursor-pointer"
                onClick={() => setShowModal(true)}
                whileHover={{ scale: 1.02 }}
              >
                Forgot Password?
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Forgot Password Modal */}
      {showModal && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="bg-white rounded-2xl p-6 w-96 shadow-xl border border-gray-200"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Reset Password
            </h2>
            <input
              type="text"
              placeholder="Enter your code"
              value={resetCode}
              onChange={(e) => setResetCode(e.target.value)}
              className="w-full px-3 py-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-[#40A1CB]"
            />
            <div className="flex justify-end space-x-2">
              <button
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-[#40A1CB] text-white px-4 py-2 rounded hover:bg-[#3693b7] transition"
                onClick={handleForgotPassword}
              >
                Send Link
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default Login;
