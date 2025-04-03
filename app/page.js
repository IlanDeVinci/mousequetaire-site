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
            <div className="relative">
              <h1
                className="text-4xl md:text-6xl font-light mb-6 py-2 overflow-hidden opacity-0 font-Montserrat metal-text fade-in"
                data-text="Créons le Futur Numérique"
              >
                Créons le Futur Numérique{" "}
              </h1>
            </div>

            <style jsx global>{`
              @keyframes fadeIn {
                0% {
                  opacity: 0;
                }
                100% {
                  opacity: 1;
                }
              }

              .fade-in {
                opacity: 0;
                animation: fadeIn 1.5s ease-in-out forwards;
              }

              .metal-text {
                position: relative;
                letter-spacing: 1px;
                color: #777;
                text-shadow: 0 0 2px rgba(255, 255, 255, 0.4),
                  0 0 4px rgba(255, 255, 255, 0.2);
                will-change: opacity;
              }

              /* Make sure this element doesn't inherit the fade-in opacity */
              .metal-text.fade-in {
                animation: fadeIn 1.5s ease-in-out forwards;
              }

              /* Main metal background */
              .metal-text::before {
                content: attr(data-text);
                position: absolute;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(
                  to right,
                  #777 0%,
                  #999 48%,
                  #fff 50%,
                  #999 52%,
                  #777 100%
                );
                background-size: 300% 100%;
                color: transparent;
                -webkit-background-clip: text;
                background-clip: text;
                z-index: -1;
                animation: metalShine 6s linear infinite;
              }

              @keyframes metalShine {
                0% {
                  background-position: 100% 0;
                }
                100% {
                  background-position: -200% 0;
                }
              }

              /* Moving shine overlay */
              .metal-text::after {
                content: attr(data-text);
                position: absolute;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(
                  90deg,
                  transparent 0%,
                  rgba(255, 255, 255, 0) 35%,
                  rgba(255, 255, 255, 0.8) 48%,
                  rgba(255, 255, 255, 0.9) 50%,
                  rgba(255, 255, 255, 0.8) 52%,
                  rgba(255, 255, 255, 0) 65%,
                  transparent 100%
                );
                background-size: 200% 100%;
                color: transparent;
                -webkit-background-clip: text;
                background-clip: text;
                animation: shimmer 12s ease-in-out infinite;
                z-index: 1;
              }

              @keyframes shimmer {
                0% {
                  background-position: 200% 0;
                }
                100% {
                  background-position: -200% 0;
                }
              }

              /* Subtle glow effect */
              @keyframes subtleGlow {
                0% {
                  text-shadow: 0 0 2px rgba(255, 255, 255, 0.4);
                }
                50% {
                  text-shadow: 0 0 5px rgba(255, 255, 255, 0.7);
                }
                100% {
                  text-shadow: 0 0 2px rgba(255, 255, 255, 0.4);
                }
              }
            `}</style>

            <TypeWriter
              text="Transformation digitale. Innovation technologique. Création d'identité numérique."
              className="text-base md:text-lg text-white opacity-70 mb-12 font-light tracking-wide"
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
