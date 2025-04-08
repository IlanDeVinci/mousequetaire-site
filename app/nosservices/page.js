"use client";
import Image from "next/image";
import { useState, useCallback, useRef } from "react";
import ScrollReveal from "../../components/ScrollReveal";

const services = [
  {
    icon: "/bulbe.png",
    title: "Développement Web",
    description: "Création de sites web modernes et responsive",
    bgColor: "#004165",
  },
  {
    icon: "/supporttechnique.png",
    title: "Support Technique",
    description: "Assistance et maintenance professionnelle",
    bgColor: "#005180",
  },
  {
    icon: "/internetpicto.png",
    title: "Conseil",
    description: "Solutions digitales sur mesure",
    bgColor: "#006A9E",
  },
];

const sections = [
  {
    title: "Expertise Technique",
    description:
      "Notre équipe possède une expertise approfondie dans les dernières technologies web et mobile.",
    image: "/images/ronds.png",
    isReversed: false,
  },
  {
    title: "Support 24/7",
    description:
      "Une équipe dédiée à votre service pour répondre à vos besoins en temps réel.",
    image: "/images/webp.png",
    isReversed: true,
  },
  {
    title: "Solutions Innovantes",
    description:
      "Des solutions créatives et innovantes pour répondre à vos défis numériques.",
    image: "/images/feuille.png",
    isReversed: false,
  },
];

export default function Services() {
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
      <main className="pt-24 pb-16 bg-[#050610] min-h-screen px-3 sm:px-4 md:px-8 lg:px-12 xl:px-48">
        <div className="container mx-auto">
          {/* Header Section */}
          <ScrollReveal animation="fade-down">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-8 sm:mt-12 md:mt-16 mb-4 sm:mb-6 text-center text-[#7DD4FF]">
              Nos Services
            </h1>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={200}>
            <p className="text-white text-center max-w-2xl mx-auto mb-8 sm:mb-12 md:mb-16 text-sm sm:text-base md:text-lg px-3 sm:px-4">
              Découvrez notre gamme complète de services numériques conçus pour
              propulser votre entreprise vers le succès.
            </p>
          </ScrollReveal>

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
            <div className="hidden md:flex justify-center mb-16 lg:mb-24 relative h-72">
              <div className="w-full max-w-[1000px] relative">
                {services.map((service, index) => (
                  <div
                    key={index}
                    className="absolute top-0 transition-all duration-700 ease-in-out"
                    style={{
                      left:
                        activeIndex === index
                          ? index === 2
                            ? "calc(100% - 1012px)"
                            : "0px"
                          : `${index * 33}%`,
                      zIndex: activeIndex === index ? 10 : 1,
                      width: "288px",
                      padding: "8px",
                    }}
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div
                      className={`h-72 rounded-full flex items-center justify-center cursor-pointer transition-all duration-700 ease-in-out relative overflow-hidden ${
                        activeIndex === index ? "w-[1000px]" : "w-72"
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
                          <p className="whitespace-normal max-w-[500px] md:max-w-[600px] text-lg md:text-xl">
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

          {/* Alternating Sections - Responsive */}
          {sections.map((section, index) => (
            <ScrollReveal
              key={index}
              animation={section.isReversed ? "fade-left" : "fade-right"}
              delay={index * 200}
            >
              <div
                className={`flex flex-col ${
                  section.isReversed ? "md:flex-row-reverse" : "md:flex-row"
                } items-center gap-6 sm:gap-8 md:gap-12 mb-12 sm:mb-16 md:mb-24`}
              >
                <div className="flex-1 w-full">
                  <div className="relative h-[180px] sm:h-[220px] md:h-[300px] lg:h-[400px] w-full rounded-xl overflow-hidden">
                    <Image
                      src={section.image}
                      alt={section.title}
                      fill
                      className="object-contain p-3 sm:p-4 md:p-8"
                    />
                  </div>
                </div>
                <div className="flex-1 text-white px-2 sm:px-4">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 md:mb-6 text-[#7DD4FF]">
                    {section.title}
                  </h2>
                  <p className="text-sm sm:text-base md:text-lg leading-relaxed">
                    {section.description}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </main>
    </>
  );
}
