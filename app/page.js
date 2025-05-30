"use client";

import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import WindAnimation from "../components/WindAnimation";
import ScrollReveal from "../components/ScrollReveal";
import { gsap } from "gsap";
import TypeWriter from "../components/TypeWriter";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "../context/GSAPContext";

// Register ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  const heroTitleRef = useRef(null);
  const neonTextRef = useRef(null);
  const heroContainerRef = useRef(null);

  // GSAP hero animations
  useGSAP(() => {
    const tl = gsap.timeline();

    // Animate neon text first
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

    // Animate hero title with stagger effect
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

      // Create shimmer effect with GSAP
      const shimmerTl = gsap.timeline({ repeat: -1, yoyo: true });
      shimmerTl.to(heroTitleRef.current, {
        textShadow: "0 0 8px rgba(255, 255, 255, 0.8)",
        duration: 2,
        ease: "sine.inOut",
      });
    }
  }, []);

  return (
    <>
      <ScrollReveal animation="fade-up" threshold={0.1}>
        <section className="relative min-h-[90vh] -mt-16 flex items-center justify-center bg-[050610] overflow-hidden font-montserrat">
          {/* Wind Animation SVG - now with responsive sizing */}
          <div className="absolute inset-0 h-full">
            <WindAnimation />
          </div>

          {/* Logo in top left */}
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
                  data-text="&lt;mouse-quetaires/&gt;"
                >
                  &lt;mouse-quetaires/&gt;
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

              <style jsx global>{`
                /* Simplified CSS - GSAP handles most animations now */
                .metal-text {
                  position: relative;
                  letter-spacing: 1px;
                  color: #888;
                  will-change: transform, opacity;
                  line-height: 1.2;
                  overflow-wrap: break-word;
                  word-wrap: break-word;
                  -webkit-hyphens: auto;
                  -ms-hyphens: auto;
                  hyphens: auto;
                }

                /* Main metal background */
                .metal-text::before {
                  content: attr(data-text);
                  position: absolute;
                  left: 0;
                  top: 0;
                  width: 100%;
                  height: 100%;
                  background: linear-gradient(
                    to right,
                    #888 0%,
                    #aaa 48%,
                    #fff 50%,
                    #aaa 52%,
                    #888 100%
                  );
                  background-size: 300% 100%;
                  color: transparent;
                  -webkit-background-clip: text;
                  background-clip: text;
                  z-index: -1;
                  animation: metalShine 6s linear infinite;
                }

                /* Moving shine overlay */
                .metal-text::after {
                  content: attr(data-text);
                  position: absolute;
                  top: 0;
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

                /* Make the metal text responsive on smaller screens */
                @media (max-width: 640px) {
                  .metal-text {
                    letter-spacing: 0.5px;
                  }

                  .metal-text::before,
                  .metal-text::after {
                    background-size: 400% 100%;
                  }
                }

                @keyframes metalShine {
                  0% {
                    background-position: 100% 0;
                  }
                  100% {
                    background-position: -200% 0;
                  }
                }

                @keyframes shimmer {
                  0% {
                    background-position: 200% 0;
                  }
                  100% {
                    background-position: -200% 0;
                  }
                }

                /* 3D Flip Card Styles - GSAP enhanced */
                .flip-card-container {
                  perspective: 1500px;
                  width: 100%;
                  aspect-ratio: 1/1;
                  cursor: pointer;
                  -webkit-tap-highlight-color: transparent;
                }

                .flip-card {
                  position: relative;
                  width: 100%;
                  height: 100%;
                  transform-style: preserve-3d;
                  /* Remove CSS transition - GSAP handles this */
                }

                .flip-card-front,
                .flip-card-back {
                  position: absolute;
                  width: 100%;
                  height: 100%;
                  -webkit-backface-visibility: hidden;
                  backface-visibility: hidden;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  border-radius: 1.5rem;
                }

                .flip-card-front {
                  background: linear-gradient(135deg, #003c59 0%, #002538 100%);
                  box-shadow: 0 4px 20px rgba(0, 60, 89, 0.3),
                    inset 0 2px 0 rgba(255, 255, 255, 0.1);
                  transform: rotateY(0);
                }

                .flip-card-scrollreveal:last-of-type .flip-card-front {
                  align-items: flex-start;
                }

                .flip-card-front h3 {
                  text-shadow: 0 2px 10px rgba(135, 215, 255, 0.3);
                }

                .flip-card-back {
                  transform: rotateY(180deg);
                  background: linear-gradient(135deg, #035073 0%, #023146 100%);
                  box-shadow: 0 4px 20px rgba(135, 215, 255, 0.4),
                    inset 0 2px 0 rgba(255, 255, 255, 0.1);
                }

                .flip-card-back-content {
                  transform: translateZ(60px);
                  display: flex;
                  flex-direction: column;
                  height: 100%;
                  width: 100%;
                  align-items: center;
                  text-align: center;
                }

                /* Touch device specific styles */
                @media (hover: none) {
                  .flip-card-container::after {
                    content: "Tap to flip";
                    position: absolute;
                    bottom: 1rem;
                    left: 50%;
                    transform: translateX(-50%);
                    color: rgba(135, 215, 255, 0.6);
                    font-size: 0.75rem;
                    opacity: 0.8;
                    pointer-events: none;
                  }

                  .flip-card-container.flipped::after {
                    content: "Tap to return";
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
        </section>
      </ScrollReveal>
      {/* Services Section */}
      <ScrollReveal animation="fade-up" threshold={0.1}>
        <section className="py-16 mx-[5vw]">
          <div className="container mx-auto px-4">
            <h2 className="text-5xl font-light text-center mb-12 text-white">
              Nos Services
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 services-grid">
              {[
                {
                  title: "Développement Web",
                  description:
                    "Sites et applications web sur mesure avec des technologies modernes. Développement réactif, optimisé pour les performances et compatible tous appareils. Solutions évolutives adaptées à vos besoins uniques.",
                },
                {
                  title: "Design UX/UI",
                  description:
                    "Maquettes d'applications, logos, chartes graphiques et interfaces utilisateur intuitives. Design créatif et fonctionnel qui valorise votre marque. Solutions visuelles adaptées à votre identité pour une expérience utilisateur optimale.",
                },
                {
                  title: "Stratégie Digitale",
                  description:
                    "Analyse de marché et ciblage précis de votre audience. Stratégies de référencement (SEO/SEA) pour maximiser votre visibilité. Plans de conversion optimisés et présence sur les réseaux sociaux. L'expertise de nos techniciens garantit un ROI mesurable pour votre entreprise.",
                },
              ].map((service, index) => (
                <ScrollReveal
                  className="flip-card-scrollreveal"
                  key={index}
                  animation="fade-up"
                  threshold={0.1}
                  delay={index * 150}
                >
                  <FlipCard
                    frontContent={service.title}
                    backContent={service.description}
                    index={index}
                  />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>
      {/* Team Section */}
      <ScrollReveal animation="fade-up" threshold={0.1} delay={100}>
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-5xl font-light text-center mb-12 text-white">
              Notre Équipe
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mx-auto max-w-6xl">
              {[
                {
                  name: "Samuel Alhadef",
                  role: "CEO/CCO - Chief Customer Officer",
                  image: "/images/photo-samuel.jpg",
                },
                {
                  name: "Ilan Maouchi",
                  role: "CIO - Chief Information Officer",
                  image: "/images/photo-ilan.jpeg",
                },
                {
                  name: "Dorian Collet",
                  role: "Directeur Artistique",
                  image: "/images/photo-dorian.png",
                },
              ].map((member, index) => (
                <ScrollReveal
                  key={index}
                  animation="zoom-in"
                  threshold={0.1}
                  delay={index * 200}
                >
                  <div className="flex flex-col items-center">
                    <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden mb-4 border-2 border-[#48B1E5]/30">
                      <Image
                        src={member.image}
                        alt={member.name}
                        width={300}
                        height={300}
                        className={`object-cover w-full h-full ${
                          member.name === "Dorian Collet"
                            ? "scale-125 object-center"
                            : ""
                        }`}
                      />
                    </div>
                    <h3 className="text-xl font-medium text-white">
                      {member.name}
                    </h3>
                    <p className="text-[#48B1E5] font-semibold font-montserrat">
                      {member.role}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
          <div className="mt-12 text-center">
            <Link href="/apropos">
              <button className="bg-[#EBF2FA] hover:bg-[#256b90] text-white font-semibold py-3 px-6 rounded-full transition duration-300 items-center justify-center mx-auto cursor-pointer max-w-xs inline-flex">
                <span className="text-[#060606] text-lg font-montserrat">
                  En savoir plus
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 ml-2 text-[#060606]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </Link>
          </div>
        </section>
      </ScrollReveal>
      <ScrollReveal animation="fade-right" threshold={0.1}>
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3 xl md:text-5xl font-light text-center mb-12 text-white">
              Les Mousequetaires, notre ambition...{" "}
            </h2>

            <div className="max-w-5xl mx-auto space-y-10">
              <ScrollReveal animation="fade-up" delay={500} threshold={0.2}>
                <div className="flex justify-start">
                  <div
                    className="w-4/5 md:w-2/3 text-gray-300 p-6 rounded-lg relative py-12 overflow-hidden text-justify"
                    style={{
                      background:
                        "linear-gradient(to right, rgba(5,6,16,0.85), rgba(5,6,16,0.95))",
                    }}
                  >
                    <div
                      className="absolute inset-0 z-0 opacity-80"
                      style={{
                        backgroundImage: "url('/images/accueil1.svg')",
                        backgroundSize: "contain",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        transition: "all 1.2s ease-out",
                      }}
                    ></div>
                    <p className="text-lg relative z-10 backdrop-blur-xs p-4 rounded-2xl border-1 border-white/80">
                      Mouse-quetaires est né en 2025 de la rencontre de trois
                      passionnés réunis autour d&apos;un bon repas et de
                      discussions animées. Notre aventure est celle d&apos;amis
                      unis par une vision commune : rendre la technologie et le
                      développement web accessibles à tous, en dépassant les
                      barrières du jargon technique et en proposant une approche
                      claire, humaine et pédagogique.
                    </p>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal animation="fade-left" delay={500} threshold={0.2}>
                <div className="flex justify-end">
                  <div
                    className="w-4/5 md:w-2/3 text-gray-300 p-6 rounded-lg relative overflow-hidden py-12 text-justify"
                    style={{
                      background:
                        "linear-gradient(to left, rgba(5,6,16,0.85), rgba(5,6,16,0.95))",
                      textAlignLast: "right",
                    }}
                  >
                    <div
                      className="absolute inset-0 z-0 opacity-100"
                      style={{
                        backgroundImage: "url('/images/accueil2.svg')",
                        backgroundSize: "contain",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        transition: "all 1.2s ease-out",
                      }}
                    ></div>
                    <p className="text-lg relative z-10 backdrop-blur-xs p-4 rounded-2xl border-1 border-white/80">
                      Ce qui nous anime au quotidien ? L&apos;exigence
                      d&apos;une qualité sans compromis, une créativité sans
                      limites, et une transparence totale dans tout ce que nous
                      entreprenons. Et nous croyons fermement qu&apos;une
                      relation de confiance repose sur l&apos;honnêteté. Chaque
                      projet est traité avec intégrité, sincérité et un
                      engagement authentique. Les solutions standardisées ? Très
                      peu pour nous. Votre projet est unique, et il mérite une
                      attention sur mesure, avec cette touche personnelle qui
                      fait toute la différence.
                    </p>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal animation="zoom-in" delay={500} threshold={0.2}>
                <div className="flex justify-start">
                  <div
                    className="w-4/5 md:w-2/3 text-gray-300 p-6 rounded-lg relative py-12 text-justify"
                    style={{
                      background:
                        "linear-gradient(to right, rgba(5,6,16,0.85), rgba(5,6,16,0.95))",
                    }}
                  >
                    <div
                      className="absolute inset-0 z-0 opacity-90"
                      style={{
                        backgroundImage: "url('/images/accueil3.svg')",
                        backgroundSize: "contain",
                        backgroundPosition: "bottom  left",
                        backgroundRepeat: "no-repeat",
                        maskImage:
                          "linear-gradient(to left, rgba(0,0,0,1) 70%, rgba(0,0,0,0))",
                        WebkitMaskImage:
                          "linear-gradient(to left, rgba(0,0,0,1) 70%, rgba(0,0,0,0))",
                        transition: "all 1.2s ease-out",
                      }}
                    ></div>
                    <p className="text-lg relative z-10 backdrop-blur-xs p-4 rounded-2xl border-1 border-white/80">
                      Nous travaillons en équipe soudée, où expertise technique
                      et créativité se nourrissent mutuellement. Nous sommes
                      chacun experts dans nos domaines et c'est en mettant nos
                      compétences en commun que nous arrivons à comprendre vos
                      défis numériques et à imaginer des solutions qui vous
                      ressemblent vraiment.
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>
      </ScrollReveal>
      {/* Projects Section */}
      <ScrollReveal animation="fade-up" threshold={0.05}>
        <section className="py-16 mx-6">
          <div className="container mx-auto px-4">
            <h2 className="text-5xl font-light text-center mb-12 text-white">
              Quelques unes de nos créations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  title: "Plateforme E-commerce",
                  description: "Solution complète pour une boutique de mode",
                  image: "/images/project1.jpg",
                },
                {
                  title: "Application Mobile",
                  description: "Service de livraison de proximité",
                  image: "/images/project2.jpg",
                },
                {
                  title: "Dashboard Analytique",
                  description:
                    "Visualisation de données pour une startup fintech",
                  image: "/images/project3.jpg",
                },
              ].map((project, index) => (
                <ScrollReveal
                  key={index}
                  animation="zoom-in"
                  delay={200 * index}
                  threshold={0.2}
                >
                  <div className="group relative overflow-hidden rounded-3xl aspect-square">
                    <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-[#050610] z-10" />
                    <Image
                      src={project.image}
                      alt={project.title}
                      width={400}
                      height={400}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-linear-to-b from-transparent via-[#050610]/40 to-[#050610] flex flex-col justify-end p-4 transition-all z-20"></div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
            <div className="mt-12 text-center">
              <Link href="/portfolio">
                <button className="bg-[#EBF2FA] hover:bg-[#256b90] text-white font-semibold py-3 px-6 rounded-full transition duration-300 items-center justify-center mx-auto cursor-pointer max-w-xs inline-flex">
                  <span className="text-[#060606] text-lg font-montserrat">
                    En savoir plus
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 ml-2 text-[#060606]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </Link>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </>
  );
}

// Enhanced FlipCard Component with GSAP
function FlipCard({ frontContent, backContent, index }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const cardRef = useRef(null);
  const frontRef = useRef(null);
  const backRef = useRef(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      // Detect touch device
      let touchDevice = false;
      if (window.matchMedia("(any-hover:none)").matches) {
        touchDevice = true;
      }
      setIsTouchDevice(touchDevice);
      initialized.current = true;

      // Enhanced initial animation with GSAP
      gsap.fromTo(
        cardRef.current,
        {
          opacity: 0,
          y: 50,
          rotationX: -15,
          scale: 0.9,
        },
        {
          opacity: 1,
          y: 0,
          rotationX: 0,
          scale: 1,
          duration: 0.8,
          delay: index * 0.2,
          ease: "back.out(1.7)",
        }
      );
    }
  }, [index]);

  useEffect(() => {
    if (!cardRef.current) return;

    // Enhanced flip animation with GSAP
    if (isFlipped) {
      gsap.to(cardRef.current, {
        rotationY: 180,
        duration: 0.6,
        ease: "power2.inOut",
      });

      // Animate back content entrance
      gsap.fromTo(
        backRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.3, delay: 0.3 }
      );
    } else {
      gsap.to(cardRef.current, {
        rotationY: 0,
        duration: 0.6,
        ease: "power2.inOut",
      });

      // Reset back content
      gsap.set(backRef.current, { opacity: 0, scale: 0.9 });
    }
  }, [isFlipped]);

  const handleClick = () => {
    if (isTouchDevice) {
      setIsFlipped(!isFlipped);
    }
  };

  const handleMouseEnter = () => {
    if (!isTouchDevice) {
      setIsFlipped(true);

      // Add subtle hover effect
      gsap.to(cardRef.current, {
        y: -10,
        scale: 1.02,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  };

  const handleMouseLeave = () => {
    if (!isTouchDevice) {
      setIsFlipped(false);

      // Reset hover effect
      gsap.to(cardRef.current, {
        y: 0,
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  };

  return (
    <div
      className={`flip-card-container ${isTouchDevice ? "touch-device" : ""}`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={cardRef}
        className="flip-card"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="flip-card-front overflow-hidden" ref={frontRef}>
          <h3 className="text-2xl md:text-3xl font-medium text-[#87D7FF] z-10 absolute">
            {frontContent}
            {index}
          </h3>
          {index == 0 ? (
            <svg
              className="w-[80%] h-[80%]"
              viewBox="0 0 322 353"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMidYMid meet"
            >
              <path
                d="M217.453 340.188L229.6 345.109V348.555L215.221 341.893V339.871L217.453 340.188ZM229.6 336.145L217.471 341.137L215.221 341.383V339.344L229.6 332.699V336.145ZM238.002 325V352H234.75V325H238.002ZM237.229 341.77L235.875 341.717C235.887 340.416 236.08 339.215 236.455 338.113C236.83 337 237.357 336.033 238.037 335.213C238.717 334.393 239.525 333.76 240.463 333.314C241.412 332.857 242.461 332.629 243.609 332.629C244.547 332.629 245.391 332.758 246.141 333.016C246.891 333.262 247.529 333.66 248.057 334.211C248.596 334.762 249.006 335.477 249.287 336.355C249.568 337.223 249.709 338.283 249.709 339.537V352H246.439V339.502C246.439 338.506 246.293 337.709 246 337.111C245.707 336.502 245.279 336.062 244.717 335.793C244.154 335.512 243.463 335.371 242.643 335.371C241.834 335.371 241.096 335.541 240.428 335.881C239.771 336.221 239.203 336.689 238.723 337.287C238.254 337.885 237.885 338.57 237.615 339.344C237.357 340.105 237.229 340.914 237.229 341.77ZM262.541 332.98V335.477H252.258V332.98H262.541ZM255.738 328.357H258.99V347.289C258.99 347.934 259.09 348.42 259.289 348.748C259.488 349.076 259.746 349.293 260.062 349.398C260.379 349.504 260.719 349.557 261.082 349.557C261.352 349.557 261.633 349.533 261.926 349.486C262.23 349.428 262.459 349.381 262.611 349.346L262.629 352C262.371 352.082 262.031 352.158 261.609 352.229C261.199 352.311 260.701 352.352 260.115 352.352C259.318 352.352 258.586 352.193 257.918 351.877C257.25 351.561 256.717 351.033 256.318 350.295C255.932 349.545 255.738 348.537 255.738 347.271V328.357ZM269.59 336.76V352H266.32V332.98H269.414L269.59 336.76ZM268.922 341.77L267.41 341.717C267.422 340.416 267.592 339.215 267.92 338.113C268.248 337 268.734 336.033 269.379 335.213C270.023 334.393 270.826 333.76 271.787 333.314C272.748 332.857 273.861 332.629 275.127 332.629C276.018 332.629 276.838 332.758 277.588 333.016C278.338 333.262 278.988 333.654 279.539 334.193C280.09 334.732 280.518 335.424 280.822 336.268C281.127 337.111 281.279 338.131 281.279 339.326V352H278.027V339.484C278.027 338.488 277.857 337.691 277.518 337.094C277.189 336.496 276.721 336.062 276.111 335.793C275.502 335.512 274.787 335.371 273.967 335.371C273.006 335.371 272.203 335.541 271.559 335.881C270.914 336.221 270.398 336.689 270.012 337.287C269.625 337.885 269.344 338.57 269.168 339.344C269.004 340.105 268.922 340.914 268.922 341.77ZM281.244 339.977L279.064 340.645C279.076 339.602 279.246 338.6 279.574 337.639C279.914 336.678 280.4 335.822 281.033 335.072C281.678 334.322 282.469 333.73 283.406 333.297C284.344 332.852 285.416 332.629 286.623 332.629C287.643 332.629 288.545 332.764 289.33 333.033C290.127 333.303 290.795 333.719 291.334 334.281C291.885 334.832 292.301 335.541 292.582 336.408C292.863 337.275 293.004 338.307 293.004 339.502V352H289.734V339.467C289.734 338.4 289.564 337.574 289.225 336.988C288.896 336.391 288.428 335.975 287.818 335.74C287.221 335.494 286.506 335.371 285.674 335.371C284.959 335.371 284.326 335.494 283.775 335.74C283.225 335.986 282.762 336.326 282.387 336.76C282.012 337.182 281.725 337.668 281.525 338.219C281.338 338.77 281.244 339.355 281.244 339.977ZM301.459 325V352H298.189V325H301.459ZM319.072 340.891L306.574 336.021V332.664L321.586 339.309V341.365L319.072 340.891ZM306.574 345.18L319.107 340.205L321.586 339.836V341.875L306.574 348.537V345.18Z"
                fill="#EBF2FA"
                fillOpacity="0.6"
              />
              <path
                d="M4.38867 6.98047H7.6582V28.2676C7.6582 29.4277 7.4707 30.4121 7.0957 31.2207C6.73242 32.0293 6.18164 32.6387 5.44336 33.0488C4.7168 33.4707 3.79688 33.6816 2.68359 33.6816C2.39062 33.6816 2.05078 33.6523 1.66406 33.5938C1.26562 33.5352 0.931641 33.4648 0.662109 33.3828L0.679688 30.7637C0.902344 30.8105 1.1543 30.8457 1.43555 30.8691C1.7168 30.9043 1.96289 30.9219 2.17383 30.9219C2.6543 30.9219 3.05859 30.834 3.38672 30.6582C3.71484 30.4824 3.96094 30.2012 4.125 29.8145C4.30078 29.4277 4.38867 28.9121 4.38867 28.2676V6.98047ZM4.05469 1.93555C4.05469 1.4082 4.21875 0.962891 4.54688 0.599609C4.875 0.236328 5.34961 0.0546875 5.9707 0.0546875C6.60352 0.0546875 7.08398 0.236328 7.41211 0.599609C7.74023 0.962891 7.9043 1.4082 7.9043 1.93555C7.9043 2.43945 7.74023 2.87305 7.41211 3.23633C7.08398 3.58789 6.60352 3.76367 5.9707 3.76367C5.34961 3.76367 4.875 3.58789 4.54688 3.23633C4.21875 2.87305 4.05469 2.43945 4.05469 1.93555ZM24.1289 22.748V12.957C24.1289 12.207 23.9766 11.5566 23.6719 11.0059C23.3789 10.4434 22.9336 10.0098 22.3359 9.70508C21.7383 9.40039 21 9.24805 20.1211 9.24805C19.3008 9.24805 18.5801 9.38867 17.959 9.66992C17.3496 9.95117 16.8691 10.3203 16.5176 10.7773C16.1777 11.2344 16.0078 11.7266 16.0078 12.2539H12.7559C12.7559 11.5742 12.9316 10.9004 13.2832 10.2324C13.6348 9.56445 14.1387 8.96094 14.7949 8.42188C15.4629 7.87109 16.2598 7.4375 17.1855 7.12109C18.123 6.79297 19.166 6.62891 20.3145 6.62891C21.6973 6.62891 22.916 6.86328 23.9707 7.33203C25.0371 7.80078 25.8691 8.50977 26.4668 9.45898C27.0762 10.3965 27.3809 11.5742 27.3809 12.9922V21.8516C27.3809 22.4844 27.4336 23.1582 27.5391 23.873C27.6562 24.5879 27.8262 25.2031 28.0488 25.7188V26H24.6562C24.4922 25.625 24.3633 25.127 24.2695 24.5059C24.1758 23.873 24.1289 23.2871 24.1289 22.748ZM24.6914 14.4688L24.7266 16.7539H21.4395C20.5137 16.7539 19.6875 16.8301 18.9609 16.9824C18.2344 17.123 17.625 17.3398 17.1328 17.6328C16.6406 17.9258 16.2656 18.2949 16.0078 18.7402C15.75 19.1738 15.6211 19.6836 15.6211 20.2695C15.6211 20.8672 15.7559 21.4121 16.0254 21.9043C16.2949 22.3965 16.6992 22.7891 17.2383 23.082C17.7891 23.3633 18.4629 23.5039 19.2598 23.5039C20.2559 23.5039 21.1348 23.293 21.8965 22.8711C22.6582 22.4492 23.2617 21.9336 23.707 21.3242C24.1641 20.7148 24.4102 20.123 24.4453 19.5488L25.834 21.1133C25.752 21.6055 25.5293 22.1504 25.166 22.748C24.8027 23.3457 24.3164 23.9199 23.707 24.4707C23.1094 25.0098 22.3945 25.4609 21.5625 25.8242C20.7422 26.1758 19.8164 26.3516 18.7852 26.3516C17.4961 26.3516 16.3652 26.0996 15.3926 25.5957C14.4316 25.0918 13.6816 24.418 13.1426 23.5742C12.6152 22.7188 12.3516 21.7637 12.3516 20.709C12.3516 19.6895 12.5508 18.793 12.9492 18.0195C13.3477 17.2344 13.9219 16.584 14.6719 16.0684C15.4219 15.541 16.3242 15.1426 17.3789 14.873C18.4336 14.6035 19.6113 14.4688 20.9121 14.4688H24.6914ZM37.998 23.0645L43.2012 6.98047H46.5234L39.6855 26H37.5059L37.998 23.0645ZM33.6562 6.98047L39.0176 23.1523L39.3867 26H37.207L30.3164 6.98047H33.6562ZM60.5859 22.748V12.957C60.5859 12.207 60.4336 11.5566 60.1289 11.0059C59.8359 10.4434 59.3906 10.0098 58.793 9.70508C58.1953 9.40039 57.457 9.24805 56.5781 9.24805C55.7578 9.24805 55.0371 9.38867 54.416 9.66992C53.8066 9.95117 53.3262 10.3203 52.9746 10.7773C52.6348 11.2344 52.4648 11.7266 52.4648 12.2539H49.2129C49.2129 11.5742 49.3887 10.9004 49.7402 10.2324C50.0918 9.56445 50.5957 8.96094 51.252 8.42188C51.9199 7.87109 52.7168 7.4375 53.6426 7.12109C54.5801 6.79297 55.623 6.62891 56.7715 6.62891C58.1543 6.62891 59.373 6.86328 60.4277 7.33203C61.4941 7.80078 62.3262 8.50977 62.9238 9.45898C63.5332 10.3965 63.8379 11.5742 63.8379 12.9922V21.8516C63.8379 22.4844 63.8906 23.1582 63.9961 23.873C64.1133 24.5879 64.2832 25.2031 64.5059 25.7188V26H61.1133C60.9492 25.625 60.8203 25.127 60.7266 24.5059C60.6328 23.873 60.5859 23.2871 60.5859 22.748ZM61.1484 14.4688L61.1836 16.7539H57.8965C56.9707 16.7539 56.1445 16.8301 55.418 16.9824C54.6914 17.123 54.082 17.3398 53.5898 17.6328C53.0977 17.9258 52.7227 18.2949 52.4648 18.7402C52.207 19.1738 52.0781 19.6836 52.0781 20.2695C52.0781 20.8672 52.2129 21.4121 52.4824 21.9043C52.752 22.3965 53.1562 22.7891 53.6953 23.082C54.2461 23.3633 54.9199 23.5039 55.7168 23.5039C56.7129 23.5039 57.5918 23.293 58.3535 22.8711C59.1152 22.4492 59.7188 21.9336 60.1641 21.3242C60.6211 20.7148 60.8672 20.123 60.9023 19.5488L62.291 21.1133C62.209 21.6055 61.9863 22.1504 61.623 22.748C61.2598 23.3457 60.7734 23.9199 60.1641 24.4707C59.5664 25.0098 58.8516 25.4609 58.0195 25.8242C57.1992 26.1758 56.2734 26.3516 55.2422 26.3516C53.9531 26.3516 52.8223 26.0996 51.8496 25.5957C50.8887 25.0918 50.1387 24.418 49.5996 23.5742C49.0723 22.7188 48.8086 21.7637 48.8086 20.709C48.8086 19.6895 49.0078 18.793 49.4062 18.0195C49.8047 17.2344 50.3789 16.584 51.1289 16.0684C51.8789 15.541 52.7812 15.1426 53.8359 14.873C54.8906 14.6035 56.0684 14.4688 57.3691 14.4688H61.1484ZM69.0059 24.2773C69.0059 23.7266 69.1758 23.2637 69.5156 22.8887C69.8672 22.502 70.3711 22.3086 71.0273 22.3086C71.6836 22.3086 72.1816 22.502 72.5215 22.8887C72.873 23.2637 73.0488 23.7266 73.0488 24.2773C73.0488 24.8164 72.873 25.2734 72.5215 25.6484C72.1816 26.0234 71.6836 26.2109 71.0273 26.2109C70.3711 26.2109 69.8672 26.0234 69.5156 25.6484C69.1758 25.2734 69.0059 24.8164 69.0059 24.2773ZM78.5332 6.98047H81.8027V28.2676C81.8027 29.4277 81.6152 30.4121 81.2402 31.2207C80.877 32.0293 80.3262 32.6387 79.5879 33.0488C78.8613 33.4707 77.9414 33.6816 76.8281 33.6816C76.5352 33.6816 76.1953 33.6523 75.8086 33.5938C75.4102 33.5352 75.0762 33.4648 74.8066 33.3828L74.8242 30.7637C75.0469 30.8105 75.2988 30.8457 75.5801 30.8691C75.8613 30.9043 76.1074 30.9219 76.3184 30.9219C76.7988 30.9219 77.2031 30.834 77.5312 30.6582C77.8594 30.4824 78.1055 30.2012 78.2695 29.8145C78.4453 29.4277 78.5332 28.9121 78.5332 28.2676V6.98047ZM78.1992 1.93555C78.1992 1.4082 78.3633 0.962891 78.6914 0.599609C79.0195 0.236328 79.4941 0.0546875 80.1152 0.0546875C80.748 0.0546875 81.2285 0.236328 81.5566 0.599609C81.8848 0.962891 82.0488 1.4082 82.0488 1.93555C82.0488 2.43945 81.8848 2.87305 81.5566 3.23633C81.2285 3.58789 80.748 3.76367 80.1152 3.76367C79.4941 3.76367 79.0195 3.58789 78.6914 3.23633C78.3633 2.87305 78.1992 2.43945 78.1992 1.93555ZM98.1328 20.9551C98.1328 20.4863 98.0273 20.0527 97.8164 19.6543C97.6172 19.2441 97.2012 18.875 96.5684 18.5469C95.9473 18.207 95.0098 17.9141 93.7559 17.668C92.7012 17.4453 91.7461 17.1816 90.8906 16.877C90.0469 16.5723 89.3262 16.2031 88.7285 15.7695C88.1426 15.3359 87.6914 14.8262 87.375 14.2402C87.0586 13.6543 86.9004 12.9688 86.9004 12.1836C86.9004 11.4336 87.0645 10.7246 87.3926 10.0566C87.7324 9.38867 88.207 8.79688 88.8164 8.28125C89.4375 7.76563 90.1816 7.36133 91.0488 7.06836C91.916 6.77539 92.8828 6.62891 93.9492 6.62891C95.4727 6.62891 96.7734 6.89844 97.8516 7.4375C98.9297 7.97656 99.7559 8.69727 100.33 9.59961C100.904 10.4902 101.191 11.4805 101.191 12.5703H97.9395C97.9395 12.043 97.7812 11.5332 97.4648 11.041C97.1602 10.5371 96.709 10.1211 96.1113 9.79297C95.5254 9.46484 94.8047 9.30078 93.9492 9.30078C93.0469 9.30078 92.3145 9.44141 91.752 9.72266C91.2012 9.99219 90.7969 10.3379 90.5391 10.7598C90.293 11.1816 90.1699 11.627 90.1699 12.0957C90.1699 12.4473 90.2285 12.7637 90.3457 13.0449C90.4746 13.3145 90.6973 13.5664 91.0137 13.8008C91.3301 14.0234 91.7754 14.2344 92.3496 14.4336C92.9238 14.6328 93.6562 14.832 94.5469 15.0312C96.1055 15.3828 97.3887 15.8047 98.3965 16.2969C99.4043 16.7891 100.154 17.3926 100.646 18.1074C101.139 18.8223 101.385 19.6895 101.385 20.709C101.385 21.541 101.209 22.3027 100.857 22.9941C100.518 23.6855 100.02 24.2832 99.3633 24.7871C98.7188 25.2793 97.9453 25.666 97.043 25.9473C96.1523 26.2168 95.1504 26.3516 94.0371 26.3516C92.3613 26.3516 90.9434 26.0527 89.7832 25.4551C88.623 24.8574 87.7441 24.084 87.1465 23.1348C86.5488 22.1855 86.25 21.1836 86.25 20.1289H89.5195C89.5664 21.0195 89.8242 21.7285 90.293 22.2559C90.7617 22.7715 91.3359 23.1406 92.0156 23.3633C92.6953 23.5742 93.3691 23.6797 94.0371 23.6797C94.9277 23.6797 95.6719 23.5625 96.2695 23.3281C96.8789 23.0938 97.3418 22.7715 97.6582 22.3613C97.9746 21.9512 98.1328 21.4824 98.1328 20.9551Z"
                fill="#EBF2FA"
                fillOpacity="0.6"
              />
              <path
                d="M26.6934 264.861H30.0684C29.8926 266.479 29.4297 267.926 28.6797 269.203C27.9297 270.48 26.8691 271.494 25.498 272.244C24.127 272.982 22.416 273.352 20.3652 273.352C18.8652 273.352 17.5 273.07 16.2695 272.508C15.0508 271.945 14.002 271.148 13.123 270.117C12.2441 269.074 11.5645 267.826 11.084 266.373C10.6152 264.908 10.3809 263.279 10.3809 261.486V258.938C10.3809 257.145 10.6152 255.521 11.084 254.068C11.5645 252.604 12.25 251.35 13.1406 250.307C14.043 249.264 15.127 248.461 16.3926 247.898C17.6582 247.336 19.082 247.055 20.6641 247.055C22.5977 247.055 24.2324 247.418 25.5684 248.145C26.9043 248.871 27.9414 249.879 28.6797 251.168C29.4297 252.445 29.8926 253.928 30.0684 255.615H26.6934C26.5293 254.42 26.2246 253.395 25.7793 252.539C25.334 251.672 24.7012 251.004 23.8809 250.535C23.0605 250.066 21.9883 249.832 20.6641 249.832C19.5273 249.832 18.5254 250.049 17.6582 250.482C16.8027 250.916 16.082 251.531 15.4961 252.328C14.9219 253.125 14.4883 254.08 14.1953 255.193C13.9023 256.307 13.7559 257.543 13.7559 258.902V261.486C13.7559 262.74 13.8848 263.918 14.1426 265.02C14.4121 266.121 14.8164 267.088 15.3555 267.92C15.8945 268.752 16.5801 269.408 17.4121 269.889C18.2441 270.357 19.2285 270.592 20.3652 270.592C21.8066 270.592 22.9551 270.363 23.8105 269.906C24.666 269.449 25.3105 268.793 25.7441 267.938C26.1895 267.082 26.5059 266.057 26.6934 264.861ZM48.332 266.531C48.332 265.934 48.2383 265.406 48.0508 264.949C47.875 264.48 47.5586 264.059 47.1016 263.684C46.6562 263.309 46.0352 262.951 45.2383 262.611C44.4531 262.271 43.457 261.926 42.25 261.574C40.9844 261.199 39.8418 260.783 38.8223 260.326C37.8027 259.857 36.9297 259.324 36.2031 258.727C35.4766 258.129 34.9199 257.443 34.5332 256.67C34.1465 255.896 33.9531 255.012 33.9531 254.016C33.9531 253.02 34.1582 252.1 34.5684 251.256C34.9785 250.412 35.5645 249.68 36.3262 249.059C37.0996 248.426 38.0195 247.934 39.0859 247.582C40.1523 247.23 41.3418 247.055 42.6543 247.055C44.5762 247.055 46.2051 247.424 47.541 248.162C48.8887 248.889 49.9141 249.844 50.6172 251.027C51.3203 252.199 51.6719 253.453 51.6719 254.789H48.2969C48.2969 253.828 48.0918 252.979 47.6816 252.24C47.2715 251.49 46.6504 250.904 45.8184 250.482C44.9863 250.049 43.9316 249.832 42.6543 249.832C41.4473 249.832 40.4512 250.014 39.666 250.377C38.8809 250.74 38.2949 251.232 37.9082 251.854C37.5332 252.475 37.3457 253.184 37.3457 253.98C37.3457 254.52 37.457 255.012 37.6797 255.457C37.9141 255.891 38.2715 256.295 38.752 256.67C39.2441 257.045 39.8652 257.391 40.6152 257.707C41.377 258.023 42.2852 258.328 43.3398 258.621C44.793 259.031 46.0469 259.488 47.1016 259.992C48.1562 260.496 49.0234 261.064 49.7031 261.697C50.3945 262.318 50.9043 263.027 51.2324 263.824C51.5723 264.609 51.7422 265.5 51.7422 266.496C51.7422 267.539 51.5312 268.482 51.1094 269.326C50.6875 270.17 50.084 270.891 49.2988 271.488C48.5137 272.086 47.5703 272.549 46.4688 272.877C45.3789 273.193 44.1602 273.352 42.8125 273.352C41.6289 273.352 40.4629 273.188 39.3145 272.859C38.1777 272.531 37.1406 272.039 36.2031 271.383C35.2773 270.727 34.5332 269.918 33.9707 268.957C33.4199 267.984 33.1445 266.859 33.1445 265.582H36.5195C36.5195 266.461 36.6895 267.217 37.0293 267.85C37.3691 268.471 37.832 268.986 38.418 269.396C39.0156 269.807 39.6895 270.111 40.4395 270.311C41.2012 270.498 41.9922 270.592 42.8125 270.592C43.9961 270.592 44.998 270.428 45.8184 270.1C46.6387 269.771 47.2598 269.303 47.6816 268.693C48.1152 268.084 48.332 267.363 48.332 266.531ZM69.707 266.531C69.707 265.934 69.6133 265.406 69.4258 264.949C69.25 264.48 68.9336 264.059 68.4766 263.684C68.0312 263.309 67.4102 262.951 66.6133 262.611C65.8281 262.271 64.832 261.926 63.625 261.574C62.3594 261.199 61.2168 260.783 60.1973 260.326C59.1777 259.857 58.3047 259.324 57.5781 258.727C56.8516 258.129 56.2949 257.443 55.9082 256.67C55.5215 255.896 55.3281 255.012 55.3281 254.016C55.3281 253.02 55.5332 252.1 55.9434 251.256C56.3535 250.412 56.9395 249.68 57.7012 249.059C58.4746 248.426 59.3945 247.934 60.4609 247.582C61.5273 247.23 62.7168 247.055 64.0293 247.055C65.9512 247.055 67.5801 247.424 68.916 248.162C70.2637 248.889 71.2891 249.844 71.9922 251.027C72.6953 252.199 73.0469 253.453 73.0469 254.789H69.6719C69.6719 253.828 69.4668 252.979 69.0566 252.24C68.6465 251.49 68.0254 250.904 67.1934 250.482C66.3613 250.049 65.3066 249.832 64.0293 249.832C62.8223 249.832 61.8262 250.014 61.041 250.377C60.2559 250.74 59.6699 251.232 59.2832 251.854C58.9082 252.475 58.7207 253.184 58.7207 253.98C58.7207 254.52 58.832 255.012 59.0547 255.457C59.2891 255.891 59.6465 256.295 60.127 256.67C60.6191 257.045 61.2402 257.391 61.9902 257.707C62.752 258.023 63.6602 258.328 64.7148 258.621C66.168 259.031 67.4219 259.488 68.4766 259.992C69.5312 260.496 70.3984 261.064 71.0781 261.697C71.7695 262.318 72.2793 263.027 72.6074 263.824C72.9473 264.609 73.1172 265.5 73.1172 266.496C73.1172 267.539 72.9062 268.482 72.4844 269.326C72.0625 270.17 71.459 270.891 70.6738 271.488C69.8887 272.086 68.9453 272.549 67.8438 272.877C66.7539 273.193 65.5352 273.352 64.1875 273.352C63.0039 273.352 61.8379 273.188 60.6895 272.859C59.5527 272.531 58.5156 272.039 57.5781 271.383C56.6523 270.727 55.9082 269.918 55.3457 268.957C54.7949 267.984 54.5195 266.859 54.5195 265.582H57.8945C57.8945 266.461 58.0645 267.217 58.4043 267.85C58.7441 268.471 59.207 268.986 59.793 269.396C60.3906 269.807 61.0645 270.111 61.8145 270.311C62.5762 270.498 63.3672 270.592 64.1875 270.592C65.3711 270.592 66.373 270.428 67.1934 270.1C68.0137 269.771 68.6348 269.303 69.0566 268.693C69.4902 268.084 69.707 267.363 69.707 266.531ZM94.5098 244.928L95.1953 246.932C93.8008 247.365 92.8398 248.145 92.3125 249.27C91.7852 250.383 91.5215 251.66 91.5215 253.102V256.74C91.5215 257.912 91.2812 258.979 90.8008 259.939C90.332 260.889 89.582 261.645 88.5508 262.207C87.5312 262.77 86.1895 263.051 84.5254 263.051V260.906C85.8496 260.906 86.7988 260.531 87.373 259.781C87.959 259.031 88.252 258.018 88.252 256.74V253.102C88.252 251.871 88.4395 250.723 88.8145 249.656C89.2012 248.578 89.8457 247.635 90.748 246.826C91.6621 246.006 92.916 245.373 94.5098 244.928ZM95.1953 277.412L94.5098 279.434C92.916 278.977 91.6621 278.344 90.748 277.535C89.8457 276.727 89.2012 275.783 88.8145 274.705C88.4395 273.639 88.252 272.49 88.252 271.26V267.639C88.252 266.783 88.123 266.045 87.8652 265.424C87.6074 264.803 87.2031 264.322 86.6523 263.982C86.1133 263.631 85.4043 263.455 84.5254 263.455V261.311C86.1895 261.311 87.5312 261.592 88.5508 262.154C89.582 262.717 90.332 263.479 90.8008 264.439C91.2812 265.389 91.5215 266.455 91.5215 267.639V271.26C91.5215 272.221 91.6328 273.111 91.8555 273.932C92.0898 274.752 92.4707 275.461 92.998 276.059C93.5371 276.668 94.2695 277.119 95.1953 277.412ZM104.881 246.932L105.566 244.928C107.172 245.373 108.426 246.006 109.328 246.826C110.242 247.635 110.887 248.578 111.262 249.656C111.637 250.723 111.824  251.871 111.824 253.102V256.74C111.824 257.584 111.953 258.322 112.211 258.955C112.469 259.576 112.867 260.057 113.406 260.396C113.957 260.736 114.672 260.906 115.551 260.906V262.893C113.898 262.893 112.557 262.629 111.525 262.102C110.494 261.562 109.738 260.83 109.258 259.904C108.789 258.967 108.555 257.912 108.555 256.74V253.102C108.555 252.141 108.443 251.25 108.221 250.43C107.998 249.598 107.617 248.883 107.078 248.285C106.551 247.676 105.818 247.225 104.881 246.932ZM105.566 279.434L104.881 277.412C105.807 277.119 106.533 276.668 107.061 276.059C107.6 275.461 107.98 274.752 108.203 273.932C108.438 273.111 108.555 272.221 108.555 271.26V267.639C108.555 266.455 108.789 265.4 109.258 264.475C109.738 263.549 110.494 262.822 111.525 262.295C112.557 261.756 113.898 261.486 115.551 261.486V263.455C114.238 263.455 113.289 263.836 112.703 264.598C112.117 265.348 111.824 266.361 111.824 267.639V271.26C111.824 272.49 111.637 273.639 111.262 274.705C110.887 275.783 110.242 276.727 109.328 277.535C108.426 278.344 107.172 278.977 105.566 279.434Z"
                fill="#EBF2FA"
                fillOpacity="0.6"
              />
              <path
                d="M199.693 96.8613H203.068C202.893 98.4785 202.43 99.9258 201.68 101.203C200.93 102.48 199.869 103.494 198.498 104.244C197.127 104.982 195.416 105.352 193.365 105.352C191.865 105.352 190.5 105.07 189.27 104.508C188.051 103.945 187.002 103.148 186.123 102.117C185.244 101.074 184.564 99.8262 184.084 98.373C183.615 96.9082 183.381 95.2793 183.381 93.4863V90.9375C183.381 89.1445 183.615 87.5215 184.084 86.0684C184.564 84.6035 185.25 83.3496 186.141 82.3066C187.043 81.2637 188.127 80.4609 189.393 79.8984C190.658 79.3359 192.082 79.0547 193.664 79.0547C195.598 79.0547 197.232 79.418 198.568 80.1445C199.904 80.8711 200.941 81.8789 201.68 83.168C202.43 84.4453 202.893 85.9277 203.068 87.6152H199.693C199.529 86.4199 199.225 85.3945 198.779 84.5391C198.334 83.6719 197.701 83.0039 196.881 82.5352C196.061 82.0664 194.988 81.832 193.664 81.832C192.527 81.832 191.525 82.0488 190.658 82.4824C189.803 82.916 189.082 83.5312 188.496 84.3281C187.922 85.125 187.488 86.0801 187.195 87.1934C186.902 88.3066 186.756 89.543 186.756 90.9023V93.4863C186.756 94.7402 186.885 95.918 187.143 97.0195C187.412 98.1211 187.816 99.0879 188.355 99.9199C188.895 100.752 189.58 101.408 190.412 101.889C191.244 102.357 192.229 102.592 193.365 102.592C194.807 102.592 195.955 102.363 196.811 101.906C197.666 101.449 198.311 100.793 198.744 99.9375C199.189 99.082 199.506 98.0566 199.693 96.8613ZM221.332 98.5312C221.332 97.9336 221.238 97.4062 221.051 96.9492C220.875 96.4805 220.559 96.0586 220.102 95.6836C219.656 95.3086 219.035 94.9512 218.238 94.6113C217.453 94.2715 216.457 93.9258 215.25 93.5742C213.984 93.1992 212.842 92.7832 211.822 92.3262C210.803 91.8574 209.93 91.3242 209.203 90.7266C208.477 90.1289 207.92 89.4434 207.533 88.6699C207.146 87.8965 206.953 87.0117 206.953 86.0156C206.953 85.0195 207.158 84.0996 207.568 83.2559C207.979 82.4121 208.564 81.6797 209.326 81.0586C210.1 80.4258 211.02 79.9336 212.086 79.582C213.152 79.2305 214.342 79.0547 215.654 79.0547C217.576 79.0547 219.205 79.4238 220.541 80.1621C221.889 80.8887 222.914 81.8438 223.617 83.0273C224.32 84.1992 224.672 85.4531 224.672 86.7891H221.297C221.297 85.8281 221.092 84.9785 220.682 84.2402C220.271 83.4902 219.65 82.9043 218.818 82.4824C217.986 82.0488 216.932 81.832 215.654 81.832C214.447 81.832 213.451 82.0137 212.666 82.377C211.881 82.7402 211.295 83.2324 210.908 83.8535C210.533 84.4746 210.346 85.1836 210.346 85.9805C210.346 86.5195 210.457 87.0117 210.68 87.457C210.914 87.8906 211.271 88.2949 211.752 88.6699C212.244 89.0449 212.865 89.3906 213.615 89.707C214.377 90.0234 215.285 90.3281 216.34 90.6211C217.793 91.0312 219.047 91.4883 220.102 91.9922C221.156 92.4961 222.023 93.0645 222.703 93.6973C223.395 94.3184 223.904 95.0273 224.232 95.8242C224.572 96.6094 224.742 97.5 224.742 98.4961C224.742 99.5391 224.531 100.482 224.109 101.326C223.688 102.17 223.084 102.891 222.299 103.488C221.514 104.086 220.57 104.549 219.469 104.877C218.379 105.193 217.16 105.352 215.812 105.352C214.629 105.352 213.463 105.188 212.314 104.859C211.178 104.531 210.141 104.039 209.203 103.383C208.277 102.727 207.533 101.918 206.971 100.957C206.42 99.9844 206.145 98.8594 206.145 97.582H209.52C209.52 98.4609 209.689 99.2168 210.029 99.8496C210.369 100.471 210.832 100.986 211.418 101.396C212.016 101.807 212.689 102.111 213.439 102.311C214.201 102.498 214.992 102.592 215.812 102.592C216.996 102.592 217.998 102.428 218.818 102.1C219.639 101.771 220.26 101.303 220.682 100.693C221.115 100.084 221.332 99.3633 221.332 98.5312ZM242.707 98.5312C242.707 97.9336 242.613 97.4062 242.426 96.9492C242.25 96.4805 241.934 96.0586 241.477 95.6836C241.031 95.3086 240.41 94.9512 239.613 94.6113C238.828 94.2715 237.832 93.9258 236.625 93.5742C235.359 93.1992 234.217 92.7832 233.197 92.3262C232.178 91.8574 231.305 91.3242 230.578 90.7266C229.852 90.1289 229.295 89.4434 228.908 88.6699C228.521 87.8965 228.328 87.0117 228.328 86.0156C228.328 85.0195 228.533 84.0996 228.943 83.2559C229.354 82.4121 229.939 81.6797 230.701 81.0586C231.475 80.4258 232.395 79.9336 233.461 79.582C234.527 79.2305 235.717 79.0547 237.029 79.0547C238.951 79.0547 240.58 79.4238 241.916 80.1621C243.264 80.8887 244.289 81.8438 244.992 83.0273C245.695 84.1992 246.047 85.4531 246.047 86.7891H242.672C242.672 85.8281 242.467 84.9785 242.057 84.2402C241.646 83.4902 241.025 82.9043 240.193 82.4824C239.361 82.0488 238.307 81.832 237.029 81.832C235.822 81.832 234.826 82.0137 234.041 82.377C233.256 82.7402 232.67 83.2324 232.283 83.8535C231.908 84.4746 231.721 85.1836 231.721 85.9805C231.721 86.5195 231.832 87.0117 232.055 87.457C232.289 87.8906 232.646 88.2949 233.127 88.6699C233.619 89.0449 234.24 89.3906 234.99 89.707C235.752 90.0234 236.66 90.3281 237.715 90.6211C239.168 91.0312 240.422 91.4883 241.477 91.9922C242.531 92.4961 243.398 93.0645 244.078 93.6973C244.77 94.3184 245.279 95.0273 245.607 95.8242C245.947 96.6094 246.117 97.5 246.117 98.4961C246.117 99.5391 245.906 100.482 245.484 101.326C245.062 102.17 244.459 102.891 243.674 103.488C242.889 104.086 241.945 104.549 240.844 104.877C239.754 105.193 238.535 105.352 237.188 105.352C236.004 105.352 234.838 105.188 233.689 104.859C232.553 104.531 231.516 104.039 230.578 103.383C229.652 102.727 228.908 101.918 228.346 100.957C227.795 99.9844 227.52 98.8594 227.52 97.582H230.895C230.895 98.4609 231.064 99.2168 231.404 99.8496C231.744 100.471 232.207 100.986 232.793 101.396C233.391 101.807 234.064 102.111 234.814 102.311C235.576 102.498 236.367 102.592 237.188 102.592C238.371 102.592 239.373 102.428 240.193 102.1C241.014 101.771 241.635 101.303 242.057 100.693C242.49 100.084 242.707 99.3633 242.707 98.5312ZM267.51 76.9277L268.195 78.9316C266.801 79.3652 265.84 80.1445 265.312 81.2695C264.785 82.3828 264.521 83.6602 264.521 85.1016V88.7402C264.521 89.9121 264.281 90.9785 263.801 91.9395C263.332 92.8887 262.582 93.6445 261.551 94.207C260.531 94.7695 259.189 95.0508 257.525 95.0508V92.9062C258.85 92.9062 259.799 92.5312 260.373 91.7812C260.959 91.0312 261.252 90.0176 261.252 88.7402V85.1016C261.252 83.8711 261.439 82.7227 261.814 81.6562C262.201 80.5781 262.846 79.6348 263.748 78.8262C264.662 78.0059 265.916 77.373 267.51 76.9277ZM268.195 109.412L267.51 111.434C265.916 110.977 264.662 110.344 263.748 109.535C262.846 108.727 262.201 107.783 261.814 106.705C261.439 105.639 261.252 104.49 261.252 103.26V99.6387C261.252 98.7832 261.123 98.0449 260.865 97.4238C260.607 96.8027 260.203 96.3223 259.652 95.9824C259.113 95.6309 258.404 95.4551 257.525 95.4551V93.3105C259.189 93.3105 260.531 93.5918 261.551 94.1543C262.582 94.7168 263.332 95.4785 263.801 96.4395C264.281 97.3887 264.521 98.4551 264.521 99.6387V103.26C264.521 104.221 264.633 105.111 264.855 105.932C265.09 106.752 265.471 107.461 265.998 108.059C266.537 108.668 267.27 109.119 268.195 109.412ZM277.881 78.9316L278.566 76.9277C280.172 77.373 281.426 78.0059 282.328 78.8262C283.242 79.6348 283.887 80.5781 284.262 81.6562C284.637 82.7227 284.824 83.8711 284.824 85.1016V88.7402C284.824 89.584 284.953 90.3223 285.211 90.9551C285.469 91.5762 285.867 92.0566 286.406 92.3965C286.957 92.7363 287.672 92.9062 288.551 92.9062V94.8926C286.898 94.8926 285.557 94.6289 284.525 94.1016C283.494 93.5625 282.738 92.8301 282.258 91.9043C281.789 90.9668 281.555 89.9121 281.555 88.7402V85.1016C281.555 84.1406 281.443 83.25 281.221 82.4297C280.998 81.5977 280.617 80.8828 280.078 80.2852C279.551 79.6758 278.818 79.2246 277.881 78.9316ZM278.566 111.434L277.881 109.412C278.807 109.119 279.533 108.668 280.061 108.059C280.6 107.461 280.98 106.752 281.203 105.932C281.438 105.111 281.555 104.221 281.555 103.26V99.6387C281.555 98.4551 281.789 97.4004 282.258 96.4746C282.738 95.5488 283.494 94.8223 284.525 94.2949C285.557 93.7559 286.898 93.4863 288.551 93.4863V95.4551C287.238 95.4551 286.289 95.8359 285.703 96.5977C285.117 97.3477 284.824 98.3613 284.824 99.6387V103.26C284.824 104.49 284.637 105.639 284.262 106.705C283.887 107.783 283.242 108.727 282.328 109.535C281.426 110.344 280.172 110.977 278.566 111.434Z"
                fill="#EBF2FA"
                fillOpacity="0.6"
              />
            </svg>
          ) : index == 1 ? (
            <svg
              className="w-[100%] h-[100%]"
              viewBox="0 0 462 313"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMidYMid meet"
            >
              <g clipPath="url(#clip0_0_1)">
                <path
                  d="M222.388 102.684C222.388 108.995 217.254 114.132 210.937 114.132H195.716C195.224 108.946 191.086 104.804 185.893 104.312V94.5791C185.893 87.1273 179.829 81.0642 172.375 81.0642H150.792V61.515C150.792 54.0631 144.727 48 137.273 48H0V50.0665H72.0638V85.3956C72.0638 91.7067 66.9293 96.844 60.6126 96.844H47.0696V85.937C47.0696 78.4852 41.0051 72.422 33.5515 72.422H0V74.4885H33.5556C39.8682 74.4885 45.0068 79.6217 45.0068 85.937V96.844H0V98.9105H21.9846V102.68C21.9846 108.991 16.8502 114.128 10.5334 114.128H0V116.195H10.5334C17.987 116.195 24.0516 110.132 24.0516 102.68V98.9105H60.6126C68.0662 98.9105 74.1308 92.8474 74.1308 85.3956V50.0665H137.282C143.594 50.0665 148.733 55.1997 148.733 61.515V102.684C148.733 110.136 154.797 116.199 162.251 116.199H174.016C174.537 121.729 179.209 126.069 184.872 126.069C190.536 126.069 195.203 121.729 195.728 116.199H210.949C218.403 116.199 224.468 110.136 224.468 102.684V94.7321H294.088V92.6655H222.401V102.684H222.388ZM150.796 102.684V83.1348H172.379C178.692 83.1348 183.83 88.268 183.83 94.5833V104.317C178.642 104.808 174.5 108.946 174.008 114.137H162.243C155.93 114.137 150.792 109.003 150.792 102.688L150.796 102.684ZM184.864 124.002C179.99 124.002 176.025 120.039 176.025 115.166C176.025 110.293 179.99 106.329 184.864 106.329C189.738 106.329 193.702 110.293 193.702 115.166C193.702 120.039 189.738 124.002 184.864 124.002Z"
                  fill="#EBF2FA"
                  fillOpacity="0.6"
                />
                <path
                  d="M222.151 102.434H222.138V102.684C222.138 108.857 217.116 113.882 210.937 113.882H195.941C195.349 108.758 191.273 104.679 186.143 104.087V94.5791C186.143 86.9892 179.967 80.8142 172.375 80.8142H151.042V61.515C151.042 53.925 144.865 47.75 137.273 47.75H0H-0.25V48V50.0665V50.3165H0H71.8138V85.3956C71.8138 91.5686 66.7913 96.594 60.6126 96.594H47.3196V85.937C47.3196 78.347 41.1431 72.172 33.5515 72.172H0H-0.25V72.422V74.4885V74.7385H0H33.5556C39.7303 74.7385 44.7568 79.7599 44.7568 85.937V96.594H0H-0.25V96.844V98.9105V99.1605H0H21.7346V102.68C21.7346 108.853 16.7121 113.878 10.5334 113.878H0H-0.25V114.128V116.195V116.445H0H10.5334C18.125 116.445 24.3016 110.27 24.3016 102.68V99.1605H60.6126C68.2042 99.1605 74.3808 92.9855 74.3808 85.3956V50.3165H137.282C143.456 50.3165 148.483 55.3379 148.483 61.515V102.684C148.483 110.274 154.659 116.449 162.251 116.449H173.791C174.428 121.998 179.156 126.319 184.872 126.319C190.589 126.319 195.312 121.997 195.953 116.449H210.949C218.541 116.449 224.718 110.274 224.718 102.684V94.9821H294.088H294.338V94.7321V92.6655V92.4155H294.088H222.401H222.151V92.6655V102.434ZM151.042 102.791L151.046 102.787V102.684V83.3848H172.379C178.554 83.3848 183.58 88.4062 183.58 94.5833V104.091C178.454 104.683 174.375 108.758 173.783 113.887H162.243C156.102 113.887 151.097 108.921 151.042 102.791ZM184.864 123.752C180.128 123.752 176.275 119.9 176.275 115.166C176.275 110.431 180.128 106.579 184.864 106.579C189.6 106.579 193.452 110.431 193.452 115.166C193.452 119.9 189.6 123.752 184.864 123.752Z"
                  stroke="#EBF2FA"
                  strokeOpacity="0.6"
                  strokeWidth="0.5"
                />
                <path
                  d="M199.335 63.7022C193.023 63.7022 187.884 58.569 187.884 52.2538V39.1769C187.884 31.7251 181.82 25.6619 174.366 25.6619H95.6259C95.105 20.1319 90.4336 15.7923 84.77 15.7923C79.1065 15.7923 74.4392 20.1319 73.9142 25.6619H60.9045V13.515C60.9045 6.06314 54.8399 0 47.3863 0H-35V2.06651H47.3905C53.7031 2.06651 58.8416 7.19972 58.8416 13.515V25.6619H-35V27.7284H73.9183C74.4392 33.2584 79.1106 37.5981 84.7742 37.5981C90.4377 37.5981 95.105 33.2584 95.63 27.7284H174.37C180.683 27.7284 185.821 32.8616 185.821 39.1769V52.2538C185.821 59.7056 191.886 65.7687 199.339 65.7687H353.004V63.7022H199.339H199.335ZM84.7742 35.5316C79.9002 35.5316 75.9357 31.568 75.9357 26.6952C75.9357 21.8223 79.9002 17.8588 84.7742 17.8588C89.6481 17.8588 93.6126 21.8223 93.6126 26.6952C93.6126 31.568 89.6481 35.5316 84.7742 35.5316Z"
                  fill="#EBF2FA"
                  fillOpacity="0.6"
                />
                <path
                  d="M73.6891 25.4119H61.1545V13.515C61.1545 5.92501 54.9779 -0.25 47.3863 -0.25H-35H-35.25V0V2.06651V2.31651H-35H47.3905C53.5651 2.31651 58.5916 7.33791 58.5916 13.515V25.4119H-35H-35.25V25.6619V27.7284V27.9784H-35H73.6931C74.3304 33.5271 79.058 37.8481 84.7742 37.8481C90.4906 37.8481 95.2139 33.5269 95.8551 27.9784H174.37C180.545 27.9784 185.571 32.9998 185.571 39.1769V52.2538C185.571 59.8437 191.748 66.0187 199.339 66.0187H353.004H353.254V65.7687V63.7022V63.4522H353.004H199.339H199.335C193.161 63.4522 188.134 58.4308 188.134 52.2538V39.1769C188.134 31.5869 181.958 25.4119 174.366 25.4119H95.8511C95.2138 19.8632 90.4862 15.5423 84.77 15.5423C79.0536 15.5423 74.3303 19.8634 73.6891 25.4119ZM84.7742 35.2816C80.0382 35.2816 76.1857 31.4299 76.1857 26.6952C76.1857 21.9605 80.0382 18.1088 84.7742 18.1088C89.5101 18.1088 93.3626 21.9605 93.3626 26.6952C93.3626 31.4299 89.5101 35.2816 84.7742 35.2816Z"
                  stroke="#EBF2FA"
                  strokeOpacity="0.6"
                  strokeWidth="0.5"
                />
              </g>
              <path
                d="M279.025 309.549C271.509 309.549 265.39 303.461 265.39 295.972V280.463C265.39 271.625 258.169 264.434 249.294 264.434H155.537C154.917 257.876 149.355 252.729 142.611 252.729C135.868 252.729 130.31 257.876 129.685 264.434H114.194V250.028C114.194 241.191 106.973 234 98.0981 234H0V236.451H98.1031C105.62 236.451 111.738 242.539 111.738 250.028V264.434H0V266.885H129.69C130.31 273.444 135.873 278.59 142.616 278.59C149.36 278.59 154.917 273.444 155.542 266.885H249.299C256.815 266.885 262.934 272.973 262.934 280.463V295.972C262.934 304.809 270.155 312 279.03 312H462V309.549H279.03H279.025ZM142.616 276.14C136.813 276.14 132.092 271.439 132.092 265.66C132.092 259.881 136.813 255.18 142.616 255.18C148.42 255.18 153.14 259.881 153.14 265.66C153.14 271.439 148.42 276.14 142.616 276.14Z"
                fill="#EBF2FA"
                fillOpacity="0.6"
              />
              <path
                d="M129.46 264.184H114.444V250.028C114.444 241.052 107.11 233.75 98.0981 233.75H0H-0.25V234V236.451V236.701H0H98.1031C105.483 236.701 111.488 242.678 111.488 250.028V264.184H0H-0.25V264.434V266.885V267.135H0H129.465C130.202 273.713 135.821 278.84 142.616 278.84C149.412 278.84 155.026 273.713 155.768 267.135H249.299C256.678 267.135 262.684 273.112 262.684 280.463V295.972C262.684 304.948 270.018 312.25 279.03 312.25H462H462.25V312V309.549V309.299H462H279.03H279.025C271.646 309.299 265.64 303.322 265.64 295.972V280.463C265.64 271.486 258.306 264.184 249.294 264.184H155.763C155.025 257.606 149.406 252.479 142.611 252.479C135.816 252.479 130.202 257.607 129.46 264.184ZM142.616 275.89C136.95 275.89 132.342 271.3 132.342 265.66C132.342 260.02 136.95 255.43 142.616 255.43C148.283 255.43 152.89 260.02 152.89 265.66C152.89 271.3 148.283 275.89 142.616 275.89Z"
                stroke="#EBF2FA"
                strokeOpacity="0.6"
                strokeWidth="0.5"
              />
              <defs>
                <clipPath id="clip0_0_1">
                  <rect width="388" height="130" fill="white" />
                </clipPath>
              </defs>
            </svg>
          ) : (
            <svg
              className="w-[90%] h-[100%]"
              viewBox="0 0 407 407"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMidYMid meet"
            >
              <path
                d="M205 295H167V331H205V295Z"
                stroke="#EBF2FA"
                strokeOpacity="0.52"
                strokeWidth="6"
                strokeLinejoin="round"
              />
              <path
                d="M404 364H260V400H404V364Z"
                stroke="#EBF2FA"
                strokeOpacity="0.52"
                strokeWidth="6"
                strokeLinejoin="round"
              />
              <path
                d="M38 92H-4V128H38V92Z"
                stroke="#EBF2FA"
                strokeOpacity="0.52"
                strokeWidth="6"
                strokeLinejoin="round"
              />
              <path
                d="M404 92H260V128H404V92Z"
                stroke="#EBF2FA"
                strokeOpacity="0.52"
                strokeWidth="6"
                strokeLinejoin="round"
              />
              <path
                d="M334.5 314H337C337 312.619 335.881 311.5 334.5 311.5V314ZM332.732 362.268C333.709 363.244 335.291 363.244 336.268 362.268L352.178 346.358C353.154 345.382 353.154 343.799 352.178 342.822C351.201 341.846 349.618 341.846 348.642 342.822L334.5 356.964L320.358 342.822C319.382 341.846 317.799 341.846 316.822 342.822C315.846 343.799 315.846 345.382 316.822 346.358L332.732 362.268ZM206.5 316.5H334.5V311.5H206.5V316.5ZM332 314V360.5H337V314H332Z"
                fill="#EBF2FA"
                fillOpacity="0.52"
              />
              <path
                d="M164.002 316.268C164.978 315.291 164.978 313.709 164.002 312.732L148.092 296.822C147.116 295.846 145.533 295.846 144.557 296.822C143.58 297.799 143.58 299.382 144.557 300.358L158.699 314.5L144.557 328.642C143.58 329.618 143.58 331.201 144.557 332.178C145.533 333.154 147.116 333.154 148.092 332.178L164.002 316.268ZM-2.5 317H162.234V312H-2.5V317Z"
                fill="#EBF2FA"
                fillOpacity="0.52"
              />
              <path
                d="M261.768 111.768C262.744 110.791 262.744 109.209 261.768 108.232L245.858 92.3223C244.882 91.346 243.299 91.346 242.322 92.3223C241.346 93.2986 241.346 94.8816 242.322 95.8579L256.464 110L242.322 124.142C241.346 125.118 241.346 126.701 242.322 127.678C243.299 128.654 244.882 128.654 245.858 127.678L261.768 111.768ZM41 112.5H260V107.5H41V112.5Z"
                fill="#EBF2FA"
                fillOpacity="0.52"
              />
              <path
                d="M333.768 -1.76776C332.791 -2.74407 331.209 -2.74407 330.232 -1.76776L314.322 14.1421C313.346 15.1185 313.346 16.7014 314.322 17.6777C315.299 18.654 316.882 18.654 317.858 17.6777L332 3.53555L346.142 17.6777C347.118 18.654 348.701 18.654 349.678 17.6777C350.654 16.7014 350.654 15.1185 349.678 14.1421L333.768 -1.76776ZM334.5 89L334.5 7.50415e-06L329.5 7.75464e-06L329.5 89L334.5 89Z"
                fill="#EBF2FA"
                fillOpacity="0.52"
              />
            </svg>
          )}
        </div>
        <div className="flip-card-back">
          <div className="flip-card-back-content">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-6 pt-4">
              {frontContent}
            </h3>
            <div className="grow flex items-center justify-center">
              <p className="text-base md:text-lg p-4 font-medium leading-relaxed pb-[10%]">
                {backContent}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
