"use client";

import Image from "next/image";

export default function About() {
  const team = [
    {
      name: "SAMARPRATAP SINGH DHALIWAL",
      position: "CEO and Founder",
      quote: "Visionary leader driving product strategy and market entry.",
      image: "/team1.jpg",
    },
    {
      name: "HITEN SINGLA",
      position: "Co-Founder",
      quote: "Design is intelligence made visible.",
      image: "/team2.jpg",
    },
    {
      name: "AYUSH AGGARWAL",
      position: "Co-Founder",
      quote: "Expert in system design in Fintaxtic",
      image: "/team3.jpg",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-800 px-6 md:px-20 py-16">
      {/* About Section */}
      <section className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-bold mb-4">About Us</h1>
        <p className="text-lg text-gray-600">
          We{"'"}re a small team of people who actually want change and help
          people by reducing their taxes and gain some financial information :)
        </p>
      </section>

      {/* Team Section */}
      <section className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-semibold text-center mb-10">
          Meet the Team
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member) => (
            <div
              key={member.name}
              className="flex flex-col items-center text-center border rounded-2xl p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="w-32 h-32 mb-4 relative rounded-full overflow-hidden">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-top object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold">{member.name}</h3>
              <p className="text-sm text-gray-500">{member.position}</p>
              <p className="mt-3 italic text-gray-600">“{member.quote}”</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
