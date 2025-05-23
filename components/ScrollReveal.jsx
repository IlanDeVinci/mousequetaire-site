"use client";

import { useRef, useEffect, useState } from "react";
import { useGSAP } from "../context/GSAPContext";
import { useLoading } from "../context/PageLoader";

export default function ScrollReveal({
  children,
  threshold = 0.1,
  delay = 0,
  rootMargin = "0px",
  className = "",
  animation = "fade-up",
}) {
  const ref = useRef(null);
  const { contextReady, gsap, ScrollTrigger } = useGSAP();
  const { isLoadingComplete } = useLoading();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Wait for both GSAP context and loading to complete
    if (
      !contextReady ||
      !gsap ||
      !ScrollTrigger ||
      !ref.current ||
      !isLoadingComplete
    ) {
      return;
    }

    const initTimer = setTimeout(() => {
      // Define initial state based on animation type
      let initialVars = {};

      switch (animation) {
        case "fade-up":
          initialVars = { y: 64, opacity: 0 };
          break;
        case "fade-down":
          initialVars = { y: -64, opacity: 0 };
          break;
        case "fade-left":
          initialVars = { x: 64, opacity: 0 };
          break;
        case "fade-right":
          initialVars = { x: -64, opacity: 0 };
          break;
        case "zoom-in":
          initialVars = { scale: 0.95, opacity: 0 };
          break;
        case "zoom-out":
          initialVars = { scale: 1.05, opacity: 0 };
          break;
        default:
          initialVars = { opacity: 0 };
      }

      // Set initial state
      gsap.set(ref.current, initialVars);

      // Create ScrollTrigger animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ref.current,
          start: `top bottom-=${threshold * 100}%`,
          toggleActions: "play none none none",
          markers: false,
        },
      });

      // Animate to visible state
      tl.to(ref.current, {
        x: 0,
        y: 0,
        scale: 1,
        opacity: 1,
        duration: 1,
        ease: "power2.out",
        delay: delay / 1000,
      });

      setIsInitialized(true);
    }, 100); // Small delay after loading completes

    return () => clearTimeout(initTimer);
  }, [
    contextReady,
    gsap,
    ScrollTrigger,
    animation,
    threshold,
    delay,
    isLoadingComplete,
  ]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        visibility: isInitialized ? "visible" : "hidden",
      }}
    >
      {children}
    </div>
  );
}
