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
        console.log(response.data);
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
              className={`rounded-xl overflow-hidden relative ${
                index % 2 === 0 ? "text-black" : "text-white"
              }`}
              data-aos="fade-up" // AOS scroll animation
              data-aos-delay={index * 100} // Stagger the animations
            >
              <div className="group relative w-80">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-950 to-slate-900 p-[1px] shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-cyan-500/25">
                  <div className="absolute inset-0 bg-gradient-to-b from-cyan-500 to-blue-500 opacity-20"></div>

                  <div className="relative rounded-2xl bg-gradient-to-b from-slate-950 to-slate-900 p-6">
                    <div className="absolute -left-16 -top-16 h-32 w-32 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/0 blur-2xl transition-all duration-500 group-hover:scale-150 group-hover:opacity-70"></div>
                    <div className="absolute -bottom-16 -right-16 h-32 w-32 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/0 blur-2xl transition-all duration-500 group-hover:scale-150 group-hover:opacity-70"></div>

                    <div className="absolute -right-[1px] -top-[1px] overflow-hidden rounded-tr-2xl">
                      <div className="absolute h-20 w-20 bg-gradient-to-r from-cyan-500 to-blue-500"></div>
                      <div className="absolute h-20 w-20 bg-slate-950/90"></div>
                      <div className="absolute right-0 top-[22px] h-[2px] w-[56px] rotate-45 bg-gradient-to-r from-cyan-500 to-blue-500"></div>
                      <span className="absolute right-1 top-1 text-[10px] font-semibold text-white">
                        POPULAR
                      </span>
                    </div>

                    <div className="relative">
                      <h3 className="text-sm font-medium uppercase tracking-wider text-[#40A1CB]">
                        Code : {coupon.code}
                      </h3>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-white">
                          {coupon.discount} %
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-slate-400">
                        Perfect for growing businesses and professionals.
                      </p>
                    </div>

                    <div className="relative mt-6 space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-500/10">
                          <svg
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            fill="none"
                            className="h-4 w-4 text-cyan-500"
                          >
                            <path
                              d="M5 13l4 4L19 7"
                              stroke-width="2"
                              stroke-linejoin="round"
                              stroke-linecap="round"
                            ></path>
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">
                            Daily Fresh Milk Delivery
                          </p>
                          <p className="text-xs text-slate-400">
                            Get fresh milk delivered to your doorstep.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-500/10">
                          <svg
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            fill="none"
                            className="h-4 w-4 text-cyan-500"
                          >
                            <path
                              d="M5 13l4 4L19 7"
                              stroke-width="2"
                              stroke-linejoin="round"
                              stroke-linecap="round"
                            ></path>
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">
                            Fast Login Experience
                          </p>
                          <p className="text-xs text-slate-400">
                            No hassle—log in with just your email.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-500/10">
                          <svg
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            fill="none"
                            className="h-4 w-4 text-cyan-500"
                          >
                            <path
                              d="M5 13l4 4L19 7"
                              stroke-width="2"
                              stroke-linejoin="round"
                              stroke-linecap="round"
                            ></path>
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">
                            Location-Based Delivery
                          </p>
                          <p className="text-xs text-slate-400">
                            Get milk delivered only from nearby trusted vendors.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-500/10">
                          <svg
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            fill="none"
                            className="h-4 w-4 text-cyan-500"
                          >
                            <path
                              d="M5 13l4 4L19 7"
                              stroke-width="2"
                              stroke-linejoin="round"
                              stroke-linecap="round"
                            ></path>
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">
                            24/7 Priority Support
                          </p>
                          <p className="text-xs text-slate-400">
                            Get help when you need it
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="relative mt-8">
                      <button
                        className="group/btn relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 p-px font-semibold text-white shadow-[0_1000px_0_0_hsl(0_0%_100%_/_0%)_inset] transition-colors hover:shadow-[0_1000px_0_0_hsl(0_0%_100%_/_2%)_inset]"
                        onClick={() => navigate("/register")}
                      >
                        <div className="relative rounded-xl bg-[#40A1CB] px-4 py-3 transition-colors group-hover/btn:bg-transparent">
                          <span className="relative flex items-center justify-center gap-2">
                            Get Started
                            <svg
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              fill="none"
                              className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1"
                            >
                              <path
                                d="M17 8l4 4m0 0l-4 4m4-4H3"
                                stroke-width="2"
                                stroke-linejoin="round"
                                stroke-linecap="round"
                              ></path>
                            </svg>
                          </span>
                        </div>
                      </button>
                    </div>

                    <div className="mt-4 flex items-center justify-center gap-2">
                      <svg
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="h-4 w-4 text-slate-400"
                      >
                        <path
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                          stroke-width="2"
                          stroke-linejoin="round"
                          stroke-linecap="round"
                        ></path>
                      </svg>
                      <span className="text-xs font-medium text-slate-400">
                        <span
                          className={
                            isExpiringSoon(coupon.expiryDate)
                              ? "text-red-400 font-bold"
                              : ""
                          }
                        >
                          Expiry{" "}
                          {new Date(coupon.expiryDate).toLocaleDateString()}
                        </span>{" "}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CouponComm;
