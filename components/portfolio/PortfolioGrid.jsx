"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import ScrollReveal from "../ScrollReveal";
import ProjectModal from "./ProjectModal";

export default function PortfolioGrid({ portfolioItems }) {
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
          debugDimensions: { width: 1, height: 1, label: "1x1" },
          uniqueKey: `item-${item.id}`,
          index: index,
        };
      });

      log(`Prepared ${allItems.length} items with default 1x1 size`);

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
            `Blueprint has: ${spacesByType["2x2"].length} 2x2 spaces, ${spacesByType["2x1"].length} 2x1 spaces, ${spacesByType["1x1"].length} 1x1 spaces`
          );

          const getOriginalSizeLabel = (importance) => {
            switch (importance) {
              case 4:
                return "2x2";
              case 3:
                return "2x1";
              case 2:
                return "1x2";
              case 1:
              default:
                return "1x1";
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

            item.debugDimensions = { width: 2, height: 2, label: "2x2" };
            item.gridStyle = { gridRow: `span 2`, gridColumn: `span 2` };

            resultItems[space.index] = item;
            log(
              `Assigned importance 4 item ${item.id} to 2x2 space at position ${space.index}`
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

            item.debugDimensions = { width: 2, height: 1, label: "2x1" };
            item.gridStyle = { gridRow: `span 1`, gridColumn: `span 2` };

            resultItems[space.index] = item;
            log(
              `Assigned importance 3 item ${item.id} to 2x1 space at position ${space.index}`
            );
            itemIndex++;
          }

          while (
            spacesByType["2x2"].length > 0 &&
            itemIndex < sortedItems.length
          ) {
            const item = sortedItems[itemIndex];
            const space = spacesByType["2x2"].shift();

            item.debugDimensions = { width: 2, height: 2, label: "2x2" };
            item.gridStyle = { gridRow: `span 2`, gridColumn: `span 2` };

            if (item.originalImportance !== 4) {
              adjustments.push({
                itemId: item.id,
                title: item.title,
                from: getOriginalSizeLabel(item.originalImportance),
                to: "2x2",
                reason: "Assigned to 2x2 based on importance ranking",
              });
            }

            resultItems[space.index] = item;
            log(
              `Assigned importance ${item.originalImportance} item ${item.id} to 2x2 space at position ${space.index}`
            );
            itemIndex++;
          }

          while (
            spacesByType["2x1"].length > 0 &&
            itemIndex < sortedItems.length
          ) {
            const item = sortedItems[itemIndex];
            const space = spacesByType["2x1"].shift();

            item.debugDimensions = { width: 2, height: 1, label: "2x1" };
            item.gridStyle = { gridRow: `span 1`, gridColumn: `span 2` };

            if (item.originalImportance !== 3) {
              adjustments.push({
                itemId: item.id,
                title: item.title,
                from: getOriginalSizeLabel(item.originalImportance),
                to: "2x1",
                reason: "Assigned to 2x1 based on importance ranking",
              });
            }

            resultItems[space.index] = item;
            log(
              `Assigned importance ${item.originalImportance} item ${item.id} to 2x1 space at position ${space.index}`
            );
            itemIndex++;
          }

          while (
            spacesByType["1x1"].length > 0 &&
            itemIndex < sortedItems.length
          ) {
            const item = sortedItems[itemIndex];
            const space = spacesByType["1x1"].shift();

            item.debugDimensions = { width: 1, height: 1, label: "1x1" };
            item.gridStyle = { gridRow: `span 1`, gridColumn: `span 1` };

            if (item.originalImportance !== 1) {
              adjustments.push({
                itemId: item.id,
                title: item.title,
                from: getOriginalSizeLabel(item.originalImportance),
                to: "1x1",
                reason: "Assigned to 1x1 based on importance ranking",
              });
            }

            resultItems[space.index] = item;
            log(
              `Assigned importance ${item.originalImportance} item ${item.id} to 1x1 space at position ${space.index}`
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
          debugDimensions: { width: 1, height: 1, label: "1x1" },
          uniqueKey: `simple-${item.id}`,
        };
      });

      setGridItems(simpleGrid);
    }
  }, [portfolioItems]);

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
    <>
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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300  "></div>
                  </div>
                  <div className="absolute left-0 right-0 bottom-0 z-10">
                    <div className="px-4 py-3 transition-transform duration-300 ease-in-out translate-y-full group-hover:translate-y-0 rounded-b-2xl bg-gradient-to-t from-black/20 to-transparent">
                      <h3 className="text-base font-semibold text-blue-300 mb-1">
                        {item.title}
                      </h3>
                      <p className="text-xs text-gray-200 line-clamp-1">
                        {
                          portfolioItems.find((p) => p.id === item.id)
                            ?.description
                        }
                      </p>
                    </div>
                  </div>

                  {showDebug && (
                    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-white p-2 text-center">
                      <p className="font-bold text-lg">
                        {item.debugDimensions.label}
                      </p>
                      <p className="text-xs">ID: {item.id}</p>
                      <p className="text-xs">
                        Grid: {item.debugDimensions.width}x
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
        <ProjectModal
          project={selectedProject}
          currentImageIndex={currentImageIndex}
          onClose={closeProjectModal}
          onPrev={navigateToPrevProject}
          onNext={navigateToNextProject}
          onSlideChange={setCurrentImageIndex}
        />
      )}
    </>
  );
}
