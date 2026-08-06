"use client";
import React from "react";
import { Poppins } from "next/font/google";
import { motion } from "framer-motion";
import {
  Bot,
  FileStack,
  Gamepad2,
  Zap,
  PhoneCall,
  Scale
} from "lucide-react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const features = [
  {
    title: "AI Voice Chatbot",
    description:
      "Powered by the Gemini API and advanced data systems to answer your questions, complete with voice talk-back for full accessibility.",
    icon: <Bot className="w-8 h-8 text-indigo-600" />,
  },
  {
    title: "Smart FM Toolbox",
    description:
      "Upload documents for auto-parsing and auto-fill. Our system analyzes your data to generate a personalized financial health score.",
    icon: <FileStack className="w-8 h-8 text-indigo-600" />,
  },
  {
    title: "Tax Regime Analyzer",
    description:
      "Easily compare the old vs. new tax regimes. We calculate the differences so you know exactly which one saves you more money.",
    icon: <Scale className="w-8 h-8 text-indigo-600" />,
  },
  {
    title: "Gamified Education",
    description:
      "Level up your financial literacy! Learn about taxes and finance through interactive, gamified modules and recorded expert sessions.",
    icon: <Gamepad2 className="w-8 h-8 text-indigo-600" />,
  },
  {
    title: "Tax Reducer System",
    description:
      "We allow you to check what your tax will be after strategic reductions using the latest Indian tax policies.",
    icon: <Zap className="w-8 h-8 text-indigo-600" />,
  },
  {
    title: "Emergency CA Connect",
    description:
      "Need urgent help? Instantly book a Calendly slot or jump into a direct video meeting with a certified CA. (Coming soon)",
    icon: <PhoneCall className="w-8 h-8 text-indigo-600" />,
  },
];

const Features = () => {
  return (
    <section
      className={`py-20 px-8 bg-white border-t-[1.5px] border-gray-100 text-gray-800 ${poppins.className}`}
    >
      <div className="max-w-6xl mx-auto text-center mb-14">
        <h2 className="text-4xl font-bold mb-3 tracking-tight">
          Powerful Features
        </h2>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto">
          Everything you need to take control of your finances, parse your tax documents, and learn effortlessly — all in one place.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-white border cursor-pointer border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all text-left group hover:border-indigo-100"
          >
            <div className="mb-4 p-3 bg-indigo-50 inline-block rounded-lg group-hover:scale-110 transition-transform">
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Features;
