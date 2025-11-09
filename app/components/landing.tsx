"use client";
import React from "react";
import { Poppins } from "next/font/google";
import { motion } from "framer-motion";
import Link from "next/link";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const Landing = () => {
  return (
    <div
      className={`min-h-screen flex flex-col bg-white text-gray-800 ${poppins.className}`}
    >
      {/* Navbar */}

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center flex-grow text-center px-6">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-6xl font-bold mb-4 tracking-tight"
        >
          Finance. Simplified.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-lg md:text-xl text-gray-500 mb-8 max-w-xl leading-relaxed"
        >
          Fintaxtic helps you track, analyze, and optimize your money —
          effortlessly and intelligently.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex space-x-4"
        >
          <Link href="/dashboard">
            {" "}
            <button className="px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-all">
              Dashboard
            </button>
          </Link>
          <Link href="/about">
            <button className="px-6 py-3 border border-gray-400 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-all">
              About
            </button>
          </Link>
        </motion.div>

        {/* Illustration Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-16 w-full max-w-[85rem] h-full cursor-pointer transition-all hover:scale-105 max-h-[38rem] bg-gray-100 border border-gray-200 rounded-2xl flex items-center justify-center"
        >
          <p className="text-gray-400 font-medium">
            <img
              src="./dashboard.png"
              className="w-[80rem] h-[30rem] rounded-lg m-4"
            />
          </p>
        </motion.div>
      </main>

      {/* Footer */}
    </div>
  );
};

export default Landing;
