"use client";

import { useState, useEffect } from "react";
import { ArrowUpIcon } from "@heroicons/react/24/outline";
import ScrollReveal from "./ScrollReveal";
import { usePathname } from "next/navigation";

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when page is scrolled down 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <ScrollReveal
      key={`back-to-top-${pathname}`}
      animation="fade-up"
      delay={100}
    >
      <div className="relative bottom-8 left-0 right-0 flex justify-center z-50 mb-6">
        <button
          onClick={scrollToTop}
          className={`bg-[#ffffff] hover:bg-[#87D7FF] p-4 rounded-full shadow-lg transform transition-all duration-300 ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-12 pointer-events-none"
          }`}
          aria-label="Back to top"
        >
          <ArrowUpIcon className="h-12 w-12 text-black" />
        </button>
      </div>
    </ScrollReveal>
  );
}
