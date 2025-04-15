"use client";
import Image from "next/image";
import { useState, useCallback, useRef, useEffect } from "react";
import ScrollReveal from "../../components/ScrollReveal";

const services = [
  {
    icon: "/bulbe.svg",
    title: "Développement Web",
    description: "Création de sites web modernes et responsive",
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
    description: "Solutions digitales sur mesure",
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
    title: "Support 24/7",
    description:
      "Une équipe dédiée à votre service pour répondre à vos besoins en temps réel.",
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

// SVG Bubbles Animation Component
const SvgBubblesAnimation = () => {
  const [visibleBubble, setVisibleBubble] = useState(null);

  useEffect(() => {
    let bubbleIndex = 0;
    const interval = setInterval(() => {
      setVisibleBubble(bubbleIndex);
      bubbleIndex = (bubbleIndex + 1) % 4; // 0-3, where 0 is no bubble
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-full w-full flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full h-full mt-0">
          <Image
            src="/images/papotte.svg"
            alt="Communication"
            fill
            className="object-contain p-4"
            style={{ marginTop: "80px" }}
          />
          <div className="absolute">
            <div
              className={`transition-all duration-700 translate-x-1/3 -scale-x-100 ${
                visibleBubble === 1
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-1/2"
              }`}
              style={{ width: "200px", height: "112px" }}
            >
              <Image
                src="/images/bulle1.svg"
                alt="Message"
                fill
                className="object-contain"
              />
            </div>
          </div>
          <div className="absolute">
            <div
              className={`transition-all duration-700 translate-x-[150%] -scale-x-100 ${
                visibleBubble === 2
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-1/2"
              }`}
              style={{ width: "200px", height: "124px" }}
            >
              <Image
                src="/images/bulle2.svg"
                alt="Message"
                fill
                className="object-contain"
              />
            </div>
          </div>
          <div className="absolute">
            <div
              className={`transition-all duration-700 translate-x-[100%] ${
                visibleBubble === 3
                  ? "opacity-100 translate-y-1/4"
                  : "opacity-0 translate-y-1/2"
              }`}
              style={{ width: "200px", height: "110px" }}
            >
              <Image
                src="/images/bulle3.svg"
                alt="Message"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Typewriter Animation Component
const TypewriterAnimation = () => {
  const [text, setText] = useState("");
  const [snippetIndex, setSnippetIndex] = useState(0);
  const codeSnippets = [
    `function support24_7() {
  const status = checkSystemStatus();
  if (status !== 'operational') {
    notifyTechnicalTeam();
    return initiateRecoveryProtocol();
  }
  
  monitorPerformance();
  return "All systems operational";
}`,
    `class WebsiteSolution {
  constructor(clientRequirements) {
    this.requirements = clientRequirements;
    this.technologies = this.selectTechnologies();
  }
  
  selectTechnologies() {
    return ['React', 'Node.js', 'Tailwind CSS'];
  }

}`,
    `async function deployApplication() {
  try {
    await runTests();
    const buildResult = await buildProject();
    return deployment.url;
    }
  } catch (error) {
    logError(error);
  }
}`,
  ];
  const fullText = codeSnippets[snippetIndex];
  const speed = 50;

  // Process text for syntax highlighting
  const processedText = () => {
    if (!text) return null;

    const keywords = ["function", "const", "if", "return"];
    const strings = ['"All systems operational"', "'operational'"];

    let result = [];
    let currentWord = "";
    let inString = false;
    let stringDelimiter = "";

    for (let i = 0; i < text.length; i++) {
      const char = text[i];

      // Check if we're entering or exiting a string
      if ((char === '"' || char === "'") && (i === 0 || text[i - 1] !== "\\")) {
        if (!inString) {
          // Start of string
          if (currentWord) {
            result.push(
              <span
                key={`word-${i}`}
                className={
                  keywords.includes(currentWord)
                    ? "text-purple-400"
                    : "text-green-300"
                }
              >
                {currentWord}
              </span>
            );
            currentWord = "";
          }
          inString = true;
          stringDelimiter = char;
          currentWord += char;
        } else if (char === stringDelimiter) {
          // End of string
          currentWord += char;
          result.push(
            <span key={`string-${i}`} className="text-amber-300">
              {currentWord}
            </span>
          );
          currentWord = "";
          inString = false;
        } else {
          // Just a quote inside a different type of string
          currentWord += char;
        }
      } else if (inString) {
        // Inside a string
        currentWord += char;
      } else if (/[\s\(\)\{\};]/.test(char)) {
        // Whitespace or punctuation
        if (currentWord) {
          result.push(
            <span
              key={`word-${i}`}
              className={
                keywords.includes(currentWord)
                  ? "text-purple-400"
                  : "text-green-300"
              }
            >
              {currentWord}
            </span>
          );
          currentWord = "";
        }
        result.push(
          <span key={`punct-${i}`} className="text-white">
            {char}
          </span>
        );
      } else {
        // Part of a word
        currentWord += char;
      }
    }

    // Add any remaining text
    if (currentWord) {
      result.push(
        <span
          key="last-word"
          className={
            keywords.includes(currentWord)
              ? "text-purple-400"
              : "text-green-300"
          }
        >
          {currentWord}
        </span>
      );
    }

    return result;
  };

  useEffect(() => {
    let i = 0;
    const typing = setInterval(() => {
      if (i < fullText.length) {
        setText(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(typing);
        setTimeout(() => {
          setText("");
          i = 0;
          // Move to next snippet
          setSnippetIndex((prev) => (prev + 1) % codeSnippets.length);
        }, 3000);
      }
    }, speed);

    return () => clearInterval(typing);
  }, [fullText, text.length === 0]);

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-transparent rounded-xl overflow-hidden">
      <div className="bg-transparent p-4 rounded-lg shadow-lg w-full max-w-lg h-full flex items-center justify-center">
        {/* Fixed height container with vertical alignment to prevent layout shifts */}
        <div className="w-full h-[280px] overflow-hidden flex items-center justify-center">
          <pre className="text-sm md:text-base lg:text-lg p-4 font-mono bg-transparent max-h-full">
            {/* Set a fixed height container for the code to prevent shifting */}
            <div className="h-[230px] overflow-hidden flex items-center">
              <code>
                {processedText()}
                <span className="inline-block w-2 h-4 md:h-5 bg-white opacity-70 animate-pulse ml-0.5 align-middle"></span>
              </code>
            </div>
          </pre>
        </div>
      </div>
    </div>
  );
};

// Grid Elements Animation Component
const GridElementsAnimation = () => {
  const [positions, setPositions] = useState([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  const [gradients, setGradients] = useState([
    { from: "rgb(96, 165, 250)", to: "rgb(168, 85, 247)" },
    { from: "rgb(74, 222, 128)", to: "rgb(96, 165, 250)" },
    { from: "rgb(250, 204, 21)", to: "rgb(249, 115, 22)" },
    { from: "rgb(248, 113, 113)", to: "rgb(236, 72, 153)" },
    { from: "rgb(168, 85, 247)", to: "rgb(99, 102, 241)" },
    { from: "rgb(99, 102, 241)", to: "rgb(96, 165, 250)" },
    { from: "rgb(236, 72, 153)", to: "rgb(248, 113, 113)" },
    { from: "rgb(96, 165, 250)", to: "rgb(45, 212, 191)" },
    { from: "rgb(45, 212, 191)", to: "rgb(74, 222, 128)" },
  ]);
  // Track which elements are showing their pseudo-elements
  const [showingPseudo, setShowingPseudo] = useState(Array(9).fill(false));
  // Store alternate gradients for pseudo-elements
  const [pseudoGradients, setPseudoGradients] = useState([
    { from: "rgb(249, 115, 22)", to: "rgb(250, 204, 21)" },
    { from: "rgb(236, 72, 153)", to: "rgb(248, 113, 113)" },
    { from: "rgb(45, 212, 191)", to: "rgb(74, 222, 128)" },
    { from: "rgb(96, 165, 250)", to: "rgb(45, 212, 191)" },
    { from: "rgb(250, 204, 21)", to: "rgb(249, 115, 22)" },
    { from: "rgb(168, 85, 247)", to: "rgb(99, 102, 241)" },
    { from: "rgb(74, 222, 128)", to: "rgb(96, 165, 250)" },
    { from: "rgb(99, 102, 241)", to: "rgb(96, 165, 250)" },
    { from: "rgb(96, 165, 250)", to: "rgb(168, 85, 247)" },
  ]);

  // Updated elements with more varied rounded corners
  const elements = [
    { id: 1, rounded: "rounded-tl-[69px] rounded-br-[69px]", hasLetter: false }, // Opposite corners rounded
    { id: 2, rounded: "rounded-lg", hasLetter: false }, // Slightly rounded all corners
    { id: 3, rounded: "rounded-tr-full", hasLetter: false },
    { id: 4, rounded: "rounded-full", hasLetter: false }, // Fully rounded (circle)
    { id: 5, rounded: "", hasLetter: true }, // The A letter (no rounding needed)
    { id: 6, rounded: "rounded-3xl", hasLetter: false }, // More rounded all corners
    { id: 7, rounded: "rounded-bl-full", hasLetter: false },
    { id: 8, rounded: "rounded-xl", hasLetter: false }, // Medium rounded all corners
    { id: 9, rounded: "rounded-br-full", hasLetter: false },
  ];

  // Position calculation
  const calculatePosition = (index) => {
    const pos = positions[index];
    const col = pos % 3;
    const row = Math.floor(pos / 3);
    return { col, row };
  };

  // Change gradients periodically with smooth transition
  useEffect(() => {
    const availableGradients = [
      { from: "rgb(96, 165, 250)", to: "rgb(168, 85, 247)" }, // blue to purple
      { from: "rgb(74, 222, 128)", to: "rgb(96, 165, 250)" }, // green to blue
      { from: "rgb(250, 204, 21)", to: "rgb(249, 115, 22)" }, // yellow to orange
      { from: "rgb(248, 113, 113)", to: "rgb(236, 72, 153)" }, // red to pink
      { from: "rgb(168, 85, 247)", to: "rgb(99, 102, 241)" }, // purple to indigo
      { from: "rgb(99, 102, 241)", to: "rgb(96, 165, 250)" }, // indigo to blue
      { from: "rgb(236, 72, 153)", to: "rgb(248, 113, 113)" }, // pink to red
      { from: "rgb(96, 165, 250)", to: "rgb(45, 212, 191)" }, // blue to teal
      { from: "rgb(45, 212, 191)", to: "rgb(74, 222, 128)" }, // teal to green
      { from: "rgb(249, 115, 22)", to: "rgb(250, 204, 21)" }, // orange to yellow
      { from: "rgb(34, 211, 238)", to: "rgb(96, 165, 250)" }, // cyan to blue
    ];

    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * 9);
      const randomGradient =
        availableGradients[
          Math.floor(Math.random() * availableGradients.length)
        ];

      // Update the target gradient in the non-active layer (pseudo or main)
      if (showingPseudo[randomIndex]) {
        setGradients((prev) => {
          const newGradients = [...prev];
          newGradients[randomIndex] = randomGradient;
          return newGradients;
        });
      } else {
        setPseudoGradients((prev) => {
          const newGradients = [...prev];
          newGradients[randomIndex] = randomGradient;
          return newGradients;
        });
      }

      // Toggle the visibility state
      setShowingPseudo((prev) => {
        const newState = [...prev];
        newState[randomIndex] = !newState[randomIndex];
        return newState;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [showingPseudo]);

  // Swap elements smoothly
  useEffect(() => {
    const interval = setInterval(() => {
      const idx1 = Math.floor(Math.random() * 9);
      let idx2 = Math.floor(Math.random() * 9);

      // Ensure we pick a different element
      while (idx2 === idx1) {
        idx2 = Math.floor(Math.random() * 9);
      }

      setPositions((prev) => {
        const newPositions = [...prev];
        const temp = newPositions[idx1];
        newPositions[idx1] = newPositions[idx2];
        newPositions[idx2] = temp;
        return newPositions;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center p-4 overflow-hidden">
      <div className="relative w-full max-w-[400px] aspect-square">
        {elements.map((element, index) => {
          const { col, row } = calculatePosition(index);

          if (element.hasLetter) {
            // Render the A letter as the element itself with gradient
            return (
              <div
                key={element.id}
                className="absolute flex items-center justify-center"
                style={{
                  width: "calc(33.333% - 8px)",
                  height: "calc(33.333% - 8px)",
                  left: `calc(${col} * 33.333% + 4px)`,
                  top: `calc(${row} * 33.333% + 4px)`,
                  transition: "all 1.5s cubic-bezier(0.4, 0, 0.2, 1)",
                  position: "absolute",
                }}
              >
                <span
                  className="text-7xl md:text-9xl font-bold"
                  style={{
                    backgroundImage: showingPseudo[index]
                      ? `linear-gradient(135deg, ${pseudoGradients[index].from}, ${pseudoGradients[index].to})`
                      : `linear-gradient(135deg, ${gradients[index].from}, ${gradients[index].to})`,
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    color: "transparent",
                    transition: "all 1s ease-in-out",
                  }}
                >
                  A
                </span>
              </div>
            );
          }

          // Standard shape elements
          return (
            <div
              key={element.id}
              className={`absolute ${element.rounded} flex items-center justify-center overflow-hidden`}
              style={{
                width: "calc(33.333% - 8px)",
                height: "calc(33.333% - 8px)",
                left: `calc(${col} * 33.333% + 4px)`,
                top: `calc(${row} * 33.333% + 4px)`,
                transition: "all 1.5s cubic-bezier(0.4, 0, 0.2, 1)",
                position: "absolute",
                backgroundImage: `linear-gradient(135deg, ${gradients[index].from}, ${gradients[index].to})`,
                backgroundSize: "100%",
                backgroundColor: "transparent",
                zIndex: 1,
              }}
            >
              {/* Pseudo-element replacement using absolute positioning */}
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${pseudoGradients[index].from}, ${pseudoGradients[index].to})`,
                  backgroundSize: "100%",
                  opacity: showingPseudo[index] ? 1 : 0,
                  transition: "opacity 1s ease-in-out",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  zIndex: 0,
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

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
                  <div className="relative h-[400px] w-full rounded-xl overflow-hidden">
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
