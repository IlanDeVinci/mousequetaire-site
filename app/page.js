"use client";

import Image from "next/image";
import dynamic from "next/dynamic";

// Import the wind animation with no SSR since it uses browser APIs
const WindAnimationInitializer = dynamic(
  () => import("../components/WindAnimation"),
  { ssr: false }
);

export default function Home() {
  return (
    <>
      <section className="relative min-h-[90vh] flex items-center bg-[#002132] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#002132]/90 to-[#006A9E]/20 z-10" />

        {/* Wind Animation SVG - make it responsive and contained */}
        <svg
          className="wind-svg absolute inset-0 w-full h-full overflow-hidden"
          preserveAspectRatio="xMidYMid slice"
          style={{ maxWidth: "100vw" }}
        ></svg>

        <div className="container mx-auto px-4 relative z-20">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 animate-fade-in">
              Bienvenue à Mousequetaire
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 animate-fade-in-delayed">
              Votre partenaire pour des solutions informatiques sur mesure.
            </p>
            <a
              href="/services"
              className="inline-block px-8 py-4 text-lg font-semibold text-white bg-[#006A9E] 
                         rounded-full hover:bg-[#0085c7] hover:shadow-lg shadow-[#006A9E]/50
                         transform hover:-translate-y-1 transition-all duration-300"
            >
              Découvrez nos services
            </a>
          </div>
        </div>
        <WindAnimationInitializer />
      </section>
    </>
  );
}
