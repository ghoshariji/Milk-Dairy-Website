import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import logo from "../../pages/images/login.png";
import AOS from "aos"; // Import AOS
import "aos/dist/aos.css"; // Import AOS styles

const CouponComm = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize AOS
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true, // Only animate once per scroll
    });

    axios
      .get(`${import.meta.env.VITE_SERVER}/api/coupon/get`)
      .then((response) => {
        setCoupons(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching coupons", error);
        setLoading(false);
      });
  }, []);

  const isExpiringSoon = (expiryDate) => {
    const currentDate = new Date();
    const expiry = new Date(expiryDate);
    return expiry - currentDate <= 7 * 24 * 60 * 60 * 1000;
  };

  return (
    <div className="p-6 ">
      <h2 className="text-4xl font-bold text-center mb-6">Available Coupons</h2>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {coupons.map((coupon, index) => (
            <motion.div
              key={coupon._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`rounded-xl overflow-hidden shadow-md relative ${
                index % 2 === 0 ? "bg-white text-black" : "bg-black text-white"
              }`}
              data-aos="fade-up" // AOS scroll animation
              data-aos-delay={index * 100} // Stagger the animations
            >
              <div className="p-4 space-y-4 flex flex-col items-center text-center">
                <h3 className="text-3xl font-bold">10% Off</h3>
                <img src={logo} alt="ZARA Logo" className="h-6 mb-2" />
                <p
                  className={`py-2 px-4 rounded-full font-semibold ${
                    index % 2 === 0
                      ? "bg-black text-white"
                      : "bg-white text-black"
                  }`}
                >
                  Code: {coupon.code}
                </p>
                {isExpiringSoon(coupon.expiryDate) && (
                  <span className="text-red-500 font-semibold">
                    Ending Soon!
                  </span>
                )}
                <p className="text-xs mt-2">
                  Valid till {new Date(coupon.expiryDate).toLocaleDateString()}
                </p>

                {/* Adjusted the margin for the button to reduce bottom spacing */}
                <button
                  className={`mt-4 px-4 py-2 rounded-full font-semibold hover:cursor-pointer ${
                    index % 2 === 0
                      ? "bg-black text-white"
                      : "bg-white text-black"
                  }`}
                  onClick={() => navigate("/login")}
                >
                  Copy Code
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CouponComm;
