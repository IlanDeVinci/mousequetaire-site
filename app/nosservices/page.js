import Image from "next/image";
import ScrollReveal from "../../components/ScrollReveal";
import ServiceCircles from "../../components/services/ServiceCircles";
import SvgBubblesAnimation from "../../components/services/SvgBubblesAnimation";
import TypewriterAnimation from "../../components/services/TypewriterAnimation";
import GridElementsAnimation from "../../components/services/GridElementsAnimation";

const services = [
  {
    icon: "/bulbe.svg",
    title: "Développement Web",
    description:
      "Création de sites web modernes et compatibles sur tous type d'appareils",
    bgColor: "#004165",
  },
  {
    icon: "/supporttechnique.svg",
    title: "Support Technique",
    description: "Assistance et maintenance professionnelle",
    bgColor: "#005180",
  },
  {
    icon: "/internetpicto.svg",
    title: "Conseil",
    description:
      "Solutions digitales sur mesure, communication, community management, rdv de mises au point professionnelles régulières, ...",
    bgColor: "#006A9E",
  },
];

const sections = [
  {
    title: "Expertise Technique",
    description:
      "Notre équipe possède une expertise approfondie dans les dernières technologies web et mobile.",
    animationType: "svg-bubbles",
    isReversed: false,
  },
  {
    title: "Support ultra réactif",
    description:
      "Un hébergement assuré par nos propres serveurs et une équipe ultra réactive pour intervenir en cas de problème technique",
    animationType: "typewriter",
    isReversed: true,
  },
  {
    title: "Solutions Innovantes",
    description:
      "Des solutions créatives et innovantes pour répondre à vos défis numériques.",
    animationType: "grid-elements",
    isReversed: false,
  },
];

// Helper function to render the appropriate animation
const renderAnimation = (type) => {
  switch (type) {
    case "svg-bubbles":
      return <SvgBubblesAnimation />;
    case "typewriter":
      return <TypewriterAnimation />;
    case "grid-elements":
      return <GridElementsAnimation />;
    default:
      return null;
  }
};

export default function Services() {
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

          {/* Interactive Circles */}
          <ServiceCircles services={services} />

          {/* Alternating Sections - Responsive */}
          {sections.map((section, index) => (
            <ScrollReveal
              key={index}
              animation={section.isReversed ? "fade-left" : "fade-right"}
              delay={index * 200}
            >
              <div
                className={`flex flex-col ${
                  section.isReversed ? "lg:flex-row-reverse" : "lg:flex-row"
                } items-center gap-6 sm:gap-8 md:gap-12 mb-12 sm:mb-16 md:mb-24`}
              >
                <div className="flex-1 w-full">
                  <div className="relative h-[400px] w-full rounded-xl overflow-visible">
                    {renderAnimation(section.animationType)}
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
