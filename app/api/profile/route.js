import { NextResponse } from "next/server";
import { connectDB } from "../../lib/mongodb";
import User from "../../models/User";

// 🔹 GET — fetch user profile
export async function GET(req) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email)
    return NextResponse.json({ error: "Email is required" }, { status: 400 });

  try {
    const user = await User.findOne({ email }).select("-password");
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({ user });
  } catch (error) {
    console.error("❌ GET /profile error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// 🔹 PATCH — update user profile (e.g. name)
export async function PATCH(req) {
  await connectDB();

  try {
    const { email, name, plan, planType } = await req.json();

    if (!email)
      return NextResponse.json({ error: "Email is required" }, { status: 400 });

    const user = await User.findOneAndUpdate(
      { email },
      { $set: { name, plan, planType } },
      { new: true, runValidators: true },
    ).select("-password");

    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("❌ PATCH /profile error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
