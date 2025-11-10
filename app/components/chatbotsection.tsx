"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";

export default function ChatbotSection() {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "👋 Hey! I’m Fintaxtic Assistant. You can ask up to 10 finance-related questions for free.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [remaining, setRemaining] = useState(10);

  // Load remaining count from cookies
  useEffect(() => {
    const savedCount = Cookies.get("chatCount");
    if (savedCount) setRemaining(10 - parseInt(savedCount));
  }, []);

  const handleSend = async (e: any) => {
    e.preventDefault();
    if (!input.trim()) return;

    const usedCount = 5 - remaining;
    if (usedCount >= 5) {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "🚫 You’ve hit the 5-message free limit. Upgrade to Pro for unlimited chats!",
        },
      ]);
      return;
    }

    const userMessage = { role: "user", text: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Only finance questions allowed
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
        "⚠️ Sorry, I couldn’t fetch that right now. Try again later.";

      setMessages((prev) => [...prev, { role: "bot", text: reply }]);

      // Update count
      const newUsed = usedCount + 1;
      Cookies.set("chatCount", String(newUsed), { expires: 7 });
      setRemaining(5 - newUsed);
    } catch (error) {
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
      <div className="border-b border-gray-100 p-4 flex justify-between items-center">
        <h2 className="font-semibold text-gray-800">Fintaxtic Chatbot</h2>
        <p className="text-sm text-gray-500">
          💬 {remaining} / 10 messages left
        </p>
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
          disabled={remaining <= 0}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        <button
          type="submit"
          disabled={loading || remaining <= 0}
          className="px-5 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition disabled:opacity-50"
        >
          Send
        </button>
      </form>

      {/* Upgrade CTA */}
      {remaining <= 0 && (
        <div className="text-center p-4 border-t text-sm bg-gray-50">
          🚀 You’ve used your free messages.{" "}
          <span className="font-semibold text-gray-900 cursor-pointer hover:underline">
            Upgrade to Pro
          </span>{" "}
          for unlimited access.
        </div>
      )}
    </div>
  );
}
