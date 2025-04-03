"use client";

import Image from "next/image";
import React from "react";
import dynamic from "next/dynamic";

// Import the wind animation with no SSR since it uses browser APIs
const WindAnimationInitializer = dynamic(
  () => import("../components/WindAnimation"),
  { ssr: false }
);

export default function Home() {
  return (
    <>
      <section className="relative min-h-[90vh] flex items-center justify-center bg-[050610] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#050610]/90 to-[#050610]/20 z-10" />

        {/* Wind Animation SVG - make it responsive and contained */}
        <svg
          className="wind-svg absolute inset-0 w-full h-full overflow-hidden"
          preserveAspectRatio="xMidYMid slice"
          style={{ maxWidth: "100vw" }}
        ></svg>

        {/* Logo in top left */}

        <div className="container mx-auto px-4 relative z-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="absolute -top-12 left-50 z-30 opacity-70">
              <span className="text-gray-400 font-mono text-3xl">
                &lt;mouse-quetaires/&gt;
              </span>
            </div>
            <h1
              className="text-4xl md:text-6xl font-light mb-6 animate-fade-in 
                            bg-clip-text text-transparent bg-gradient-to-r from-blue-100 via-silver-200 to-gray-200
                            [text-shadow:0_0_8px_rgba(255,255,255,0.3)] animate-shimmer-fast font-Montserrat"
            >
              Créons le Futur Numérique{" "}
            </h1>

            <TypeWriter
              text="Transformation digitale. Innovation technologique. Création d'identité numérique."
              className="text-base md:text-lg text-white mb-12 font-light tracking-wide"
              speed={50}
            />
          </div>
        </div>
        <WindAnimationInitializer />
      </section>
    </>
  );
}

// TypeWriter component for the animation
function TypeWriter({ text, className, speed = 50 }) {
  const [displayText, setDisplayText] = React.useState("");
  const [index, setIndex] = React.useState(0);
  const [isComplete, setIsComplete] = React.useState(false);

  React.useEffect(() => {
    if (index < text.length) {
      const timer = setTimeout(() => {
        setDisplayText((prev) => prev + text.charAt(index));
        setIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timer);
    } else {
      setIsComplete(true);
    }
  }, [index, text, speed]);

  return (
    <p className={className}>
      {displayText}
      {!isComplete && <span className="animate-blink">|</span>}
    </p>
  );
}
