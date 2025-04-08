"use client";

import Image from "next/image";
import React from "react";
import Link from "next/link";
import WindAnimation from "../components/WindAnimation";
import ScrollReveal from "../components/ScrollReveal";

export default function Home() {
  return (
    <>
      <section className="relative min-h-[90vh] -mt-16 flex items-center justify-center bg-[050610] overflow-hidden font-montserrat">
        {/* Wind Animation SVG - now with responsive sizing */}
        <div className="absolute inset-0 h-full">
          <WindAnimation />
        </div>

        {/* Logo in top left */}
        <div className="container mx-auto px-4 relative z-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="absolute -top-12 left-50 z-30 opacity-70 ">
              <span className="text-gray-400 font-mono text-3xl">
                &lt;mouse-quetaires/&gt;
              </span>
            </div>
            <div className="relative mt-8 z-30">
              <h1
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light mb-6 overflow-hidden opacity-0 font-Montserrat metal-text fade-in max-w-full"
                data-text="Créons le Futur Numérique"
              >
                <span className="block text-center whitespace-normal px-2">
                  Créons le Futur Numérique
                </span>
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
                color: #888;
                text-shadow: 0 0 2px rgba(255, 255, 255, 0.25),
                  0 0 4px rgba(255, 255, 255, 0.15);
                animation: subtleGlow 1.5s ease-in-out infinite;
                will-change: opacity;
                line-height: 1.2;
                overflow-wrap: break-word;
                word-wrap: break-word;
                -webkit-hyphens: auto;
                -ms-hyphens: auto;
                hyphens: auto;
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
      </section>
      {/* Services Section */}
      <ScrollReveal animation="fade-up" threshold={0.1}>
        <section className="py-16 mx-[5vw]">
          <div className="container mx-auto px-4">
            <h2 className="text-5xl font-light text-center mb-12 text-white">
              Nos Services
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Développement Web",
                  description:
                    "Sites et applications web performants avec les technologies modernes",
                },
                {
                  title: "Design UX/UI",
                  description:
                    "Interfaces intuitives et esthétiques pour une expérience utilisateur optimale",
                },
                {
                  title: "Stratégie Digitale",
                  description:
                    "Conseil et accompagnement pour votre transformation numérique",
                },
              ].map((service, index) => (
                <ScrollReveal
                  key={index}
                  animation="fade-up"
                  threshold={0.1}
                  delay={index * 150}
                >
                  <div className="bg-[#003C59] rounded-2xl p-6 m-[1vw] transition-all duration-300 aspect-square hover:shadow-lg hover:shadow-blue-500/20 flex text-center items-center justify-center flex-col relative group overflow-hidden">
                    <h3 className="text-2xl md:text-3xl font-medium text-[#87D7FF] mb-3 z-10 transition-all duration-300 group-hover:transform group-hover:translate-y-[-10px] ">
                      {service.title}
                    </h3>
                    <p className="text-[#050610] absolute opacity-0 mt-20 transition-all duration-300 transform translate-y-8 group-hover:opacity-100 group-hover:translate-y-0 max-w-[80%]">
                      {service.description}
                    </p>
                  </div>
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
                  role: "CCO - Chief Claude Officer",
                  image: "/images/photo-samuel.jpg",
                },
                {
                  name: "Célestin Godefroy",
                  role: "CBO - Chief Branleur Officer",
                  image: "/images/photo-célestin.jpg",
                },
                {
                  name: "Ilan Maouchi",
                  role: "CIO - Chief Information Officer",
                  image: "/images/photo-ilan.jpeg",
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
                        className="object-cover w-full h-full"
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
              <button className="bg-[#EBF2FA] hover:bg-[#256b90] text-white font-semibold py-3 px-6 rounded-full transition duration-300 flex items-center justify-center mx-auto">
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
            <h2 className="text-5xl font-light text-center mb-12 text-white">
              Les MouseQuetaires, notre ambition...{" "}
            </h2>

            <div className="max-w-5xl mx-auto space-y-12">
              <ScrollReveal animation="fade-left" delay={100}>
                <div className="flex justify-start">
                  <div className="w-4/5 md:w-2/3 text-gray-300">
                    <p className="text-lg">
                      Mouse-quetaires est né de la rencontre de trois passionnés
                      de technologie qui partagent une vision commune : rendre
                      le numérique accessible et innovant pour tous. Fondée en
                      2020, notre entreprise s&apos;est rapidement imposée comme
                      un acteur innovant dans le domaine du développement web et
                      de l&apos;expérience utilisateur.
                    </p>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal animation="fade-right" delay={300}>
                <div className="flex justify-end">
                  <div className="w-4/5 md:w-2/3 text-gray-300">
                    <p className="text-lg">
                      Notre philosophie repose sur trois piliers : la qualité,
                      la créativité et la transparence. Nous croyons fermement
                      que chaque projet mérite une attention particulière et une
                      approche personnalisée. Nous combinons expertise technique
                      et créativité pour répondre aux défis numériques de nos
                      clients.
                    </p>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal animation="fade-left" delay={500}>
                <div className="flex justify-start">
                  <div className="w-4/5 md:w-2/3 text-gray-300">
                    <p className="text-lg">
                      Aujourd&apos;hui, nous sommes fiers d&apos;accompagner des
                      entreprises de toutes tailles dans leur transformation
                      digitale, en créant des solutions sur mesure qui répondent
                      à leurs besoins spécifiques. Notre engagement est de
                      continuer à innover et à repousser les limites du possible
                      pour nos clients.
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
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050610] z-10" />
                    <Image
                      src={project.image}
                      alt={project.title}
                      width={400}
                      height={400}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050610]/40 to-[#050610] flex flex-col justify-end p-4 transition-all z-20"></div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
            <div className="mt-12 text-center">
              <Link href="/portfolio">
                <button className="bg-[#EBF2FA] hover:bg-[#256b90] text-white font-semibold py-3 px-6 rounded-full transition duration-300 flex items-center justify-center mx-auto">
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
