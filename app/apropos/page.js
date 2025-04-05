"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

function DiscoverElement() {
  const [phase, setPhase] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Use effect to trigger the fade-in animation after component mount
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
        return "left-[1%] md:left-[1%]"; // Reduced from 5% to bring closer to edge
      case 2:
        return "left-[50%] -translate-x-1/2";
      case 3:
        return "left-[99%] -translate-x-full"; // Increased from 95% to bring closer to edge
      default:
        return "top-[200%]"; // Hide the slider when phase is 0
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`w-full max-w-5xl h-48 sm:h-56 md:h-64 lg:h-80 relative overflow-hidden rounded-full shadow-lg cursor-pointer transition-all duration-700 ${getBackgroundColor()}`}
    >
      <div
        className={`absolute ${getSliderPosition()} transition-all duration-700 ease-in-out h-[92%] w-[85%] sm:w-[75%] md:w-[60%] lg:w-[45%] top-1/2 -translate-y-1/2 z-0`}
      >
        <div
          className={`${getSliderColor()} rounded-full px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 shadow-lg h-full transition-all duration-700`}
        >
          <div className="flex flex-col h-full justify-center text-center font-montserrat">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2 md:mb-4 text-white">
              {getContent().title}
            </h3>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-white/90 line-clamp-2 sm:line-clamp-3">
              {getContent().text}
            </p>
          </div>
        </div>
      </div>

      {/* Updated images with fade in/out and movement animations */}
      <Image
        src="/images/contact0.png"
        alt="Start discovery"
        width={300}
        height={300}
        className={`transition-all duration-700 ease-in-out z-10 absolute inset-0 w-full h-full object-cover bg-white ${
          phase === 0
            ? `opacity-${isLoaded ? "100" : "0"}`
            : "opacity-0 pointer-events-none"
        }`}
      />
      <Image
        src="/images/contact1.png"
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
        src="/images/contact2.png"
        alt="Our growth"
        width={300}
        height={300}
        className={`transition-all duration-700 ease-in-out z-10 absolute -left-6 sm:-left-8 md:-left-12 top-1/2 -translate-y-1/2 w-[45%] h-[85%] object-contain ${
          phase === 2
            ? "opacity-100"
            : "opacity-0 pointer-events-none translate-x-[100px]"
        }`}
      />
      <Image
        src="/images/contact3.png"
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

// Partie Équipe :

const teamMembers = [
  {
    id: 1,
    name: "Samuel Alhadef",
    role: "CCO | Chief Communication Officer",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    image: "/images/photo-samuel.jpg",
  },
  {
    id: 2,
    name: "Célestin Godefroy",
    role: "COO | Chief Operational Officer",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    image: "/images/photo-célestin.jpg",
  },
  {
    id: 3,
    name: "Ilan Maouchi",
    role: "CTO | Chief Technical Officer",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    image: "/images/photo-ilan.jpeg",
  },
];

function TeamMember({ image, name, role, description, reverse }) {
  return (
    <article
      className={`flex flex-col ${
        reverse ? "md:flex-row-reverse" : "md:flex-row"
      } items-center mb-8 md:mb-12`}
    >
      {/* Image du membre */}
      <Image
        src={image}
        alt={`Photo de ${name}`}
        width={200}
        height={200}
        className="rounded-full w-[120px] h-[120px] sm:w-[150px] sm:h-[150px] md:w-[180px] md:h-[180px] lg:w-[200px] lg:h-[200px] mb-4 md:mb-0"
      />
      {/* Bloc de texte */}
      <div
        className={`${
          reverse
            ? "md:mr-6 lg:mr-12 md:text-right"
            : "md:ml-6 lg:ml-12 md:text-left"
        } text-center md:text-left text-lg px-4`}
      >
        <h2 className="text-xl sm:text-2xl md:text-3xl">{name}</h2>
        <h3 className="text-[#87D7FF] my-2 text-base sm:text-lg md:text-xl">
          {role}
        </h3>
        <p className="text-xs sm:text-sm md:text-base">{description}</p>
      </div>
    </article>
  );
}

// Fin partie Équipe

// Code de la page :

export default function Equipe() {
  const [hovered, setHovered] = useState(false);

  return (
    <>
      <main className="pt-20">
        <header className="p-4 md:p-24 text-center">
          <h1 className="text-3xl md:text-5xl pb-4 md:pb-8">
            Qui sommes nous ?
          </h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor
          </p>
        </header>

        {/* Bloc de découverte */}
        <section className="flex justify-center mb-16 px-4">
          <DiscoverElement />
        </section>

        {/* Section équipe */}
        <section className="text-center justify-center mb-16 px-4 md:px-12 lg:px-44">
          <h1 className="text-3xl md:text-4xl mb-12 md:mb-24">Notre équipe</h1>
          {teamMembers.map((member, index) => (
            <TeamMember
              key={member.id}
              image={member.image}
              name={member.name}
              role={member.role}
              description={member.description}
              reverse={index === 1}
            />
          ))}
        </section>

        {/* Section valeurs */}
        <section className="text-center my-12">
          <h1 className="text-3xl md:text-4xl my-8 md:m-24">Nos valeurs</h1>

          <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={() => setHovered(!hovered)} // For touch devices
            className={`flex items-center gap-4 p-4 md:p-8 mx-4 rounded-r-full bg-[#0091D9] text-white cursor-pointer 
                    transition-all duration-300 ease-in-out
                    ${hovered ? "w-[90vw]" : "w-[90%] md:w-[400px]"}`}
          >
            <div className="flex-shrink-0">
              <Image
                src="/images/photo-samuel.jpg"
                alt="Icon Entraide"
                width={100}
                height={100}
                className="w-[60px] h-[60px] md:w-[100px] md:h-[100px] rounded-full"
              />
            </div>
            {/* Le texte qui change au survol */}
            <p className="whitespace-nowrap text-sm md:text-base">
              {hovered
                ? "Collaboration et esprit d'entraide"
                : "Entraide Collaboration"}
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
