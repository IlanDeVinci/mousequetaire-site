"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import ScrollReveal from "../../components/ScrollReveal";
import { useGSAP } from "../../context/GSAPContext";

function DiscoverElement() {
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
          text: "Ambitieux et pleins d'idées, nous voulions tous, un jour, pouvoir entreprendre et révolutionner le digital en cassant les codes.",
        };
      case 2:
        return {
          title: "Rencontre",
          text: "Nous nous sommes rencontrés en école supérieure, où nous avons eu l'occasion de mener à bien une multitude de projets, suivi des semaines intensives en Hackathon et bien d'autres",
        };
      case 3:
        return {
          title: "Collaboration",
          text: "Nous avons donc eu l'idée de nous lancer dans cette aventure qui ne fera que de rendre le monde du web meilleur, nous apportons des solutions durables, qui auront de l'impact sur notre environnement.",
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

const teamMembers = [
  {
    id: 1,
    name: "Samuel Alhadef",
    role: "CEO/CCO | Chief Communication Officer",
    description:
      "Je m'occupe de vous écouter et de comprendre vos besoins. En tant que responsable des clients, je suis là pour répondre à vos questions et m'assurer que votre projet avance bien. Vous parlez directement avec moi, du premier rendez-vous jusqu'à la fin ",
    image: "/images/photo-samuel.jpg",
  },
  {
    id: 2,
    name: "Célestin Godefroy",
    role: "COO | Chief Operational Officer / Responsable Communication",
    description:
      "Je coordonne toutes nos opérations et veille au bon déroulement de votre projet. Je m'assure que les délais sont respectés et que chaque étape est réalisée avec qualité. Je suis également chargé de faire connaître et croître Mousequetaires.",
    image: "/images/photo-célestin.jpg",
  },
  {
    id: 3,
    name: "Ilan Maouchi",
    role: "CTO | Chief Technical Officer",
    description:
      "Expert technique de l'équipe, je conçois les solutions et choisis les technologies adaptées à votre projet. Je transforme vos idées en réalités numériques fonctionnelles et innovantes. Pour toute question technique, comptez sur mon expertise.",
    image: "/images/photo-ilan.jpeg",
  },
  {
    id: 4,
    name: "Dorian Collet",
    role: "Directeur Artistique",
    description:
      "Je suis le Directeur Artistique, responsable de toute l'identité visuelle de vos projets. Je supervise la création des designs, garantis leur cohérence et m'assure qu'ils reflètent parfaitement votre image de marque. Mon rôle est de transformer vos idées en expériences visuelles impactantes.",
    image: "/images/photo-dorian.png",
  },
  {
    id: 5,
    name: "Jade-Bérénice",
    role: "Responsable Juridique",
    description:
      "Je m'occupe de la rédaction et de la révision de tous les contrats et conditions d'utilisation de vos projets. Mon expertise juridique garantit que vos documents légaux sont conformes aux réglementations en vigueur et protègent efficacement votre entreprise et vos utilisateurs.",
    image: "/images/Photo-Jade.jpg",
  },
  {
    id: 6,
    name: "Ilona DUBLINEAU",
    role: "Responsable Commercial & Marketing",
    description:
      "Je suis la Responsable Commercial et Marketing, en charge de développer notre portefeuille client. Mon rôle consiste à identifier de nouvelles opportunités, prospecter, et établir des relations solides avec nos futurs partenaires. J'accompagne les clients dès le premier contact, comprends leurs besoins et leur propose des solutions adaptées. Mon objectif est de créer une collaboration de confiance et de décrocher les contrats qui permettront à votre projet de prendre de l'ampleur.",
    image: "/images/photo_ilona.jpg",
  },
];

function TeamMember({ image, name, role, description, reverse }) {
  const isDorian = name === "Dorian Collet";
  const memberRef = useRef(null);
  const { gsap, contextReady } = useGSAP();

  useEffect(() => {
    if (!contextReady || !gsap || !memberRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          gsap.fromTo(
            memberRef.current,
            {
              opacity: 0,
              x: reverse ? 50 : -50,
              rotationY: reverse ? 15 : -15,
            },
            {
              opacity: 1,
              x: 0,
              rotationY: 0,
              duration: 1,
              ease: "power3.out",
              delay: 0.1,
            }
          );
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(memberRef.current);

    return () => observer.disconnect();
  }, [contextReady, gsap, reverse]);

  return (
    <ScrollReveal
      animation={reverse ? "fade-left" : "fade-right"}
      delay={100}
      className={`flex flex-col md:flex-row items-center mb-8 md:mb-12`}
    >
      <article
        ref={memberRef}
        className={`flex flex-col ${
          reverse ? "md:flex-row-reverse" : "md:flex-row"
        } items-center mb-8 md:mb-12`}
      >
        <div className="rounded-full overflow-hidden shrink-0 w-[120px] h-[120px] sm:w-[150px] sm:h-[150px] md:w-[180px] md:h-[180px] lg:w-[200px] lg:h-[200px] mb-4 md:mb-0">
          <Image
            src={image}
            alt={`Photo de ${name}`}
            width={200}
            height={200}
            className={`w-full h-full object-cover object-top ${
              isDorian ? "scale-125" : ""
            }`}
          />
        </div>
        <div
          className={`${
            reverse ? "mr-4 md:mr-6 lg:mr-12" : "ml-4 md:ml-6 lg:ml-12"
          } text-center md:text-left ${reverse ? "md:text-right" : ""} text-lg`}
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl">{name}</h2>
          <h3 className="text-[#87D7FF] my-2 text-base sm:text-lg md:text-xl">
            {role}
          </h3>
          <p className="text-xs sm:text-sm md:text-base">{description}</p>
        </div>
      </article>
    </ScrollReveal>
  );
}

export default function Equipe() {
  const [hoveredValue1, setHoveredValue1] = useState(false);
  const [hoveredValue2, setHoveredValue2] = useState(false);
  const [hoveredValue3, setHoveredValue3] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const value1Ref = useRef(null);
  const value2Ref = useRef(null);
  const value3Ref = useRef(null);
  const { gsap, contextReady } = useGSAP();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia("(max-width: 768px)").matches);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleValueHover = (valueNumber, isHovering) => {
    if (!contextReady || !gsap) return;

    const refs = [value1Ref, value2Ref, value3Ref];
    const setters = [setHoveredValue1, setHoveredValue2, setHoveredValue3];
    const ref = refs[valueNumber - 1];
    const setter = setters[valueNumber - 1];

    if (!ref.current) return;

    const content = ref.current.querySelector(".value-content");
    const textElement = content?.querySelector("p");

    if (!content || !textElement) return;

    if (isHovering) {
      // Smooth scale animation for the content
      gsap.to(content, {
        transformOrigin: valueNumber === 2 ? "right center" : "left center",
        scaleX: 1,
        duration: 0.1,
        ease: "power2.out",
      });

      // Fade text animation - change state only after fade out is complete
      gsap.to(textElement, {
        opacity: 0,
        duration: 0.15,
        ease: "power2.out",
        onComplete: () => {
          setter(true);
          gsap.to(textElement, {
            opacity: 1,
            duration: 0.15,
            ease: "power2.out",
          });
        },
      });
    } else {
      // Return to normal with smooth ease
      gsap.to(content, {
        scaleX: 1,
        duration: 0.15,
        ease: "power2.out",
      });

      // Fade text back - change state only after fade out is complete
      gsap.to(textElement, {
        opacity: 0,
        duration: 0.2,
        ease: "power2.out",
        onComplete: () => {
          setter(false);
          gsap.to(textElement, {
            opacity: 1,
            duration: 0.15,
            ease: "power2.out",
          });
        },
      });
    }
  };

  return (
    <>
      <main className="pt-20">
        <ScrollReveal animation="fade-down" delay={100}>
          <header className="p-4 md:p-24 text-center">
            <h1 className="text-3xl md:text-5xl pb-4 md:pb-8">
              Qui sommes nous ?
            </h1>
            <p>
              Nous sommes trois passionnés qui, autour d&apos;un bon repas et de
              discussions enflammées, avons donné vie à Mouse-quetaires en 2025.
              Notre histoire ? Celle d&apos;amis qui partagent un rêve simple
              mais ambitieux : rendre la technologie et l&apos;IA vraiment
              accessibles à tous, sans le jargon intimidant.
            </p>
          </header>
        </ScrollReveal>
        <ScrollReveal animation="zoom-in" delay={200}>
          <section className="flex justify-center mb-16 px-4">
            <DiscoverElement />
          </section>
        </ScrollReveal>

        <ScrollReveal animation="fade-up" delay={100}>
          <section className="text-center justify-center mb-16 px-4 md:px-12 lg:px-44">
            <h1 className="text-3xl md:text-4xl mb-12 md:mb-24">
              Notre équipe
            </h1>
            {teamMembers.map((member, index) => (
              <TeamMember
                key={member.id}
                image={member.image}
                name={member.name}
                role={member.role}
                description={member.description}
                reverse={index % 2 === 1}
              />
            ))}
          </section>
        </ScrollReveal>

        <section className="text-center my-16 pb-24 md:my-24 md:pb-32">
          <ScrollReveal animation="fade-up" delay={100}>
            <h1 className="text-3xl md:text-4xl my-12 md:my-16 md:mb-24">
              Nos valeurs
            </h1>
          </ScrollReveal>

          <ScrollReveal animation="fade-right" delay={200} threshold={0.2}>
            <div
              ref={value1Ref}
              className="relative px-2 md:px-4 py-24 sm:py-28 md:py-32 flex justify-center overflow-visible w-full cursor-pointer group"
              onMouseEnter={() => !isMobile && handleValueHover(1, true)}
              onMouseLeave={() => !isMobile && handleValueHover(1, false)}
              onClick={() => isMobile && setHoveredValue1(!hoveredValue1)}
            >
              {/* Invisible hitbox layer that covers the rectangle area */}
              <div className="absolute top-1/2 left-[40px] md:left-[60px] transform -translate-y-1/2 h-[180px] sm:h-[180px] md:h-[180px] lg:h-[200px] w-[85%] sm:w-[80%] md:w-[65%] lg:w-[55%] z-40"></div>

              <div
                className={`absolute top-0 rounded-r-full bg-[#00527A] text-white p-4 md:p-8 
                        h-[180px] sm:h-[180px] md:h-[180px] lg:h-[200px] left-0 z-10
                        transition-all duration-500 ease-out
                        ${
                          hoveredValue1
                            ? "w-[95vw] md:w-[85vw] lg:w-[80vw]"
                            : "w-[85%] sm:w-[80%] md:w-[60%] lg:w-[45%]"
                        } group-hover:shadow-lg`}
              ></div>

              <div
                className={`absolute top-0 rounded-r-full bg-[#006A9E] text-white p-4 md:p-8 
                        h-[180px] sm:h-[180px] md:h-[180px] lg:h-[200px] left-[-20px] md:left-[-40px] z-20
                        transition-all duration-500 ease-out
                        ${
                          hoveredValue1
                            ? "w-[95vw] md:w-[85vw] lg:w-[80vw]"
                            : "w-[85%] sm:w-[80%] md:w-[60%] lg:w-[45%]"
                        } group-hover:shadow-lg`}
              ></div>

              <div
                className={`absolute top-0 rounded-r-full bg-[#0091D9] text-white pl-4 md:pl-8 
                        flex items-center gap-2 md:gap-4 value-content
                        transition-all duration-500 ease-out
                        h-[180px] sm:h-[180px] md:h-[180px] lg:h-[200px] left-[-40px] md:left-[-80px] z-30
                        ${
                          hoveredValue1
                            ? "w-[95vw] md:w-[85vw] lg:w-[80vw]"
                            : "w-[85%] sm:w-[80%] md:w-[60%] lg:w-[45%]"
                        } group-hover:shadow-lg`}
              >
                <div className="shrink-0 ml-[40px] md:ml-[60px] lg:ml-[80px] -left-8 md:left-0">
                  <Image
                    src="/images/valeur1.svg"
                    alt="Icon Entraide"
                    width={100}
                    height={100}
                    className="w-[40px] h-[40px] sm:w-[60px] sm:h-[60px] md:w-[100px] md:h-[100px] rounded-full"
                  />
                </div>
                <div className="overflow-hidden h-full flex items-center">
                  <p
                    className={`text-[10px] xs:text-[11px] sm:text-xs md:text-sm lg:text-base ${
                      hoveredValue1
                        ? "font-montserrat font-bold"
                        : "font-montserrat font-extrabold whitespace-nowrap"
                    } transition-all duration-500 ease-out text-left`}
                  >
                    {hoveredValue1 ? (
                      <span className="fade-in-text overflow-y-auto max-h-{170px] sm:max-h-[160px] md:max-h-[150px] lg:max-h-[170px] block w-[60vw] sm:w-[50vw] md:w-[55vw] lg:w-[60vw] font-montserrat font-bold text-[10px] xs:text-[10px] sm:text-xs md:text-[13px] lg:text-sm">
                        L&apos;entraide est au cœur de notre ADN, car nous
                        savons que les meilleures solutions naissent du partage
                        des idées et des compétences. Notre collaboration
                        quotidienne nous permet de voir chaque défi sous
                        plusieurs angles et d&apos;y apporter des réponses plus
                        innovantes. Ensemble, nous transformons vos projets en
                        succès collectifs où la satisfaction de nos clients est
                        notre plus belle récompense.
                      </span>
                    ) : (
                      "Entraide Collaboration"
                    )}
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade-left" delay={300} threshold={0.2}>
            <div
              ref={value2Ref}
              className="relative px-2 md:px-4 py-24 sm:py-28 md:py-32 flex justify-center overflow-visible w-full cursor-pointer group"
              onMouseEnter={() => !isMobile && handleValueHover(2, true)}
              onMouseLeave={() => !isMobile && handleValueHover(2, false)}
              onClick={() => isMobile && setHoveredValue2(!hoveredValue2)}
            >
              {/* Invisible hitbox layer that covers the rectangle area */}
              <div className="absolute top-1/2 right-[40px] md:right-[60px] transform -translate-y-1/2 h-[180px] sm:h-[180px] md:h-[180px] lg:h-[200px] w-[85%] sm:w-[80%] md:w-[65%] lg:w-[55%] z-40"></div>

              <div
                className={`absolute top-0 rounded-l-full bg-[#00527A] text-white p-4 md:p-8 
                        h-[180px] sm:h-[180px] md:h-[180px] lg:h-[200px] right-0 z-10
                        transition-all duration-500 ease-out
                        ${
                          hoveredValue2
                            ? "w-[95vw] md:w-[85vw] lg:w-[80vw]"
                            : "w-[85%] sm:w-[80%] md:w-[60%] lg:w-[45%]"
                        } group-hover:shadow-lg`}
              ></div>

              <div
                className={`absolute top-0 rounded-l-full bg-[#006A9E] text-white p-4 md:p-8 
                        h-[180px] sm:h-[180px] md:h-[180px] lg:h-[200px] right-[-20px] md:right-[-40px] z-20
                        transition-all duration-500 ease-out
                        ${
                          hoveredValue2
                            ? "w-[95vw] md:w-[85vw] lg:w-[80vw]"
                            : "w-[85%] sm:w-[80%] md:w-[60%] lg:w-[45%]"
                        } group-hover:shadow-lg`}
              ></div>

              <div
                className={`absolute top-0 rounded-l-full bg-[#0091D9] text-white pr-4 md:pr-8 
                        flex items-center justify-end gap-2 md:gap-4 value-content
                        transition-all duration-500 ease-out
                        h-[180px] sm:h-[180px] md:h-[180px] lg:h-[200px] right-[-40px] md:right-[-80px] z-30
                        ${
                          hoveredValue2
                            ? "w-[95vw] md:w-[85vw] lg:w-[80vw]"
                            : "w-[85%] sm:w-[80%] md:w-[60%] lg:w-[45%]"
                        } group-hover:shadow-lg`}
              >
                <div className="overflow-hidden h-full flex items-center grow justify-end">
                  <p
                    className={`text-[10px] xs:text-[11px] sm:text-xs md:text-sm lg:text-base ${
                      hoveredValue2
                        ? "font-montserrat font-bold"
                        : "font-montserrat font-extrabold whitespace-nowrap"
                    } transition-all duration-500 ease-out text-right`}
                  >
                    {hoveredValue2 ? (
                      <span className="fade-in-text overflow-y-auto max-h-{170px] sm:max-h-[160px] md:max-h-[150px] lg:max-h-[170px] block w-[60vw] sm:w-[50vw] md:w-[55vw] lg:w-[60vw] font-montserrat font-bold text-[10px] xs:text-[11px] sm:text-xs md:text-[13px] lg:text-sm">
                        L&apos;innovation guide chacune de nos décisions, nous
                        poussant constamment à explorer de nouvelles approches
                        pour résoudre vos défis numériques. Notre créativité se
                        nourrit de curiosité, d&apos;expérimentation et
                        d&apos;une volonté de dépasser les solutions
                        conventionnelles. Nous transformons les contraintes en
                        opportunités créatives, apportant à vos projets cette
                        étincelle qui les rend uniques et mémorables.
                      </span>
                    ) : (
                      "Innovation Créativité"
                    )}
                  </p>
                </div>
                <div className="shrink-0 mr-[40px] md:mr-[60px] lg:mr-[80px]">
                  <Image
                    src="/images/valeur2.svg"
                    alt="Icon Innovation"
                    width={100}
                    height={100}
                    className="w-[40px] h-[40px] sm:w-[60px] sm:h-[60px] md:w-[100px] md:h-[100px] rounded-full"
                  />
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade-right" delay={400} threshold={0.2}>
            <div
              ref={value3Ref}
              className="relative px-2 md:px-4 py-24 sm:py-28 md:py-32 flex justify-center overflow-visible w-full cursor-pointer group"
              onMouseEnter={() => !isMobile && handleValueHover(3, true)}
              onMouseLeave={() => !isMobile && handleValueHover(3, false)}
              onClick={() => isMobile && setHoveredValue3(!hoveredValue3)}
            >
              {/* Invisible hitbox layer that covers the rectangle area */}
              <div className="absolute top-1/2 left-[40px] md:left-[60px] transform -translate-y-1/2 h-[180px] sm:h-[180px] md:h-[180px] lg:h-[200px] w-[85%] sm:w-[80%] md:w-[65%] lg:w-[55%] z-40"></div>

              <div
                className={`absolute top-0 rounded-r-full bg-[#00527A] text-white p-4 md:p-8 
                        h-[180px] sm:h-[180px] md:h-[180px] lg:h-[200px] left-0 z-10
                        transition-all duration-500 ease-out
                        ${
                          hoveredValue3
                            ? "w-[95vw] md:w-[85vw] lg:w-[80vw]"
                            : "w-[85%] sm:w-[80%] md:w-[60%] lg:w-[45%]"
                        } group-hover:shadow-lg`}
              ></div>

              <div
                className={`absolute top-0 rounded-r-full bg-[#006A9E] text-white p-4 md:p-8 
                        h-[180px] sm:h-[180px] md:h-[180px] lg:h-[200px] left-[-20px] md:left-[-40px] z-20
                        transition-all duration-500 ease-out
                        ${
                          hoveredValue3
                            ? "w-[95vw] md:w-[85vw] lg:w-[80vw]"
                            : "w-[85%] sm:w-[80%] md:w-[60%] lg:w-[45%]"
                        } group-hover:shadow-lg`}
              ></div>

              <div
                className={`absolute top-0 rounded-r-full bg-[#0091D9] text-white pl-4 md:pl-8 
                        flex items-center gap-2 md:gap-4 value-content
                        transition-all duration-500 ease-out
                        h-[180px] sm:h-[180px] md:h-[180px] lg:h-[200px] left-[-40px] md:left-[-80px] z-30
                        ${
                          hoveredValue3
                            ? "w-[95vw] md:w-[85vw] lg:w-[80vw]"
                            : "w-[85%] sm:w-[80%] md:w-[60%] lg:w-[45%]"
                        } group-hover:shadow-lg`}
              >
                <div className="shrink-0 ml-[40px] md:ml-[60px] lg:ml-[80px]">
                  <Image
                    src="/images/valeur3.svg"
                    alt="Icon Excellence"
                    width={100}
                    height={100}
                    className="w-[40px] h-[40px] sm:w-[60px] sm:h-[60px] md:w-[100px] md:h-[100px] rounded-full"
                  />
                </div>
                <div className="overflow-hidden h-full flex items-center">
                  <p
                    className={`text-[10px] xs:text-[11px] sm:text-xs md:text-sm lg:text-base ${
                      hoveredValue3
                        ? "font-montserrat font-bold"
                        : "font-montserrat font-extrabold whitespace-nowrap"
                    } transition-all duration-500 ease-out text-left`}
                  >
                    {hoveredValue3 ? (
                      <span className="fade-in-text overflow-y-auto max-h-{170px] sm:max-h-[160px] md:max-h-[150px] lg:max-h-[170px] block w-[60vw] sm:w-[50vw] md:w-[55vw] lg:w-[60vw] font-montserrat font-bold text-[10px] xs:text-[11px] sm:text-xs md:text-[13px] lg:text-sm">
                        L&apos;excellence n&apos;est pas négociable pour nous,
                        chaque ligne de code et chaque pixel sont
                        méticuleusement travaillés pour atteindre les plus hauts
                        standards. Notre exigence de qualité se traduit par des
                        tests rigoureux et une attention obsessionnelle aux
                        détails que vous remarquerez dans le produit final. Nous
                        ne livrons que des solutions dont nous sommes fiers, car
                        votre satisfaction et la performance de votre projet
                        sont notre véritable mesure de réussite.
                      </span>
                    ) : (
                      "Excellence Qualité"
                    )}
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </section>
      </main>

      <style jsx global>{`
        @keyframes circleGlow {
          0% {
            box-shadow: 0 0 0 0px rgba(135, 215, 255, 0.5);
          }
          50% {
            box-shadow: 0 0 0 30px rgba(135, 215, 255, 0.8);
          }
          100% {
            box-shadow: 0 0 0 0px rgba(135, 215, 255, 0.5);
          }
        }

        @keyframes fadeInText {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .fade-in-text {
          animation: fadeInText 0.6s ease-out forwards;
        }

        .value-content {
          will-change: transform;
        }
      `}</style>
    </>
  );
}
