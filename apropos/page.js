"use client";

import Image from "next/image";
import { useState } from "react";

function DiscoverElement() {
  const [phase, setPhase] = useState(0);

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

  // Message de base (disparait au clic)
  if (phase === 0) {
    return (
      <div
        onClick={handleClick}
        className="w-full max-w-3xl h-64 flex text-center items-center justify-center bg-gray-100 cursor-pointer rounded-full shadow-md"
      >
        <span className="text-2xl font-bold text-black">
          Cliquez ici pour <br /> découvrir notre histoire
        </span>
      </div>
    );
  }

  let circleText = "";
  let imageSrc = "";
  let longText = "";
  let layout = null;

  switch (phase) {
    case 1:
      circleText = "A";
      imageSrc = "https://picsum.photos/seed/a/50/50";
      longText = "Texte long A";
      layout = (
        <div className="flex items-center space-x-4">
          {/* Rond à gauche */}
          <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
            {circleText}
          </div>
          {/* Image */}
          <img
            src={imageSrc}
            alt="A"
            className="w-12 h-12 object-cover rounded"
          />
          {/* Texte */}
          <p className="text-base">{longText}</p>
        </div>
      );
      break;
    case 2:
      circleText = "B";
      imageSrc = "https://picsum.photos/seed/b/50/50";
      longText = "Texte long B";
      layout = (
        <div className="flex items-center space-x-4">
          {/* Image à gauche */}
          <img
            src={imageSrc}
            alt="B"
            className="w-12 h-12 object-cover rounded"
          />
          {/* Rond au centre */}
          <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
            {circleText}
          </div>
          {/* Texte à droite */}
          <p className="text-base">{longText}</p>
        </div>
      );
      break;
    case 3:
      circleText = "C";
      imageSrc = "https://picsum.photos/seed/c/50/50";
      longText = "Texte long C";
      layout = (
        <div className="flex items-center justify-between w-full">
          {/* Image à l'extrême gauche */}
          <img
            src={imageSrc}
            alt="C"
            className="w-12 h-12 object-cover rounded"
          />
          {/* Texte au centre */}
          <p className="text-base flex-1 text-center">{longText}</p>
          {/* Rond à l'extrême droite */}
          <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center text-white font-bold">
            {circleText}
          </div>
        </div>
      );
      break;
    default:
      break;
  }

  return (
    <div
      onClick={handleClick}
      className="w-full max-w-3xl h-64 flex text-center items-center justify-center bg-gray-100 text-black cursor-pointer rounded-full shadow-md"
    >
      {layout}
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
      className={`flex items-center mb-12 ${reverse ? "flex-row-reverse" : ""}`}
    >
      {/* Image du membre */}
      <Image
        src={image}
        alt={`Photo de ${name}`}
        width={200}
        height={200}
        className="rounded-full w-[200px] h-[200px]"
      />
      {/* Bloc de texte */}
      <div
        className={`${
          reverse ? "mr-12 text-right" : "ml-12 text-left"
        } text-lg`}
      >
        <h2 className="text-3xl">{name}</h2>
        <h3 className="text-[#87D7FF] my-2 text-xl">{role}</h3>
        <p>{description}</p>
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
        <header className="p-24 text-center">
          <h1 className="text-5xl pb-8">Qui sommes nous ?</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor
          </p>
        </header>

        {/* Bloc de découverte */}

        <section className="flex justify-center mb-16">
          <DiscoverElement />
        </section>

        {/* Section équipe */}
        <section className="text-center justify-center mb-16 px-44">
          <h1 className="text-4xl mb-24">Notre équipe</h1>
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
          <h1 className="text-4xl m-24">Nos valeurs</h1>

          <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className={`flex items-center gap-4 p-8 rounded-r-full bg-[#0091D9] text-white cursor-pointer 
                    transition-all duration-300 ease-in-out
                    ${hovered ? "w-[90vw]" : "w-[400px]"}`}
          >
            <div className="flex-shrink-0">
              <Image
                src="/images/photo-samuel.jpg"
                alt="Icon Entraide"
                width={100}
                height={100}
              />
            </div>
            {/* Le texte qui change au survol */}
            <p className="whitespace-nowrap">
              {hovered
                ? "Collaboration et esprit d’entraide"
                : "Entraide Collaboration"}
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
