"use client";

import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import WindAnimationSVG, { WindAnimation } from "./WindAnimation";
import { useGSAP } from "../context/GSAPContext";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HeroSection({ children }) {
  const heroTitleRef = useRef(null);
  const neonTextRef = useRef(null);
  const heroContainerRef = useRef(null);
  const windAnimationRef = useRef(null);

  // Initialize wind animation
  useEffect(() => {
    setTimeout(() => {
      if (!window._windAnimationInstance) {
        window._windAnimationInstance = new WindAnimation();
      }
      windAnimationRef.current = window._windAnimationInstance;
    }, 1000);
    return () => {
      windAnimationRef.current = null;
    };
  }, []);

  // GSAP hero animations
  useGSAP(() => {
    const tl = gsap.timeline();

    if (neonTextRef.current) {
      gsap.fromTo(
        neonTextRef.current,
        {
          opacity: 0,
          y: -20,
          scale: 0.9,
        },
        {
          opacity: 0.7,
          y: 0,
          scale: 1,
          duration: 1.2,
          ease: "back.out(1.7)",
        }
      );
    }

    if (heroTitleRef.current) {
      gsap.fromTo(
        heroTitleRef.current,
        {
          opacity: 0,
          y: 30,
          scale: 0.95,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.5,
          delay: 0.3,
          ease: "power3.out",
        }
      );

      const shimmerTl = gsap.timeline({ repeat: -1, yoyo: true });
      shimmerTl.to(heroTitleRef.current, {
        textShadow: "0 0 8px rgba(255, 255, 255, 0.8)",
        duration: 2,
        ease: "sine.inOut",
      });
    }
  }, []);

  return (
    <section className="relative min-h-[90vh] -mt-16 flex items-center justify-center bg-[050610] overflow-hidden font-montserrat">
      {/* Wind Animation SVG */}
      <div className="absolute inset-0 h-full">
        <WindAnimationSVG />
      </div>

      <div
        className="container mx-auto px-4 relative z-20"
        ref={heroContainerRef}
      >
        <div className="max-w-4xl mx-auto text-center">
          <div
            className="absolute -top-2 md:-top-12 left-4 md:left-50 z-30"
            ref={neonTextRef}
          >
            <span
              className="neon-blue-text text-lg md:text-3xl"
              data-text="&lt;mouse-quetaire/&gt;"
            >
              &lt;mouse-quetaire/&gt;
            </span>
          </div>
          <div className="relative mt-8 z-30">
            <h1
              ref={heroTitleRef}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light mb-6 overflow-hidden font-Montserrat metal-text max-w-full"
              data-text="Créons le Futur Numérique"
            >
              <span className="block text-center whitespace-normal px-2">
                Créons le Futur Numérique
              </span>
            </h1>
          </div>

          {/* Children slot for TypeWriter and other content */}
          {children}
        </div>
      </div>
    </section>
  );
}
