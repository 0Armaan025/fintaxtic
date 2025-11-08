"use client";

import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    // You can replace this with your own backend email API
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setSubmitted(true);
        setForm({ name: "", email: "", message: "" });
      }
    } catch (err) {
      console.error("Error sending message", err);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-3xl w-full border border-gray-200 rounded-2xl shadow-sm p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Get in Touch
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Have any queries or need help with taxes? Send us a message — we’ll
          get back soon.
        </p>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Message
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
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
          <div className="text-center text-gray-700 py-8">
            ✅ Thanks for reaching out! We’ll get back to you shortly.
          </div>
        )}

        <div className="mt-8 flex justify-center">
          <a
            href="https://wa.me/919876543210" // Replace with your WhatsApp number (with country code)
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-green-500 text-white px-5 py-2 rounded-full hover:bg-green-600 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12c0 1.87.51 3.63 1.47 5.19L2 22l4.91-1.44A9.97 9.97 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2Zm.01 18c-1.67 0-3.26-.43-4.67-1.25l-.33-.19-2.93.86.89-2.85-.22-.36A7.96 7.96 0 1 1 20 12a7.93 7.93 0 0 1-7.99 8Zm4.33-5.48c-.23-.12-1.35-.67-1.56-.75-.21-.08-.36-.12-.52.12-.16.23-.6.75-.73.9-.13.15-.27.17-.5.06-.23-.12-.95-.35-1.8-1.12a6.66 6.66 0 0 1-1.22-1.52c-.13-.23-.01-.36.1-.48.1-.1.23-.27.35-.4.12-.13.16-.23.23-.38.08-.15.04-.29-.02-.41-.06-.12-.52-1.25-.72-1.71-.19-.45-.38-.38-.52-.38h-.45c-.15 0-.4.06-.61.29-.21.23-.8.77-.8 1.88 0 1.1.81 2.17.92 2.32.12.15 1.59 2.43 3.9 3.41.55.24.98.38 1.31.49.55.17 1.06.15 1.46.09.45-.07 1.35-.55 1.54-1.08.19-.53.19-.98.13-1.08-.05-.1-.2-.15-.43-.27Z" />
            </svg>
            Contact on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
