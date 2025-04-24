import React, { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className="w-full bg-white shadow px-6 py-4 flex justify-between items-center relative z-30">
      {/* Logo */}
      <div className="text-xl sm:text-2xl font-extrabold text-[#40A1CB]">
        Hallo Dairy
      </div>

      {/* Desktop Menu */}
      <nav className="hidden md:flex space-x-6 text-base font-medium">
        <a href="#home" className="text-[#40A1CB] border-b-2 border-[#40A1CB]">
          Home
        </a>
        <a
          href="#about"
          className="hover:text-[#40A1CB] transition-colors duration-200"
        >
          About
        </a>
        <a
          href="#contact"
          className="hover:text-[#40A1CB] transition-colors duration-200"
        >
          Contact
        </a>
        <a
          href="#coupon"
          className="hover:text-[#40A1CB] transition-colors duration-200"
        >
          Coupon
        </a>
        <a
          href="/login"
          className="hover:text-[#40A1CB] transition-colors duration-200"
        >
          Login
        </a>
      </nav>

      {/* Toggle Button */}
      <button
        className="md:hidden text-3xl text-[#40A1CB] focus:outline-none z-40"
        onClick={handleToggle}
      >
        {isOpen ? <FiX /> : <FiMenu />}
      </button>

      {/* Slide-in Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:hidden z-30 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <ul className="flex flex-col space-y-6 p-6 text-base font-medium mt-16">
          <li>
            <a
              href="#home"
              onClick={closeMenu}
              className="text-[#40A1CB] border-b-2 border-[#40A1CB]"
            >
              Home
            </a>
          </li>
          <li>
            <a
              href="#about"
              onClick={closeMenu}
              className="hover:text-[#40A1CB] transition duration-200"
            >
              About
            </a>
          </li>
          <li>
            <a
              href="#contact"
              onClick={closeMenu}
              className="hover:text-[#40A1CB] transition duration-200"
            >
              Contact
            </a>
          </li>
          <li>
            <a
              href="#coupon"
              onClick={closeMenu}
              className="hover:text-[#40A1CB] transition duration-200"
            >
              Coupon
            </a>
          </li>
          <li>
            <a
              href="/login"
              onClick={closeMenu}
              className="hover:text-[#40A1CB] transition duration-200"
            >
              Login
            </a>
          </li>
        </ul>
      </div>

      {/* Backdrop when menu is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 md:hidden z-20"
          onClick={closeMenu}
        />
      )}
    </header>
  );
};

export default Navbar;
  