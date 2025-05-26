"use client";

import { useRef, useEffect, useState } from "react";
import { useGSAP } from "../context/GSAPContext";
import { useLoading } from "../context/PageLoader";

export default function ScrollReveal({
  children,
  threshold = 0.15,
  delay = 0,
  duration = 1.2,
  rootMargin = "0px",
  className = "",
  animation = "fade-up",
  stagger = false,
  distance = 80,
}) {
  const ref = useRef(null);
  const { contextReady, gsap, ScrollTrigger } = useGSAP();
  const { isLoadingComplete } = useLoading();
  const [isInitialized, setIsInitialized] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    if (
      !contextReady ||
      !gsap ||
      !ScrollTrigger ||
      !ref.current ||
      !isLoadingComplete
    ) {
      return;
    }

    const element = ref.current;

    // More sophisticated timing
    const initTimer = setTimeout(() => {
      // Define animation variants with improved parameters
      let initialVars = {};
      let animateVars = {};

      switch (animation) {
        case "fade-up":
          initialVars = {
            y: distance,
            opacity: 0,
            scale: 0.95,
            rotationX: 8,
          };
          animateVars = {
            y: 0,
            opacity: 1,
            scale: 1,
            rotationX: 0,
            ease: "power3.out",
          };
          break;
        case "fade-down":
          initialVars = {
            y: -distance,
            opacity: 0,
            scale: 0.95,
            rotationX: -8,
          };
          animateVars = {
            y: 0,
            opacity: 1,
            scale: 1,
            rotationX: 0,
            ease: "power3.out",
          };
          break;
        case "fade-left":
          initialVars = {
            x: distance,
            opacity: 0,
            scale: 0.9,
            rotationY: 15,
          };
          animateVars = {
            x: 0,
            opacity: 1,
            scale: 1,
            rotationY: 0,
            ease: "power3.out",
          };
          break;
        case "fade-right":
          initialVars = {
            x: -distance,
            opacity: 0,
            scale: 0.9,
            rotationY: -15,
          };
          animateVars = {
            x: 0,
            opacity: 1,
            scale: 1,
            rotationY: 0,
            ease: "power3.out",
          };
          break;
        case "zoom-in":
          initialVars = {
            scale: 0.7,
            opacity: 0,
            rotation: 5,
          };
          animateVars = {
            scale: 1,
            opacity: 1,
            rotation: 0,
            ease: "back.out(1.7)",
          };
          break;
        case "zoom-out":
          initialVars = {
            scale: 1.3,
            opacity: 0,
            rotation: -3,
          };
          animateVars = {
            scale: 1,
            opacity: 1,
            rotation: 0,
            ease: "power2.out",
          };
          break;
        case "slide-diagonal":
          initialVars = {
            x: distance * 0.7,
            y: distance * 0.7,
            opacity: 0,
            scale: 0.8,
            rotation: 10,
          };
          animateVars = {
            x: 0,
            y: 0,
            opacity: 1,
            scale: 1,
            rotation: 0,
            ease: "power3.out",
          };
          break;
        default:
          initialVars = { opacity: 0, y: 20 };
          animateVars = { opacity: 1, y: 0, ease: "power2.out" };
      }

      // Set initial state with transform origin for better rotations
      gsap.set(element, {
        ...initialVars,
        transformOrigin: "center center",
        willChange: "transform, opacity",
      });

      // Create main timeline
      const mainTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: element,
          start: `top bottom-=${threshold * 100}%`,
          end: "bottom top",
          toggleActions: "play none none none",
          onComplete: () => {
            setAnimationComplete(true);
            // Clean up will-change after animation
            gsap.set(element, { clearProps: "willChange" });
          },
        },
      });

      // Handle stagger for child elements
      if (stagger && element.children.length > 0) {
        // Animate parent container first
        mainTimeline.to(
          element,
          {
            opacity: 1,
            duration: 0.1,
            delay: delay / 1000,
          },
          0
        );

        // Then stagger children
        mainTimeline.fromTo(
          element.children,
          initialVars,
          {
            ...animateVars,
            duration: duration * 0.8,
            stagger: {
              amount: 0.6,
              from: "start",
              ease: "power2.out",
            },
          },
          "-=0.05"
        );
      } else {
        // Single element animation with improved timing
        mainTimeline.to(
          element,
          {
            ...animateVars,
            duration: duration,
            delay: delay / 1000,
          },
          0
        );
      }

      // Add a subtle secondary animation for enhanced smoothness
      if (animation.includes("fade")) {
        mainTimeline.to(
          element,
          {
            duration: duration * 0.3,
            ease: "none",
          },
          "-=0.8"
        );
      }

      setIsInitialized(true);

      // Cleanup function
      return () => {
        if (mainTimeline) {
          mainTimeline.kill();
        }
      };
    }, Math.max(50, delay * 0.1)); // Dynamic initialization delay

    return () => clearTimeout(initTimer);
  }, [
    contextReady,
    gsap,
    ScrollTrigger,
    animation,
    threshold,
    delay,
    duration,
    isLoadingComplete,
    stagger,
    distance,
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
