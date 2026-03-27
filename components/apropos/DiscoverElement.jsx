"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useGSAP } from "../../context/GSAPContext";

export default function DiscoverElement() {
  const [phase, setPhase] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const containerRef = useRef(null);
  const pulseRef = useRef(null);
  const contentRef = useRef(null);
  const { gsap, contextReady } = useGSAP();

  useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true);
    }, 500);
  }, []);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobileView(window.innerWidth < 700);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  // GSAP animations for phase transitions
  useEffect(() => {
    if (!contextReady || !gsap || !contentRef.current || phase === 0) return;

    const content = contentRef.current;

    gsap.fromTo(
      content,
      {
        opacity: 0,
        scale: 0.8,
        rotationY: -15,
      },
      {
        opacity: 1,
        scale: 1,
        rotationY: 0,
        duration: 0.8,
        ease: "back.out(1.7)",
      }
    );
  }, [contextReady, gsap, phase]);

  const handleClick = () => {
    const container = containerRef.current;

    // Fallback without animations
    if (phase === 0) setPhase(1);
    else if (phase === 1) setPhase(2);
    else if (phase === 2) setPhase(3);
    else if (phase === 3) setPhase(1);
    return;
  };

  const getBackgroundColor = () => {
    switch (phase) {
      case 0:
        return "bg-white";
      case 1:
        return "bg-[#7DD4FF]";
      case 2:
        return "bg-[#007590]";
      case 3:
        return "bg-[#003C59]";
      default:
        return "bg-white";
    }
  };

  const getSliderColor = () => {
    switch (phase) {
      case 0:
        return "bg-white";
      case 1:
        return "bg-[#04ACFF]";
      case 2:
        return "bg-[#005568]";
      case 3:
        return "bg-[#002132]";
      default:
        return "bg-gray-100";
    }
  };

  const getContent = () => {
    switch (phase) {
      case 1:
        return {
          title: "Ambitions",
          text: "Ambitieux et pleins d'id\u00e9es, nous voulions tous, un jour, pouvoir entreprendre et r\u00e9volutionner le digital en cassant les codes.",
        };
      case 2:
        return {
          title: "Rencontre",
          text: "Nous nous sommes rencontr\u00e9s en \u00e9cole sup\u00e9rieure, o\u00f9 nous avons eu l'occasion de mener \u00e0 bien une multitude de projets, suivi des semaines intensives en Hackathon et bien d'autres",
        };
      case 3:
        return {
          title: "Collaboration",
          text: "Nous avons donc eu l'id\u00e9e de nous lancer dans cette aventure qui ne fera que de rendre le monde du web meilleur, nous apportons des solutions durables, qui auront de l'impact sur notre environnement.",
        };
      default:
        return {
          title: "",
          text: "",
        };
    }
  };

  const getSliderPosition = () => {
    switch (phase) {
      case 1:
        return "left-[1%] md:left-[1%]";
      case 2:
        return "left-[50%] -translate-x-1/2";
      case 3:
        return "left-[99%] -translate-x-full";
      default:
        return "top-[200%]";
    }
  };

  // Mobile circle view rendering
  const renderMobileView = () => {
    const content = getContent();

    return (
      <div
        ref={containerRef}
        onClick={handleClick}
        className={`w-[75vw] h-[75vw] mx-auto relative overflow-hidden rounded-full shadow-lg cursor-pointer transition-all duration-700 flex items-center justify-center text-center ${
          phase === 0 ? "bg-gray-700" : getBackgroundColor()
        }`}
        style={{
          animation: phase === 0 ? "circleGlow 3s infinite 0s" : "none",
        }}
      >
        {phase === 0 && (
          <div
            ref={pulseRef}
            className="absolute inset-0 rounded-full z-10 pointer-events-none"
          ></div>
        )}

        <div ref={contentRef} className="relative z-20 px-6">
          <h3
            style={{ textShadow: "0 0 5px rgba(0, 0, 0, 0.7)" }}
            className="text-xl font-bold mb-2 text-white"
          >
            {content.title}
          </h3>
          <p
            style={{ textShadow: "0 0 5px rgba(0, 0, 0, 0.7)" }}
            className="text-sm text-white/90"
          >
            {content.text}
          </p>
        </div>

        {/* Mobile circular image for phase 0*/}
        <Image
          src="/images/contact0mobile.svg"
          alt="Start discovery"
          width={200}
          height={200}
          className={`transition-all duration-700 ease-in-out z-5 absolute inset-0 w-full h-full object-cover bg-white ${
            phase === 0
              ? `opacity-${isLoaded ? "100" : "0"}`
              : "opacity-0 pointer-events-none"
          }`}
        />

        <Image
          src="/images/contact1.svg"
          alt="Our beginning"
          width={200}
          height={200}
          className={`transition-all duration-700 ease-in-out z-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 object-contain ${
            phase === 1 ? "opacity-70" : "opacity-0"
          }`}
        />
        <Image
          src="/images/contact2.svg"
          alt="Our growth"
          width={200}
          height={200}
          className={`transition-all duration-700 ease-in-out z-5 absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-3/4 h-3/4 object-contain ${
            phase === 2 ? "opacity-70" : "opacity-0"
          }`}
        />
        <Image
          src="/images/contact3.svg"
          alt="Our vision"
          width={200}
          height={200}
          className={`transition-all duration-700 ease-in-out z-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 object-contain ${
            phase === 3 ? "opacity-70" : "opacity-0"
          }`}
        />
        <div
          className={`absolute inset-0 ${
            phase === 0 ? "bg-black/20" : ""
          } z-5 transition-opacity duration-500 ${
            phase === 0 && !isLoaded ? "opacity-0" : ""
          }`}
        />
      </div>
    );
  };

  // Desktop slider view rendering
  const renderDesktopView = () => {
    return (
      <div
        ref={containerRef}
        onClick={handleClick}
        className={`w-full max-w-5xl h-48 sm:h-56 md:h-64 lg:h-80 relative overflow-hidden rounded-full shadow-lg cursor-pointer transition-all duration-700 ${getBackgroundColor()}`}
        style={{
          animation: phase === 0 ? "circleGlow 3s infinite 0s" : "none",
        }}
      >
        {phase === 0 && (
          <div
            ref={pulseRef}
            className="absolute inset-0 rounded-full z-10 pointer-events-none"
          ></div>
        )}

        <div
          className={`absolute ${getSliderPosition()} transition-all duration-700 ease-in-out h-[92%] w-[40%] sm:w-[40%] md:w-[50%] top-1/2 -translate-y-1/2 z-0`}
        >
          <div
            ref={contentRef}
            className={`${getSliderColor()} rounded-full px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 shadow-lg h-full transition-all duration-700`}
          >
            <div className="flex flex-col h-full justify-center text-center font-montserrat">
              <h3 className="text-base sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2 md:mb-4 text-white">
                {getContent().title}
              </h3>
              <p className="text-xs sm:text-sm md:text-base lg:text-lg text-white/90 line-clamp-5 sm:h-2/3 h-[52%] md:h-auto">
                {getContent().text}
              </p>
            </div>
          </div>
        </div>

        <Image
          src="/images/contact0.svg"
          alt="Start discovery"
          width={3320}
          height={1136}
          className={`transition-all duration-700 ease-in-out z-10 absolute inset-0 w-full h-full object-cover bg-white ${
            phase === 0
              ? `opacity-${isLoaded ? "100" : "0"}`
              : "opacity-0 pointer-events-none"
          }`}
        />
        <Image
          src="/images/contact1.svg"
          alt="Our beginning"
          width={300}
          height={300}
          className={`transition-all duration-700 ease-in-out z-10 absolute right-0 top-1/2 -translate-y-1/2 w-[45%] h-[90%] object-contain ${
            phase === 1
              ? "opacity-100"
              : "opacity-0 pointer-events-none translate-x-[-100px]"
          }`}
        />
        <Image
          src="/images/contact2.svg"
          alt="Our growth"
          width={300}
          height={300}
          className={`transition-all duration-700 ease-in-out z-10 absolute -left-10 sm:-left-10 md:-left-20 top-[60%] -translate-y-1/2 w-[45%] h-[85%] object-contain ${
            phase === 2
              ? "opacity-100"
              : "opacity-0 pointer-events-none translate-x-[100px]"
          }`}
        />
        <Image
          src="/images/contact3.svg"
          alt="Our vision"
          width={300}
          height={300}
          className={`transition-all duration-700 ease-in-out z-10 absolute left-2 sm:left-3 md:left-4 top-1/2 -translate-y-1/2 w-[45%] h-[90%] object-contain ${
            phase === 3
              ? "opacity-100"
              : "opacity-0 pointer-events-none translate-x-[50px]"
          }`}
        />
        <div
          className={`absolute inset-0 ${
            phase === 0 ? "bg-black/30" : ""
          } z-5 transition-opacity duration-500 ${
            phase === 0 && !isLoaded ? "opacity-0" : ""
          }`}
        />
      </div>
    );
  };

  return isMobileView ? renderMobileView() : renderDesktopView();
}
