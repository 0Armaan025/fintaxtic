"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function ProfileSection() {
  const [email, setEmail] = useState(""); // temporary hardcoded; ideally from session
  //fixed
  const [name, setName] = useState("");
  const [plan, setPlan] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const { data: session, status } = useSession();

  if (!session) {
    return <p>please log in!</p>;
  }

  // 🔹 Fetch user data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log(session?.user);
        console.log(session?.user?.email);
        if (session?.user?.email) {
          setEmail(session.user.email);
        }
        const res = await fetch(`/api/profile?email=${session?.user?.email}`);
        const data = await res.json();

        if (data.user) {
          setName(data.user.name);
          setPlan(data.user.plan);
        } else {
          setMsg("User not found");
        }
      } catch (err) {
        setMsg("Error fetching profile");
      }
    };
    fetchProfile();
  }, [session]);

  // 🔹 Save updated profile
  const handleSave = async () => {
    setLoading(true);
    setMsg("");
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, plan }),
      });

      const data = await res.json();
      if (data.user) {
        setMsg("✅ Profile updated successfully!");
        setIsEditing(false);
      } else {
        setMsg("⚠️ Failed to update profile.");
      }
    } catch (err) {
      setMsg("❌ Error saving profile");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Upgrade plan
  const handleUpgrade = async () => {
    setLoading(true);
    setMsg("");
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, plan: "Pro Plan", planType: "pro 1" }),
      });

      const data = await res.json();
      if (data.user) {
        setPlan(data.user.plan);
        setMsg("🚀 Plan upgraded!");
      } else {
        setMsg("⚠️ Failed to upgrade plan.");
      }
    } catch (err) {
      setMsg("❌ Error upgrading plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Profile</h2>

      {/* Name Field */}
      <div className="mb-6">
        <label className="block text-sm text-gray-600 mb-2">Name</label>
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={!isEditing || loading}
            className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none ${
              isEditing
                ? "border-gray-400 focus:ring-2 focus:ring-gray-900"
                : "border-gray-200 bg-gray-100 cursor-not-allowed"
            }`}
          />
        </div>
        <br />
        {!isEditing ? (
          <>
            <button
              onClick={() => setIsEditing(true)}
              disabled={loading}
              className="text-sm px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
            >
              Edit
            </button>
          </>
        ) : (
          <button
            onClick={handleSave}
            disabled={loading}
            className="text-sm px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        )}
      </div>

      {/* Plan Info */}
      <div className="mb-6">
        <label className="block text-sm text-gray-600 mb-2">Current Plan</label>
        <div className="flex items-center justify-between border border-gray-200 rounded-lg p-3">
          <span className="font-medium text-gray-800">{plan}</span>
          <button
            onClick={handleUpgrade}
            disabled={loading || plan === "Pro Plan"}
            className="text-sm px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
          >
            {plan === "Pro Plan" ? "Upgraded" : "Upgrade Plan"}
          </button>
        </div>
      </div>

      {/* Message / Info */}
      {msg && (
        <div
          className={`text-sm mt-3 ${
            msg.includes("✅") || msg.includes("🚀")
              ? "text-green-600"
              : msg.includes("❌")
                ? "text-red-600"
                : "text-gray-600"
          }`}
        >
          {msg}
        </div>
      )}

      {/* Info */}
      <div className="text-sm text-gray-500 mt-4">
        <p>
          Manage your profile details and subscription plan. Upgrading unlocks
          premium features.
        </p>
      </div>
    </div>
  );
}
