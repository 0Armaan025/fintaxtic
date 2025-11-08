"use client";

import { useState } from "react";

export default function ProfileSection() {
  const [name, setName] = useState("Armaan");
  const [isEditing, setIsEditing] = useState(false);
  const [plan, setPlan] = useState("Free Plan");

  const handleSave = () => {
    setIsEditing(false);
    // pretend to save (API call can go here)
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
            disabled={!isEditing}
            className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none ${
              isEditing
                ? "border-gray-400 focus:ring-2 focus:ring-gray-900"
                : "border-gray-200 bg-gray-100 cursor-not-allowed"
            }`}
          />
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="text-sm px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
            >
              Edit
            </button>
          ) : (
            <button
              onClick={handleSave}
              className="text-sm px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
            >
              Save
            </button>
          )}
        </div>
      </div>

      {/* Plan Info */}
      <div className="mb-6">
        <label className="block text-sm text-gray-600 mb-2">Current Plan</label>
        <div className="flex items-center justify-between border border-gray-200 rounded-lg p-3">
          <span className="font-medium text-gray-800">{plan}</span>
          <button
            onClick={() => setPlan("Pro Plan")}
            className="text-sm px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
          >
            Upgrade Plan
          </button>
        </div>
      </div>

      {/* Additional Info */}
      <div className="text-sm text-gray-500">
        <p>
          Manage your profile details and subscription plan. Upgrading unlocks
          premium tax optimization features.
        </p>
      </div>
    </div>
  );
}
