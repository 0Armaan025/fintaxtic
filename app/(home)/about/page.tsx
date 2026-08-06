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

  const pillars = [
    {
      title: "Tax Optimization",
      description:
        "Navigating complex tax codes to ensure you legally claim every available deduction and keep more of your hard-earned money.",
      tag: "SAVINGS",
    },
    {
      title: "Financial Empowerment",
      description:
        "Demystifying financial jargon through accessible learning modules and actionable, data-backed insights.",
      tag: "EDUCATION",
    },
    {
      title: "Smart Automation",
      description:
        "Replacing tedious manual calculations with automated parsing and intelligent regime comparison tools.",
      tag: "EFFICIENCY",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-gray-800 px-6 md:px-20 py-24 relative overflow-hidden">
      {/* Decorative background blur */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-100/50 rounded-full blur-[120px] pointer-events-none -z-10"></div>

      {/* About Section */}
      <section className="text-center max-w-3xl mx-auto mb-48">
        <div className="mb-6 flex justify-center">
          <span className="inline-block py-1 px-4 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold tracking-wider border border-blue-100 shadow-sm">
            OUR MISSION
          </span>
        </div>

        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-500 pb-2">
          About Us
        </h1>

        <p className="text-lg md:text-xl text-gray-600 leading-relaxed font-medium">
          We{"'"}re a small team of people who actually want change and help
          people by reducing their taxes and gain some financial information.
        </p>
      </section>

      {/* Core Pillars Section (Fills layout with value-driven content) */}
      <section className="max-w-5xl mx-auto mb-24 mt-48">
        <div className="text-center mb-12">

          <p className="text-gray-500 text-sm md:text-base mt-2">
            Built to simplify financial management and tax planning for everyone.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((pillar, index) => (
            <div
              key={index}
              className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-bold text-indigo-600 tracking-widest uppercase mb-3 inline-block">
                  {pillar.tag}
                </span>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {pillar.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {pillar.description}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-50 flex items-center text-xs font-semibold text-indigo-600">
                Core Focus
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section (Uncommented and Styled) */}
      {/*   <section className="max-w-6xl mx-auto"> */}
      {/*     <div className="text-center mb-16"> */}
      {/*       <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-gray-900"> */}
      {/*         Meet the Minds Behind Fintaxtic */}
      {/*       </h2> */}
      {/*       <p className="text-gray-500 text-lg"> */}
      {/*         Dedicated to simplifying your financial journey. */}
      {/*       </p> */}
      {/*     </div> */}
      {/**/}
      {/*     <div className="grid grid-cols-1 md:grid-cols-3 gap-10"> */}
      {/*       {team.map((member) => ( */}
      {/*         <div */}
      {/*           key={member.name} */}
      {/*           className="group flex flex-col items-center text-center bg-white border border-gray-100 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300" */}
      {/*         > */}
      {/*           <div className="w-40 h-40 mb-6 relative rounded-full overflow-hidden border-4 border-indigo-50 group-hover:border-indigo-100 transition-colors"> */}
      {/*             <Image */}
      {/*               src={member.image} */}
      {/*               alt={member.name} */}
      {/*               fill */}
      {/*               className="object-top object-cover" */}
      {/*             /> */}
      {/*           </div> */}
      {/*           <h3 className="text-xl font-bold text-gray-900 mb-1"> */}
      {/*             {member.name} */}
      {/*           </h3> */}
      {/*           <p className="text-sm font-semibold text-indigo-600 mb-4 uppercase tracking-wide"> */}
      {/*             {member.position} */}
      {/*           </p> */}
      {/*           <p className="text-gray-600 italic leading-relaxed"> */}
      {/*             “{member.quote}” */}
      {/*           </p> */}
      {/*         </div> */}
      {/*       ))} */}
      {/*     </div> */}
      {/*   </section> */}
    </div>
  );
}
