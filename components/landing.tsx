"use client";
import React, { useEffect, useRef, useState } from "react";

const RickrollLanding = () => {
  const audioRef = useRef(null);
  const [apologyText, setApologyText] = useState("");
  const [apologyCount, setApologyCount] = useState(0);

  useEffect(() => {
    // Auto-play audio when component mounts
    if (audioRef.current) {
      audioRef.current.play().catch((err) => {
        console.log("Autoplay prevented:", err);
      });
    }
  }, []);

  const handleApologyChange = (e) => {
    const text = e.target.value;
    const lines = text.split("\n").filter((line) => line.trim() !== "");
    const count = lines.length;

    // Evil reset at 150
    if (count === 150) {
      setApologyText("");
      setApologyCount(0);
      alert("Nice try! But you need to be MORE sorry. Starting over! 😈");
      return;
    }

    setApologyText(text);
    setApologyCount(count);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-8">
      {/* Hidden audio element */}
      <audio ref={audioRef} loop className="hidden">
        <source
          src="https://cdn.jsdelivr.net/gh/TheOdinProject/curriculum@main/foundations/javascript_basics/DOM_manipulation_and_events/imgs/02.mp3"
          type="audio/mpeg"
        />
      </audio>

      <div className="max-w-3xl w-full">
        {/* Legal Notice Header */}
        <div className="border-4 border-red-600 bg-red-50 p-8 mb-8">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-4xl font-bold text-red-600 mb-2">
              OFFICIAL WORK STOPPAGE NOTICE
            </h1>
            <p className="text-sm text-gray-600">
              Case No. OFFICIAL-ANGER-2025-001
            </p>
          </div>

          <div className="bg-white p-6 border-2 border-red-400 text-left space-y-4">
            <div>
              <p className="font-bold text-lg">TO: Team Member</p>
              <p className="font-bold text-lg">FROM: Armaan, Project Lead</p>
              <p className="font-bold text-lg">
                DATE: {new Date().toLocaleDateString()}
              </p>
              <p className="font-bold text-lg text-red-600">
                RE: IMMEDIATE WORK CESSATION
              </p>
              <p className="font-bold text-lg text-red-600">
                STATUS: OFFICIALLY ANGRY (NOT FRIENDSHIP ANGRY)
              </p>
            </div>

            <hr className="border-gray-300" />

            <div className="space-y-3 text-gray-800">
              <p className="font-semibold">
                This notice serves as OFFICIAL DOCUMENTATION that all website
                development activities have been
                <span className="text-red-600 font-bold">
                  {" "}
                  IMMEDIATELY SUSPENDED
                </span>
                .
              </p>

              <div>
                <p className="font-bold">REASON FOR ACTION:</p>
                <p className="text-xl font-bold text-red-600">INHOSPITALITY</p>
              </div>

              <div>
                <p className="font-bold">
                  VIOLATIONS INCLUDE BUT ARE NOT LIMITED TO:
                </p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Failure to maintain adequate team morale</li>
                  <li>Insufficient appreciation of project leadership</li>
                  <li>General lack of professional courtesy</li>
                  <li>Actions requiring official intervention</li>
                </ul>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4">
                <p className="font-bold">MANDATORY REMEDIATION:</p>
                <p>
                  To resume website operations, the following actions are
                  REQUIRED:
                </p>
                <ol className="list-decimal ml-6 mt-2 space-y-1">
                  <li>Issue formal apology to Armaan</li>
                  <li>Acknowledge unprofessional behavior</li>
                  <li>Demonstrate genuine remorse</li>
                  <li>
                    Watch the educational video below regarding team dynamics
                  </li>
                  <li className="font-bold text-red-600">
                    Write "I'm sorry" exactly 1,000 times below
                  </li>
                </ol>
              </div>

              <p className="text-sm italic text-gray-600 mt-4">
                This is an official notice. Take it seriously or face continued
                project suspension.
              </p>
            </div>
          </div>
        </div>

        {/* Apology Text Field */}
        <div className="border-4 border-orange-500 bg-orange-50 p-6 mb-8">
          <h2 className="text-2xl font-bold text-orange-600 mb-4 text-center">
            📝 OFFICIAL APOLOGY SUBMISSION FORM
          </h2>
          <p className="text-center mb-4 text-gray-700">
            Write "I'm sorry" on each line. You must reach exactly{" "}
            <span className="font-bold">1,000 lines</span> to unlock website
            access.
          </p>
          <div className="mb-3">
            <div className="flex justify-between items-center mb-2">
              <span
                className={`text-lg font-bold ${apologyCount >= 1000 ? "text-green-600" : "text-orange-600"}`}
              >
                Progress: {apologyCount} / 1,000 lines
              </span>
              {apologyCount >= 140 && apologyCount < 150 && (
                <span className="text-red-600 font-bold animate-pulse">
                  ⚠️ Almost there... keep going...
                </span>
              )}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className={`h-4 rounded-full transition-all duration-300 ${
                  apologyCount >= 1000 ? "bg-green-500" : "bg-orange-500"
                }`}
                style={{
                  width: `${Math.min((apologyCount / 1000) * 100, 100)}%`,
                }}
              ></div>
            </div>
          </div>
          <textarea
            value={apologyText}
            onChange={handleApologyChange}
            placeholder="I'm sorry
I'm sorry
I'm sorry
..."
            className="w-full h-64 p-4 border-2 border-orange-400 rounded font-mono text-sm resize-none focus:outline-none focus:border-orange-600"
          />
          {apologyCount >= 1000 && (
            <div className="mt-4 p-4 bg-green-100 border-2 border-green-500 rounded text-center">
              <p className="text-green-700 font-bold text-xl">
                ✅ Apology accepted! You may now resume work... maybe.
              </p>
            </div>
          )}
        </div>

        {/* Video - Direct embed */}
        <div className="border-4 border-gray-800 rounded-lg overflow-hidden shadow-2xl">
          <video
            autoPlay
            loop
            muted={false}
            controls
            className="w-full"
            onLoadStart={(e) => {
              e.target.muted = false;
              e.target.play();
            }}
          >
            <source
              src="https://cdn.jsdelivr.net/gh/TheOdinProject/curriculum@main/foundations/javascript_basics/DOM_manipulation_and_events/imgs/02.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-3xl font-bold text-gray-800 mb-2 animate-pulse">
            🎵 MANDATORY TEAM BUILDING EXERCISE 🎵
          </p>
          <p className="text-xl text-gray-600">
            Consider this your official notice.
          </p>
          <p className="text-6xl mt-4 animate-bounce">⚖️</p>
        </div>
      </div>
    </div>
  );
};

export default RickrollLanding;
