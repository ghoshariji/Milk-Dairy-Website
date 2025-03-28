import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaGooglePlusG } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-6 px-4 md:px-16 text-gray-700 text-center md:text-left">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
        {/* Logo Section */}
        <div className="flex items-center space-x-2">
          <img src="https://via.placeholder.com/40" alt="Logo" className="w-10 h-10" />
          <div>
            <h2 className="text-[#40A1CB] font-bold text-lg">Hallo Dairy</h2>
            <p className="text-xs">DELIVERY ON DEMAND</p>
          </div>
        </div>

        {/* Links Section */}
        <div className="flex space-x-6 my-4 md:my-0 text-sm">
          <a href="#" className="hover:text-green-600">About</a>
          <a href="#" className="text-[#40A1CB] font-semibold">Terms & Conditions</a>
          <a href="#" className="hover:text-green-600">Privacy Policy</a>
          <a href="#" className="hover:text-green-600">Contact</a>
        </div>

        {/* Social Media Icons */}
        <div className="flex space-x-4 text-[#40A1CB] text-lg">
          <a href="#" className="hover:text-[#40A1CB]"><FaFacebookF /></a>
          <a href="#" className="hover:text-[#40A1CB]"><FaTwitter /></a>
          <a href="#" className="hover:text-[#40A1CB]"><FaInstagram /></a>
          <a href="#" className="hover:text-[#40A1CB]"><FaGooglePlusG /></a>
        </div>
      </div>
      
      {/* Copyright Text */}
      <p className="text-sm text-gray-500 mt-4 text-center">Copyright &copy; 2021 Deonde.</p>
    </footer>
  );
};

export default Footer;