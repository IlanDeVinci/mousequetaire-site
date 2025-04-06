"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

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

  // Fix the debug message function
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

  useEffect(() => {
    const { log, getLog } = createDebugLogger();
    const gridWidth = 3; // Our grid has 3 columns
    const adjustments = [];

    try {
      // First prepare all items with 1x1 dimensions by default
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
          index: index, // Store original index for sorting later
        };
      });

      log(`Prepared ${allItems.length} items with default 1×1 size`);

      // Sort items by importance for better assignment
      allItems.sort((a, b) => b.originalImportance - a.originalImportance);
      log(`Sorted items by importance (highest first)`);

      // Two-phase layout approach
      const createOptimizedLayout = () => {
        // Phase 1: Generate layout blueprint first without assigning items
        const generateLayoutBlueprint = (itemCount) => {
          const layoutSpaces = [];

          // Create a simulated set of dummy items just to run through the algorithm
          const dummyItems = Array(itemCount)
            .fill()
            .map((_, i) => ({
              id: `dummy-${i}`,
              originalImportance: 1, // Doesn't matter for blueprint
              title: `Dummy Item ${i}`,
            }));

          // Helper function to track spaces without actually assigning items
          const trackSpace = (width, height) => {
            layoutSpaces.push({
              type: `${width}x${height}`,
              width,
              height,
            });
            return { id: `dummy-space-${layoutSpaces.length}` };
          };

          // Clone the layout generation algorithm but just track spaces
          const simulateLayoutCreation = () => {
            const remainingDummyItems = [...dummyItems];

            // Simulated getNextItem just records the space type
            const simulatedGetNextItem = (width, height) => {
              if (remainingDummyItems.length === 0) return null;
              remainingDummyItems.shift(); // Remove a dummy item
              return trackSpace(width, height);
            };

            // Now run through the same layout algorithm but just tracking spaces
            while (remainingDummyItems.length > 0) {
              const itemsLeft = remainingDummyItems.length;

              // Pattern Row 1: Adaptive first row (identical to your original)
              if (itemsLeft === 4) {
                simulatedGetNextItem(2, 1); // First 2x1
                simulatedGetNextItem(1, 1); // 1x1
                simulatedGetNextItem(1, 1); // 1x1
                simulatedGetNextItem(2, 1); // Second 2x1
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

              // Pattern Row 2 (identical to your original)
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
                  simulatedGetNextItem(2, 2); // 2x2
                  simulatedGetNextItem(1, 1);
                } else if (remainingDummyItems.length === 2) {
                  simulatedGetNextItem(1, 1);
                  simulatedGetNextItem(2, 1);
                } else if (remainingDummyItems.length === 1) {
                  simulatedGetNextItem(2, 1);
                }
              }

              if (remainingDummyItems.length === 0) break;

              // Pattern Row 3 (identical to your original)
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

              // Pattern Row 4 (identical to your original)
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

              // Pattern Row 5 (identical to your original)
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
                simulatedGetNextItem(2, 2); // 2x2
                simulatedGetNextItem(1, 1);
                simulatedGetNextItem(1, 1);
              }

              if (remainingDummyItems.length === 0) break;

              // Pattern Row 6 (identical to your original)
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

          // Run the simulation to get the layout blueprint
          simulateLayoutCreation();
          return layoutSpaces;
        };

        // Phase 2: Assign items to the blueprint based on importance
        const assignItemsToBlueprint = (items, blueprint) => {
          // Count spaces by type
          const spacesByType = {
            "2x2": [],
            "2x1": [],
            "1x1": [],
          };

          // Organize spaces by type
          blueprint.forEach((space, index) => {
            spacesByType[space.type].push({
              ...space,
              index,
            });
          });

          // Sort items by importance (highest first)
          const sortedItems = [...items].sort(
            (a, b) => b.originalImportance - a.originalImportance
          );
          const resultItems = new Array(sortedItems.length);

          log(
            `Blueprint has: ${spacesByType["2x2"].length} 2×2 spaces, ${spacesByType["2x1"].length} 2×1 spaces, ${spacesByType["1x1"].length} 1×1 spaces`
          );

          // Get original size label for importance
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

          // First assign importance 4 items to 2x2 spaces
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

          // Next assign importance 3 items to 2x1 spaces
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

          // If there are leftover 2x2 spaces, assign next highest importance items
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

          // If there are leftover 2x1 spaces, assign next highest importance items
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

          // Assign remaining items to 1x1 spaces
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

          // Filter out any undefined elements (shouldn't happen if algorithm is correct)
          return resultItems.filter((item) => item !== undefined);
        };

        // Execute the two-phase layout process
        const layoutBlueprint = generateLayoutBlueprint(allItems.length);
        return assignItemsToBlueprint(allItems, layoutBlueprint);
      };

      // Use the optimized two-phase layout approach instead of createLayoutPattern
      const finalItems = createOptimizedLayout();

      log(`Created optimized layout with ${finalItems.length} items`);
      log(`Made ${adjustments.length} size adjustments to fit pattern`);

      setGridItems(finalItems);

      // Calculate final metrics for debug info
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

      // Fallback to simple grid
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
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition-colors"
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
          {gridItems.map((item) => (
            <Link
              href={`/portfolio/${item.id}`}
              key={item.uniqueKey || item.id}
              className={`
                relative overflow-hidden rounded-lg transition-all duration-300
                group cursor-pointer
                hover:shadow-lg hover:shadow-blue-500/20
              `}
              style={{
                gridRow: `span ${item.debugDimensions.height}`,
                gridColumn: `span ${item.debugDimensions.width}`,
              }}
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
                    {item.debugDimensions.width * item.debugDimensions.height}
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
            </Link>
          ))}
        </div>
      </div>

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
