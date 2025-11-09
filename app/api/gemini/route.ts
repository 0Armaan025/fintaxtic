import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("Missing API key");

    const model = "gemini-2.5-pro"; // use correct model
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Gemini API error:", errorText);
      return NextResponse.json(
        { reply: "Error: " + errorText },
        { status: res.status },
      );
    }

    const data = await res.json();
    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("Server error:", error.message);
    return NextResponse.json(
      { reply: "Internal server error" },
      { status: 500 },
    );
  }
}
