import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) throw new Error("Missing Groq API key");

    const url = "https://api.groq.com/openai/v1/chat/completions";
    const model = "llama-3.1-8b-instant"; // solid, fast, and free (for now)

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Groq API error:", errorText);
      return NextResponse.json(
        { reply: "Error: " + errorText },
        { status: res.status },
      );
    }

    const data = await res.json();
    const reply = data?.choices?.[0]?.message?.content || "No response";

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("Server error:", error.message);
    return NextResponse.json(
      { reply: "Internal server error" },
      { status: 500 },
    );
  }
}
