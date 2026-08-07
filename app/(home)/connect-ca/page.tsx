"use client";

import React from "react";
import { Video, Calendar, ExternalLink, ShieldCheck, Clock, PhoneCall } from "lucide-react";

export default function ConnectCaPage() {
  const INSTANT_MEET_URL = "https://meet.google.com/abc-defg-hij"; // Replace with your Google Meet link
  const CALENDLY_URL = "https://calendly.com/your-ca-team/emergency-consultation"; // Replace with your scheduling link

  return (
    <div className="max-w-4xl mx-auto py-4 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r rounded-2xl p-6 md:p-8 text-white shadow-lg">
        <div className="flex items-center gap-3 text-red-200 text-sm font-semibold tracking-wide uppercase">
          <PhoneCall className="w-4 h-4 animate-pulse" />
          <span>Emergency Assistance</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold mt-2">
          Connect with a Chartered Accountant
        </h1>
        <p className="text-red-100 mt-2 max-w-xl text-sm md:text-base">
          Get real-time expert assistance for urgent tax notices, filing issues, or instant compliance queries.
        </p>
      </div>

      {/* Primary Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Instant Video Call */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl  text-black flex items-center justify-center mb-4">
              <Video className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Instant Video Call</h2>
            <p className="text-gray-600 text-sm mt-2">
              Join an immediate Google Meet session with an available CA for live consultation.
            </p>
          </div>

          <a
            href={INSTANT_MEET_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 flex items-center justify-center gap-2 w-full text-black  font-medium py-3 px-4 rounded-xl shadow transition"
          >
            <span>Join Instant Meeting</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Scheduled Session */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-gray-100 text-gray-800 flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Schedule Consultation</h2>
            <p className="text-gray-600 text-sm mt-2">
              Book a specific time slot on our calendar that fits your schedule.
            </p>
          </div>

          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 flex items-center justify-center gap-2 w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-4 rounded-xl shadow transition"
          >
            <span>Book Time Slot</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Info Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
        <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-gray-100">
          <Clock className="w-5 h-5 text-gray-500 mt-0.5" />
          <div>
            <h4 className="font-semibold text-sm text-gray-900">Operating Hours</h4>
            <p className="text-xs text-gray-500 mt-0.5">Monday to Saturday: 9:00 AM – 8:00 PM IST</p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-gray-100">
          <ShieldCheck className="w-5 h-5 text-gray-500 mt-0.5" />
          <div>
            <h4 className="font-semibold text-sm text-gray-900">Encrypted & Confidential</h4>
            <p className="text-xs text-gray-500 mt-0.5">All video calls and shared documents remain strictly private.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
