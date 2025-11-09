"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Poppins } from "next/font/google";
import { Menu, X } from "lucide-react";

const poppinsFont = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
});

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className={`relative w-full flex items-center justify-between px-6 sm:px-10 py-4 border-b border-gray-200 bg-white ${poppinsFont.className}`}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2">
        {/* optional logo image */}
        {/* <img src="/logo.png" alt="logo" className="w-7 h-7" /> */}
        <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">
          Fintaxtic
        </h2>
      </Link>

      {/* Desktop Nav */}
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

      {/* Mobile Toggle */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden text-gray-700 focus:outline-none"
      >
        {menuOpen ? <X size={26} /> : <Menu size={26} />}
      </button>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="absolute top-[70px] left-0 w-full bg-white border-t border-gray-200 flex flex-col items-center py-4 space-y-4 md:hidden shadow-md z-50">
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="text-gray-700 hover:text-gray-900 transition"
          >
            Home
          </Link>
          <Link
            href="/about"
            onClick={() => setMenuOpen(false)}
            className="text-gray-700 hover:text-gray-900 transition"
          >
            About
          </Link>
          <Link
            href="/#pricing"
            onClick={() => setMenuOpen(false)}
            className="text-gray-700 hover:text-gray-900 transition"
          >
            Pricing
          </Link>
          <Link
            href="/contact"
            onClick={() => setMenuOpen(false)}
            className="text-gray-700 hover:text-gray-900 transition"
          >
            Contact
          </Link>
          <Link href="/dashboard" onClick={() => setMenuOpen(false)}>
            <button className="bg-black cursor-pointer px-6 py-2 rounded-lg text-white hover:bg-gray-800 transition">
              Dashboard
            </button>
          </Link>
        </div>
      )}
    </header>
  );
};

export default Navbar;
