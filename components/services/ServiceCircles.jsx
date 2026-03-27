"use client";
import Image from "next/image";
import { useState, useCallback, useRef } from "react";
import ScrollReveal from "../ScrollReveal";

const ServiceCircles = ({ services }) => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const lastIndex = useRef(null);

  const handleMouseEnter = useCallback(
    (index) => {
      if (!isAnimating || lastIndex.current !== index) {
        setIsAnimating(true);
        setActiveIndex(index);
        lastIndex.current = index;
        setTimeout(() => {
          setIsAnimating(false);
        }, 750);
      }
    },
    [isAnimating]
  );

  const handleClick = useCallback(
    (index) => {
      if (activeIndex === index) {
        setActiveIndex(null);
      } else {
        setActiveIndex(index);
      }
    },
    [activeIndex]
  );

  const handleMouseLeave = useCallback(() => {
    lastIndex.current = null;
    setActiveIndex(null);
  }, []);

  return (
    <>
      {/* Tablet Interactive Circles (Vertical Layout) */}
      <ScrollReveal animation="fade-up" delay={400}>
      <div className="flex md:hidden flex-col items-center mb-16 px-4 relative min-h-[900px]">
        {services.map((service, index) => (
          <div
            className="absolute transition-all duration-500 ease-in-out w-full flex justify-center"
            style={{
              top:
                activeIndex === index
                  ? `${index * 140}px`
                  : `${index * 300}px`,
              zIndex: activeIndex === index ? 10 : 1,
            }}
            key={index}
          >
            <div
              className="w-full max-w-[280px]"
              onClick={() => handleClick(index)}
            >
              <div
                className={`rounded-full transition-all duration-500 ease-in-out overflow-hidden relative mx-auto
                ${
                  activeIndex === index
                    ? "h-[600px] w-full max-w-[600px]"
                    : "h-[280px] w-[280px]"
                }`}
                style={{
                  backgroundColor: service.bgColor,
                }}
              >
                <div
                  className={`flex ${
                    activeIndex === index ? "flex-col" : "flex-col"
                  } items-center p-4`}
                >
                  <div
                    className={`relative ${
                      activeIndex === index ? "h-40 w-40" : "h-32 w-32"
                    } mt-4 mb-2`}
                  >
                    <Image
                      src={service.icon}
                      alt={service.title}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                  <h3 className="text-xl text-white font-bold text-center mb-2">
                    {service.title}
                  </h3>
                  <div
                    className={`transition-all duration-300 text-white text-center px-4 mt-2
                    ${
                      activeIndex === index
                        ? "opacity-100 delay-200"
                        : "opacity-0"
                    }`}
                  >
                    <p className="whitespace-normal text-base">
                      {service.description}
                    </p>
                    <p className="mt-3 text-base">
                      Notre équipe d&apos;experts est prête à vous
                      accompagner dans vos projets numériques avec des
                      solutions innovantes et personnalisées.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      </ScrollReveal>

      {/* Desktop Interactive Circles */}
      <ScrollReveal animation="zoom-in">
      <div className="hidden md:flex justify-center mb-16 lg:mb-24 relative h-72 w-full mx-auto">
        <div className="w-[1000px] relative">
          {services.map((service, index) => (
            <div
              key={index}
              className="absolute top-0 transition-all duration-700 ease-in-out"
              style={{
                left:
                  activeIndex === index
                    ? index === 2
                      ? typeof window !== "undefined" && window.innerWidth >= 1024
                        ? "calc(102.5% - 1012px)"
                        : "calc(102.5% - 930px)"
                      : "2.5%"
                    : `${index * 33 + 2.5}%`,
                zIndex: activeIndex === index ? 10 : 1,
                width: "288px",
              }}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            >
              <div
                className={`h-72 rounded-full flex items-center justify-center transition-all duration-700 ease-in-out relative overflow-hidden ${
                  activeIndex === index
                    ? "lg:w-[960px] w-[890px]"
                    : "w-72"
                }`}
                style={{
                  backgroundColor: service.bgColor,
                  transformOrigin: index === 2 ? "right" : "left",
                }}
              >
                <div
                  className={`absolute transition-all duration-700 ease-in-out flex items-center gap-6 md:gap-8 lg:gap-12 ${
                    index === 2 ? "right-3 flex-row-reverse" : "left-3"
                  }`}
                >
                  <span className="text-5xl md:text-6xl text-white shrink-0 w-56 md:w-64 h-56 md:h-64 relative">
                    <Image
                      src={service.icon}
                      alt={service.title}
                      fill
                      className="object-contain p-4"
                    />
                  </span>
                  <div
                    className={`transition-all duration-300 text-white ${
                      activeIndex === index
                        ? "opacity-100 delay-200"
                        : "opacity-0 delay-0"
                    }`}
                  >
                    <h3 className="text-3xl md:text-4xl font-bold mb-3 md:mb-4">
                      {service.title}
                    </h3>
                    <p className="whitespace-normal min-w-[450px] max-w-[500px] md:max-w-[600px] text-lg md:text-xl">
                      {service.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      </ScrollReveal>
    </>
  );
};

export default ServiceCircles;
