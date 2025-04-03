"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

// Enhanced portfolio items with importance representing layout size:
// 4: 2x2 grid (takes 4 spaces)
// 3: 2x1 grid (takes 2 spaces horizontally)
// 2: 1x2 grid (takes 2 spaces vertically) - NO LONGER USED
// 1: 1x1 grid (takes 1 space)
const portfolioItems = [
  {
    id: 1,
    title: "Featured Project",
    image: "/images/project1.jpg",
    importance: Math.floor(Math.random() * 4) + 1,
  },
  {
    id: 2,
    title: "Web Design",
    image: "/images/project2.jpg",
    importance: Math.floor(Math.random() * 4) + 1,
  },
  {
    id: 3,
    title: "Mobile App",
    image: "/images/project3.jpg",
    importance: Math.floor(Math.random() * 4) + 1,
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
    title: "Product Design",
    image: "/images/project15.jpg",
    importance: Math.floor(Math.random() * 4) + 1,
  },
  {
    id: 16,
    title: "Interactive Installation",
    image: "/images/project1.jpg",
    importance: Math.floor(Math.random() * 4) + 1,
  },
  {
    id: 17,
    title: "3D Modeling",
    image: "/images/project2.jpg",
    importance: Math.floor(Math.random() * 4) + 1,
  },
  {
    id: 18,
    title: "Packaging Design",
    image: "/images/project3.jpg",
    importance: Math.floor(Math.random() * 4) + 1,
  },
  {
    id: 19,
    title: "Game UI Design",
    image: "/images/project4.jpg",
    importance: Math.floor(Math.random() * 4) + 1,
  },
  {
    id: 20,
    title: "Augmented Reality App",
    image: "/images/project5.jpg",
    importance: Math.floor(Math.random() * 4) + 1,
  },
  {
    id: 21,
    title: "Editorial Design",
    image: "/images/project6.jpg",
    importance: Math.floor(Math.random() * 4) + 1,
  },
  {
    id: 22,
    title: "Virtual Reality Experience",
    image: "/images/project7.jpg",
    importance: Math.floor(Math.random() * 4) + 1,
  },
  {
    id: 23,
    title: "Data Visualization",
    image: "/images/project8.jpg",
    importance: Math.floor(Math.random() * 4) + 1,
  },
  {
    id: 24,
    title: "Illustration Series",
    image: "/images/project9.jpg",
    importance: Math.floor(Math.random() * 4) + 1,
  },
  {
    id: 25,
    title: "E-learning Platform",
    image: "/images/project10.jpg",
    importance: Math.floor(Math.random() * 4) + 1,
  },
  {
    id: 26,
    title: "Wayfinding System",
    image: "/images/project11.jpg",
    importance: Math.floor(Math.random() * 4) + 1,
  },
  {
    id: 27,
    title: "Wearable Technology",
    image: "/images/project12.jpg",
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
          // Pattern Row 1: Three 1x1 items
          if (remainingItems.length >= 3) {
            for (let i = 0; i < 3 && remainingItems.length > 0; i++) {
              displayItems.push(getNextItem(1, 1, 1)); // Prefer importance 1
            }
            log("Created row pattern: Three 1×1 items");
          } else if (remainingItems.length === 2) {
            // Only 2 items left - use them both as 1x1
            displayItems.push(getNextItem(1, 1, 1));
            displayItems.push(getNextItem(2, 1, 3)); // Make the second one wider
            log(
              "Created row pattern: 1×1, 2×1 (fallback for insufficient items)"
            );
          } else if (remainingItems.length === 1) {
            // Only 1 item left - make it take the whole row
            displayItems.push(getNextItem(3, 1, 3)); // Make it span full row
            log("Created row pattern: 3×1 (fallback for one item)");
          }

          if (remainingItems.length === 0) break;

          // Pattern Row 2: One 1x1, one 2x2 spanning columns 2-3, one 1x1
          if (remainingItems.length >= 3) {
            displayItems.push(getNextItem(1, 1, 1)); // First 1x1
            displayItems.push(getNextItem(2, 2, 4)); // 2x2 (prefer importance 4)
            displayItems.push(getNextItem(1, 1, 1)); // Another 1x1
            log("Created row pattern: 1×1, 2×2, 1×1 items");
          } else if (remainingItems.length === 2) {
            // Only 2 items, skip the 2x2 pattern
            displayItems.push(getNextItem(1, 1, 1));
            displayItems.push(getNextItem(2, 1, 3));
            log(
              "Created row pattern: 1×1, 2×1 (fallback for insufficient items)"
            );
          } else if (remainingItems.length === 1) {
            // Only 1 item, skip the 2x2 pattern
            displayItems.push(getNextItem(3, 1, 3));
            log("Created row pattern: 3×1 (fallback for one item)");
          }

          if (remainingItems.length === 0) break;

          // Pattern Row 3: 2x1 and 1x1
          if (remainingItems.length >= 2) {
            displayItems.push(getNextItem(2, 1, 3)); // 2x1 (prefer importance 3)
            displayItems.push(getNextItem(1, 1, 1)); // 1x1
            log("Created row pattern: 2×1, 1×1 items");
          } else if (remainingItems.length === 1) {
            displayItems.push(getNextItem(3, 1, 3)); // Make it span full row
            log("Created row pattern: 3×1 (fallback for one item)");
          }

          if (remainingItems.length === 0) break;

          // Pattern Row 4: 1x1 followed by 2x1
          if (remainingItems.length >= 2) {
            displayItems.push(getNextItem(1, 1, 1)); // 1x1
            displayItems.push(getNextItem(2, 1, 3)); // 2x1 (prefer importance 3)
            log("Created row pattern: 1×1, 2×1 items");
          } else if (remainingItems.length === 1) {
            displayItems.push(getNextItem(3, 1, 3)); // Make it span full row
            log("Created row pattern: 3×1 (fallback for one item)");
          }

          if (remainingItems.length === 0) break;

          // Pattern Row 5: 2x2 followed by two 1x1
          if (remainingItems.length >= 3) {
            displayItems.push(getNextItem(2, 2, 4)); // 2x2 (prefer importance 4)
            displayItems.push(getNextItem(1, 1, 1)); // 1x1
            displayItems.push(getNextItem(1, 1, 1)); // 1x1
            log("Created row pattern: 2×2, 1×1, 1×1 items");
          } else if (remainingItems.length === 2) {
            // Skip the 2x2 pattern with only 2 items
            displayItems.push(getNextItem(2, 1, 3));
            displayItems.push(getNextItem(1, 1, 1));
            log(
              "Created row pattern: 2×1, 1×1 (fallback for insufficient items)"
            );
          } else if (remainingItems.length === 1) {
            // Skip the 2x2 pattern with only 1 item
            displayItems.push(getNextItem(3, 1, 3)); // Make it span full row
            log("Created row pattern: 3×1 (fallback for one item)");
          }

          if (remainingItems.length === 0) break;
          // Pattern Row 6: Final row with flexible sizing
          if (remainingItems.length === 3) {
            // If we have exactly 3 items left, use three 1x1 items
            for (let i = 0; i < 3 && remainingItems.length > 0; i++) {
              displayItems.push(getNextItem(1, 1, 1)); // Prefer importance 1
            }
          } else if (remainingItems.length === 2) {
            // If we have 2 items left, make one of them 2x1 if possible
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
          } else if (remainingItems.length === 1) {
            // If we have 1 item left, make it a 2x1
            displayItems.push(getNextItem(3, 1, 3));
          } else {
            // For any other number of items, use 1x1 followed by 2x1
            displayItems.push(getNextItem(1, 1, 1)); // One 1x1 item
            displayItems.push(getNextItem(2, 1, 3)); // One 2x1 item
          }

          log("Created row pattern: Three 1×1 items (final row)");
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
    <div className="bg-black min-h-screen p-8 text-white font-sans">
      <h1 className="text-center text-4xl mb-8 uppercase tracking-widest">
        My Portfolio
      </h1>

      {error && (
        <div className="bg-red-500 text-white p-4 mb-4 rounded max-w-6xl mx-auto">
          Error: {error}
        </div>
      )}

      <div className="max-w-6xl mx-auto mb-6 flex justify-between items-center">
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

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-3 gap-4 auto-rows-[minmax(300px,auto)]">
          {gridItems.map((item) => (
            <div
              key={item.uniqueKey || item.id}
              className={`relative overflow-hidden rounded-lg transition-all duration-300`}
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
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="portfolio-overlay absolute bottom-0 left-0 right-0 bg-black/70 text-white p-4">
                <h3 className="text-lg font-semibold">{item.title}</h3>
                {showDebug &&
                  item.originalImportance !==
                    (item.debugDimensions.width === 2 &&
                    item.debugDimensions.height === 2
                      ? 4
                      : item.debugDimensions.width === 2 &&
                        item.debugDimensions.height === 1
                      ? 3
                      : 1) && (
                    <span className="text-xs bg-yellow-600 px-1 rounded ml-2">
                      Adjusted
                    </span>
                  )}
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
            </div>
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
