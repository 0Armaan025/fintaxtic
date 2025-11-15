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
      // 🔥 Send data to MongoDB route
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
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-3xl w-full border border-gray-200 rounded-2xl shadow-sm p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Get in Touch
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Have any queries or need help with taxes? Send us a message — we’ll get
          back soon.
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

        {/* ===================== CA CONTACT SECTION ===================== */}
        <div className="mt-10 text-center text-gray-700">
          <p className="font-semibold mb-3 text-lg">
            Chartered Accountant Contact Numbers
          </p>

          <div className="space-y-2 text-base">
            <p>📞 9463411557</p>
            <p>📞 8847511401</p>
            <p>📞 6284273711</p>
          </div>
        </div>
        {/* =============================================================== */}

      </div>
    </div>
  );
}
