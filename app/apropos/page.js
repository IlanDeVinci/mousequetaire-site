"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import ScrollReveal from "../../components/ScrollReveal";

function DiscoverElement() {
  const [phase, setPhase] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true);
    }, 500);
  }, []);

  const handleClick = () => {
    if (phase === 0) {
      setPhase(1);
    } else if (phase === 1) {
      setPhase(2);
    } else if (phase === 2) {
      setPhase(3);
    } else if (phase === 3) {
      setPhase(1);
    }
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
          text: "Ambitieux et pleins d'idées, nous voulions tous, un jour, pouvoir entreprendre et créer notre entreprise pour concevoir dans le digital.",
        };
      case 2:
        return {
          title: "Rencontre",
          text: "Nous nous sommes donc rencontrés en école supérieure, où nous avons pratiqué création web et Digital multimédia.",
        };
      case 3:
        return {
          title: "Collaboration",
          text: "Nous avons donc eu l'idée de nous lancer dans cette aventure qui ne fera que de rendre le monde du web meilleur.",
        };
      default:
        return {
          title: "Découvrez notre histoire",
          text: "Cliquez pour commencer le voyage",
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

  useEffect(() => {
    if (!document.querySelector("#pulse-animations")) {
      const styleEl = document.createElement("style");
      styleEl.id = "pulse-animations";
      styleEl.innerHTML = `
        @keyframes pulseRing {
          0% { box-shadow: 0 0 0 0 rgba(135, 215, 255, 0.8); }
          70% { box-shadow: 0 0 0 25px rgba(135, 215, 255, 0); }
          100% { box-shadow: 0 0 0 0 rgba(135, 215, 255, 0); }
        }
        
        @keyframes pulseLight {
          0% { background-color: rgba(255, 255, 255, 0.1); }
          50% { background-color: rgba(135, 215, 255, 0.3); }
          100% { background-color: rgba(255, 255, 255, 0.1); }
        }
        
        .animate-pulse-ring {
          animation: pulseRing 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite;
        }
        
        .animate-pulse-light {
          animation: pulseLight 2s ease-in-out infinite;
        }
      `;
      document.head.appendChild(styleEl);
    }
  }, []);

  return (
    <div
      onClick={handleClick}
      className={`w-full max-w-5xl h-48 sm:h-56 md:h-64 lg:h-80 relative overflow-hidden rounded-full shadow-lg cursor-pointer transition-all duration-700 ${getBackgroundColor()} ${
        phase === 0 ? "animate-pulse-ring" : ""
      }`}
    >
      {phase === 0 && (
        <div className="absolute inset-0 rounded-full animate-pulse-light z-10 pointer-events-none"></div>
      )}

      <div
        className={`absolute ${getSliderPosition()} transition-all duration-700 ease-in-out h-[92%] w-[40%] sm:w-[40%] md:w-[50%] top-1/2 -translate-y-1/2 z-0`}
      >
        <div
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
    role: "COO | Chief Operational Officer",
    description:
      "Je coordonne toutes nos opérations et veille au bon déroulement de votre projet. Je m'assure que les délais sont respectés et que chaque étape est réalisée avec qualité. Pour toute question pratique, je suis votre interlocuteur.",
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
    name: "Xavier d'Andurain",
    role: "UI/UX Designer",
    description:
      "Je crée l'apparence visuelle de votre projet et m'assure qu'il soit beau et facile à utiliser. Mon travail est de concevoir des interfaces que vos utilisateurs aimeront et comprendront intuitivement. Je donne vie à votre marque à travers des designs attrayants et fonctionnels.",
    image: "/images/photo-xavier.png",
  },
];

function TeamMember({ image, name, role, description, reverse }) {
  return (
    <ScrollReveal
      animation={reverse ? "fade-left" : "fade-right"}
      delay={200}
      threshold={0.1}
    >
      <article
        className={`flex flex-col ${
          reverse ? "md:flex-row-reverse" : "md:flex-row"
        } items-center mb-8 md:mb-12`}
      >
        <div className="rounded-full overflow-hidden flex-shrink-0 w-[120px] h-[120px] sm:w-[150px] sm:h-[150px] md:w-[180px] md:h-[180px] lg:w-[200px] lg:h-[200px] mb-4 md:mb-0">
          <Image
            src={image}
            alt={`Photo de ${name}`}
            width={200}
            height={200}
            className="w-full h-full object-cover object-top"
          />
        </div>
        <div
          className={`${
            reverse ? "md:mr-4 md:mr-6 lg:mr-12" : "md:ml-4 md:ml-6 lg:ml-12"
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

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia("(max-width: 768px)").matches);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!document.querySelector("#fade-animations")) {
      const styleEl = document.createElement("style");
      styleEl.id = "fade-animations";
      styleEl.innerHTML = `
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out forwards;
        }
      `;
      document.head.appendChild(styleEl);
    }
  }, []);

  return (
    <>
      <main className="pt-20">
        <ScrollReveal animation="fade-down" delay={100}>
          <header className="p-4 md:p-24 text-center">
            <h1 className="text-3xl md:text-5xl pb-4 md:pb-8">
              Qui sommes nous ?
            </h1>
            <p>
            Nous sommes trois passionnés qui, autour d'un bon repas et de discussions enflammées, avons donné vie à Mouse-quetaires en 2025. Notre histoire ? Celle d'amis qui partagent un rêve simple mais ambitieux : rendre la technologie et l'IA vraiment accessibles à tous, sans le jargon intimidant.
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
              className="relative px-2 md:px-4 py-16 md:py-24 flex justify-center overflow-visible w-full cursor-pointer group"
              onMouseEnter={() => !isMobile && setHoveredValue1(true)}
              onMouseLeave={() => !isMobile && setHoveredValue1(false)}
              onClick={() => isMobile && setHoveredValue1(!hoveredValue1)}
            >
              {/* Invisible hitbox layer that covers the entire area */}
              <div className="absolute inset-0 z-40"></div>

              <div
                className={`absolute rounded-r-full bg-[#00527A] text-white p-4 md:p-8 
                        h-[90px] md:h-[130px] left-0 z-10
                        transition-all duration-300 ease-in-out
                        ${
                          hoveredValue1
                            ? "w-[95vw] md:w-[80vw]"
                            : "w-[60%] md:w-[45%]"
                        } group-hover:shadow-lg`}
              ></div>

              <div
                className={`absolute rounded-r-full bg-[#006A9E] text-white p-4 md:p-8 
                        h-[90px] md:h-[130px] left-[-20px] md:left-[-40px] z-20
                        transition-all duration-300 ease-in-out
                        ${
                          hoveredValue1
                            ? "w-[95vw] md:w-[80vw]"
                            : "w-[60%] md:w-[45%]"
                        } group-hover:shadow-lg`}
              ></div>

              <div
                className={`absolute rounded-r-full bg-[#0091D9] text-white pl-4 md:pl-8 
                        flex items-center gap-2 md:gap-4 
                        transition-all duration-300 ease-in-out
                        h-[90px] md:h-[130px] left-[-40px] md:left-[-80px] z-30
                        ${
                          hoveredValue1
                            ? "w-[95vw] md:w-[80vw]"
                            : "w-[60%] md:w-[45%]"
                        } group-hover:shadow-lg`}
              >
                <div className="flex-shrink-0 ml-[40px] md:ml-[60px] lg:ml-[80px]">
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
                    className={`text-xs sm:text-sm md:text-base ${
                      hoveredValue1
                        ? "font-montserrat font-bold"
                        : "font-montserrat font-extrabold whitespace-nowrap"
                    } transition-all duration-300 text-left`}
                  >
                    {hoveredValue1 ? (
                      <span className="animate-fadeIn overflow-y-auto max-h-[150px] md:max-h-[200px] block w-[60vw] font-montserrat font-bold">
                        L'entraide est au cœur de notre ADN, car nous savons que les meilleures solutions naissent du partage des idées et des compétences. Notre collaboration quotidienne nous permet de voir chaque défi sous plusieurs angles et d'y apporter des réponses plus innovantes. Ensemble, nous transformons vos projets en succès collectifs où la satisfaction de nos clients est notre plus belle récompense.
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
              className="relative px-2 md:px-4 py-16 md:py-24 flex justify-center overflow-visible w-full cursor-pointer group"
              onMouseEnter={() => !isMobile && setHoveredValue2(true)}
              onMouseLeave={() => !isMobile && setHoveredValue2(false)}
              onClick={() => isMobile && setHoveredValue2(!hoveredValue2)}
            >
              {/* Invisible hitbox layer that covers the entire area */}
              <div className="absolute inset-0 z-40"></div>

              <div
                className={`absolute rounded-l-full bg-[#00527A] text-white p-4 md:p-8 
                        h-[90px] md:h-[130px] right-0 z-10
                        transition-all duration-300 ease-in-out
                        ${
                          hoveredValue2
                            ? "w-[95vw] md:w-[80vw]"
                            : "w-[60%] md:w-[45%]"
                        } group-hover:shadow-lg`}
              ></div>

              <div
                className={`absolute rounded-l-full bg-[#006A9E] text-white p-4 md:p-8 
                        h-[90px] md:h-[130px] right-[-20px] md:right-[-40px] z-20
                        transition-all duration-300 ease-in-out
                        ${
                          hoveredValue2
                            ? "w-[95vw] md:w-[80vw]"
                            : "w-[60%] md:w-[45%]"
                        } group-hover:shadow-lg`}
              ></div>

              <div
                className={`absolute rounded-l-full bg-[#0091D9] text-white pr-4 md:pr-8 
                        flex items-center justify-end gap-2 md:gap-4
                        transition-all duration-300 ease-in-out
                        h-[90px] md:h-[130px] right-[-40px] md:right-[-80px] z-30
                        ${
                          hoveredValue2
                            ? "w-[95vw] md:w-[80vw]"
                            : "w-[60%] md:w-[45%]"
                        } group-hover:shadow-lg`}
              >
                <div className="overflow-hidden h-full flex items-center flex-grow justify-end">
                  <p
                    className={`text-xs sm:text-sm md:text-base ${
                      hoveredValue2
                        ? "font-montserrat font-bold"
                        : "font-montserrat font-extrabold whitespace-nowrap"
                    } transition-all duration-300 text-right`}
                  >
                    {hoveredValue2 ? (
                      <span className="animate-fadeIn overflow-y-auto max-h-[150px] md:max-h-[200px] block w-[60vw] font-montserrat font-bold">
                        L'innovation guide chacune de nos décisions, nous poussant constamment à explorer de nouvelles approches pour résoudre vos défis numériques. Notre créativité se nourrit de curiosité, d'expérimentation et d'une volonté de dépasser les solutions conventionnelles. Nous transformons les contraintes en opportunités créatives, apportant à vos projets cette étincelle qui les rend uniques et mémorables.
                      </span>
                    ) : (
                      "Innovation Créativité"
                    )}
                  </p>
                </div>
                <div className="flex-shrink-0 mr-[40px] md:mr-[60px] lg:mr-[80px]">
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
              className="relative px-2 md:px-4 py-16 md:py-24 flex justify-center overflow-visible w-full cursor-pointer group"
              onMouseEnter={() => !isMobile && setHoveredValue3(true)}
              onMouseLeave={() => !isMobile && setHoveredValue3(false)}
              onClick={() => isMobile && setHoveredValue3(!hoveredValue3)}
            >
              {/* Invisible hitbox layer that covers the entire area */}
              <div className="absolute inset-0 z-40"></div>

              <div
                className={`absolute rounded-r-full bg-[#00527A] text-white p-4 md:p-8 
                        h-[90px] md:h-[130px] left-0 z-10
                        transition-all duration-300 ease-in-out
                        ${
                          hoveredValue3
                            ? "w-[95vw] md:w-[80vw]"
                            : "w-[60%] md:w-[45%]"
                        } group-hover:shadow-lg`}
              ></div>

              <div
                className={`absolute rounded-r-full bg-[#006A9E] text-white p-4 md:p-8 
                        h-[90px] md:h-[130px] left-[-20px] md:left-[-40px] z-20
                        transition-all duration-300 ease-in-out
                        ${
                          hoveredValue3
                            ? "w-[95vw] md:w-[80vw]"
                            : "w-[60%] md:w-[45%]"
                        } group-hover:shadow-lg`}
              ></div>

              <div
                className={`absolute rounded-r-full bg-[#0091D9] text-white pl-4 md:pl-8 
                        flex items-center gap-2 md:gap-4
                        transition-all duration-300 ease-in-out
                        h-[90px] md:h-[130px] left-[-40px] md:left-[-80px] z-30
                        ${
                          hoveredValue3
                            ? "w-[95vw] md:w-[80vw]"
                            : "w-[60%] md:w-[45%]"
                        } group-hover:shadow-lg`}
              >
                <div className="flex-shrink-0 ml-[40px] md:ml-[60px] lg:ml-[80px]">
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
                    className={`text-xs sm:text-sm md:text-base ${
                      hoveredValue3
                        ? "font-montserrat font-bold"
                        : "font-montserrat font-extrabold whitespace-nowrap"
                    } transition-all duration-300 text-left`}
                  >
                    {hoveredValue3 ? (
                      <span className="animate-fadeIn overflow-y-auto max-h-[150px] md:max-h-[200px] block w-[65vw] font-montserrat font-bold">
                        L'excellence n'est pas négociable pour nous, chaque ligne de code et chaque pixel sont méticuleusement travaillés pour atteindre les plus hauts standards. Notre exigence de qualité se traduit par des tests rigoureux et une attention obsessionnelle aux détails que vous remarquerez dans le produit final. Nous ne livrons que des solutions dont nous sommes fiers, car votre satisfaction et la performance de votre projet sont notre véritable mesure de réussite.
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
    </>
  );
}