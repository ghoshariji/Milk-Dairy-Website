import React, { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

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
      <div className="block md:hidden">
  <button
    className="text-gray-600 text-3xl focus:outline-none"
    onClick={() => setIsOpen(!isOpen)}
  >
    {isOpen ? <FiX /> : <FiMenu />}
  </button>
</div>


      {/* Mobile Menu */}
      {isOpen && (
        <ul className="absolute top-16 left-0 w-full bg-white shadow-md flex flex-col space-y-4 p-6 text-gray-600 md:hidden z-10">
          <li
            onClick={() => setIsOpen(false)}
            className="hover:text-green-500 cursor-pointer"
          >
            Home
          </li>
          <li
            onClick={() => setIsOpen(false)}
            className="hover:text-green-500 cursor-pointer"
          >
            About
          </li>
          <li
            onClick={() => setIsOpen(false)}
            className="hover:text-green-500 cursor-pointer"
          >
            Contact
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
