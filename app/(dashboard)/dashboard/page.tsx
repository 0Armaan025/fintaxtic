"use client";

import ChatbotSection from "@/app/components/chatbotsection";
import ProfileSection from "@/app/components/profile";
import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Menu } from "lucide-react";

export default function DashboardPage() {
  const [active, setActive] = useState("Profile");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: session, status } = useSession();

  const menuItems = [
    { name: "Profile" },
    { name: "Chatbot" },
    { name: "Tax Reducer" },
    { name: "Sessions" },
    { name: "Logout" },
  ];

  if (status === "loading") return <p>Loading....</p>;
  if (!session) redirect("/auth");

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Mobile Header */}
      <div className="flex md:hidden items-center justify-between bg-white p-4 shadow-sm">
        <Link href="/">
          <h1 className="text-lg font-semibold text-gray-800">Fintaxtic</h1>
        </Link>

        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          <Menu className="w-6 h-6 text-gray-700" />
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed md:static z-20 top-0 left-0 h-full md:h-auto w-64 bg-white border-r border-gray-200 flex flex-col justify-between transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div>
          <div className="p-6 border-b border-gray-100 hidden md:block">
            <h1 className="text-xl font-semibold text-gray-800">Fintaxtic</h1>
          </div>
          <nav className="mt-6">
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  setActive(item.name);
                  setSidebarOpen(false);
                }}
                className={`w-full text-left px-6 py-3 text-sm font-medium transition ${
                  active === item.name
                    ? "bg-gray-900 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {item.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4 text-xs text-gray-400 text-center border-t border-gray-100">
          © {new Date().getFullYear()} Fintaxtic
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/30 md:hidden"
        ></div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 mt-16 md:mt-0">
        <h2 className="text-2xl font-semibold mb-4">{active}</h2>

        {active === "Profile" && (
          <div className="text-gray-600">
            <ProfileSection />
          </div>
        )}

        {active === "Chatbot" && (
          <div className="text-gray-600">
            <ChatbotSection />
          </div>
        )}

        {active === "Tax Reducer" && (
          <div className="text-gray-600">
            <p>
              Use our tools and recommendations to reduce your taxable income.
            </p>
          </div>
        )}

        {active === "Sessions" && (
          <div className="text-gray-600">
            <p>Your recent sessions will appear here.</p>
          </div>
        )}

        {active === "Logout" && (
          <div className="text-gray-600">
            <p>You have been logged out successfully.</p>
          </div>
        )}
      </main>
    </div>
  );
}
