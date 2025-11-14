"use client";
import React, { useEffect, useRef } from "react";

const RickrollLanding = () => {
  const audioRef = useRef(null);

  useEffect(() => {
    // Auto-play audio when component mounts
    if (audioRef.current) {
      audioRef.current.play().catch((err) => {
        console.log("Autoplay prevented:", err);
      });
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black">
      {/* Hidden audio element */}
      <audio ref={audioRef} loop className="hidden">
        <source
          src="https://cdn.jsdelivr.net/gh/TheOdinProject/curriculum@main/foundations/javascript_basics/DOM_manipulation_and_events/imgs/02.mp3"
          type="audio/mpeg"
        />
      </audio>

      {/* Rickroll Video */}
      <div className="w-full max-w-4xl px-4">
        <div className="relative" style={{ paddingBottom: "56.25%" }}>
          <iframe
            className="absolute top-0 left-0 w-full h-full rounded-lg shadow-2xl"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=0&loop=1&playlist=dQw4w9WgXcQ&controls=0"
            title="Never Gonna Give You Up"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>

      {/* Classic Rickroll Text */}
      <div className="mt-8 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 animate-pulse">
          Never Gonna Give You Up
        </h1>
        <p className="text-xl md:text-2xl text-gray-300">
          You just got rickrolled! 🎵
        </p>
      </div>

      {/* Dancing Emoji */}
      <div className="mt-8 text-6xl animate-bounce">🕺</div>
    </div>
  );
};

export default RickrollLanding;
