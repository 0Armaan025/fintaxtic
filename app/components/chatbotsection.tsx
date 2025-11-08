"use client";

import { useState } from "react";

export default function ChatbotSection() {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "👋 Hey! I’m Fintaxtic Assistant. Ask me anything about finance, tax, or investments.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: any) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // ❌ Block unrelated topics
    const financeKeywords = [
      "tax",
      "finance",
      "investment",
      "money",
      "income",
      "savings",
      "gst",
      "budget",
      "expense",
      "loan",
    ];
    const isFinanceRelated = financeKeywords.some((kw) =>
      input.toLowerCase().includes(kw),
    );

    if (!isFinanceRelated) {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "🚫 Sorry, I can only answer finance-related questions. Please ask something about taxes, income, or savings.",
        },
      ]);
      return;
    }

    setLoading(true);

    try {
      // 🧩 Replace this with your actual Gemini API call
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `You are a professional financial assistant. Only answer finance-related questions briefly and clearly.\n\nUser: ${input}`,
        }),
      });

      const data = await response.json();
      const reply =
        data.reply ||
        "Sorry, I couldn’t fetch that right now. Try again later.";

      setMessages((prev) => [...prev, { role: "bot", text: reply }]);
    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "⚠️ Error connecting to Gemini API." },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col h-[80vh] max-w-3xl mx-auto border border-gray-200 rounded-2xl bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-gray-100 p-4 font-semibold text-gray-800">
        Fintaxtic Chatbot
      </div>

      {/* Chat Window */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-4 py-2 rounded-2xl max-w-[80%] text-sm ${
                msg.role === "user"
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="text-gray-500 text-sm italic">Thinking...</div>
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={handleSend}
        className="border-t border-gray-100 p-3 flex items-center gap-2"
      >
        <input
          type="text"
          placeholder="Ask about tax, finance, investments..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-900"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}
