
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { name, email, message } = await req.json();
  console.log("📩 New query:", { name, email, message });
  // Send this data to your email service or database
  return NextResponse.json({ success: true });
}