"use client";
import React, { useState } from "react";
import { Poppins } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";
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
      "chatbot usage upto 5 times",
      "less priority customer service",
      "limited tax reduction criterias",
    ],
    extra:
      "Starter gives you the basic experience of the platform with limited access but enough to understand how things work.",
    highlight: false,
  },
  {
    name: "Pro",
    price: "₹149",
    description: "Best for people who wanna be aware about finance.",
    features: [
      "All features",
      "Still limited tax reducing policy criteras",
      "Priority support",
    ],
    extra:
      "Pro plan unlocks most features with better support and extended tax reduction criteria.",
    highlight: true,
  },
  {
    name: "Advanced",
    price: "₹1499",
    description: "For people who are serious about finance.",
    features: [
      "Priority support",
      "Unlimited chatbot usage",
      "Unlimited tax reductions + criteras",
      "Unlimited sessions",
      "Newsletters (upcoming)",
    ],
    extra:
      "Advanced is built for users who want maximum control, unlimited tools, and full premium benefits.",
    highlight: false,
  },
];

const Pricing = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);

  return (
    <>
      {/* ================== MODAL ================== */}
      <AnimatePresence>
        {selectedPlan && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h2 className="text-3xl font-bold mb-4">{selectedPlan.name}</h2>
              <p className="text-gray-700 mb-4">{selectedPlan.description}</p>

              <h3 className="font-semibold mb-2">Included Features:</h3>
              <ul className="space-y-2 text-gray-600 mb-4">
                {selectedPlan.features.map((f, i) => (
                  <li key={i} className="flex gap-2">
                    <Check size={18} className="text-green-600" />
                    {f}
                  </li>
                ))}
              </ul>

              <p className="text-gray-700 mb-6">{selectedPlan.extra}</p>

              <button
                onClick={() => setSelectedPlan(null)}
                className="w-full mt-4 py-3 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-all"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================== PRICING ================== */}
      <section
        id="pricing"
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
                onClick={() => setSelectedPlan(plan)}
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
    </>
  );
};

export default Pricing;
