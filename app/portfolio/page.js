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
    importance: 1,
  },
  { id: 2, title: "Web Design", image: "/images/project2.jpg", importance: 1 },
  { id: 3, title: "Mobile App", image: "/images/project3.jpg", importance: 4 },
  {
    id: 4,
    title: "UI/UX Design",
    image: "/images/project4.jpg",
    importance: 1,
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
    importance: 1,
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
          uniqueKey: `${item.id}-${row}-${col}-${Date.now()}-${Math.random()
            .toString(36)
            .substr(2, 5)}`,
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

      const optimizeGrid = () => {
        log("=== OPTIMIZING GRID TO ELIMINATE EMPTY CELLS ===");

        const gridStatus = checkGridFill();
        if (gridStatus.completelyFilled) {
          log("Grid is already completely filled - no optimization needed.");
          return;
        }

        log(`Found ${gridStatus.emptyCount} empty cells. Optimizing layout...`);

        const placedItems = [...displayItems];
        const rowsToFix = [...gridStatus.unevenRows].sort(
          (a, b) => b.empties - a.empties
        );

        // Function to modify an item's dimensions to help fill gaps
        const modifyItemFormat = (item, newImportance, reason) => {
          const oldImportance = item.importance;
          const oldPos = { ...item.debugDimensions.position };
          const oldSize = { ...item.debugDimensions };

          // Clear the item from virtual grid first
          for (let r = oldPos.row; r < oldPos.row + oldSize.height; r++) {
            for (let c = oldPos.col; c < oldPos.col + oldSize.width; c++) {
              virtualGrid[r][c] = null;
            }
          }

          // Create new dimensions based on new importance
          const newDimensions = getDimensions(newImportance);

          // Store original importance if not already stored
          if (!item.originalImportance) {
            item.originalImportance = oldImportance;
          }

          // Create a new item with modified dimensions
          const newItem = {
            ...item,
            importance: newImportance,
            gridStyle: {
              gridRow: `span ${newDimensions.height}`,
              gridColumn: `span ${newDimensions.width}`,
            },
            debugDimensions: {
              ...newDimensions,
              position: oldPos, // Keep the same position initially
              cellsUsed: newDimensions.width * newDimensions.height,
            },
            placementReason: reason,
            uniqueKey: `${item.id}-modified-${Date.now()}-${Math.random()
              .toString(36)
              .substr(2, 5)}`,
          };

          // Remove old item from display items
          const itemIndex = placedItems.findIndex(
            (i) =>
              i.debugDimensions.position.row === oldPos.row &&
              i.debugDimensions.position.col === oldPos.col &&
              i.id === item.id
          );

          if (itemIndex !== -1) {
            placedItems.splice(itemIndex, 1);
          }

          log(
            `Modified item ${item.id} from importance ${oldImportance} to ${newImportance}`
          );
          return newItem;
        };

        for (const { row, empties } of rowsToFix) {
          log(`Fixing row ${row} with ${empties} empty cells`);

          // Handle completely empty rows
          if (empties === gridWidth) {
            log(`Row ${row} is completely empty and can be removed`);
            const itemsBelow = placedItems.filter(
              (item) => item.debugDimensions.position.row > row
            );

            if (itemsBelow.length > 0) {
              log(
                `Moving ${itemsBelow.length} items up from rows below ${row}`
              );

              for (const item of itemsBelow) {
                const oldPos = { ...item.debugDimensions.position };
                const newRow = oldPos.row - 1;

                const { width, height } = item.debugDimensions;
                for (let r = oldPos.row; r < oldPos.row + height; r++) {
                  for (let c = oldPos.col; c < oldPos.col + width; c++) {
                    if (r < virtualGrid.length && c < gridWidth) {
                      virtualGrid[r][c] = null;
                    }
                  }
                }

                item.debugDimensions.position.row = newRow;

                for (let r = newRow; r < newRow + height; r++) {
                  for (let c = oldPos.col; c < oldPos.col + width; c++) {
                    if (r < virtualGrid.length && c < gridWidth) {
                      virtualGrid[r][c] = item.id;
                    }
                  }
                }

                log(
                  `Moved item ${item.id} from [${oldPos.row},${oldPos.col}] to [${newRow},${oldPos.col}]`
                );
              }
            }

            continue;
          }

          // For partially empty rows
          const emptyCells = [];
          for (let c = 0; c < gridWidth; c++) {
            if (virtualGrid[row][c] === null) {
              emptyCells.push(c);
            }
          }

          if (emptyCells.length > 0) {
            // First try to move small items to fill gaps
            const smallItemsBelow = placedItems.filter(
              (item) =>
                item.debugDimensions.width === 1 &&
                item.debugDimensions.height === 1 &&
                item.debugDimensions.position.row > row
            );

            // Check if we can expand existing 1x1 items in this row that are adjacent to empty cells
            for (let c = 0; c < gridWidth - 1; c++) {
              if (virtualGrid[row][c] !== null && emptyCells.includes(c + 1)) {
                const itemId = virtualGrid[row][c];
                const itemToExpand = placedItems.find(
                  (item) =>
                    item.id === itemId &&
                    item.debugDimensions.width === 1 &&
                    item.debugDimensions.height === 1 &&
                    item.debugDimensions.position.row === row &&
                    item.debugDimensions.position.col === c
                );

                if (itemToExpand) {
                  log(
                    `Found 1x1 item ${
                      itemToExpand.id
                    } at [${row},${c}] that can expand to 2x1 to fill empty cell at [${row},${
                      c + 1
                    }]`
                  );

                  // Modify to 2x1 (importance 3)
                  const modifiedItem = modifyItemFormat(
                    itemToExpand,
                    3,
                    `Modified from 1x1 to 2x1 to fill empty cell at [${row},${
                      c + 1
                    }]`
                  );

                  // Place the expanded item
                  const placedModifiedItem = placeItem(
                    modifiedItem,
                    row,
                    c,
                    2,
                    1,
                    `Expanded item to fill gap at [${row},${c + 1}]`
                  );
                  displayItems.push(placedModifiedItem);

                  // Remove the empty cell we just filled
                  emptyCells.splice(emptyCells.indexOf(c + 1), 1);
                }
              }
              // Check for empty cell followed by 1x1 item (expand leftward)
              else if (
                emptyCells.includes(c) &&
                c + 1 < gridWidth &&
                virtualGrid[row][c + 1] !== null
              ) {
                const itemId = virtualGrid[row][c + 1];
                const itemToExpand = placedItems.find(
                  (item) =>
                    item.id === itemId &&
                    item.debugDimensions.width === 1 &&
                    item.debugDimensions.height === 1 &&
                    item.debugDimensions.position.row === row &&
                    item.debugDimensions.position.col === c + 1
                );

                if (itemToExpand) {
                  log(
                    `Found 1x1 item ${itemToExpand.id} at [${row},${
                      c + 1
                    }] that can expand to 2x1 to fill empty cell at [${row},${c}]`
                  );

                  // Modify to 2x1 (importance 3)
                  const modifiedItem = modifyItemFormat(
                    itemToExpand,
                    3,
                    `Modified from 1x1 to 2x1 to fill empty cell at [${row},${c}]`
                  );

                  // Place the expanded item at the empty cell position
                  const placedModifiedItem = placeItem(
                    modifiedItem,
                    row,
                    c, // Start at the empty cell
                    2,
                    1,
                    `Expanded item to fill gap at [${row},${c}]`
                  );
                  displayItems.push(placedModifiedItem);

                  // Remove the empty cell we just filled
                  emptyCells.splice(emptyCells.indexOf(c), 1);
                }
              }
            }

            // Process remaining empty cells
            for (const emptyCol of emptyCells) {
              if (smallItemsBelow.length > 0) {
                const itemToMove = smallItemsBelow.shift();
                const oldPos = { ...itemToMove.debugDimensions.position };

                virtualGrid[oldPos.row][oldPos.col] = null;

                itemToMove.debugDimensions.position = { row, col: emptyCol };

                virtualGrid[row][emptyCol] = itemToMove.id;

                log(
                  `Moved small item ${itemToMove.id} from [${oldPos.row},${oldPos.col}] to [${row},${emptyCol}]`
                );
              } else {
                log(
                  `No available 1x1 items to move to [${row},${emptyCol}]. Looking for items to resize...`
                );

                // Check if we have two adjacent empty cells that can fit a 2x1
                if (
                  emptyCells.includes(0) &&
                  emptyCells.includes(1) &&
                  emptyCells.length >= 2
                ) {
                  // Try to find a 1x1 item to expand to a 2x1
                  const smallItemToExpand = placedItems.find(
                    (item) =>
                      item.debugDimensions.width === 1 &&
                      item.debugDimensions.height === 1 &&
                      item.debugDimensions.position.row > row
                  );

                  if (smallItemToExpand) {
                    log(
                      `Found 1x1 item ${smallItemToExpand.id} that can be expanded to 2x1`
                    );

                    // Clear its original position
                    const oldPos = {
                      ...smallItemToExpand.debugDimensions.position,
                    };
                    virtualGrid[oldPos.row][oldPos.col] = null;

                    // Modify to 2x1 (importance 3)
                    const modifiedItem = modifyItemFormat(
                      smallItemToExpand,
                      3,
                      `Modified from 1x1 to 2x1 to fill empty cells at row ${row}`
                    );

                    // Place the expanded item
                    const placedModifiedItem = placeItem(
                      modifiedItem,
                      row,
                      0, // Start at the beginning of the row
                      2,
                      1,
                      `Placed expanded item to fill row ${row}`
                    );
                    displayItems.push(placedModifiedItem);

                    // Remove these columns from emptyCells since we've filled them
                    emptyCells.splice(emptyCells.indexOf(0), 1);
                    emptyCells.splice(emptyCells.indexOf(1), 1);
                    continue;
                  }
                }

                // Try to find 2-wide items we can split or resize to fill the gap
                if (
                  emptyCol === 2 &&
                  virtualGrid[row][0] === virtualGrid[row][1]
                ) {
                  const itemId = virtualGrid[row][0];
                  const wideItem = placedItems.find(
                    (item) =>
                      item.id === itemId &&
                      item.debugDimensions.width === 2 &&
                      item.debugDimensions.height === 1
                  );

                  if (wideItem) {
                    log(
                      `Found 2x1 item ${wideItem.id} at start of row ${row} that can be converted to 1x1`
                    );

                    const modifiedItem = modifyItemFormat(
                      wideItem,
                      1,
                      `Modified from 2x1 to 1x1 to eliminate empty cell at [${row},${emptyCol}]`
                    );

                    const placedModifiedItem = placeItem(
                      modifiedItem,
                      row,
                      0,
                      1,
                      1,
                      `Placed resized item to help fill row ${row}`
                    );
                    displayItems.push(placedModifiedItem);

                    const smallItemToUse = placedItems.find(
                      (item) =>
                        item.debugDimensions.width === 1 &&
                        item.debugDimensions.height === 1 &&
                        item.debugDimensions.position.row > row
                    );

                    if (smallItemToUse) {
                      const oldPos = {
                        ...smallItemToUse.debugDimensions.position,
                      };
                      virtualGrid[oldPos.row][oldPos.col] = null;
                      smallItemToUse.debugDimensions.position = {
                        row,
                        col: emptyCol,
                      };
                      virtualGrid[row][emptyCol] = smallItemToUse.id;
                      log(
                        `Moved small item ${smallItemToUse.id} to [${row},${emptyCol}] after resizing another item`
                      );
                    }
                  }
                }
              }
            }
          }
        }

        const newGridStatus = checkGridFill();
        if (newGridStatus.completelyFilled) {
          log("SUCCESS: Grid optimization complete - all cells filled!");
        } else {
          log(
            `AFTER OPTIMIZATION: ${newGridStatus.emptyCount} empty cells remain`
          );
        }

        visualizeCurrentGrid("Grid after optimization");
      };

      const fillGrid = () => {
        let placeOnRight = false;

        for (const item of itemsBySize["2x2"]) {
          const { width, height } = getDimensions(item.importance);
          let placed = false;

          if (placeOnRight) {
            for (let r = 0; r < virtualGrid.length + 1 && !placed; r++) {
              const rightCol = gridWidth - width;
              if (isPositionAvailable(r, rightCol, width, height)) {
                displayItems.push(
                  placeItem(
                    item,
                    r,
                    rightCol,
                    width,
                    height,
                    `Placed 2x2 at right side [${r},${rightCol}]`
                  )
                );
                placed = true;
              }
            }
          } else {
            for (let r = 0; r < virtualGrid.length + 1 && !placed; r++) {
              if (isPositionAvailable(r, 0, width, height)) {
                displayItems.push(
                  placeItem(
                    item,
                    r,
                    0,
                    width,
                    height,
                    `Placed 2x2 at left side [${r},0]`
                  )
                );
                placed = true;
              }
            }
          }

          if (!placed) {
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
                      `Placed 2x2 at [${r},${c}] (fallback)`
                    )
                  );
                  placed = true;
                }
              }
            }
          }

          placeOnRight = !placeOnRight;
        }

        visualizeCurrentGrid("After placing 2x2 items");

        placeOnRight = false;

        for (const item of itemsBySize["2x1"]) {
          const { width, height } = getDimensions(item.importance);
          let placed = false;

          if (placeOnRight) {
            for (let r = 0; r < virtualGrid.length + 1 && !placed; r++) {
              const rightCol = gridWidth - width;
              if (isPositionAvailable(r, rightCol, width, height)) {
                displayItems.push(
                  placeItem(
                    item,
                    r,
                    rightCol,
                    width,
                    height,
                    `Placed 2x1 at right side [${r},${rightCol}]`
                  )
                );
                placed = true;
              }
            }
          } else {
            for (let r = 0; r < virtualGrid.length + 1 && !placed; r++) {
              if (isPositionAvailable(r, 0, width, height)) {
                displayItems.push(
                  placeItem(
                    item,
                    r,
                    0,
                    width,
                    height,
                    `Placed 2x1 at left side [${r},0]`
                  )
                );
                placed = true;
              }
            }
          }

          if (!placed) {
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
                      `Placed 2x1 at [${r},${c}] (fallback)`
                    )
                  );
                  placed = true;
                }
              }
            }
          }

          placeOnRight = !placeOnRight;
        }

        visualizeCurrentGrid("After placing 2x1 items");

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

      fillGrid();
      optimizeGrid();

      const gridStatus = checkGridFill();

      if (!gridStatus.completelyFilled) {
        log(
          `WARNING: Found ${gridStatus.emptyCount} empty cells in the grid after optimization!`
        );
      } else {
        log("SUCCESS: Grid completely filled with no empty cells!");
      }

      log("=== SORTING ITEMS FOR DISPLAY ===");

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

      setDebugInfo({
        totalCells: virtualGrid.length * gridWidth,
        cellsUsed: debugCellsUsed,
        placeholders: 0,
        emptyCount: gridStatus.emptyCount,
        gridDimensions: `${virtualGrid.length} rows × ${gridWidth} columns`,
        debugLog: getLog(),
      });

      setGridItems(displayItems);
    } catch (err) {
      setError(err.message);
      console.error("Grid error:", err);

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
