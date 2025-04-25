import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaGooglePlusG,
} from "react-icons/fa";
import logo from "../../pages/images/login.png";
import { motion } from "framer-motion"; // Import motion

const Footer = () => {
  return (
    <footer className="bg-gray-200 py-6 px-4 md:px-16 text-gray-700">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-start gap-6 md:gap-0">
        {/* Logo & Tagline */}
        <motion.div
          className="flex items-center space-x-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <img src={logo} alt="Logo" className="w-12 h-12" />
          <div>
            <h2 className="text-[#40A1CB] font-bold text-lg">Hallo Dairy</h2>
            <p className="text-[11px] italic text-gray-500">
              Freshness at your doorstep, every single day.
            </p>
          </div>
        </motion.div>

        {/* Social Media */}
        <motion.div
          className="flex space-x-5 text-[#40A1CB] text-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <motion.a
            href="#"
            className="hover:scale-110 transition duration-300 hover:cursor-pointer"
            whileHover={{ scale: 1.1, rotate: 15 }}
          >
            <FaFacebookF size={30}/>
          </motion.a>
          <motion.a
            href="https://www.instagram.com/foxteach_offical/?hl=en"
            className="hover:scale-110 transition duration-300 hover:cursor-pointer"
            whileHover={{ scale: 1.1, rotate: 15 }}
          >
            <FaInstagram size={30}/>
          </motion.a>
          <motion.a
            href="mailto:official.foxteach@gmail.com"
            className="hover:scale-110 transition duration-300 hover:cursor-pointer"
            whileHover={{ scale: 1.1, rotate: 15 }}
          >
            <FaGooglePlusG size={30}/>
          </motion.a>
        </motion.div>
      </div>

      {/* Footer Text */}
      <motion.div
        className="mt-6 border-t border-gray-200 pt-4 text-center text-sm text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        &copy; 2025 Hallo Dairy. All rights reserved.
      </motion.div>
    </footer>
  );
};

export default Footer;
