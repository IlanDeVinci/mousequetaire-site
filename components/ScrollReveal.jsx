"use client";

import { useRef, useEffect, useState } from "react";

export default function ScrollReveal({
  children,
  threshold = 0.1,
  delay = 0,
  rootMargin = "0px",
  className = "",
  animation = "fade-up", // Options: fade-up, fade-down, fade-left, fade-right, zoom-in, zoom-out
}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // When the element is in view
        if (entry.isIntersecting && !isVisible) {
          // Wait for the delay before showing
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
        }
      },
      {
        root: null, // Use viewport as root
        rootMargin: rootMargin,
        threshold: threshold, // Trigger when 10% of the element is visible
      }
    );

    const currentElement = ref.current;

    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [threshold, delay, rootMargin, isVisible]);

  // Base classes for all animations
  const baseClasses = "transition-all duration-1000 ease-out";

  // Animation specific classes when not visible
  const animationClasses = {
    "fade-up": "opacity-0 translate-y-16",
    "fade-down": "opacity-0 -translate-y-16",
    "fade-left": "opacity-0 translate-x-16",
    "fade-right": "opacity-0 -translate-x-16",
    "zoom-in": "opacity-0 scale-95",
    "zoom-out": "opacity-0 scale-105",
  };

  return (
    <div
      ref={ref}
      className={`${baseClasses} ${
        isVisible
          ? "opacity-100 translate-x-0 translate-y-0 scale-100"
          : animationClasses[animation]
      } ${className}`}
    >
      {children}
    </div>
  );
}
