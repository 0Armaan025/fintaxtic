import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { connectDB } from "../../../lib/mongodb";
import User from "../../../models/User";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials", // might later scale to other auth options if I get time
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();

        const user = await User.findOne({ email: credentials.email });
        if (!user) {
          console.log("❌ No user found");
          return null; // returning null triggers 401
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password,
        );
        if (!isValid) {
          console.log("❌ Wrong password");
          return null;
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/auth" },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
