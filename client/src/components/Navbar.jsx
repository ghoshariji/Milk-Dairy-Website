import React, { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi"; // Import icons for menu and close

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-white shadow-md relative">
      {/* Logo */}
      <h1 className="text-2xl font-bold text-[#40A1CB]">Hallo Dairy</h1>

      {/* Desktop Menu */}
      <ul className="hidden md:flex space-x-6 text-gray-600">
        <li className="hover:text-green-500 cursor-pointer">Home</li>
        <li className="hover:text-green-500 cursor-pointer">About</li>
        <li className="hover:text-green-500 cursor-pointer">Contact</li>
      </ul>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-gray-600 text-2xl focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FiX /> : <FiMenu />}
      </button>

      {/* Mobile Menu */}
      {isOpen && (
        <ul className="absolute top-14 left-0 w-full bg-white shadow-md flex flex-col space-y-4 p-6 text-gray-600 md:hidden">
          <li
            className="hover:text-green-500 hover:bg-gray-100 px-4 py-2 cursor-pointer transition-all duration-300"
            onClick={() => setIsOpen(false)}
          >
            Home
          </li>
          <li
            className="hover:text-green-500 hover:bg-gray-100 px-4 py-2 cursor-pointer transition-all duration-300"
            onClick={() => setIsOpen(false)}
          >
            About
          </li>
          <li
            className="hover:text-green-500 hover:bg-gray-100 px-4 py-2 cursor-pointer transition-all duration-300"
            onClick={() => setIsOpen(false)}
          >
            Contact
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
