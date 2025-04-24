import axios from "axios";
import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import login12 from "../../pages/images/login.png";
import smalllogo from "../../pages/images/login.png";
import Loader from "../../components/Loader/Loader";
import { FaEye, FaEyeSlash } from "react-icons/fa";

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

      console.log(response.data)

      if (response.data.message === "Login successful!") {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("name",response.data.name)
        toast.success("Login successful!");

        console.log(post.enterCode)
        console.log(role)
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
        <div className="flex-1 flex justify-center items-center hidden md:block ml-24">
          {" "}
          {/* Added ml-10 to add margin on the left */}
          <img
            src={login12}
            alt="Login Visual"
            className="w-3/4 lg:w-2/3 xl:w-1/2 object-contain"
          />
        </div>

        {/* Mobile Logo */}
        <div className="md:hidden w-full flex justify-center items-center mt-4">
          <img
            src={smalllogo}
            alt="Small Logo"
            className="w-1/2 max-w-xs object-contain"
          />
        </div>

        {/* Login Form */}
        <div className="flex-1 flex flex-col items-center w-full px-4 sm:px-8 md:px-12 lg:px-20 py-8">
          <div className="w-full max-w-md">
            <form onSubmit={login}>
              <div className="mb-4">
                <label
                  htmlFor="enterCode"
                  className="block text-sm font-medium text-gray-700"
                >
                  Enter Code*
                </label>
                <input
                  type="text"
                  id="enterCode"
                  name="enterCode"
                  value={post.enterCode}
                  onChange={handleInput}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter your code"
                  required
                />
              </div>

              <div className="mb-6 relative">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password*
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={post.password}
                  onChange={handleInput}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-2/3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showPassword ? (
                    <FaEyeSlash className="w-5 h-5" />
                  ) : (
                    <FaEye className="w-5 h-5" />
                  )}
                </button>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Role:
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="role"
                      value="customer"
                      checked={role === "customer"}
                      onChange={() => setRole("customer")}
                      className="mr-2"
                    />
                    Customer
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="role"
                      value="seller"
                      checked={role === "seller"}
                      onChange={() => setRole("seller")}
                      className="mr-2"
                    />
                    Seller
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="role"
                      value="milkman"
                      checked={role === "milkman"}
                      onChange={() => setRole("milkman")}
                      className="mr-2"
                    />
                    Milkman
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 px-4 bg-[#40A1CB] text-white rounded-md hover:bg-[#3693b7] transition"
              >
                Log in
              </button>
            </form>

            <div className="mt-4 text-center space-y-2">
              <Link to="/register">
                <p className="text-sm text-[#40A1CB] hover:underline">
                  Don't have an account? Register
                </p>
              </Link>
              <p
                className="text-sm text-[#40A1CB] hover:underline cursor-pointer"
                onClick={() => setShowModal(true)}
              >
                Forgot Password?
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl p-6 w-96 shadow-xl border border-gray-200">
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
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
