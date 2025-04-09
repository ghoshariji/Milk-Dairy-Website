import axios from "axios";
import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import login12 from "../../pages/images/login.png"; // Ensure the path is correct
import smalllogo from "../../pages/images/login.png";
import Loader from "../../components/Loader/Loader";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState({ enterCode: "", password: "" });
  const [role, setRole] = useState("customer");
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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
      console.log(response.data);
      if (response.data.message === "Login successful!") {
        localStorage.setItem("token", response.data.token);
        toast.success("Login successful!");
        setTimeout(() => {
          if (role === "customer") {
            navigate("/customer-dashboard");
          } else if (role === "seller") {
            navigate("/seller-dashboard");
          } else if (role === "milkman") {
            navigate("/milkman-dashboard");
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

  return (
    <>
      <ToastContainer />
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-500 bg-opacity-50 backdrop-blur-md">
          <Loader />
        </div>
      )}
      <div className="flex flex-col md:flex-row h-screen justify-center items-center">
        <div className="flex-1 flex justify-center items-center hidden sm:block ml-20">
          <img
            className="hidden sm:block w-full max-w-sm h-auto object-contain"
            src={login12}
            alt="Logo"
          />
        </div>

        <div className="sm:hidden w-full flex justify-center items-center mt-14">
          <img
            className="w-full max-w-xs h-[90%] object-contain"
            src={smalllogo}
            alt="Logo"
          />
        </div>

        <div className="flex-1 flex flex-col justify-start items-center sm:items-start px-6 sm:px-12 md:px-16 py-8 bg-white">
          <div className="w-full max-w-md mt-8 sm:mt-0">
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
              <div className="mb-4 flex flex-col space-y-2">
                <label className="text-sm font-medium text-gray-700">
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
                className="w-full py-2 px-4 bg-[#40A1CB] text-white rounded-md hover:bg-[#40A1CB]"
              >
                Log in
              </button>
            </form>
          </div>
          <Link to="/register">
            <p className="text-sm font-medium text-[#40A1CB] hover:underline hover:text-[#40A1CB] cursor-pointer transition duration-200">
              Don't have an account? Register
            </p>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Login;
