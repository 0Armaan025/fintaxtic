"use client";

import { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import { Mic, MicOff, Volume2, VolumeX, Play, Square } from "lucide-react";

// Reusable Equalizer Component
function AudioEqualizer({ className = "h-4" }: { className?: string }) {
  return (
    <div className={`flex items-end gap-0.5 ${className}`}>
      <span className="w-0.5 rounded-full bg-red-500 h-full animate-[ping_0.6s_ease-in-out_infinite_100ms]" />
      <span className="w-0.5 rounded-full bg-red-500 h-2/3 animate-[ping_0.6s_ease-in-out_infinite_300ms]" />
      <span className="w-0.5 rounded-full bg-red-500 h-full animate-[ping_0.6s_ease-in-out_infinite_200ms]" />
      <span className="w-0.5 rounded-full bg-red-500 h-1/2 animate-[ping_0.6s_ease-in-out_infinite_400ms]" />
    </div>
  );
}

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
  const [isListening, setIsListening] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [currentlySpeakingIndex, setCurrentlySpeakingIndex] = useState<number | null>(null);

  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "en-US";

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
          setIsListening(false);
          handleSendMessage(transcript);
        };

        recognition.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error);
          setIsListening(false);

          if (event.error === "network") {
            alert(
              "Speech recognition failed due to a network connection error. " +
              "If you are using Brave browser, enable 'Google services for speech recognition' in brave://settings/privacy."
            );
          } else if (event.error === "not-allowed") {
            alert("Microphone permission was denied. Please allow microphone access in your browser settings.");
          }
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, [remaining]);

  // Load remaining count from cookies
  useEffect(() => {
    const savedCount = Cookies.get("chatCount");
    if (savedCount) setRemaining(10 - parseInt(savedCount, 10));
  }, []);

  // Stop active speech playback
  const stopSpeech = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setCurrentlySpeakingIndex(null);
  };

  // Text-to-Speech Output Function
  const speakText = (text: string, index?: number) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    stopSpeech();

    const cleanText = text.replace(
      /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu,
      ""
    );

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    if (index !== undefined) {
      setCurrentlySpeakingIndex(index);
    }

    utterance.onend = () => setCurrentlySpeakingIndex(null);
    utterance.onerror = () => setCurrentlySpeakingIndex(null);

    window.speechSynthesis.speak(utterance);
  };

  // Toggle Microphone Input
  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Please try Chrome, Edge, or Safari.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  // Reusable Send Handler
  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const usedCount = 10 - remaining;
    if (usedCount >= 10) {
      const limitText = "🚫 You’ve hit the 10-message free limit. Upgrade to Pro for unlimited chats!";
      setMessages((prev) => [...prev, { role: "bot", text: limitText }]);
      if (autoSpeak) speakText(limitText, messages.length);
      return;
    }

    const userMessage = { role: "user", text: textToSend.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Finance relevance filter
    const financeKeywords = [
      "tax", "finance", "investment", "money", "income", "savings",
      "gst", "budget", "expense", "loan", "bank", "mutual fund", "stock", "ca"
    ];
    const isFinanceRelated = financeKeywords.some((kw) =>
      textToSend.toLowerCase().includes(kw)
    );

    if (!isFinanceRelated) {
      const rejectText = "🚫 Sorry, I can only answer finance-related questions. Please ask something about taxes, income, or savings.";
      setMessages((prev) => [...prev, { role: "bot", text: rejectText }]);
      if (autoSpeak) speakText(rejectText, messages.length);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `You are a professional financial assistant. Only answer finance-related questions briefly and clearly in 2-3 sentences.\n\nUser: ${textToSend}`,
        }),
      });

      const data = await response.json();
      const reply =
        data.reply ||
        "⚠️ Sorry, I couldn’t fetch that right now. Try again later.";

      setMessages((prev) => {
        const updated = [...prev, { role: "bot", text: reply }];
        if (autoSpeak) speakText(reply, updated.length - 1);
        return updated;
      });

      // Update Cookie Count
      const newUsed = usedCount + 1;
      Cookies.set("chatCount", String(newUsed), { expires: 7 });
      setRemaining(10 - newUsed);
    } catch (error) {
      const errText = "⚠️ Error connecting to Gemini API.";
      setMessages((prev) => [...prev, { role: "bot", text: errText }]);
      if (autoSpeak) speakText(errText, messages.length);
    }

    setLoading(false);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(input);
  };

  return (
    <div className="flex flex-col h-[80vh] max-w-3xl mx-auto border border-gray-200 rounded-2xl bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-100 p-4 flex justify-between items-center bg-gray-50/50">
        <div className="flex items-center gap-3">
          <h2 className="font-semibold text-gray-800">Fintaxtic Voice Assistant</h2>

          {/* Auto-Read Toggle Switch */}
          <button
            type="button"
            onClick={() => {
              if (autoSpeak) stopSpeech();
              setAutoSpeak(!autoSpeak);
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition ${autoSpeak
              ? "bg-green-100 text-green-700 hover:bg-green-200"
              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            title={autoSpeak ? "Auto-speak enabled" : "Auto-speak disabled"}
          >
            {autoSpeak ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-green-600" />
                <span>Auto-read On</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-gray-400" />
                <span>Auto-read Off</span>
              </>
            )}
          </button>

          {/* Header Equalizer Indicator */}
          {currentlySpeakingIndex !== null && (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-red-50 border border-red-100 text-xs text-red-600 font-medium">
              <AudioEqualizer className="h-3" />
              <span>Speaking</span>
            </div>
          )}
        </div>

        <p className="text-sm text-gray-500 font-medium">
          💬 {remaining} / 10 messages left
        </p>
      </div>

      {/* Chat Window */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex items-start gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"
              }`}
          >
            {/* Play/Stop Button + Equalizer for Bot Messages */}
            {msg.role === "bot" && (
              <div className="flex items-center gap-1.5 mt-1 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    if (currentlySpeakingIndex === i) {
                      stopSpeech();
                    } else {
                      speakText(msg.text, i);
                    }
                  }}
                  title={currentlySpeakingIndex === i ? "Stop reading" : "Listen to response"}
                  className={`p-2 rounded-full transition ${currentlySpeakingIndex === i
                    ? "bg-red-500 text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                    }`}
                >
                  {currentlySpeakingIndex === i ? (
                    <Square className="w-3.5 h-3.5 fill-current" />
                  ) : (
                    <Play className="w-3.5 h-3.5 ml-0.5 fill-current" />
                  )}
                </button>

                {currentlySpeakingIndex === i && <AudioEqualizer className="h-4" />}
              </div>
            )}

            <div
              className={`px-4 py-2.5 rounded-2xl max-w-[80%] text-sm leading-relaxed ${msg.role === "user"
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-800"
                }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-gray-400 text-sm italic">
            <span className="animate-pulse">Assistant is thinking...</span>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleFormSubmit}
        className="border-t border-gray-100 p-3 flex items-center gap-2 bg-white"
      >
        <button
          type="button"
          onClick={toggleListening}
          disabled={remaining <= 0}
          className={`p-2.5 rounded-full transition flex items-center justify-center ${isListening
            ? "bg-red-500 text-white animate-bounce"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          title={isListening ? "Listening... click to stop" : "Speak your question"}
        >
          {isListening ? (
            <MicOff className="w-5 h-5" />
          ) : (
            <Mic className="w-5 h-5" />
          )}
        </button>

        <input
          type="text"
          placeholder={
            isListening ? "Listening..." : "Ask about tax, finance, or speak..."
          }
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={remaining <= 0}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
        />

        <button
          type="submit"
          disabled={loading || remaining <= 0}
          className="px-5 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition text-sm font-medium disabled:opacity-50"
        >
          Send
        </button>
      </form>

      {/* Upgrade CTA */}
      {remaining <= 0 && (
        <div className="text-center p-3 border-t text-sm bg-gray-50 text-gray-600">
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
