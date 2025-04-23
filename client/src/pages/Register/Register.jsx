import React, { useEffect, useState } from "react";
import {  useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast,ToastContainer } from "react-toastify";
import Loader from "../../components/Loader/Loader";
import register12 from "../../pages/images/login.png"

const Register = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("customer");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    upiId: "",
    village: "",
    enterCode: "",
    subcriptionCode: "",
    password: "",
    userType: role,
    milkman: null,
  });

  const [milkmen, setMilkmen] = useState([]);
  const [filteredMilkmen, setFilteredMilkmen] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const getLocationAndFetch = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `${
              import.meta.env.VITE_SERVER
            }/api/auth/milkman/get-all/${latitude}/${longitude}`
          );
          const data = await res.json();
          setMilkmen(data.milkmen || []);
          setFilteredMilkmen(data.milkmen || []);
        } catch (err) {
          setError("Failed to fetch milkmen.");
        }
      },
      () => setError("Unable to retrieve location.")
    );
  };
  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        setError("Geolocation is not supported.");
        reject(new Error("Geolocation is not supported."));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          resolve({ latitude, longitude, accuracy });
        },
        () => {
          setError("Unable to retrieve location.");
          reject(new Error("Unable to retrieve location."));
        }
      );
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const location = await getCurrentLocation();
    const updatedForm = {
      ...form,
      location, // Add the location object containing latitude and longitude
    };
    const apiUrl =
      role === "milkman"
        ? `${import.meta.env.VITE_SERVER}/api/auth/milkman/register`
        : `${import.meta.env.VITE_SERVER}/api/auth/user/register`;
    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedForm),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Registration failed");

      toast.success("Registration successful!")
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      toast.error(err.message)
      console.log("Error" + error);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLocationAndFetch();
  }, []);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    const filtered = milkmen.filter((milkman) =>
      milkman.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredMilkmen(filtered);
  }, [searchText]);

  return (
    <>
      <ToastContainer />
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-500 bg-opacity-50 backdrop-blur-md">
          <Loader />
        </div>
      )}


<div className="flex-1 flex justify-center items-center w-full px-4 sm:px-8 md:px-12 overflow-hidden">
  <div className="hidden lg:block w-full lg:w-1/2 mb-6 lg:mb-0 justify-center">
    <img
      src={register12}
      alt="Register"
      className="w-[50%] max-w-sm h-auto object-cover rounded-lg shadow-lg"
    />
  </div>

  <div className="hidden md:block lg:hidden w-full md:w-1/2 mb-6 lg:mb-0 justify-center">
    <img
      src={register12}
      alt="Register"
      className="w-[50%] max-w-sm h-auto object-cover rounded-lg shadow-lg"
    />
  </div>

  <div className="w-full max-w-4xl bg-white p-6 rounded-xl shadow-md">
    <div className="w-full flex justify-center mb-6 sm:block md:hidden lg:hidden overflow-hidden">
      <img
        src={register12}
        alt="Register"
        className="w-[50%] max-w-sm h-auto object-cover rounded-lg shadow-lg"
      />
    </div>

    <h2 className="text-2xl font-semibold mb-6 text-center">Welcome</h2>
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Enter Name*</label>
          <input type="text" id="name" name="name" value={form.name} onChange={handleChange}
            className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:ring focus:border-indigo-500 sm:text-sm"
            placeholder="Enter your Name*" required />
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Enter Phone*</label>
          <input type="text" id="phone" name="phone" value={form.phone} onChange={handleChange}
            className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:ring focus:border-indigo-500 sm:text-sm"
            placeholder="Enter your Phone*" required />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Enter Email*</label>
          <input type="text" id="email" name="email" value={form.email} onChange={handleChange}
            className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:ring focus:border-indigo-500 sm:text-sm"
            placeholder="Enter your Email*" required />
        </div>

        {/* Password */}
        <div className="relative">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password*</label>
          <input type={showPassword ? "text" : "password"} id="password" name="password"
            value={form.password} onChange={handleChange}
            className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:ring focus:border-indigo-500 sm:text-sm"
            placeholder="••••••••" required />
          <button type="button" onClick={togglePasswordVisibility}
            className="absolute right-3 top-9 text-gray-500 hover:text-gray-700">
            {showPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
          </button>
        </div>

        {/* UPI ID */}
        <div>
          <label htmlFor="upiId" className="block text-sm font-medium text-gray-700">Enter UPI ID*</label>
          <input type="text" id="upiId" name="upiId" value={form.upiId} onChange={handleChange}
            className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:ring focus:border-indigo-500 sm:text-sm"
            placeholder="Enter your UPI ID*" required />
        </div>

        {/* Village */}
        <div>
          <label htmlFor="village" className="block text-sm font-medium text-gray-700">Enter Village*</label>
          <input type="text" id="village" name="village" value={form.village} onChange={handleChange}
            className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:ring focus:border-indigo-500 sm:text-sm"
            placeholder="Enter your Village*" required />
        </div>

        {/* Code */}
        <div>
          <label htmlFor="enterCode" className="block text-sm font-medium text-gray-700">Enter Code (e.g., 123)*</label>
          <input type="text" id="enterCode" name="enterCode" value={form.enterCode} onChange={handleChange}
            className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:ring focus:border-indigo-500 sm:text-sm"
            placeholder="Enter your Code*" required />
        </div>

        {/* Subscription Code */}
        <div>
          <label htmlFor="subcriptionCode" className="block text-sm font-medium text-gray-700">Enter Subscription Code</label>
          <input type="text" id="subcriptionCode" name="subcriptionCode" value={form.subcriptionCode} onChange={handleChange}
            className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:ring focus:border-indigo-500 sm:text-sm"
            placeholder="Optional code" />
        </div>
      </div>

      {/* Select Milkman */}
      {role !== "milkman" && (
        <div className="mt-4">
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="bg-[#40A1CB] text-white w-full py-2 rounded-lg hover:bg-[#3690b5]"
          >
            {form.milkman ? `Selected: ${form.milkman.name}` : "Select Milkman"}
          </button>
        </div>
      )}

      {/* Select Role */}
      <div className="mt-4">
        <label className="text-sm font-medium text-gray-700">Select Role:</label>
        <div className="flex space-x-4 mt-2">
          {["customer", "seller", "milkman"].map((r) => (
            <label key={r} className="flex items-center">
              <input
                type="radio"
                name="role"
                value={r}
                checked={role === r}
                onChange={() => setRole(r)}
                className="mr-2"
              />
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </label>
          ))}
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="mt-6 w-full py-2 px-4 bg-[#40A1CB] text-white rounded-md hover:bg-[#3690b5]"
      >
        {loading ? "Submitting..." : "Register"}
      </button>

      <Link to="/login">
        <p className="text-sm font-medium text-[#40A1CB] mt-4 text-center hover:underline">
          Already have an account? Login
        </p>
      </Link>
    </form>
  </div>

  {/* Modal */}
  {modalOpen && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-md p-4 rounded-xl shadow-xl">
        <h3 className="text-lg font-bold mb-2">Select Milkman</h3>
        <input
          type="text"
          className="w-full border p-2 rounded mb-2"
          placeholder="Search..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <div className="max-h-60 overflow-y-auto space-y-2">
          {filteredMilkmen.length > 0 ? (
            filteredMilkmen.map((m) => (
              <div
                key={m._id}
                className="border p-2 rounded cursor-pointer hover:bg-gray-200"
                onClick={() => {
                  setForm((prev) => ({ ...prev, milkman: m }));
                  setModalOpen(false);
                }}
              >
                {m.name}
              </div>
            ))
          ) : (
            "No Milkman found in 30km radius"
          )}
        </div>
        <button
          onClick={() => setModalOpen(false)}
          className="mt-4 text-sm text-blue-600 hover:underline"
        >
          Close
        </button>
      </div>
    </div>
  )}
</div>

    </>
  );
};

export default Register;
