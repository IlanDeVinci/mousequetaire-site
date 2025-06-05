"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import ScrollReveal from "../../components/ScrollReveal";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y, Autoplay } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Enhanced portfolio items with importance representing layout size:
// 4: 2x2 grid (takes 4 spaces)
// 3: 2x1 grid (takes 2 spaces horizontally)
// 2: 1x2 grid (takes 2 spaces vertically) - NO LONGER USED
// 1: 1x1 grid (takes 1 space)
const portfolioItems = [
  {
    id: 1,
    title: "Featured Project",
    description:
      "IA conversationnelle qui analyse automatiquement le contenu d'un site web pour répondre aux questions des visiteurs !",
    image: "/images/projets/projet_IA.png",
    images: ["/images/projets/projet_IA.png", "/images/projets/projet_IA2.png"],
    importance: Math.floor(Math.random() * 4) + 1,
    technologies: ["IA", "24/7", "TailwindCSS"],
    client: "Projet personnel",
    year: "2025",
    link: "https://example.com/project1",
  },
  {
    id: 2,
    title: "TableManager",
    description:
      "TableManager - une application intégrée à Microsoft Teams que j'ai développée pour faciliter la réservation des bureaux dans les espaces de travail flexibles.",
    image: "/images/projets/projet_teams.png",
    images: [
      "/images/projets/projet_teams.png",
      "/images/projets/projet_teams2.png",
    ],
    importance: Math.floor(Math.random() * 4) + 1,
    technologies: ["App", "HTML5", "CSS3"],
    client: "Chambre de commerce franco-tchèque",
    year: "2025",
    link: "https://example.com/project2",
  },
  {
    id: 3,
    title: "IA détection d'objets",
    description: "Application de détection d'objets personnalisable",
    image: "/images/projets/projet_IA-detect.png",
    images: [
      "/images/projets/projet_IA-detect.png",
      "/images/projets/projet_IA-detect2.png",
    ],
    importance: Math.floor(Math.random() * 4) + 1,
    technologies: ["Python", "OpenCV", "YOLOv3", "NumPy", "JSON"],
    client: "Projet IIM Digital School",
    year: "2025",
    link: "https://example.com/project3",
  },
  {
    id: 4,
    title: "IA détection langue des signes",
    description:
      "Application de traduction de la langue des signes en temps réel, développée pour faciliter la communication des personnes sourdes et malentendantes.",
    image: "/images/projets/projet_IA-aveugle.png",
    images: [
      "/images/projets/projet_IA-aveugle.png",
      "/images/projets/projet_IA-aveugle2.png",
    ],
    importance: Math.floor(Math.random() * 4) + 1,
    technologies: ["IA", "Malvoyants"],
    client: "Projet personnel",
    year: "2024",
    link: "https://example.com/project4",
  },
  {
    id: 5,
    title: "Pétanque 3D",
    description:
      "Une physique réaliste des boules et du cochonnet, le tout développé sur un site internet !",
    image: "/images/projets/projet_petanque.png",
    images: ["/images/projets/projet_petanque.png"],
    importance: Math.floor(Math.random() * 4) + 1,
    technologies: ["JS", "CSS"],
    client: "Projet personnel",
    year: "2025",
    link: "https://example.com/project5",
  },
  {
    id: 6,
    title: "Générateur de vidéo IA",
    description:
      "Plateforme web permettant de générer des vidéos à partir de descriptions textuelles, utilisant AnimateDiff-Lightning, un modèle d'IA de dernière génération.",
    image: "/images/projets/projet_IA-video-generator.png",
    images: [
      "/images/projets/projet_IA-video-generator.png",
      "/image/projets/projet_IA-video-generator2.png",
    ],
    importance: Math.floor(Math.random() * 4) + 1,
    technologies: ["HTML", "Javascript", "Pytorch"],
    client: "Projet Personnel",
    year: "2025",
    link: "https://example.com/project6",
  },
  {
    id: 7,
    title: "Taskflow",
    description:
      "TaskFlow est une application web de gestion de tâches moderne et intuitive, conçue pour faciliter la gestion de projets en équipe. Développée avec TypeScript et dotée d'une interface utilisateur fluide et réactive.",
    image: "/images/projets/projet_taskflow.png",
    images: [
      "/images/projets/projet_taskflow.png",
      "/images/projets/projet_taskflow2.png",
    ],
    importance: Math.floor(Math.random() * 4) + 1,
    technologies: ["HTML", "CSS"],
    client: "Projet scolaire",
    year: "2025",
    link: "https://example.com/project7",
  },
  {
    id: 8,
    title: "Assistant IA pour annuaire interactif",
    description:
      "Assistant intelligent pour annuaire téléphonique, combinant une interface web moderne avec une IA intégrée directement dans le navigateur.",
    image: "/images/projets/projet_annuaire.png",
    images: ["/images/projets/projet_annuaire.png"],
    importance: Math.floor(Math.random() * 4) + 1,
    technologies: ["HTML", "CSS", "Transformers.js"],
    client: "Projet personnel",
    year: "2025",
    link: "https://example.com/project8",
  },
  {
    id: 9,
    title: "Site E-commerce",
    description:
      "Plateforme e-commerce moderne et multilingue développée avec Symfony 6.4.",
    image: "/images/projets/projet_e-commerce.png",
    images: [
      "/images/projets/projet_e-commerce.png",
      "/images/projets/projet_e-commerce2.png",
      "/images/projets/projet_e-commerce3.png",
    ],
    importance: Math.floor(Math.random() * 4) + 1,
    technologies: ["Symphony", "MySQL", "Twig", "Tailwindcss"],
    client: "Projet scolaire",
    year: "2025",
    link: "https://example.com/project9",
  },
  {
    id: 10,
    title: "Bot Discord Musique",
    description:
      "Bot discord de streaming musical.",
    image: "/images/projets/projet_bot-discord.png",
    images: ["/images/projets/projet_bot-discord.png"],
    importance: Math.floor(Math.random() * 4) + 1,
    technologies: ["Discord", "Node.js", "Discord.js"],
    client: "Projet personnel",
    year: "2025",
    link: "https://example.com/project10",
  },
];

export default function Portfolio() {
  const [gridItems, setGridItems] = useState([]);
  const [error, setError] = useState(null);
  const [showDebug, setShowDebug] = useState(false);
  const [debugInfo, setDebugInfo] = useState({
    totalCells: 0,
    totalWidth: 0,
    cellsUsed: 0,
    placeholders: 0,
    adjustments: [],
    debugLog: [],
  });
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const createDebugLogger = () => {
    const debugLog = [];
    return {
      log: (message) => {
        debugLog.push(`[${debugLog.length}] ${message}`);
        console.log(message);
      },
      getLog: () => debugLog,
    };
  };

  const openProjectModal = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
    setCurrentImageIndex(0);
    document.body.style.overflow = "hidden";
  };

  const closeProjectModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "auto";
  };

  const navigateToNextProject = () => {
    const currentIndex = gridItems.findIndex(
      (item) => item.id === selectedProject.id
    );
    const nextIndex = (currentIndex + 1) % gridItems.length;
    setSelectedProject(gridItems[nextIndex]);
    setCurrentImageIndex(0);
  };

  const navigateToPrevProject = () => {
    const currentIndex = gridItems.findIndex(
      (item) => item.id === selectedProject.id
    );
    const prevIndex = (currentIndex - 1 + gridItems.length) % gridItems.length;
    setSelectedProject(gridItems[prevIndex]);
    setCurrentImageIndex(0);
  };

  const showNextImage = () => {
    if (
      selectedProject &&
      selectedProject.images &&
      selectedProject.images.length > 0
    ) {
      setCurrentImageIndex(
        (currentImageIndex + 1) % selectedProject.images.length
      );
    }
  };

  const showPrevImage = () => {
    if (
      selectedProject &&
      selectedProject.images &&
      selectedProject.images.length > 0
    ) {
      setCurrentImageIndex(
        (currentImageIndex - 1 + selectedProject.images.length) %
          selectedProject.images.length
      );
    }
  };

  useEffect(() => {
    const { log, getLog } = createDebugLogger();
    const gridWidth = 3;
    const adjustments = [];

    try {
      let allItems = portfolioItems.map((item, index) => {
        return {
          ...item,
          originalImportance: item.importance,
          gridStyle: {
            gridRow: `span 1`,
            gridColumn: `span 1`,
          },
          debugDimensions: { width: 1, height: 1, label: "1×1" },
          uniqueKey: `item-${item.id}`,
          index: index,
        };
      });

      log(`Prepared ${allItems.length} items with default 1×1 size`);

      allItems.sort((a, b) => b.originalImportance - a.originalImportance);
      log(`Sorted items by importance (highest first)`);

      const createOptimizedLayout = () => {
        const generateLayoutBlueprint = (itemCount) => {
          const layoutSpaces = [];
          const dummyItems = Array(itemCount)
            .fill()
            .map((_, i) => ({
              id: `dummy-${i}`,
              originalImportance: 1,
              title: `Dummy Item ${i}`,
            }));

          const trackSpace = (width, height) => {
            layoutSpaces.push({
              type: `${width}x${height}`,
              width,
              height,
            });
            return { id: `dummy-space-${layoutSpaces.length}` };
          };

          const simulateLayoutCreation = () => {
            const remainingDummyItems = [...dummyItems];

            const simulatedGetNextItem = (width, height) => {
              if (remainingDummyItems.length === 0) return null;
              remainingDummyItems.shift();
              return trackSpace(width, height);
            };

            while (remainingDummyItems.length > 0) {
              const itemsLeft = remainingDummyItems.length;

              if (itemsLeft === 4) {
                simulatedGetNextItem(2, 1);
                simulatedGetNextItem(1, 1);
                simulatedGetNextItem(1, 1);
                simulatedGetNextItem(2, 1);
              } else if (itemsLeft >= 3) {
                for (let i = 0; i < 3 && remainingDummyItems.length > 0; i++) {
                  simulatedGetNextItem(1, 1);
                }
              } else if (itemsLeft === 2) {
                simulatedGetNextItem(1, 1);
                simulatedGetNextItem(2, 1);
              } else if (itemsLeft === 1) {
                simulatedGetNextItem(2, 1);
              }

              if (remainingDummyItems.length === 0) break;

              if (remainingDummyItems.length <= 5) {
                if (remainingDummyItems.length === 4) {
                  simulatedGetNextItem(1, 1);
                  simulatedGetNextItem(2, 1);
                  simulatedGetNextItem(2, 1);
                  simulatedGetNextItem(1, 1);
                } else if (remainingDummyItems.length === 3) {
                  for (let i = 0; i < 3; i++) {
                    simulatedGetNextItem(1, 1);
                  }
                } else if (remainingDummyItems.length >= 2) {
                  simulatedGetNextItem(2, 1);
                  simulatedGetNextItem(1, 1);
                } else if (remainingDummyItems.length === 1) {
                  simulatedGetNextItem(2, 1);
                }
              } else {
                if (remainingDummyItems.length >= 3) {
                  simulatedGetNextItem(1, 1);
                  simulatedGetNextItem(2, 2);
                  simulatedGetNextItem(1, 1);
                } else if (remainingDummyItems.length === 2) {
                  simulatedGetNextItem(1, 1);
                  simulatedGetNextItem(2, 1);
                } else if (remainingDummyItems.length === 1) {
                  simulatedGetNextItem(2, 1);
                }
              }

              if (remainingDummyItems.length === 0) break;

              if (remainingDummyItems.length === 4) {
                simulatedGetNextItem(1, 1);
                simulatedGetNextItem(2, 1);
                simulatedGetNextItem(2, 1);
                simulatedGetNextItem(1, 1);
              } else if (remainingDummyItems.length === 3) {
                for (let i = 0; i < 3; i++) {
                  simulatedGetNextItem(1, 1);
                }
              } else if (remainingDummyItems.length === 2) {
                simulatedGetNextItem(2, 1);
                simulatedGetNextItem(1, 1);
              } else if (remainingDummyItems.length === 1) {
                simulatedGetNextItem(2, 1);
              } else {
                simulatedGetNextItem(2, 1);
                simulatedGetNextItem(1, 1);
              }

              if (remainingDummyItems.length === 0) break;

              if (remainingDummyItems.length <= 3) {
                if (remainingDummyItems.length === 3) {
                  for (let i = 0; i < 3; i++) {
                    simulatedGetNextItem(1, 1);
                  }
                } else if (remainingDummyItems.length === 2) {
                  simulatedGetNextItem(1, 1);
                  simulatedGetNextItem(2, 1);
                } else {
                  simulatedGetNextItem(2, 1);
                }
              } else {
                simulatedGetNextItem(1, 1);
                simulatedGetNextItem(2, 1);
              }

              if (remainingDummyItems.length === 0) break;

              if (remainingDummyItems.length <= 4) {
                if (remainingDummyItems.length === 4) {
                  simulatedGetNextItem(2, 1);
                  simulatedGetNextItem(1, 1);
                  simulatedGetNextItem(1, 1);
                  simulatedGetNextItem(2, 1);
                } else if (remainingDummyItems.length === 3) {
                  for (let i = 0; i < 3; i++) {
                    simulatedGetNextItem(1, 1);
                  }
                } else if (remainingDummyItems.length === 2) {
                  simulatedGetNextItem(2, 1);
                  simulatedGetNextItem(1, 1);
                } else {
                  simulatedGetNextItem(2, 1);
                }
              } else {
                simulatedGetNextItem(2, 2);
                simulatedGetNextItem(1, 1);
                simulatedGetNextItem(1, 1);
              }

              if (remainingDummyItems.length === 0) break;

              if (remainingDummyItems.length === 3) {
                for (let i = 0; i < 3; i++) {
                  simulatedGetNextItem(1, 1);
                }
              } else if (remainingDummyItems.length === 2) {
                simulatedGetNextItem(1, 1);
                simulatedGetNextItem(2, 1);
              } else if (remainingDummyItems.length === 1) {
                simulatedGetNextItem(2, 1);
              } else {
                if (remainingDummyItems.length === 4) {
                  simulatedGetNextItem(1, 1);
                  simulatedGetNextItem(2, 1);
                  simulatedGetNextItem(2, 1);
                  simulatedGetNextItem(1, 1);
                } else {
                  simulatedGetNextItem(1, 1);
                  simulatedGetNextItem(2, 1);
                }
              }
            }
          };

          simulateLayoutCreation();
          return layoutSpaces;
        };

        const assignItemsToBlueprint = (items, blueprint) => {
          const spacesByType = {
            "2x2": [],
            "2x1": [],
            "1x1": [],
          };

          blueprint.forEach((space, index) => {
            spacesByType[space.type].push({
              ...space,
              index,
            });
          });

          const sortedItems = [...items].sort(
            (a, b) => b.originalImportance - a.originalImportance
          );
          const resultItems = new Array(sortedItems.length);

          log(
            `Blueprint has: ${spacesByType["2x2"].length} 2×2 spaces, ${spacesByType["2x1"].length} 2×1 spaces, ${spacesByType["1x1"].length} 1×1 spaces`
          );

          const getOriginalSizeLabel = (importance) => {
            switch (importance) {
              case 4:
                return "2×2";
              case 3:
                return "2×1";
              case 2:
                return "1×2";
              case 1:
              default:
                return "1×1";
            }
          };

          let itemIndex = 0;

          while (
            itemIndex < sortedItems.length &&
            sortedItems[itemIndex].originalImportance === 4 &&
            spacesByType["2x2"].length > 0
          ) {
            const item = sortedItems[itemIndex];
            const space = spacesByType["2x2"].shift();

            item.debugDimensions = { width: 2, height: 2, label: "2×2" };
            item.gridStyle = { gridRow: `span 2`, gridColumn: `span 2` };

            resultItems[space.index] = item;
            log(
              `Assigned importance 4 item ${item.id} to 2×2 space at position ${space.index}`
            );
            itemIndex++;
          }

          while (
            itemIndex < sortedItems.length &&
            sortedItems[itemIndex].originalImportance === 3 &&
            spacesByType["2x1"].length > 0
          ) {
            const item = sortedItems[itemIndex];
            const space = spacesByType["2x1"].shift();

            item.debugDimensions = { width: 2, height: 1, label: "2×1" };
            item.gridStyle = { gridRow: `span 1`, gridColumn: `span 2` };

            resultItems[space.index] = item;
            log(
              `Assigned importance 3 item ${item.id} to 2×1 space at position ${space.index}`
            );
            itemIndex++;
          }

          while (
            spacesByType["2x2"].length > 0 &&
            itemIndex < sortedItems.length
          ) {
            const item = sortedItems[itemIndex];
            const space = spacesByType["2x2"].shift();

            item.debugDimensions = { width: 2, height: 2, label: "2×2" };
            item.gridStyle = { gridRow: `span 2`, gridColumn: `span 2` };

            if (item.originalImportance !== 4) {
              adjustments.push({
                itemId: item.id,
                title: item.title,
                from: getOriginalSizeLabel(item.originalImportance),
                to: "2×2",
                reason: "Assigned to 2×2 based on importance ranking",
              });
            }

            resultItems[space.index] = item;
            log(
              `Assigned importance ${item.originalImportance} item ${item.id} to 2×2 space at position ${space.index}`
            );
            itemIndex++;
          }

          while (
            spacesByType["2x1"].length > 0 &&
            itemIndex < sortedItems.length
          ) {
            const item = sortedItems[itemIndex];
            const space = spacesByType["2x1"].shift();

            item.debugDimensions = { width: 2, height: 1, label: "2×1" };
            item.gridStyle = { gridRow: `span 1`, gridColumn: `span 2` };

            if (item.originalImportance !== 3) {
              adjustments.push({
                itemId: item.id,
                title: item.title,
                from: getOriginalSizeLabel(item.originalImportance),
                to: "2×1",
                reason: "Assigned to 2×1 based on importance ranking",
              });
            }

            resultItems[space.index] = item;
            log(
              `Assigned importance ${item.originalImportance} item ${item.id} to 2×1 space at position ${space.index}`
            );
            itemIndex++;
          }

          while (
            spacesByType["1x1"].length > 0 &&
            itemIndex < sortedItems.length
          ) {
            const item = sortedItems[itemIndex];
            const space = spacesByType["1x1"].shift();

            item.debugDimensions = { width: 1, height: 1, label: "1×1" };
            item.gridStyle = { gridRow: `span 1`, gridColumn: `span 1` };

            if (item.originalImportance !== 1) {
              adjustments.push({
                itemId: item.id,
                title: item.title,
                from: getOriginalSizeLabel(item.originalImportance),
                to: "1×1",
                reason: "Assigned to 1×1 based on importance ranking",
              });
            }

            resultItems[space.index] = item;
            log(
              `Assigned importance ${item.originalImportance} item ${item.id} to 1×1 space at position ${space.index}`
            );
            itemIndex++;
          }

          return resultItems.filter((item) => item !== undefined);
        };

        const layoutBlueprint = generateLayoutBlueprint(allItems.length);
        return assignItemsToBlueprint(allItems, layoutBlueprint);
      };

      const finalItems = createOptimizedLayout();

      log(`Created optimized layout with ${finalItems.length} items`);
      log(`Made ${adjustments.length} size adjustments to fit pattern`);

      setGridItems(finalItems);

      let totalCells = 0;
      let totalWidth = 0;

      finalItems.forEach((item) => {
        const width = item.debugDimensions.width;
        const height = item.debugDimensions.height;

        totalCells += width * height;
        totalWidth += width;
      });

      setDebugInfo({
        totalCells,
        totalWidth,
        cellsUsed: totalCells,
        placeholders: 0,
        adjustments,
        gridWidth,
        widthRemainder: totalWidth % gridWidth,
        cellsRemainder: totalCells % gridWidth,
        debugLog: getLog(),
      });
    } catch (err) {
      setError(err.message);
      console.error("Grid error:", err);

      const simpleGrid = portfolioItems.map((item) => {
        return {
          ...item,
          gridStyle: {
            gridRow: `span 1`,
            gridColumn: `span 1`,
          },
          debugDimensions: { width: 1, height: 1, label: "1×1" },
          uniqueKey: `simple-${item.id}`,
        };
      });

      setGridItems(simpleGrid);
    }
  }, []);

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") closeProjectModal();
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="bg-[#050610] min-h-screen p-4 text-white font-sans">
      <style jsx>{`
        .portfolio-grid {
          display: grid;
          --base-size: 31vw;
          --grid-size: calc(var(--base-size) - 1rem);
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          grid-auto-rows: var(--grid-size);
        }

        @media (max-width: 768px) {
          .portfolio-grid {
            gap: 0.5rem;
          }
        }

        @media (max-width: 640px) {
          .portfolio-grid {
            gap: 0.25rem;
          }
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.85);
          z-index: 50;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 1rem;
          backdrop-filter: blur(5px);
        }

        .modal-content {
          background-color: #111827;
          border-radius: 0.75rem;
          max-width: 95%;
          width: 1000px;
          max-height: 80vh;
          overflow-y: auto;
          position: relative;
          border: 1px solid rgba(59, 130, 246, 0.2);
          box-shadow: 0 0 25px rgba(59, 130, 246, 0.15);
        }

        @media (max-width: 1250px) {
          .modal-content {
            max-height: 65vh;
          }
        }

        .carousel-button {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background-color: rgba(0, 0, 0, 0.5);
          border-radius: 9999px;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .carousel-button:hover {
          background-color: rgba(59, 130, 246, 0.7);
        }

        .prev-button {
          left: 10px;
        }

        .next-button {
          right: 10px;
        }

        .swiper {
          width: 100%;
          height: 100%;
        }

        .swiper-slide {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .swiper-pagination-bullet {
          background: rgba(255, 255, 255, 0.5);
          opacity: 1;
        }

        .swiper-pagination-bullet-active {
          background: white;
          transform: scale(1.3);
        }

        .swiper-button-next,
        .swiper-button-prev {
          color: white;
          background-color: rgba(0, 0, 0, 0.5);
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .swiper-button-next:hover,
        .swiper-button-prev:hover {
          background-color: rgba(59, 130, 246, 0.7);
        }

        .swiper-button-next::after,
        .swiper-button-prev::after {
          font-size: 16px;
          font-weight: bold;
        }
      `}</style>

      <h1 className="text-center text-2xl md:text-3xl lg:text-4xl mb-6 md:mb-8 mt-8 md:mt-12">
        Quelques unes de nos créations
      </h1>

      {error && (
        <div className="bg-red-500 text-white p-4 mb-4 rounded-sm max-w-6xl mx-auto">
          Error: {error}
        </div>
      )}

      <div className="mx-auto mb-6 flex justify-between items-center">
        <button
          onClick={() => setShowDebug(!showDebug)}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-sm transition-colors hidden"
        >
          {showDebug ? "Hide Debug Info" : "Show Debug Info"}
        </button>

        {showDebug && (
          <div className="text-xs bg-gray-800 p-4 rounded-sm">
            <h3 className="font-bold mb-2">Grid Stats</h3>
            <p>Total Cells Used: {debugInfo.cellsUsed}</p>
            <p>Total Width Used: {debugInfo.totalWidth || "N/A"}</p>
            <p>Grid Width: {debugInfo.gridWidth || 3}</p>
            <p>Items: {gridItems.length}</p>
            {debugInfo.adjustments && debugInfo.adjustments.length > 0 && (
              <p>Adjustments: {debugInfo.adjustments.length}</p>
            )}
          </div>
        )}
      </div>

      <div className="mx-2 sm:mx-4 md:mx-6">
        <div className="portfolio-grid">
          {gridItems.map((item, index) => (
            <div
              key={`grid-cell-${item.uniqueKey || item.id}`}
              style={{
                gridRow: `span ${item.debugDimensions.height}`,
                gridColumn: `span ${item.debugDimensions.width}`,
              }}
            >
              <ScrollReveal
                key={item.uniqueKey || item.id}
                threshold={0.25}
                delay={(index % 3) * 75}
                animation="fade-up"
                className={`
                  h-full w-full
                  relative overflow-hidden rounded-4xl
                  group cursor-pointer
                  hover:shadow-lg hover:shadow-blue-500/20
                  opacity-0 translate-y-8
                `}
                style={{
                  visibility: "hidden",
                }}
              >
                <div
                  className="h-full w-full"
                  onClick={() => openProjectModal(item)}
                >
                  <div className="absolute inset-0">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      priority
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="portfolio-overlay absolute bottom-0 left-0 right-0 bg-black/70 text-white p-3 sm:p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out">
                    <h3 className="text-base sm:text-lg font-semibold text-blue-300">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm mt-1 opacity-0 group-hover:opacity-100 transition-opacity delay-100 duration-300 line-clamp-2 sm:line-clamp-3">
                      {portfolioItems
                        .find((p) => p.id === item.id)
                        ?.description?.slice(0, 80)}
                      {portfolioItems.find((p) => p.id === item.id)?.description
                        ?.length > 80
                        ? "..."
                        : ""}
                    </p>
                    <div className="flex items-center mt-2 sm:mt-3">
                      <span className="text-xs px-2 py-1 bg-blue-800/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity delay-200 duration-300">
                        View Project
                      </span>
                    </div>
                  </div>

                  {showDebug && (
                    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-white p-2 text-center">
                      <p className="font-bold text-lg">
                        {item.debugDimensions.label}
                      </p>
                      <p className="text-xs">ID: {item.id}</p>
                      <p className="text-xs">
                        Grid: {item.debugDimensions.width}×
                        {item.debugDimensions.height}
                      </p>
                      <p className="text-xs">
                        Cells:{" "}
                        {item.debugDimensions.width *
                          item.debugDimensions.height}
                      </p>
                      <p className="text-xs">
                        Importance: {item.originalImportance}
                      </p>
                      {item.originalImportance !==
                        (item.debugDimensions.width === 2 &&
                        item.debugDimensions.height === 2
                          ? 4
                          : item.debugDimensions.width === 2 &&
                            item.debugDimensions.height === 1
                          ? 3
                          : 1) && (
                        <p className="text-xs text-yellow-400 mt-2">
                          Adjusted from original size
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </ScrollReveal>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && selectedProject && (
        <div
          className="modal-overlay"
          onClick={closeProjectModal}
          style={{
            animation: `fadeIn 0.3s ease forwards`,
          }}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              animation: `slideUp 0.4s ease forwards`,
            }}
          >
            <button
              onClick={closeProjectModal}
              className="absolute top-4 right-4 z-10 bg-black/40 hover:bg-blue-600 transition-colors duration-300 rounded-full p-2 text-white"
              aria-label="Close modal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="relative h-72 md:h-96">
              {selectedProject.images && selectedProject.images.length > 0 ? (
                <Swiper
                  modules={[Navigation, Pagination, A11y, Autoplay]}
                  spaceBetween={0}
                  slidesPerView={1}
                  navigation
                  pagination={{ clickable: true }}
                  loop={true}
                  autoplay={{ delay: 5000, disableOnInteraction: false }}
                  initialSlide={currentImageIndex}
                  onSlideChange={(swiper) =>
                    setCurrentImageIndex(swiper.activeIndex)
                  }
                  className="h-full"
                  style={{
                    "--swiper-pagination-bullet-size": "16px",
                    "--swiper-theme-color": "#ffffff",
                  }}
                >
                  {selectedProject.images.map((image, index) => (
                    <SwiperSlide key={`slide-${index}`}>
                      <div className="relative w-full h-full">
                        <Image
                          src={image}
                          alt={`${selectedProject.title} - image ${index + 1}`}
                          fill
                          priority
                          className="object-cover rounded-t-lg"
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              ) : (
                <Image
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  fill
                  priority
                  className="object-cover rounded-t-lg"
                />
              )}

              {/* Project title overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/40 to-transparent p-6 z-10">
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  {selectedProject.title}
                </h2>
              </div>
            </div>

            <div className="p-6 md:p-8 bg-linear-to-b from-gray-900 to-gray-950 rounded-b-lg">
              <div className="mb-6">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
                  {selectedProject.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {selectedProject.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {selectedProject.client && (
                  <div>
                    <span className="font-semibold text-blue-300 text-sm uppercase tracking-wide">
                      Client
                    </span>
                    <p className="text-white mt-1">{selectedProject.client}</p>
                  </div>
                )}

                {selectedProject.year && (
                  <div>
                    <span className="font-semibold text-blue-300 text-sm uppercase tracking-wide">
                      Year
                    </span>
                    <p className="text-white mt-1">{selectedProject.year}</p>
                  </div>
                )}
              </div>

              {selectedProject.technologies &&
                selectedProject.technologies.length > 0 && (
                  <div className="mb-6">
                    <span className="font-semibold text-blue-300 text-sm uppercase tracking-wide">
                      Technologies
                    </span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedProject.technologies.map((tech, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-900/30 border border-blue-800/50 rounded-full text-sm text-blue-200"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {selectedProject.link && (
                <div className="mb-8">
                  <a
                    href={selectedProject.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md transition-colors duration-300"
                  >
                    <div className="flex items-center gap-2">
                      <span>View Project Details</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </div>
                  </a>
                </div>
              )}

              <div className="flex justify-between border-t border-gray-800 pt-6">
                <button
                  onClick={navigateToPrevProject}
                  className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors duration-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  <span>Previous</span>
                </button>
                <button
                  onClick={navigateToNextProject}
                  className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors duration-300"
                >
                  <span>Next</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
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
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(30px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes slideDown {
          from {
            transform: translateY(0);
            opacity: 1;
          }
          to {
            transform: translateY(30px);
            opacity: 0;
          }
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.85);
          z-index: 50;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 1rem;
          backdrop-filter: blur(8px);
        }

        .modal-content {
          background-color: #0c1221;
          border-radius: 0.75rem;
          max-width: 95%;
          width: 1000px;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          border: 1px solid rgba(59, 130, 246, 0.2);
          box-shadow: 0 0 40px rgba(59, 130, 246, 0.2),
            0 0 100px rgba(0, 0, 0, 0.5);
          scrollbar-width: thin;
          scrollbar-color: rgba(59, 130, 246, 0.5) rgba(17, 24, 39, 0.7);
        }

        .modal-content::-webkit-scrollbar {
          width: 8px;
        }

        .modal-content::-webkit-scrollbar-track {
          background: rgba(17, 24, 39, 0.7);
          border-radius: 0 0.75rem 0.75rem 0;
        }

        .modal-content::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.5);
          border-radius: 20px;
        }

        /* Swiper custom styles */
        .swiper-pagination {
          position: absolute;
          bottom: 10px !important;
          z-index: 20;
        }

        .swiper-button-next,
        .swiper-button-prev {
          z-index: 20;
        }

        /* Make sure swiper buttons are visible on mobile */
        @media (max-width: 640px) {
          .swiper-button-next::after,
          .swiper-button-prev::after {
            font-size: 14px;
          }

          .swiper-button-next,
          .swiper-button-prev {
            width: 32px;
            height: 32px;
          }
        }
      `}</style>
    </div>
  );
}
