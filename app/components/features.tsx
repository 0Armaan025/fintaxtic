"use client";
import React from "react";
import { Poppins } from "next/font/google";
import { motion } from "framer-motion";
import { BarChart3, ShieldCheck, Zap, Wallet } from "lucide-react"; // you can swap icons anytime

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const features = [
  {
    title: "Advanced chatbot",
    description:
      "We use the gemini api and advanced data system to answer your questions :)",
    icon: <BarChart3 className="w-8 h-8 text-indigo-600" />,
  },
  {
    title: "Sessions on financial info",
    description:
      "We provide information about financial things to you with recorded videos/lectures.",
    icon: <ShieldCheck className="w-8 h-8 text-indigo-600" />,
  },
  {
    title: "Tax reducer system",
    description:
      "We allow you to check what your tax will be after reduction using Indian policies!",
    icon: <Zap className="w-8 h-8 text-indigo-600" />,
  },
];

const Features = () => {
  return (
    <section
      className={`py-20 px-8 bg-white border-t-[1.5px] border-gray-700 text-gray-800 ${poppins.className}`}
    >
      <div className="max-w-6xl mx-auto text-center mb-14">
        <h2 className="text-4xl font-bold mb-3 tracking-tight">
          Powerful Features
        </h2>
        <p className="text-gray-500 text-lg">
          Everything you need to take control of your finances — all in one
          place.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-white border cursor-pointer border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all text-left"
          >
            <div className="mb-4">{feature.icon}</div>
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
