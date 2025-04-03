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

      // Create a predefined pattern layout
      const createLayoutPattern = () => {
        const displayItems = [];
        const remainingItems = [...allItems];

        // Helper function to find items by importance
        const findItemsByImportance = (importance, count = 1) => {
          const result = [];
          for (
            let i = 0;
            i < remainingItems.length && result.length < count;
            i++
          ) {
            if (remainingItems[i].originalImportance === importance) {
              result.push(remainingItems.splice(i, 1)[0]);
              i--; // Adjust index since we removed an item
            }
          }
          return result;
        };

        // Function to get next item with preferred importance
        const getNextItem = (width, height, preferredImportance) => {
          if (remainingItems.length === 0) return null;

          let item;

          // Try to find an item with matching importance
          if (preferredImportance) {
            const matches = findItemsByImportance(preferredImportance, 1);
            if (matches.length > 0) {
              item = matches[0];
              log(
                `Found item with correct importance (${preferredImportance}) for ${width}×${height}`
              );
            }
          }

          // If no match found, just take next item
          if (!item) {
            item = remainingItems.shift();
            log(
              `Using next available item for ${width}×${height} (preferred importance: ${preferredImportance})`
            );
          }

          // Set dimensions based on parameters
          item.debugDimensions = { width, height, label: `${width}×${height}` };
          item.gridStyle = {
            gridRow: `span ${height}`,
            gridColumn: `span ${width}`,
          };

          // Record adjustment if dimensions differ from original importance
          const newImportance =
            width === 2 && height === 2
              ? 4
              : width === 2 && height === 1
              ? 3
              : 1;
          if (item.originalImportance !== newImportance) {
            adjustments.push({
              itemId: item.id,
              title: item.title,
              from: getOriginalSizeLabel(item.originalImportance),
              to: `${width}×${height}`,
              reason: `Assigned to ${width}×${height} based on layout pattern`,
            });
          }

          return item;
        };

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

        // Keep creating pattern rows until we run out of items
        while (remainingItems.length > 0) {
          // Check remaining items and plan accordingly
          const itemsLeft = remainingItems.length;
          // Pattern Row 1: Adaptive first row based on remaining items
          if (itemsLeft === 4) {
            // For exactly 4 items, use pattern: 2x1, 1x1, 1x1, 2x1
            displayItems.push(getNextItem(2, 1, 3)); // First 2x1
            displayItems.push(getNextItem(1, 1, 1)); // 1x1
            displayItems.push(getNextItem(1, 1, 1)); // 1x1
            displayItems.push(getNextItem(2, 1, 3)); // Second 2x1
            log(
              "Created row pattern: 2×1, 1×1, 1×1, 2×1 (for exactly 4 items)"
            );
          } else if (itemsLeft >= 3) {
            for (let i = 0; i < 3 && remainingItems.length > 0; i++) {
              displayItems.push(getNextItem(1, 1, 1)); // Prefer importance 1
            }
            log("Created row pattern: Three 1×1 items");
          } else if (itemsLeft === 2) {
            displayItems.push(getNextItem(1, 1, 1));
            displayItems.push(getNextItem(2, 1, 3)); // Make the second one wider
            log("Created row pattern: 1×1, 2×1 (for 2 remaining items)");
          } else if (itemsLeft === 1) {
            // For last item, make it a 2x1 instead of 3x1
            displayItems.push(getNextItem(2, 1, 3)); // 2x1 instead of 3x1
            log("Created row pattern: 2×1 (for final item)");
          }

          if (remainingItems.length === 0) break;

          // Pattern Row 2: Check if we need to adjust layout based on remaining items
          if (remainingItems.length <= 5) {
            // If we're getting low on items
            // Create a layout that will work well for few remaining items
            if (remainingItems.length === 4) {
              // Special pattern for exactly 4 items
              displayItems.push(getNextItem(1, 1, 1)); // 1x1
              displayItems.push(getNextItem(2, 1, 3)); // 2x1
              displayItems.push(getNextItem(2, 1, 3)); // 2x1
              displayItems.push(getNextItem(1, 1, 1)); // 1x1
              log(
                "Created adjusted row pattern: 1×1, 2×1, 2×1, 1×1 (for exactly 4 items)"
              );
            } else if (remainingItems.length === 3) {
              // For exactly 3 items, use three 1x1 items
              for (let i = 0; i < 3; i++) {
                displayItems.push(getNextItem(1, 1, 1)); // 1x1
              }
              log(
                "Created adjusted row pattern: Three 1×1 items (for exactly 3 items)"
              );
            } else if (remainingItems.length >= 2) {
              displayItems.push(getNextItem(2, 1, 3)); // 2x1
              displayItems.push(getNextItem(1, 1, 1)); // 1x1
              log(
                "Created adjusted row pattern: 2×1, 1×1 (for few remaining items)"
              );
            } else if (remainingItems.length === 1) {
              displayItems.push(getNextItem(2, 1, 3)); // 2x1 for last item
              log("Created adjusted row pattern: 2×1 (for final item)");
            }
          } else {
            // Standard pattern: One 1x1, one 2x2 spanning columns 2-3, one 1x1
            if (remainingItems.length >= 3) {
              displayItems.push(getNextItem(1, 1, 1)); // First 1x1
              displayItems.push(getNextItem(2, 2, 4)); // 2x2 (prefer importance 4)
              displayItems.push(getNextItem(1, 1, 1)); // Another 1x1
              log("Created row pattern: 1×1, 2×2, 1×1 items");
            } else if (remainingItems.length === 2) {
              displayItems.push(getNextItem(1, 1, 1));
              displayItems.push(getNextItem(2, 1, 3));
              log("Created row pattern: 1×1, 2×1 (for 2 remaining items)");
            } else if (remainingItems.length === 1) {
              displayItems.push(getNextItem(2, 1, 3)); // 2x1 instead of 3x1
              log("Created row pattern: 2×1 (for final item)");
            }
          }

          if (remainingItems.length === 0) break;

          // Pattern Row 3: Look ahead to optimize
          if (remainingItems.length === 4) {
            // If exactly 4 items remain, create balanced pattern
            displayItems.push(getNextItem(1, 1, 1)); // 1x1
            displayItems.push(getNextItem(2, 1, 3)); // 2x1
            displayItems.push(getNextItem(2, 1, 3)); // 2x1
            displayItems.push(getNextItem(1, 1, 1)); // 1x1
            log(
              "Created row pattern: 1×1, 2×1, 2×1, 1×1 (for exactly 4 items)"
            );
          } else if (remainingItems.length === 3) {
            // If exactly 3 items remain, use 3 1x1 items to complete the grid
            for (let i = 0; i < 3; i++) {
              displayItems.push(getNextItem(1, 1, 1));
            }
            log("Created row pattern: Three 1×1 items (for final 3 items)");
          } else if (remainingItems.length === 2) {
            displayItems.push(getNextItem(2, 1, 3)); // 2x1
            displayItems.push(getNextItem(1, 1, 1)); // 1x1
            log("Created row pattern: 2×1, 1×1 (for final 2 items)");
          } else if (remainingItems.length === 1) {
            displayItems.push(getNextItem(2, 1, 3)); // 2x1 instead of 3x1
            log("Created row pattern: 2×1 (for final item)");
          } else {
            // Standard pattern for more items
            displayItems.push(getNextItem(2, 1, 3)); // 2x1 (prefer importance 3)
            displayItems.push(getNextItem(1, 1, 1)); // 1x1
            log("Created row pattern: 2×1, 1×1 items");
          }

          if (remainingItems.length === 0) break;

          // Pattern Row 4: Look ahead to optimize
          if (remainingItems.length <= 3) {
            // If 3 or fewer items remain
            // Use them all in a balanced way
            if (remainingItems.length === 3) {
              for (let i = 0; i < 3; i++) {
                displayItems.push(getNextItem(1, 1, 1));
              }
              log("Created balanced row: Three 1×1 items (for final 3 items)");
            } else if (remainingItems.length === 2) {
              displayItems.push(getNextItem(1, 1, 1));
              displayItems.push(getNextItem(2, 1, 3));
              log("Created balanced row: 1×1, 2×1 (for final 2 items)");
            } else {
              displayItems.push(getNextItem(2, 1, 3)); // 2x1 for last item
              log("Created final item row: 2×1 (for final item)");
            }
          } else {
            // Standard pattern: 1x1 followed by 2x1
            displayItems.push(getNextItem(1, 1, 1)); // 1x1
            displayItems.push(getNextItem(2, 1, 3)); // 2x1 (prefer importance 3)
            log("Created row pattern: 1×1, 2×1 items");
          }

          if (remainingItems.length === 0) break;

          // Pattern Row 5: 2x2 followed by two 1x1 - or adaptive pattern
          if (remainingItems.length <= 4) {
            // If we're in the final items
            // Create a pattern that uses remaining items effectively
            if (remainingItems.length === 4) {
              // Two 2x1 items
              displayItems.push(getNextItem(2, 1, 3));
              displayItems.push(getNextItem(1, 1, 1));
              displayItems.push(getNextItem(1, 1, 1));
              displayItems.push(getNextItem(2, 1, 3));

              log(
                "Created adaptive row: 2×1, 1×1 and 2×1, 1×1 (for final 4 items)"
              );
            } else if (remainingItems.length === 3) {
              for (let i = 0; i < 3; i++) {
                displayItems.push(getNextItem(1, 1, 1));
              }
              log("Created adaptive row: Three 1×1 items (for final 3 items)");
            } else if (remainingItems.length === 2) {
              displayItems.push(getNextItem(2, 1, 3));
              displayItems.push(getNextItem(1, 1, 1));
              log("Created adaptive row: 2×1, 1×1 (for final 2 items)");
            } else {
              displayItems.push(getNextItem(2, 1, 3)); // 2x1 for last item
              log("Created adaptive row: 2×1 (for final item)");
            }
          } else {
            // Standard pattern if we have enough items
            displayItems.push(getNextItem(2, 2, 4)); // 2x2 (prefer importance 4)
            displayItems.push(getNextItem(1, 1, 1)); // 1x1
            displayItems.push(getNextItem(1, 1, 1)); // 1x1
            log("Created row pattern: 2×2, 1×1, 1×1 items");
          }

          if (remainingItems.length === 0) break;

          // Pattern Row 6: Final row with adaptive sizing
          // Use different patterns based on exact number of items remaining
          if (remainingItems.length === 3) {
            for (let i = 0; i < 3; i++) {
              displayItems.push(getNextItem(1, 1, 1));
            }
            log("Created final row: Three 1×1 items");
          } else if (remainingItems.length === 2) {
            const preferLargeItem =
              remainingItems.findIndex(
                (item) => item.originalImportance >= 3
              ) !== -1;
            if (preferLargeItem) {
              displayItems.push(getNextItem(2, 1, 3)); // 2x1 item
              displayItems.push(getNextItem(1, 1, 1)); // 1x1 item
            } else {
              displayItems.push(getNextItem(1, 1, 1)); // 1x1 item
              displayItems.push(getNextItem(2, 1, 3)); // 2x1 item
            }
            log("Created final row: 2×1, 1×1 or 1×1, 2×1 items");
          } else if (remainingItems.length === 1) {
            displayItems.push(getNextItem(2, 1, 3)); // 2x1 instead of 3x1
            log("Created final row: 2×1 (for final item)");
          } else {
            // Create a pattern for remaining items
            if (remainingItems.length === 4) {
              // For exactly 4 items, create a balanced row: 1x1, 2x1, 2x1, 1x1
              displayItems.push(getNextItem(1, 1, 1)); // 1x1
              displayItems.push(getNextItem(2, 1, 3)); // 2x1
              displayItems.push(getNextItem(2, 1, 3)); // 2x1
              displayItems.push(getNextItem(1, 1, 1)); // 1x1
              log(
                "Created balanced row: 1×1, 2×1, 2×1, 1×1 (for exactly 4 items)"
              );
            } else {
              // Standard pattern for other cases
              displayItems.push(getNextItem(1, 1, 1)); // 1x1
              displayItems.push(getNextItem(2, 1, 3)); // 2x1
              log("Created standard row: 1×1, 2×1 items");
            }
          }
        }

        return displayItems;
      };

      const finalItems = createLayoutPattern();

      log(`Created layout with ${finalItems.length} items`);
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
      <h1 className="text-center text-4xl mb-8 mt-12">
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

      <div className="mx-6">
        <div className="grid grid-cols-3 gap-4 auto-rows-[minmax(300px,auto)]">
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
                minHeight: item.debugDimensions.height > 1 ? "600px" : "300px",
                gridRow: `span ${item.debugDimensions.height}`,
                gridColumn: `span ${item.debugDimensions.width}`,
              }}
            >
              <div className="absolute inset-0">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="portfolio-overlay absolute bottom-0 left-0 right-0 bg-black/70 text-white p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out">
                <h3 className="text-lg font-semibold text-blue-300">
                  {item.title}
                </h3>
                <p className="text-sm mt-1 opacity-0 group-hover:opacity-100 transition-opacity delay-100 duration-300">
                  {portfolioItems
                    .find((p) => p.id === item.id)
                    ?.description?.slice(0, 100)}
                  {portfolioItems.find((p) => p.id === item.id)?.description
                    ?.length > 100
                    ? "..."
                    : ""}
                </p>
                <div className="flex items-center mt-3">
                  <span className="text-xs px-3 py-1 bg-blue-800/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity delay-200 duration-300">
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
