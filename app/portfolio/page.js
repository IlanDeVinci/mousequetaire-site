"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import ScrollReveal from "../../components/ScrollReveal";

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
      "A showcase of our best work with cutting-edge design and functionality.",
    image: "/images/project1.jpg",
    importance: Math.floor(Math.random() * 4) + 1,
    technologies: ["React", "NextJS", "TailwindCSS"],
    client: "Major Tech Corp",
    year: "2023",
  },
  {
    id: 2,
    title: "Web Design",
    description: "Modern and responsive web design focused on user experience.",
    image: "/images/project2.jpg",
    importance: Math.floor(Math.random() * 4) + 1,
    technologies: ["Figma", "HTML5", "CSS3"],
    client: "Fashion Brand",
    year: "2023",
  },
  {
    id: 3,
    title: "Mobile App",
    description: "Cross-platform mobile application with seamless performance.",
    image: "/images/project3.jpg",
    importance: Math.floor(Math.random() * 4) + 1,
    technologies: ["React Native", "Firebase", "Redux"],
    client: "Health Startup",
    year: "2022",
  },
  {
    id: 4,
    title: "UI/UX Design",
    image: "/images/project4.jpg",
    importance: Math.floor(Math.random() * 4) + 1,
  },
  {
    id: 5,
    title: "Brand Identity",
    image: "/images/project5.jpg",
    importance: Math.floor(Math.random() * 4) + 1,
  },
  {
    id: 6,
    title: "E-commerce Solution",
    image: "/images/project6.jpg",
    importance: Math.floor(Math.random() * 4) + 1,
  },
  {
    id: 7,
    title: "Product Photography",
    image: "/images/project7.jpg",
    importance: Math.floor(Math.random() * 4) + 1,
  },
  {
    id: 8,
    title: "Social Media Campaign",
    image: "/images/project8.jpg",
    importance: Math.floor(Math.random() * 4) + 1,
  },
  {
    id: 9,
    title: "Motion Graphics",
    image: "/images/project9.jpg",
    importance: Math.floor(Math.random() * 4) + 1,
  },
  {
    id: 10,
    title: "Logo Design",
    image: "/images/project10.jpg",
    importance: Math.floor(Math.random() * 4) + 1,
  },
  {
    id: 11,
    title: "Print Design",
    image: "/images/project11.jpg",
    importance: Math.floor(Math.random() * 4) + 1,
  },
  {
    id: 12,
    title: "Website Redesign",
    image: "/images/project12.jpg",
    importance: Math.floor(Math.random() * 4) + 1,
  },
  {
    id: 13,
    title: "App Interface",
    image: "/images/project13.jpg",
    importance: Math.floor(Math.random() * 4) + 1,
  },
  {
    id: 14,
    title: "Marketing Material",
    image: "/images/project14.jpg",
    importance: Math.floor(Math.random() * 4) + 1,
  },
  {
    id: 15,
    title: "Marketing Zeubi",
    image: "/images/project15.jpg",
    importance: Math.floor(Math.random() * 4) + 1,
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
    document.body.style.overflow = "hidden";
  };

  const closeProjectModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "auto";
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
          background-color: rgba(0, 0, 0, 0.75);
          z-index: 50;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 1rem;
        }

        .modal-content {
          background-color: #111827;
          border-radius: 0.5rem;
          max-width: 90%;
          width: 800px;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
        }
      `}</style>

      <h1 className="text-center text-2xl md:text-3xl lg:text-4xl mb-6 md:mb-8 mt-8 md:mt-12">
        Quelques unes de nos créations
      </h1>

      {error && (
        <div className="bg-red-500 text-white p-4 mb-4 rounded max-w-6xl mx-auto">
          Error: {error}
        </div>
      )}

      <div className="mx-auto mb-6 flex justify-between items-center">
        <button
          onClick={() => setShowDebug(!showDebug)}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition-colors hidden"
        >
          {showDebug ? "Hide Debug Info" : "Show Debug Info"}
        </button>

        {showDebug && (
          <div className="text-xs bg-gray-800 p-4 rounded">
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
                threshold={0.1}
                delay={(index % 3) * 100}
                animation="fade-up"
                className={`
                  h-full w-full
                  relative overflow-hidden rounded-lg transition-all duration-300
                  group cursor-pointer
                  hover:shadow-lg hover:shadow-blue-500/20
                `}
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
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
        <div className="modal-overlay" onClick={closeProjectModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="relative h-64 md:h-80 lg:h-96">
              <Image
                src={selectedProject.image}
                alt={selectedProject.title}
                fill
                priority
                className="object-cover"
              />
              <button
                onClick={closeProjectModal}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full transition-colors"
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
            </div>

            <div className="p-6">
              <h2 className="text-2xl md:text-3xl font-bold text-blue-300">
                {selectedProject.title}
              </h2>

              <div className="mt-4">
                <p className="text-gray-200 mb-4">
                  {portfolioItems.find((p) => p.id === selectedProject.id)
                    ?.description || "No description available."}
                </p>

                {selectedProject.technologies && (
                  <div className="mt-5">
                    <h3 className="text-lg font-semibold mb-2">Technologies</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.technologies.map((tech, index) => (
                        <span
                          key={index}
                          className="bg-blue-900/50 text-blue-200 px-3 py-1 rounded-full text-xs"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
                  {selectedProject.client && (
                    <div>
                      <span className="font-semibold text-gray-400">
                        Client:
                      </span>
                      <p className="text-white">{selectedProject.client}</p>
                    </div>
                  )}

                  {selectedProject.year && (
                    <div>
                      <span className="font-semibold text-gray-400">Year:</span>
                      <p className="text-white">{selectedProject.year}</p>
                    </div>
                  )}
                </div>

                <div className="mt-8">
                  <button
                    onClick={closeProjectModal}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDebug && (
        <>
          <div className="max-w-6xl mx-auto mt-8 p-4 bg-gray-800 rounded">
            <h3 className="font-bold mb-2">Item Breakdown</h3>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
              {gridItems.map((item) => (
                <div
                  key={item.uniqueKey || item.id}
                  className={`bg-gray-700 p-2 rounded text-xs ${
                    item.originalImportance !==
                    (item.debugDimensions.width === 2 &&
                    item.debugDimensions.height === 2
                      ? 4
                      : item.debugDimensions.width === 2 &&
                        item.debugDimensions.height === 1
                      ? 3
                      : 1)
                      ? "border border-yellow-500"
                      : ""
                  }`}
                >
                  <p>
                    <strong>Item {item.id}:</strong> {item.title}
                  </p>
                  <p>Size: {item.debugDimensions.label}</p>
                  {item.originalImportance !==
                    (item.debugDimensions.width === 2 &&
                    item.debugDimensions.height === 2
                      ? 4
                      : item.debugDimensions.width === 2 &&
                        item.debugDimensions.height === 1
                      ? 3
                      : 1) && (
                    <p className="text-yellow-400">
                      Originally:{" "}
                      {item.originalImportance === 1
                        ? "1×1"
                        : item.originalImportance === 2
                        ? "1×2"
                        : item.originalImportance === 3
                        ? "2×1"
                        : "2×2"}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {debugInfo.adjustments && debugInfo.adjustments.length > 0 && (
            <div className="max-w-6xl mx-auto mt-4 p-4 bg-gray-800 rounded">
              <h3 className="font-bold mb-2">Grid Adjustments</h3>
              <div className="text-xs">
                {debugInfo.adjustments.map((adj, i) => (
                  <div key={i} className="bg-yellow-900/50 p-2 mb-1 rounded">
                    <p>
                      <strong>Item {adj.itemId}:</strong> {adj.title}
                    </p>
                    <p>
                      Changed from {adj.from} to {adj.to}
                    </p>
                    <p>Reason: {adj.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="max-w-6xl mx-auto mt-4 p-4 bg-gray-800 rounded">
            <h3 className="font-bold mb-2">Log</h3>
            <div className="text-xs max-h-60 overflow-y-auto">
              {debugInfo.debugLog &&
                debugInfo.debugLog.map((msg, i) => (
                  <div
                    key={i}
                    className={
                      i % 2 === 0 ? "bg-gray-700 p-1" : "bg-gray-600 p-1"
                    }
                  >
                    {msg}
                  </div>
                ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
