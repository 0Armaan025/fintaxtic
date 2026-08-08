"use client";

import React from "react";
import { Poppins } from "next/font/google";
import { motion } from "framer-motion";
import Link from "next/link";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const steps = [
  {
    number: "01",
    title: "Connect Accounts",
    description:
      "Securely sync your bank accounts, credit cards, and investments into a single unified dashboard.",
    icon: (
      <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Optimize Tax Amount",
    description:
      "Automatically discover missed deductions, optimize tax brackets, and reduce your overall tax liabilities.",
    icon: (
      <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "24/7 AI Chat Helpline",
    description:
      "Instant AI chatbot assistance to resolve your financial questions, tax doubts, and policy queries in real time.",
    icon: (
      <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
  {
    number: "04",
    title: "Emergency CA Connect",
    description:
      "Need immediate expert intervention? Instantly schedule 1-on-1 consultations with verified CAs via Calendly & Google Meet.",
    icon: (
      <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    number: "05",
    title: "Kids Financial Quest",
    description:
      "Teach financial literacy to kids through gamified lessons, interactive quests, level progression, and unlockable badges.",
    icon: (
      <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
  },
  {
    number: "06",
    title: "Tax Toolbox Suite",
    description:
      "Pro-level tools including document parsers, HRA calculators, capital gains estimators, and tax regime comparators.",
    icon: (
      <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
  },
];

const Landing = () => {
  return (
    <div className={`min-h-screen flex flex-col bg-white text-gray-900 ${poppins.className}`}>
      <main className="flex-grow flex flex-col items-center px-6 pt-16 pb-20">
        
        {/* Top Tag */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-100 border border-gray-300 text-gray-800 text-xs font-semibold tracking-wide mb-6"
        >
          <span className="w-2 h-2 rounded-full bg-black" />
          Finance. Simplified.
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-bold text-center mb-6 tracking-tight text-black max-w-4xl leading-tight"
        >
          Finance, Mastered. <br />
          Taxes, Simplified.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-base sm:text-lg md:text-xl text-gray-600 mb-10 max-w-2xl text-center leading-relaxed"
        >
          Fintaxtic helps you track, analyze, and optimize your money — effortlessly and intelligently with zero clutter.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex flex-wrap justify-center items-center gap-4 mb-16"
        >
          <Link href="/dashboard">
            <button className="px-8 py-3.5 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-all shadow-sm">
              Dashboard
            </button>
          </Link>
          <Link href="/about">
            <button className="px-8 py-3.5 border border-gray-300 bg-white text-gray-800 font-medium rounded-lg hover:bg-gray-100 transition-all shadow-sm">
              About
            </button>
          </Link>
        </motion.div>

        {/* Showcase Image Window */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="w-full max-w-5xl px-2 mb-28"
        >
          <div className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-2 sm:p-3 shadow-md">
            {/* Window Topbar */}
            <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-200 mb-2">
              <div className="w-3 h-3 rounded-full bg-gray-300" />
              <div className="w-3 h-3 rounded-full bg-gray-300" />
              <div className="w-3 h-3 rounded-full bg-gray-300" />
              <span className="ml-2 text-xs font-mono text-gray-400">fintaxtic.app/dashboard</span>
            </div>

            <div className="relative overflow-hidden rounded-xl bg-gray-100">
              <img
                src="/dashboard.png"
                alt="Dashboard Preview"
                className="w-full h-auto object-cover rounded-lg transition-transform duration-300 hover:scale-[1.01]"
              />
            </div>
          </div>
        </motion.div>

        {/* How Fintaxtic Works Section */}
        <section className="w-full max-w-6xl px-4 py-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-black mb-3">
              How Fintaxtic Works
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              An all-in-one ecosystem designed for seamless wealth optimization, CA support, and financial education.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {steps.map((step, idx) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="bg-gray-50 border border-gray-200 rounded-xl p-8 hover:border-gray-400 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center">
                      {step.icon}
                    </div>
                    <span className="text-2xl font-bold text-gray-400 font-mono">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-black mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
};

export default Landing;
