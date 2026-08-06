"use client";

import { useState } from "react";


export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          msg: form.message,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
        setForm({ name: "", email: "", message: "" });
      } else {
        const errData = await res.json();
        alert(errData.error || "Something went wrong 💀");
      }
    } catch (err) {
      console.error("Error sending message", err);
      alert("⚠️ Couldn't send message. Check console.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-3xl w-full bg-white border border-gray-200 rounded-2xl shadow p-8">

        {/* ================= HEADER ================= */}
        <h2 className="text-3xl font-semibold text-gray-900 mb-2">
          Contact Us
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Need help with taxes or want to reach our Chartered Accountant team?
          Send us a message or contact our CA directly below.
        </p>

        {/* ================= FORM ================= */}
        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Message</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-black resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        ) : (
          <div className="text-center text-green-600 text-lg py-6">
            ✅ Thanks for reaching out! We’ll get back to you shortly.
          </div>
        )}

        {/* ================= CA CONTACT SECTION ================= */}
        <div className="mt-10">
          <p className="font-semibold text-xl text-gray-900 mb-4">
            Chartered Accountant Contact Options
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Contact 1 */}
            <div className="border border-gray-200 rounded-xl p-4 text-center shadow-sm hover:shadow-md transition">
              <p className="text-sm text-gray-500">Contact 1</p>
              <p className="text-lg font-medium text-gray-800">📞 9463411557</p>
            </div>

            {/* Contact 2 */}
            <div className="border border-gray-200 rounded-xl p-4 text-center shadow-sm hover:shadow-md transition">
              <p className="text-sm text-gray-500">Contact 2</p>
              <p className="text-lg font-medium text-gray-800">📞 8847511401</p>
            </div>

            {/* Contact 3 */}
            <div className="border border-gray-200 rounded-xl p-4 text-center shadow-sm hover:shadow-md transition">
              <p className="text-sm text-gray-500">Contact 3</p>
              <p className="text-lg font-medium text-gray-800">📞 6284273711</p>
            </div>
          </div>
        </div>

        {/* ================= SUPPORT BUSINESS WHATSAPP ================= */}
        <div className="mt-10 text-center">
          <p className="text-md font-semibold text-gray-700 mb-3">
            Customer Support (Business WhatsApp)
          </p>

          <a
            href="https://wa.me/919463411557"
            target="_blank"
            className="inline-flex items-center gap-2 bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
          >
             Contact on WhatsApp
          </a>
        </div>

      </div>
    </div>
  );
}
