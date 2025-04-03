"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

// Enhanced portfolio items with importance representing layout size:
// 4: 2x2 grid (takes 4 spaces)
// 3: 2x1 grid (takes 2 spaces horizontally)
// 2: 1x2 grid (takes 2 spaces vertically)
// 1: 1x1 grid (takes 1 space)
const portfolioItems = [
  {
    id: 1,
    title: "Featured Project",
    image: "/images/project1.jpg",
    importance: 3,
  },
  { id: 2, title: "Web Design", image: "/images/project2.jpg", importance: 1 },
  { id: 3, title: "Mobile App", image: "/images/project3.jpg", importance: 4 },
  {
    id: 4,
    title: "UI/UX Design",
    image: "/images/project4.jpg",
    importance: 2,
  },
  {
    id: 5,
    title: "Brand Identity",
    image: "/images/project5.jpg",
    importance: 3,
  },
  {
    id: 6,
    title: "E-commerce Solution",
    image: "/images/project6.jpg",
    importance: 1,
  },
  {
    id: 7,
    title: "Product Photography",
    image: "/images/project7.jpg",
    importance: 2,
  },
  {
    id: 8,
    title: "Social Media Campaign",
    image: "/images/project8.jpg",
    importance: 4,
  },
  {
    id: 9,
    title: "Motion Graphics",
    image: "/images/project9.jpg",
    importance: 3,
  },
  {
    id: 10,
    title: "Logo Design",
    image: "/images/project10.jpg",
    importance: 1,
  },
  {
    id: 11,
    title: "Print Design",
    image: "/images/project11.jpg",
    importance: 2,
  },
  {
    id: 12,
    title: "Website Redesign",
    image: "/images/project12.jpg",
    importance: 4,
  },
  {
    id: 13,
    title: "App Interface",
    image: "/images/project13.jpg",
    importance: 2,
  },
  {
    id: 14,
    title: "Marketing Material",
    image: "/images/project14.jpg",
    importance: 1,
  },
  {
    id: 15, // Changed from 14 to 15 to fix duplicate key issue
    title: "Product Design",
    image: "/images/project15.jpg",
    importance: 3,
  },
];

export default function Portfolio() {
  const [gridItems, setGridItems] = useState([]);
  const [error, setError] = useState(null);
  const [showDebug, setShowDebug] = useState(false);
  const [debugInfo, setDebugInfo] = useState({
    totalCells: 0,
    cellsUsed: 0,
    placeholders: 0,
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
    const adjustedItems = [...portfolioItems];
    const { log, getLog } = createDebugLogger();

    try {
      const virtualGrid = [];
      const itemsBySize = {
        "2x2": [...adjustedItems.filter((item) => item.importance === 4)],
        "2x1": [...adjustedItems.filter((item) => item.importance === 3)],
        "1x2": [...adjustedItems.filter((item) => item.importance === 2)],
        "1x1": [...adjustedItems.filter((item) => item.importance === 1)],
      };
      const gridWidth = 3;
      let debugCellsUsed = 0;
      const displayItems = []; // Add missing displayItems array

      log("Starting grid organization with width: " + gridWidth);

      const getDimensions = (importance) => {
        switch (importance) {
          case 4:
            return { width: 2, height: 2, label: "2×2" };
          case 3:
            return { width: 2, height: 1, label: "2×1" };
          case 2:
            return { width: 1, height: 2, label: "1×2" };
          case 1:
          default:
            return { width: 1, height: 1, label: "1×1" };
        }
      };

      const calculateTotalCells = () => {
        let totalCells = 0;
        portfolioItems.forEach((item) => {
          const { width, height } = getDimensions(item.importance);
          totalCells += width * height;
        });

        log(`Total cells needed by all items: ${totalCells}`);

        if (totalCells % gridWidth !== 0) {
          const remainder = totalCells % gridWidth;
          const cellsNeeded = gridWidth - remainder;
          log(
            `Need to add ${cellsNeeded} more cell(s) to make total a multiple of ${gridWidth}`
          );
          return { totalCells, needsAdjustment: true, cellsNeeded };
        }

        return { totalCells, needsAdjustment: false };
      };

      const { totalCells, needsAdjustment, cellsNeeded } =
        calculateTotalCells();

      if (needsAdjustment) {
        log("=== PHASE 0: Adjusting items to ensure complete rows ===");

        if (cellsNeeded === 1) {
          const candidate = adjustedItems.find((item) => item.importance === 1);
          if (candidate) {
            log(
              `Promoting item ${candidate.id} (${candidate.title}) from 1x1 to 1x2 to balance the grid`
            );
            candidate.importance = 2;
            candidate.originalImportance = 1;
          } else {
            log(
              "WARNING: Couldn't find a 1x1 item to promote for grid balance"
            );
          }
        } else if (cellsNeeded === 2) {
          const candidates = adjustedItems
            .filter((item) => item.importance === 1)
            .slice(0, 2);
          if (candidates.length === 2) {
            candidates.forEach((candidate) => {
              log(
                `Promoting item ${candidate.id} (${candidate.title}) from 1x1 to 1x2 to balance the grid`
              );
              candidate.importance = 2;
              candidate.originalImportance = 1;
            });
          } else if (candidates.length === 1) {
            const wideCandidate = adjustedItems.find(
              (item) => item.importance === 3
            );
            if (wideCandidate) {
              log(
                `Promoting item ${wideCandidate.id} (${wideCandidate.title}) from 2x1 to 2x2 to balance the grid`
              );
              wideCandidate.importance = 4;
              wideCandidate.originalImportance = 3;
            } else {
              log(
                "WARNING: Couldn't find suitable items to promote for grid balance"
              );
            }
          } else {
            log("WARNING: Not enough 1x1 items for grid adjustment");
          }
        }

        let adjustedTotal = 0;
        adjustedItems.forEach((item) => {
          const { width, height } = getDimensions(item.importance);
          adjustedTotal += width * height;
        });

        log(
          `After adjustment: Total cells: ${adjustedTotal} (should be multiple of ${gridWidth}: ${
            adjustedTotal % gridWidth === 0 ? "YES" : "NO"
          })`
        );

        // Update itemsBySize after adjustments
        itemsBySize["2x2"] = [
          ...adjustedItems.filter((item) => item.importance === 4),
        ];
        itemsBySize["2x1"] = [
          ...adjustedItems.filter((item) => item.importance === 3),
        ];
        itemsBySize["1x2"] = [
          ...adjustedItems.filter((item) => item.importance === 2),
        ];
        itemsBySize["1x1"] = [
          ...adjustedItems.filter((item) => item.importance === 1),
        ];
      }

      const addRow = () => {
        virtualGrid.push(Array(gridWidth).fill(null));
        return virtualGrid.length - 1;
      };

      addRow(); // Initialize with one row

      const visualizeCurrentGrid = (message) => {
        let gridStr = "\n" + (message || "Current Grid State:") + "\n";
        for (let r = 0; r < virtualGrid.length; r++) {
          gridStr += `Row ${r}: ${virtualGrid[r]
            .map((cell) => (cell !== null ? `Item ${cell}` : "Empty"))
            .join(" | ")}\n`;
        }
        log(gridStr);
      };

      const isPositionAvailable = (row, col, width, height) => {
        if (col + width > gridWidth) {
          return false;
        }

        while (virtualGrid.length <= row + height - 1) {
          addRow();
        }

        for (let r = row; r < row + height; r++) {
          for (let c = col; c < col + width; c++) {
            if (virtualGrid[r][c] !== null) {
              return false;
            }
          }
        }

        return true;
      };

      const placeItem = (item, row, col, width, height, reason) => {
        for (let r = row; r < row + height; r++) {
          while (virtualGrid.length <= r) {
            addRow();
          }
          for (let c = col; c < col + width; c++) {
            virtualGrid[r][c] = item.id;
          }
        }

        log(
          `Placed item ${item.id} (${item.title}) at [${row},${col}] with size ${width}x${height}. Reason: ${reason}`
        );

        const cellsUsed = width * height;
        debugCellsUsed += cellsUsed;

        return {
          ...item,
          gridStyle: {
            gridRow: `span ${height}`,
            gridColumn: `span ${width}`,
          },
          debugDimensions: {
            width,
            height,
            label: `${width}×${height}`,
            cellsUsed,
            position: { row, col },
          },
          placementReason: reason,
          importance: item.originalImportance || item.importance,
          displayOrder: row * 100 + col,
          uniqueKey: `${item.id}-${row}-${col}`,
        };
      };

      const checkGridFill = () => {
        let emptyCount = 0;
        let unevenRows = [];

        for (let r = 0; r < virtualGrid.length; r++) {
          const emptyInRow = virtualGrid[r].filter(
            (cell) => cell === null
          ).length;
          if (emptyInRow > 0) {
            emptyCount += emptyInRow;
            unevenRows.push({ row: r, empties: emptyInRow });
          }
        }

        return {
          completelyFilled: emptyCount === 0,
          emptyCount,
          unevenRows,
        };
      };

      log("=== REVISED GRID FILLING ALGORITHM WITH IMPROVED PLACEMENT ===");
      log(
        `Item counts: 2x2=${itemsBySize["2x2"].length}, 2x1=${itemsBySize["2x1"].length}, 1x2=${itemsBySize["1x2"].length}, 1x1=${itemsBySize["1x1"].length}`
      );

      // Improved grid filling algorithm
      const fillGrid = () => {
        let currentRow = 0;
        let currentCol = 0;

        // First place 2x2 items - they need the most space
        for (const item of itemsBySize["2x2"]) {
          const { width, height } = getDimensions(item.importance);
          let placed = false;

          // Find the first available spot
          for (let r = 0; r < virtualGrid.length + 1 && !placed; r++) {
            for (let c = 0; c <= gridWidth - width && !placed; c++) {
              if (isPositionAvailable(r, c, width, height)) {
                displayItems.push(
                  placeItem(
                    item,
                    r,
                    c,
                    width,
                    height,
                    `Placed 2x2 at [${r},${c}]`
                  )
                );
                placed = true;
              }
            }
          }
        }

        visualizeCurrentGrid("After placing 2x2 items");

        // Place 2x1 items next
        for (const item of itemsBySize["2x1"]) {
          const { width, height } = getDimensions(item.importance);
          let placed = false;

          // Try to place at start of rows for better organization
          for (let r = 0; r < virtualGrid.length + 1 && !placed; r++) {
            if (isPositionAvailable(r, 0, width, height)) {
              displayItems.push(
                placeItem(
                  item,
                  r,
                  0,
                  width,
                  height,
                  `Placed 2x1 at start of row ${r}`
                )
              );
              placed = true;
              continue;
            }

            // If not at start, try other positions
            for (let c = 1; c <= gridWidth - width && !placed; c++) {
              if (isPositionAvailable(r, c, width, height)) {
                displayItems.push(
                  placeItem(
                    item,
                    r,
                    c,
                    width,
                    height,
                    `Placed 2x1 at [${r},${c}]`
                  )
                );
                placed = true;
              }
            }
          }
        }

        visualizeCurrentGrid("After placing 2x1 items");

        // Place 1x2 items next
        for (const item of itemsBySize["1x2"]) {
          const { width, height } = getDimensions(item.importance);
          let placed = false;

          for (let r = 0; r < virtualGrid.length && !placed; r++) {
            for (let c = 0; c < gridWidth && !placed; c++) {
              if (isPositionAvailable(r, c, width, height)) {
                displayItems.push(
                  placeItem(
                    item,
                    r,
                    c,
                    width,
                    height,
                    `Placed 1x2 at [${r},${c}]`
                  )
                );
                placed = true;
              }
            }
          }
        }

        visualizeCurrentGrid("After placing 1x2 items");

        // Finally place 1x1 items to fill gaps
        for (const item of itemsBySize["1x1"]) {
          const { width, height } = getDimensions(item.importance);
          let placed = false;

          for (let r = 0; r < virtualGrid.length && !placed; r++) {
            for (let c = 0; c < gridWidth && !placed; c++) {
              if (isPositionAvailable(r, c, width, height)) {
                displayItems.push(
                  placeItem(
                    item,
                    r,
                    c,
                    width,
                    height,
                    `Placed 1x1 at [${r},${c}]`
                  )
                );
                placed = true;
              }
            }
          }

          if (!placed) {
            // If no space found, create a new row
            const r = virtualGrid.length;
            const c = 0;
            displayItems.push(
              placeItem(
                item,
                r,
                c,
                width,
                height,
                `Placed 1x1 at new row [${r},${c}]`
              )
            );
          }
        }

        visualizeCurrentGrid("After placing all items");
      };

      // Execute grid filling
      fillGrid();

      const gridStatus = checkGridFill();

      if (!gridStatus.completelyFilled) {
        log(`WARNING: Found ${gridStatus.emptyCount} empty cells in the grid!`);

        const lastRowIndex = virtualGrid.length - 1;
        const lastRowEmpty = virtualGrid[lastRowIndex].every(
          (cell) => cell === null
        );

        if (lastRowEmpty) {
          log(`Removing empty last row ${lastRowIndex}`);
          virtualGrid.pop();
        }
      } else {
        log("SUCCESS: Grid completely filled with no empty cells!");
      }

      log("=== SORTING ITEMS FOR DISPLAY ===");

      // Sort items by position for display
      displayItems.sort((a, b) => {
        const aRow = a.debugDimensions.position.row;
        const bRow = b.debugDimensions.position.row;

        if (aRow !== bRow) {
          return aRow - bRow;
        }
        return a.debugDimensions.position.col - b.debugDimensions.position.col;
      });

      log("Final display order (sorted by position):");
      displayItems.forEach((item) => {
        const pos = item.debugDimensions.position;
        log(
          `Item ${item.id} (${item.title}): [${pos.row},${pos.col}] - ${item.debugDimensions.label}`
        );
      });

      visualizeCurrentGrid("FINAL GRID LAYOUT");

      // Check for duplicate IDs
      const uniqueIds = new Set();
      const duplicateIds = [];

      displayItems.forEach((item) => {
        if (uniqueIds.has(item.id)) {
          duplicateIds.push(item.id);
        } else {
          uniqueIds.add(item.id);
        }
      });

      if (duplicateIds.length > 0) {
        log(`WARNING: Found duplicate IDs: ${duplicateIds.join(", ")}`);
      }

      // Set debug info
      setDebugInfo({
        totalCells: virtualGrid.length * gridWidth,
        cellsUsed: debugCellsUsed,
        placeholders: 0,
        emptyCount: gridStatus.emptyCount,
        gridDimensions: `${virtualGrid.length} rows × ${gridWidth} columns`,
        debugLog: getLog(),
      });

      // Set the grid items for display
      setGridItems(displayItems);
    } catch (err) {
      setError(err.message);
      console.error("Grid error:", err);

      // Fallback to simple grid if error
      const simpleGrid = portfolioItems.map((item) => {
        const dimensions = (() => {
          switch (item.importance) {
            case 4:
              return { width: 2, height: 2, label: "2×2" };
            case 3:
              return { width: 2, height: 1, label: "2×1" };
            case 2:
              return { width: 1, height: 2, label: "1×2" };
            case 1:
            default:
              return { width: 1, height: 1, label: "1×1" };
          }
        })();

        return {
          ...item,
          gridStyle: {
            gridRow: `span ${dimensions.height}`,
            gridColumn: `span ${dimensions.width}`,
          },
          debugDimensions: {
            width: dimensions.width,
            height: dimensions.height,
            label: dimensions.label,
            cellsUsed: dimensions.width * dimensions.height,
            position: { row: -1, col: -1 },
          },
          uniqueKey: `simple-${item.id}`,
        };
      });

      setGridItems(simpleGrid);
    }
  }, []);

  const getGridClasses = (item) => {
    const { width, height } = item.debugDimensions;

    let columnClass = width === 2 ? "col-span-2" : "col-span-1";
    let rowClass = height === 2 ? "row-span-2" : "row-span-1";

    return `${columnClass} ${rowClass}`;
  };

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
            <p>Layout: {debugInfo.gridDimensions}</p>
            <p>Total Grid Cells: {debugInfo.totalCells}</p>
            <p>Cells Used by Items: {debugInfo.cellsUsed}</p>
            <p>Placeholder Cells: {debugInfo.placeholders}</p>
          </div>
        )}
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-3 gap-4 auto-rows-auto">
          {gridItems.map((item) => (
            <div
              key={item.uniqueKey || item.id}
              className={`relative overflow-hidden rounded-lg transition-all duration-300 ${getGridClasses(
                item
              )}`}
              style={{
                minHeight: item.debugDimensions.height > 1 ? "800px" : "400px",
                gridRowStart: item.debugDimensions.position.row + 1,
                gridColumnStart: item.debugDimensions.position.col + 1,
              }}
            >
              {!item.isPlaceholder && (
                <>
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
                    {showDebug && (
                      <p className="text-xs mt-1">
                        Position: R{item.debugDimensions.position.row}, C
                        {item.debugDimensions.position.col}
                      </p>
                    )}
                  </div>

                  {showDebug && (
                    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-white p-2 text-center">
                      <p className="font-bold text-lg">
                        {item.debugDimensions.label}
                      </p>
                      <p className="text-xs">ID: {item.id}</p>
                      <p className="text-xs">
                        Position: R{item.debugDimensions.position.row}, C
                        {item.debugDimensions.position.col}
                      </p>
                      <p className="text-xs">
                        Cells: {item.debugDimensions.cellsUsed}
                      </p>
                      <p className="text-xs">Classes: {getGridClasses(item)}</p>
                      <p className="text-xs">Reason: {item.placementReason}</p>
                      {item.originalImportance && (
                        <p className="text-xs text-yellow-400">
                          Original size:{" "}
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
                  )}
                </>
              )}

              {item.isPlaceholder && showDebug && (
                <div className="absolute inset-0 bg-red-900/50 flex items-center justify-center">
                  <p className="text-xs text-white text-center">
                    Placeholder
                    <br />
                    (for grid balance)
                  </p>
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
              {gridItems
                .filter((item) => !item.isPlaceholder)
                .map((item) => (
                  <div
                    key={item.uniqueKey || item.id}
                    className="bg-gray-700 p-2 rounded text-xs"
                  >
                    <p>
                      <strong>Item {item.id}:</strong> {item.title}
                    </p>
                    <p>
                      Size: {item.debugDimensions.label} (Importance:{" "}
                      {item.importance})
                    </p>
                  </div>
                ))}
            </div>
          </div>

          <div className="max-w-6xl mx-auto mt-4 p-4 bg-gray-800 rounded">
            <h3 className="font-bold mb-2">Placement Log</h3>
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
