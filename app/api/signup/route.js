import { connectDB } from "../../lib/mongodb";
import User from "../../models/User";
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return new Response(JSON.stringify({ error: "User already exists" }), {
        status: 400,
      });

    const hashed = await bcrypt.hash(password, 10);
    const newUser = await User.create({ email, password: hashed });

    return new Response(
      JSON.stringify({ message: "User created", user: newUser }),
      { status: 201 },
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
    });
  }
}
