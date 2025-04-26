// import React, { useEffect, useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { FaEye, FaEyeSlash } from "react-icons/fa";
// import { toast, ToastContainer } from "react-toastify";
// import Loader from "../../components/Loader/Loader";
// import register12 from "../../pages/images/login.png";
// import { motion } from "framer-motion";

// const Register = () => {
//   const navigate = useNavigate();
//   const [role, setRole] = useState("customer");

//   const [form, setForm] = useState({
//     name: "",
//     phone: "",
//     email: "",
//     upiId: "",
//     village: "",
//     enterCode: "",
//     subcriptionCode: "",
//     password: "",
//     userType: role,
//     milkman: null,
//   });

//   const [milkmen, setMilkmen] = useState([]);
//   const [filteredMilkmen, setFilteredMilkmen] = useState([]);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [searchText, setSearchText] = useState("");

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const getLocationAndFetch = () => {
//     if (!navigator.geolocation) {
//       setError("Geolocation is not supported.");
//       return;
//     }

//     navigator.geolocation.getCurrentPosition(
//       async (position) => {
//         const { latitude, longitude } = position.coords;
//         try {
//           const res = await fetch(
//             `${
//               import.meta.env.VITE_SERVER
//             }/api/auth/milkman/get-all/${latitude}/${longitude}`
//           );
//           const data = await res.json();
//           setMilkmen(data.milkmen || []);
//           setFilteredMilkmen(data.milkmen || []);
//         } catch (err) {
//           setError("Failed to fetch milkmen.");
//         }
//       },
//       () => setError("Unable to retrieve location.")
//     );
//   };
//   const getCurrentLocation = () => {
//     return new Promise((resolve, reject) => {
//       if (!navigator.geolocation) {
//         setError("Geolocation is not supported.");
//         reject(new Error("Geolocation is not supported."));
//         return;
//       }

//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const { latitude, longitude, accuracy } = position.coords;
//           resolve({ latitude, longitude, accuracy });
//         },
//         () => {
//           setError("Unable to retrieve location.");
//           reject(new Error("Unable to retrieve location."));
//         }
//       );
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);
//     const location = await getCurrentLocation();
//     const updatedForm = {
//       ...form,
//       location, // Add the location object containing latitude and longitude
//     };
//     const apiUrl =
//       role === "milkman"
//         ? `${import.meta.env.VITE_SERVER}/api/auth/milkman/register`
//         : `${import.meta.env.VITE_SERVER}/api/auth/user/register`;
//     try {
//       const res = await fetch(apiUrl, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(updatedForm),
//       });

//       const result = await res.json();
//       if (!res.ok) throw new Error(result.message || "Registration failed");

//       toast.success("Registration successful!");
//       setTimeout(() => navigate("/login"), 1500);
//     } catch (err) {
//       toast.error(err.message);
//       console.log("Error" + error);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     getLocationAndFetch();
//   }, []);
//   const [showPassword, setShowPassword] = useState(false);

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   useEffect(() => {
//     const filtered = milkmen.filter((milkman) =>
//       milkman.name.toLowerCase().includes(searchText.toLowerCase())
//     );
//     setFilteredMilkmen(filtered);
//   }, [searchText]);

//   return (
//     <>
//       <ToastContainer />
//       {loading && (
//         <div className="fixed inset-0 flex items-center justify-center z-50  bg-opacity-50 backdrop-blur-md">
//           <Loader />
//         </div>
//       )}

//       <div className="flex-1 flex justify-center items-center w-full px-4 sm:px-8 md:px-12 overflow-hidden">
//         <div className="hidden lg:block w-full lg:w-1/2 mb-6 lg:mb-0 justify-center">
//           <img
//             src={register12}
//             alt="Register"
//             className="w-[50%] max-w-sm h-auto object-cover rounded-lg shadow-lg"
//           />
//         </div>

//         <div className="hidden md:block lg:hidden w-full md:w-1/2 mb-6 lg:mb-0 justify-center">
//           <img
//             src={register12}
//             alt="Register"
//             className="w-[50%] max-w-sm h-auto object-cover rounded-lg shadow-lg"
//           />
//         </div>

//         <div className="w-full max-w-4xl bg-white p-6 rounded-xl shadow-md">
//           <div className="w-full flex justify-center mb-6 sm:block md:hidden lg:hidden overflow-hidden">
//             <img
//               src={register12}
//               alt="Register"
//               className="w-[50%] max-w-sm h-auto object-cover rounded-lg shadow-lg"
//             />
//           </div>

//           <h2 className="text-4xl font-bold mb-6 text-[#40A1CB] text-center">
//             Welcome Hallo Dairy 👋
//           </h2>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {/* Name */}
//               <div>
//                 <label
//                   htmlFor="name"
//                   className="block text-sm font-medium text-gray-700"
//                 >
//                   Enter Name*
//                 </label>
//                 <input
//                   type="text"
//                   id="name"
//                   name="name"
//                   value={form.name}
//                   onChange={handleChange}
//                   className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:ring focus:border-indigo-500 sm:text-sm"
//                   placeholder="Enter your Name*"
//                   required
//                 />
//               </div>

//               {/* Phone */}
//               <div>
//                 <label
//                   htmlFor="phone"
//                   className="block text-sm font-medium text-gray-700"
//                 >
//                   Enter Phone*
//                 </label>
//                 <input
//                   type="text"
//                   id="phone"
//                   name="phone"
//                   value={form.phone}
//                   onChange={handleChange}
//                   className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:ring focus:border-indigo-500 sm:text-sm"
//                   placeholder="Enter your Phone*"
//                   required
//                 />
//               </div>

//               {/* Email */}
//               <div>
//                 <label
//                   htmlFor="email"
//                   className="block text-sm font-medium text-gray-700"
//                 >
//                   Enter Email*
//                 </label>
//                 <input
//                   type="text"
//                   id="email"
//                   name="email"
//                   value={form.email}
//                   onChange={handleChange}
//                   className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:ring focus:border-indigo-500 sm:text-sm"
//                   placeholder="Enter your Email*"
//                   required
//                 />
//               </div>

//               {/* Password */}
//               <div className="relative">
//                 <label
//                   htmlFor="password"
//                   className="block text-sm font-medium text-gray-700"
//                 >
//                   Password*
//                 </label>
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   id="password"
//                   name="password"
//                   value={form.password}
//                   onChange={handleChange}
//                   className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:ring focus:border-indigo-500 sm:text-sm"
//                   placeholder="••••••••"
//                   required
//                 />
//                 <button
//                   type="button"
//                   onClick={togglePasswordVisibility}
//                   className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
//                 >
//                   {showPassword ? (
//                     <FaEyeSlash className="w-5 h-5" />
//                   ) : (
//                     <FaEye className="w-5 h-5" />
//                   )}
//                 </button>
//               </div>

//               {/* UPI ID */}
//               <div>
//                 <label
//                   htmlFor="upiId"
//                   className="block text-sm font-medium text-gray-700"
//                 >
//                   Enter UPI ID*
//                 </label>
//                 <input
//                   type="text"
//                   id="upiId"
//                   name="upiId"
//                   value={form.upiId}
//                   onChange={handleChange}
//                   className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:ring focus:border-indigo-500 sm:text-sm"
//                   placeholder="Enter your UPI ID*"
//                   required
//                 />
//               </div>

//               {/* Village */}
//               <div>
//                 <label
//                   htmlFor="village"
//                   className="block text-sm font-medium text-gray-700"
//                 >
//                   Enter Village*
//                 </label>
//                 <input
//                   type="text"
//                   id="village"
//                   name="village"
//                   value={form.village}
//                   onChange={handleChange}
//                   className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:ring focus:border-indigo-500 sm:text-sm"
//                   placeholder="Enter your Village*"
//                   required
//                 />
//               </div>

//               {/* Code */}
//               <div>
//                 <label
//                   htmlFor="enterCode"
//                   className="block text-sm font-medium text-gray-700"
//                 >
//                   Enter Code (e.g., 123)*
//                 </label>
//                 <input
//                   type="text"
//                   id="enterCode"
//                   name="enterCode"
//                   value={form.enterCode}
//                   onChange={handleChange}
//                   className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:ring focus:border-indigo-500 sm:text-sm"
//                   placeholder="Enter your Code*"
//                   required
//                 />
//               </div>

//               {/* Subscription Code */}
//               <div>
//                 <label
//                   htmlFor="subcriptionCode"
//                   className="block text-sm font-medium text-gray-700"
//                 >
//                   Enter Subscription Code
//                 </label>
//                 <input
//                   type="text"
//                   id="subcriptionCode"
//                   name="subcriptionCode"
//                   value={form.subcriptionCode}
//                   onChange={handleChange}
//                   className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:ring focus:border-indigo-500 sm:text-sm"
//                   placeholder="Optional code"
//                 />
//               </div>
//             </div>

//             {/* Select Milkman */}
//             {role !== "milkman" && (
//               <div className="mt-4">
//                 <button
//                   type="button"
//                   onClick={() => setModalOpen(true)}
//                   className="bg-[#40A1CB] text-white w-full py-2 rounded-lg hover:bg-[#3690b5] hover:cursor-pointer"
//                 >
//                   {form.milkman
//                     ? `Selected: ${form.milkman.name}`
//                     : "Select Milkman"}
//                 </button>
//               </div>
//             )}

//             {/* Select Role */}
//             <div className="mt-4">
//               <label className="text-sm font-medium text-gray-700">
//                 Select Role:
//               </label>
//               <div className="flex space-x-4 mt-2">
//                 {["customer", "seller", "milkman"].map((r) => (
//                   <label key={r} className="flex items-center">
//                     <input
//                       type="radio"
//                       name="role"
//                       value={r}
//                       checked={role === r}
//                       onChange={() => setRole(r)}
//                       className="mr-2"
//                     />
//                     {r.charAt(0).toUpperCase() + r.slice(1)}
//                   </label>
//                 ))}
//               </div>
//             </div>

//             {/* Submit */}
//             <button
//               type="submit"
//               className="mt-6 w-full py-2 px-4 bg-[#40A1CB] text-white rounded-md hover:bg-[#3690b5] hover:cursor-pointer"
//             >
//               {loading ? "Submitting..." : "Register"}
//             </button>

//             <Link to="/login">
//               <p className="text-sm font-medium text-[#40A1CB] mt-4 text-center hover:underline hover:cursor-pointer">
//                 Already have an account? Login
//               </p>
//             </Link>
//           </form>
//         </div>

//         {/* Modal */}
//         {modalOpen && (
//           <motion.div
//             className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex justify-center items-center z-50"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.3 }}
//           >
//             <motion.div
//               className="bg-white w-full max-w-md p-4 rounded-2xl shadow-lg border border-gray-300"
//               initial={{ y: -50, opacity: 0 }}
//               animate={{ y: 0, opacity: 1 }}
//               exit={{ y: -50, opacity: 0 }}
//               transition={{ duration: 0.4, ease: "easeOut" }}
//             >
//               <h3 className="text-lg font-bold mb-2">Select Milkman</h3>
//               <input
//                 type="text"
//                 className="w-full border p-2 rounded-lg mb-2 focus:ring-[#40A1CB] focus:border-[#40A1CB]"
//                 placeholder="Search..."
//                 value={searchText}
//                 onChange={(e) => setSearchText(e.target.value)}
//               />
//               <div className="max-h-60 overflow-y-auto space-y-2">
//                 {filteredMilkmen.length > 0
//                   ? filteredMilkmen.map((m) => (
//                       <div
//                         key={m._id}
//                         className="border p-2 rounded-lg cursor-pointer hover:bg-gray-200"
//                         onClick={() => {
//                           setForm((prev) => ({ ...prev, milkman: m }));
//                           setModalOpen(false);
//                         }}
//                       >
//                         {m.name}
//                       </div>
//                     ))
//                   : "No Milkman found in 30km radius"}
//               </div>
//               <button
//                 onClick={() => setModalOpen(false)}
//                 className="mt-4 text-sm text-[#40A1CB] hover:underline hover:cursor-pointer"
//               >
//                 Close
//               </button>
//             </motion.div>
//           </motion.div>
//         )}
//       </div>
//     </>
//   );
// };

// export default Register;

import React, { useEffect, useState } from "react";
import { FaFacebookF, FaTwitter, FaGoogle } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import { NavLink, useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { motion } from "framer-motion";
import registerImage from "../../image/register12.jpg";

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

      toast.success("Registration successful!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      toast.error(err.message);
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
    <div className="relative w-full h-screen overflow-hidden">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${registerImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          filter: "blur(4px)",
        }}
      ></div>
      <ToastContainer />
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center z-50  bg-opacity-50 backdrop-blur-md">
          <Loader />
        </div>
      )}

      <div
        style={{
          transform: "translate(-200%, -50%)", // Start off-screen (left side)
          animation: "slideIn 0.6s ease-out forwards", // Animate into center
        }}
        className="w-[95%] sm:w-[450px] md:w-[500px] lg:w-[550px] max-h-[94vh] overflow-y-auto custom-scrollbar bg-[#40A1CB]/60 backdrop-blur-md shadow-[0_10px_20px_rgba(0,0,0,0.3)] rounded-sm fixed top-1/2 left-1/2 mb-10"
      >
        <form
          onSubmit={handleSubmit}
          className="p-[30px] px-[35px] bg-white relative"
          style={{
            clipPath: "polygon(0 0, 100% 0%, 100% 90%, 0% 100%)",
          }}
        >
          {/* Fixed Heading */}
          <div className="sticky top-0 bg-white z-10 pt-4">
            <h2 className="text-3xl font-extrabold text-[#40A1CB] mb-3 text-center">
              Welcome to <span className="font-extrabold">Hello Dairy</span>
              <br />
              <span className="text-black mb-1">Register Here</span>
            </h2>
          </div>

          {/* Name */}
          <div className="relative mb-4">
            <input
              type="text"
              id="name"
              required
              placeholder=" "
              className="peer text-xs w-full bg-[#eeeeee] text-black pt-[20px] pb-[12px] px-[15px] rounded border-b-2 border-transparent focus:outline-none focus:ring-0 focus:border-[#40A1CB]"
              value={form.name}
              onChange={handleChange}
              name="name"
            />
            <label
              htmlFor="name"
              className="absolute left-[15px] top-[5px] text-[#000] text-xs font-bold transition-all duration-200 transform peer-placeholder-shown:translate-y-[3px] peer-placeholder-shown:scale-100 peer-focus:-translate-y-5 peer-focus:scale-90 peer-focus:text-[#40A1CB]"
            >
              Enter your Name <span className="text-red-500">*</span>
            </label>
            <span className="absolute left-0 bottom-0 w-full h-[2px] overflow-hidden">
              <span className="block h-[2px] bg-[#40A1CB] origin-left scale-x-0 transition-transform duration-300 ease-in-out peer-focus:scale-x-100"></span>
            </span>
          </div>

          {/* Phone */}
          <div className="relative mb-4">
            <input
              type="number"
              id="phone"
              required
              placeholder=" "
              className="peer text-xs w-full bg-[#eeeeee] text-black pt-[20px] pb-[12px] px-[15px] rounded border-b-2 border-transparent focus:outline-none focus:ring-0 focus:border-[#40A1CB]"
              value={form.phone}
              onChange={handleChange}
              name="phone"
            />
            <label
              htmlFor="phone"
              className="absolute left-[15px] top-[5px] text-[#000] text-xs font-bold transition-all duration-200 transform peer-placeholder-shown:translate-y-[3px] peer-placeholder-shown:scale-100 peer-focus:-translate-y-3.5 peer-focus:scale-90 peer-focus:text-[#40A1CB]"
            >
              Enter Phone <span className="text-red-500">*</span>
            </label>
            <span className="absolute left-0 bottom-0 w-full h-[2px] overflow-hidden">
              <span className="block h-[2px] bg-[#40A1CB] origin-left scale-x-0 transition-transform duration-300 ease-in-out peer-focus:scale-x-100"></span>
            </span>
          </div>

          {/* Email */}
          <div className="relative mb-4">
            <input
              type="text"
              id="email"
              required
              placeholder=" "
              className="peer text-xs w-full bg-[#eeeeee] text-black pt-[20px] pb-[12px] px-[15px] rounded border-b-2 border-transparent focus:outline-none focus:ring-0 focus:border-[#40A1CB]"
              value={form.email}
              onChange={handleChange}
              name="email"
            />
            <label
              htmlFor="email"
              className="absolute left-[15px] top-[5px] text-[#000] text-xs font-bold transition-all duration-200 transform peer-placeholder-shown:translate-y-[3px] peer-placeholder-shown:scale-100 peer-focus:-translate-y-3.5 peer-focus:scale-90 peer-focus:text-[#40A1CB]"
            >
              Enter Email address <span className="text-red-500">*</span>
            </label>
            <span className="absolute left-0 bottom-0 w-full h-[2px] overflow-hidden">
              <span className="block h-[2px] bg-[#40A1CB] origin-left scale-x-0 transition-transform duration-300 ease-in-out peer-focus:scale-x-100"></span>
            </span>
          </div>

          {/* Password */}
          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              required
              placeholder=" "
              name="password"
              value={form.password}
              onChange={handleChange}
              className="peer text-xs w-full bg-[#eeeeee] text-black pt-[20px] pb-[12px] px-[15px] rounded border-b-2 border-transparent focus:outline-none focus:ring-0 focus:border-[#40A1CB]"
            />
            <label
              htmlFor="password"
              className="absolute left-[15px] top-[5px] text-[#000] text-xs font-bold transition-all duration-200 transform peer-placeholder-shown:translate-y-[3px] peer-placeholder-shown:scale-100 peer-focus:-translate-y-3.5 peer-focus:scale-90 peer-focus:text-[#40A1CB]"
            >
              Password <span className="text-red-500">*</span>
            </label>
            <span className="absolute left-0 bottom-0 w-full h-[2px] overflow-hidden">
              <span className="block h-[2px] bg-[#40A1CB] origin-left scale-x-0 transition-transform duration-300 ease-in-out peer-focus:scale-x-100"></span>
            </span>
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? (
                <FaEyeSlash className="w-5 h-5" />
              ) : (
                <FaEye className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* UPI ID */}

          <div className="relative mb-4">
            <input
              type="text"
              id="upiId"
              required
              placeholder=" "
              className="peer text-xs w-full bg-[#eeeeee] text-black pt-[20px] pb-[12px] px-[15px] rounded border-b-2 border-transparent focus:outline-none focus:ring-0 focus:border-[#40A1CB]"
              value={form.upiId}
              onChange={handleChange}
              name="upiId"
            />
            <label
              htmlFor="upiId"
              className="absolute left-[15px] top-[5px] text-[#000] text-xs font-bold transition-all duration-200 transform peer-placeholder-shown:translate-y-[3px] peer-placeholder-shown:scale-100 peer-focus:-translate-y-3.5 peer-focus:scale-90 peer-focus:text-[#40A1CB]"
            >
              Enter your UPI ID <span className="text-red-500">*</span>
            </label>
            <span className="absolute left-0 bottom-0 w-full h-[2px] overflow-hidden">
              <span className="block h-[2px] bg-red-500 origin-left scale-x-0 transition-transform duration-300 ease-in-out peer-focus:scale-x-100"></span>
            </span>
          </div>

          {/* Village */}

          <div className="relative mb-4">
            <input
              type="text"
              id="village"
              name="village"
              required
              placeholder=" "
              className="peer text-xs w-full bg-[#eeeeee] text-black pt-[20px] pb-[12px] px-[15px] rounded border-b-2 border-transparent focus:outline-none focus:ring-0 focus:border-[#40A1CB]"
              value={form.village}
              onChange={handleChange}
            />
            <label
              htmlFor="village"
              className="absolute left-[15px] top-[5px] text-[#000] text-xs font-bold transition-all duration-200 transform peer-placeholder-shown:translate-y-[3px] peer-placeholder-shown:scale-100 peer-focus:-translate-y-3.5 peer-focus:scale-90 peer-focus:text-[#40A1CB]"
            >
              Enter your Village <span className="text-red-500">*</span>
            </label>
            <span className="absolute left-0 bottom-0 w-full h-[2px] overflow-hidden">
              <span className="block h-[2px] bg-red-500 origin-left scale-x-0 transition-transform duration-300 ease-in-out peer-focus:scale-x-100"></span>
            </span>
          </div>

          {/* Code */}

          <div className="relative mb-4">
            <input
              type="text"
              id="enterCode"
              name="enterCode"
              required
              placeholder=" "
              className="peer text-xs w-full bg-[#eeeeee] text-black pt-[20px] pb-[12px] px-[15px] rounded border-b-2 border-transparent focus:outline-none focus:ring-0 focus:border-[#40A1CB]"
              value={form.enterCode}
              onChange={handleChange}
            />
            <label
              htmlFor="enterCode"
              className="absolute left-[15px] top-[5px] text-[#000] text-xs font-bold transition-all duration-200 transform peer-placeholder-shown:translate-y-[3px] peer-placeholder-shown:scale-100 peer-focus:-translate-y-3.5 peer-focus:scale-90 peer-focus:text-[#40A1CB]"
            >
              Enter your Code <span className="text-red-500">*</span>
            </label>
            <span className="absolute left-0 bottom-0 w-full h-[2px] overflow-hidden">
              <span className="block h-[2px] bg-[#40A1CB] origin-left scale-x-0 transition-transform duration-300 ease-in-out peer-focus:scale-x-100"></span>
            </span>
          </div>

          {/* Subscription Code */}
          <div className="relative mb-4">
            <input
              id="subcriptionCode"
              name="subcriptionCode"
              value={form.subcriptionCode}
              onChange={handleChange}
              required
              placeholder="Optional code "
              className="peer text-xs w-full bg-[#eeeeee] text-black pt-[20px] pb-[12px] px-[15px] rounded border-b-2 border-transparent focus:outline-none focus:ring-0 focus:border-[#40A1CB]"
            />
            <label
              htmlFor="subcriptionCode"
              className="absolute left-[15px] top-[4px] text-[#000] text-xs font-bold transition-all duration-200 transform peer-placeholder-shown:translate-y-[3px] peer-placeholder-shown:scale-100 peer-focus:-translate-y-3.5 peer-focus:scale-90 peer-focus:text-[#40A1CB]"
            >
              Enter Subscription Code
            </label>
            <span className="absolute left-0 bottom-0 w-full h-[2px] overflow-hidden">
              <span className="block h-[2px] bg-[#40A1CB] origin-left scale-x-0 transition-transform duration-300 ease-in-out peer-focus:scale-x-100"></span>
            </span>
          </div>

          {/* Select Milkman */}
          {role !== "milkman" && (
            <div className="mt-4 flex justify-center">
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="inline-block cursor-pointer text-sm font-bold no-underline bg-[#eee] text-[#2c2c2c] px-[30px] py-[10px] rounded transition-all duration-200 hover:bg-[#40A1CB] hover:text-white hover:shadow-[0_20px_30px_rgba(0,0,0,0.25)]"
              >
                {form.milkman
                  ? `Selected: ${form.milkman.name}`
                  : "Select Milkman"}
              </button>
            </div>
          )}

          {/* Select Role */}
          <div className="mt-4">
            <label className="text-sm font-medium text-gray-700">
              Select Role:
            </label>
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
          <div className="text-center mb-2">
            <button
              type="submit"
              className="inline-block cursor-pointer text-sm font-bold no-underline bg-[#eee] text-[#2c2c2c] px-[30px] py-[10px] rounded transition-all duration-200 hover:bg-[#40A1CB] hover:text-white hover:shadow-[0_20px_30px_rgba(0,0,0,0.25)] mb-5 mt-2"
            >
              {loading ? "Submitting..." : "Register"}
            </button>
          </div>
        </form>

        {/* Social Signup */}
        <div className="text-center mb-5">
          <div className="text-white text-xs">Or Sign up using</div>
          <div className="flex justify-center items-center mt-2 text-xs text-[#c75a59]">
            {[FaFacebookF, FaTwitter, FaGoogle].map((Icon, idx) => (
              <div
                key={idx}
                className="h-[30px] w-[30px] mx-[8px] rounded-full bg-white cursor-pointer flex justify-center items-center shadow-[0_5px_10px_rgba(0,0,0,0.4)] transition-all duration-200 hover:shadow-[0_20px_30px_rgba(0,0,0,0.2)] hover:-translate-y-[2px] active:translate-y-0"
              >
                <Icon size={14} />
              </div>
            ))}
          </div>
        </div>

        {/* Link to Login Page */}
        <div className="text-center text-xs text-white mb-5">
          <span className="mr-1 text-xs">Already have an account?</span>
          <Link
            to="/login"
            className="text-[#c75a59] font-bold hover:underline text-[16px]"
          >
            Login
          </Link>
        </div>

        {/* Modal */}
      </div>

      <style>
        {`
        @keyframes slideIn {
          0% {
            transform: translate(-200%, -50%);
            opacity: 0;
          }
          100% {
            transform: translate(-50%, -50%);
            opacity: 1;
          }
        }
      `}
      </style>
      {modalOpen && (
        <motion.div
          className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex justify-center items-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="bg-white w-full max-w-md p-4 rounded-2xl shadow-lg border border-gray-300"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <h3 className="text-lg font-bold mb-2">Select Milkman</h3>
            <input
              type="text"
              className="w-full border p-2 rounded-lg mb-2 focus:ring-[#40A1CB] focus:border-[#40A1CB]"
              placeholder="Search..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <div className="max-h-60 overflow-y-auto space-y-2">
              {filteredMilkmen.length > 0
                ? filteredMilkmen.map((m) => (
                    <div
                      key={m._id}
                      className="border p-2 rounded-lg cursor-pointer hover:bg-gray-200"
                      onClick={() => {
                        setForm((prev) => ({ ...prev, milkman: m }));
                        setModalOpen(false);
                      }}
                    >
                      {m.name}
                    </div>
                  ))
                : "No Milkman found in 30km radius"}
            </div>
            <button
              onClick={() => setModalOpen(false)}
              className="mt-4 text-sm text-[#40A1CB] hover:underline hover:cursor-pointer"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Register;
