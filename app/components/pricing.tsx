"use client";
import React from "react";
import { Poppins } from "next/font/google";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const plans = [
  {
    name: "Starter",
    price: "Free",
    description: "Perfect for individuals exploring Fintaxtic.",
    features: [
      "Basic analytics",
      "Manual tracking",
      "1 wallet connection",
      "Email support",
    ],
    highlight: false,
  },
  {
    name: "Pro",
    price: "$9/mo",
    description: "Best for professionals who want smart automation.",
    features: [
      "All Starter features",
      "Smart budgeting",
      "Unlimited wallets",
      "Priority support",
    ],
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For teams and businesses that need scalability.",
    features: [
      "Advanced analytics",
      "Team dashboards",
      "Dedicated manager",
      "API access",
    ],
    highlight: false,
  },
];

const Pricing = () => {
  return (
    <section
      className={`py-20 px-6 bg-white border-[1.5px] border-gray-700 text-gray-800 ${poppins.className}`}
    >
      <div className="max-w-6xl mx-auto text-center mb-14">
        <h2 className="text-4xl font-bold mb-3 tracking-tight">
          Simple, Transparent Pricing
        </h2>
        <p className="text-gray-500 text-lg">
          Choose a plan that fits your goals. No hidden fees — just growth.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            viewport={{ once: true }}
            className={`border rounded-2xl p-8 flex flex-col items-center shadow-sm transition-all ${
              plan.highlight
                ? "border-gray-900 shadow-md"
                : "border-gray-200 hover:shadow-md"
            }`}
          >
            <h3
              className={`text-2xl font-semibold mb-2 ${
                plan.highlight ? "text-gray-900" : "text-gray-700"
              }`}
            >
              {plan.name}
            </h3>
            <p className="text-gray-500 mb-6 text-sm text-center max-w-xs">
              {plan.description}
            </p>
            <div className="text-4xl font-bold mb-6">{plan.price}</div>

            <ul className="w-full mb-8 space-y-3 text-gray-600">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <Check size={18} className="text-green-600" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button
              className={`w-full py-3 rounded-lg font-medium transition-all ${
                plan.highlight
                  ? "bg-gray-900 text-white hover:bg-gray-800"
                  : "border border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
            >
              {plan.highlight ? "Get Started" : "Learn More"}
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Pricing;
