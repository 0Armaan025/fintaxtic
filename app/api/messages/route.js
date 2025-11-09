import { NextResponse } from "next/server";
import { connectDB } from "../../lib/mongodb";
import Message from "../../models/Message";

export async function POST(req) {
  try {
    await connectDB();

    const { name, email, msg } = await req.json();

    if (!name || !email || !msg) {
      return NextResponse.json(
        { error: "All fields (name, email, msg) are required." },
        { status: 400 },
      );
    }

    const newMessage = await Message.create({ name, email, msg });

    return NextResponse.json(
      { message: "Message stored successfully!", data: newMessage },
      { status: 201 },
    );
  } catch (error) {
    console.error("❌ Error storing message:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    await connectDB();

    const messages = await Message.find().sort({ createdAt: -1 });

    return NextResponse.json({ messages }, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching messages:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
