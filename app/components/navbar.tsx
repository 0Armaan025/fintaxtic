"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Poppins } from "next/font/google";
import { Menu, X } from "lucide-react"; // clean icons for open/close

const poppinsFont = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
});

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className={`w-full flex items-center justify-between px-6 sm:px-10 py-4 border-b border-gray-200 ${poppinsFont.className}`}
    >
      {/* Logo / Title */}

      <Link href="/">
        <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">
          Fintaxtic
        </h2>
      </Link>

      {/* Desktop Menu */}
      <nav className="hidden md:flex items-center space-x-6 text-gray-600 font-medium">
        <Link href="/" className="hover:text-gray-900 transition">
          Home
        </Link>
        <Link href="/about" className="hover:text-gray-900 transition">
          About
        </Link>
        <Link href="/#pricing" className="hover:text-gray-900 transition">
          Pricing
        </Link>
        <Link href="/contact" className="hover:text-gray-900 transition">
          Contact
        </Link>
        <Link href="/dashboard">
          <button className="bg-black cursor-pointer px-4 py-2 rounded-lg text-white hover:bg-gray-800 transition">
            Dashboard
          </button>
        </Link>
      </nav>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden text-gray-700 focus:outline-none"
      >
        {menuOpen ? <X size={26} /> : <Menu size={26} />}
      </button>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="absolute top-[70px] left-0 w-full bg-white border-t border-gray-200 flex flex-col items-center py-4 space-y-4 md:hidden shadow-md">
          <a
            href="#"
            className="text-gray-700 hover:text-gray-900 transition"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </a>
          <a
            href="#"
            className="text-gray-700 hover:text-gray-900 transition"
            onClick={() => setMenuOpen(false)}
          >
            About
          </a>
          <a
            href="#"
            className="text-gray-700 hover:text-gray-900 transition"
            onClick={() => setMenuOpen(false)}
          >
            Pricing
          </a>
          <a
            href="#"
            className="text-gray-700 hover:text-gray-900 transition"
            onClick={() => setMenuOpen(false)}
          >
            Contact
          </a>
          <button className="bg-black cursor-pointer px-6 py-2 rounded-lg text-white hover:bg-gray-800 transition">
            Dashboard
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
