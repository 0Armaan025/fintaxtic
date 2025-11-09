import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, default: "User" },
  plan: { type: String, default: "Free" },
  planType: { type: String, default: "free 1" },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
