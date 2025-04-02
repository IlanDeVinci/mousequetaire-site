"use client";

class PathTree {
  constructor(viewWidth, viewHeight) {
    this.viewWidth = viewWidth;
    this.viewHeight = viewHeight;
    this.nodes = new Set();
    this.paths = [];
    this.pathCount = 5 + Math.floor(Math.random() * 2); // 5-6 paths total
    this.occupiedYPositions = [];
    this.minX = 0;
    this.commonLength = 0;
    this.pathSegments = 10 + Math.floor(Math.random() * 5); // 10-14 segments per path

    // Fixed grid settings
    this.gridSize = 50; // Fixed grid size in pixels with no variation

    // Path offset settings to avoid all paths turning at same points
    this.pathOffsets = [];

    // Target path length (to ensure all paths have exactly same length)
    this.targetPathLength = 0;

    // Constraints for consistent behavior
    this.initialStraightSegments = 2; // Require at least 2 straight segments at start
    this.maxVerticalGrids = 3; // Maximum vertical grid blocks (increased to allow more turning)
    this.endYPositions = new Set(); // Track end Y positions to ensure they're different
    this.lastTurnDirection = {}; // Track last turn direction for each path

    // Path diversity tracking
    this.pathActionHistory = {}; // Stores history of actions for each path
    this.pathPositions = new Set(); // Track all occupied x,y positions to avoid overlap
    this.forbiddenPositions = new Set(); // Positions that paths cannot move to
    this.pathDirectionsAtPoint = {}; // Track direction taken by paths at specific points

    // Force distinct path behavior with varying initial segment lengths
    this.forcedInitialDirections = ["up", "down", "up", "down", "up", "down"]; // Pre-assign initial directions
    this.forcedYOffsets = [60, -60, 120, -120, 180, -180]; // Ensure vertical spacing
    this.initialSegmentCounts = [4, 2, 5, 3, 6, 2]; // How many horizontal segments before first turn

    // Add support for curved paths
    this.useCurvedTurns = true; // Enable curved turns by default
    this.curveRadiusGrid = 1; // Curve radius in grid units

    // Add tracking for turn types at specific coordinates - use exact coordinate as key
    this.turnTypesAtCoordinates = {}; // Track if curved/straight turn used at specific points
    this.curveRadiusAtCoordinates = {}; // Track curve radius at specific points

    // Constrain path extension to prevent overflow
    this.maxRightExtension = viewWidth * 0.95; // Limit horizontal extension to prevent overflow

    // Strictly prevent any leftward movement
    this.allowedDirections = ["right", "up", "down"]; // Never allow left direction
  }

  generatePaths() {
    // Reset state
    this.nodes.clear();
    this.paths = [];
    this.occupiedYPositions = [];
    this.endYPositions.clear();
    this.lastTurnDirection = {};
    this.pathActionHistory = {};
    this.pathPositions = new Set();
    this.forbiddenPositions = new Set();
    this.pathDirectionsAtPoint = {};
    this.turnTypesAtCoordinates = {}; // Reset turn types
    this.curveRadiusAtCoordinates = {}; // Reset curve radius tracking

    // Move path tree 2/3 of the way to the right
    const startX = this.viewWidth * (1 / 2);
    this.minX = startX;

    const startY = this.viewHeight / 2;

    // Store the start position
    this.pathPositions.add(`${startX},${startY}`);

    // Calculate Y positions with proper spacing for all paths - ensure wider spacing
    const yPositions = [];
    const spacing = 80; // Increased from 40 to 80 for clearer separation
    const maxPaths = Math.min(6, this.pathCount);

    // Add center position
    yPositions.push(startY);

    // Generate positions above and below with guaranteed spacing
    for (let i = 1; i <= Math.floor(maxPaths / 2); i++) {
      const above = startY - i * spacing;
      const below = startY + i * spacing;

      if (above >= 50) yPositions.push(above);
      if (below <= this.viewHeight - 50) yPositions.push(below);
    }

    // Sort positions from top to bottom
    yPositions.sort((a, b) => a - b);
    this.occupiedYPositions = yPositions;

    // Generate varying offsets for turning points
    this.pathOffsets = [];
    for (let i = 0; i < yPositions.length; i++) {
      // Use different offset for each path so they don't all turn at same points
      this.pathOffsets.push((10 * i) % this.gridSize);
    }

    // First, calculate paths to determine target length
    const tempPaths = [];
    for (let i = 0; i < Math.min(this.pathCount, yPositions.length); i++) {
      const targetY = yPositions[i];
      const offset = this.pathOffsets[i];
      const pathId = `path-${i}`;

      // Initialize tracking for this path
      this.lastTurnDirection[pathId] = "";
      this.pathActionHistory[pathId] = [];

      // Initial path structure with a distinct target Y
      const path = {
        id: pathId,
        x: startX,
        y: startY,
        targetY: targetY, // Each path has a different targetY
        direction: "right",
        pathData: `M${startX},${startY}`,
        segmentsCreated: 0,
        isMainPath: i === Math.floor(yPositions.length / 2),
        gridOffset: offset,
        lastTurnPoint: 0,
        verticalGridsUsed: 0,
        totalLength: 0,
        points: [{ x: startX, y: startY }],
        actions: [],
        pathIndex: i, // Store index for forced direction logic
      };

      // Generate the path
      const completePath = this.growDistinctPath(path);
      tempPaths.push(completePath);
    }

    // Calculate path lengths to find the longest
    if (tempPaths.length > 0) {
      let maxLength = 0;
      tempPaths.forEach((path) => {
        const tempSvgPath = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path"
        );
        tempSvgPath.setAttribute("d", path.pathData);
        const pathLength = tempSvgPath.getTotalLength();
        path.totalLength = pathLength;
        maxLength = Math.max(maxLength, pathLength);
      });

      // Set target length for all paths
      this.targetPathLength = maxLength;
    }

    // Clear paths collection before rebuilding
    this.paths = [];

    // Reset position tracking completely to avoid issue with pathPositions being polluted
    this.pathPositions = new Set();
    this.forbiddenPositions = new Set();
    this.endYPositions = new Set();

    // Now rebuild paths with adjusted lengths and guaranteed diversity
    for (let i = 0; i < tempPaths.length; i++) {
      const originalPath = tempPaths[i];
      const pathId = `path-${i}`;

      // Reset tracking for this path
      this.lastTurnDirection[pathId] = "";
      this.pathActionHistory[pathId] = [];

      // Create a new path but with forced vertical movement
      const path = {
        id: pathId,
        x: startX,
        y: startY,
        targetY: yPositions[i], // Use the distinct Y from positions array
        direction: "right",
        pathData: `M${startX},${startY}`,
        segmentsCreated: 0,
        isMainPath: originalPath.isMainPath,
        gridOffset: originalPath.gridOffset,
        lastTurnPoint: 0,
        verticalGridsUsed: 0,
        endY: 0,
        points: [{ x: startX, y: startY }],
        actions: [],
        pathIndex: i, // Store index for forced direction logic
        mustTurn: true, // Force this path to turn
        forcedYOffset: this.forcedYOffsets[i % this.forcedYOffsets.length], // Assign a fixed vertical offset
      };

      // Grow this path with guaranteed vertical movement
      const completePath = this.growDistinctPath(path);

      // Add the completed path to the collection
      if (completePath.isMainPath) {
        this.paths.unshift(completePath.pathData);
      } else {
        this.paths.push(completePath.pathData);
      }
    }

    // Store the common path length for all animations
    this.commonLength = this.targetPathLength;
    return this.paths;
  }

  growDistinctPath(path) {
    // Get initial segments for this path - some paths wait longer before turning
    const initialSegmentsForThisPath =
      this.initialSegmentCounts[
        path.pathIndex % this.initialSegmentCounts.length
      ];

    // First create initial horizontal segment (now varied based on path index)
    while (path.segmentsCreated < initialSegmentsForThisPath) {
      path.direction = "right";
      path = this.extendPath(path);
      path.segmentsCreated++;
    }

    // Force a vertical turn to happen after initial segments
    const forcedDirection =
      this.forcedInitialDirections[
        path.pathIndex % this.forcedInitialDirections.length
      ];

    // Use exact coordinates as key for turn consistency
    const turnKey = `${path.x},${path.y}:${forcedDirection}`;

    // Determine if this turn should be curved
    let shouldCurve;
    let curveRadius = this.gridSize * this.curveRadiusGrid;

    if (this.turnTypesAtCoordinates[turnKey] !== undefined) {
      // Use same turn type as previous path at this exact position
      shouldCurve = this.turnTypesAtCoordinates[turnKey];

      // Also use the same curve radius if it was curved
      if (shouldCurve && this.curveRadiusAtCoordinates[turnKey]) {
        curveRadius = this.curveRadiusAtCoordinates[turnKey];
      }
    } else {
      // Randomly decide if this turn should be curved
      shouldCurve = Math.random() < 0.5 && this.useCurvedTurns;

      // Sometimes use half radius for more variation
      if (shouldCurve && Math.random() < 0.3) {
        curveRadius = this.gridSize * (this.curveRadiusGrid / 2);
      }

      // Record both turn type and radius for future paths
      this.turnTypesAtCoordinates[turnKey] = shouldCurve;
      if (shouldCurve) {
        this.curveRadiusAtCoordinates[turnKey] = curveRadius;
      }
    }

    if (shouldCurve) {
      path = this.createCurvedTurn(path, forcedDirection, curveRadius);
    } else {
      path.direction = forcedDirection;
      this.lastTurnDirection[path.id] = forcedDirection;
      path.lastTurnPoint = path.x;
      path.verticalGridsUsed++;

      // Record this forced turn
      path.actions.push(
        `forced-turn-${forcedDirection}-at-${path.x},${path.y}`
      );
    }

    // Continue for a fixed length in this vertical direction
    const verticalSegments = 1 + (path.pathIndex % 3); // 1-3 vertical segments based on path index
    for (
      let i = 0;
      i < verticalSegments && path.segmentsCreated < this.pathSegments;
      i++
    ) {
      path = this.extendPath(path);
      path.segmentsCreated++;
    }

    // Always turn back to horizontal after vertical segment
    const horizontalTurnKey = `${path.x},${path.y}:right`;
    let shouldCurveHorizontal;
    let horizontalCurveRadius = this.gridSize * this.curveRadiusGrid;

    if (this.turnTypesAtCoordinates[horizontalTurnKey] !== undefined) {
      shouldCurveHorizontal = this.turnTypesAtCoordinates[horizontalTurnKey];

      if (
        shouldCurveHorizontal &&
        this.curveRadiusAtCoordinates[horizontalTurnKey]
      ) {
        horizontalCurveRadius =
          this.curveRadiusAtCoordinates[horizontalTurnKey];
      }
    } else {
      shouldCurveHorizontal = Math.random() < 0.5 && this.useCurvedTurns;

      if (shouldCurveHorizontal && Math.random() < 0.3) {
        horizontalCurveRadius = this.gridSize * (this.curveRadiusGrid / 2);
      }

      this.turnTypesAtCoordinates[horizontalTurnKey] = shouldCurveHorizontal;
      if (shouldCurveHorizontal) {
        this.curveRadiusAtCoordinates[horizontalTurnKey] =
          horizontalCurveRadius;
      }
    }

    if (shouldCurveHorizontal) {
      path = this.createCurvedTurn(path, "right", horizontalCurveRadius);
    } else {
      path.direction = "right";
      path.lastTurnPoint = path.x;
      path.actions.push(`turn-right-at-${path.x},${path.y}`);
    }

    // Continue generating path with normal rules but avoiding overlap
    while (path.segmentsCreated < this.pathSegments) {
      // Consider another turn later in the path
      const distanceFromLastTurn = path.x - path.lastTurnPoint;
      const atTurnPoint = distanceFromLastTurn >= this.gridSize * 2;

      if (
        path.direction === "right" &&
        atTurnPoint &&
        path.verticalGridsUsed < this.maxVerticalGrids
      ) {
        // 50% chance for another turn if we haven't maxed out vertical grids
        if (Math.random() < 0.5) {
          // Choose a direction - must be different than the first turn to avoid repetitive up/down
          const newDirection =
            this.lastTurnDirection[path.id] === "up" ? "down" : "up";

          // Check for existing turn type at this exact coordinate
          const lateralTurnKey = `${path.x},${path.y}:${newDirection}`;
          let shouldCurveLateral;
          let lateralCurveRadius = this.gridSize * this.curveRadiusGrid;

          if (this.turnTypesAtCoordinates[lateralTurnKey] !== undefined) {
            shouldCurveLateral = this.turnTypesAtCoordinates[lateralTurnKey];

            if (
              shouldCurveLateral &&
              this.curveRadiusAtCoordinates[lateralTurnKey]
            ) {
              lateralCurveRadius =
                this.curveRadiusAtCoordinates[lateralTurnKey];
            }
          } else {
            shouldCurveLateral = Math.random() < 0.5 && this.useCurvedTurns;

            if (shouldCurveLateral && Math.random() < 0.3) {
              lateralCurveRadius = this.gridSize * (this.curveRadiusGrid / 2);
            }

            this.turnTypesAtCoordinates[lateralTurnKey] = shouldCurveLateral;
            if (shouldCurveLateral) {
              this.curveRadiusAtCoordinates[lateralTurnKey] =
                lateralCurveRadius;
            }
          }

          if (shouldCurveLateral) {
            path = this.createCurvedTurn(
              path,
              newDirection,
              lateralCurveRadius
            );
          } else {
            path.direction = newDirection;
            this.lastTurnDirection[path.id] = newDirection;
            path.lastTurnPoint = path.x;
            path.verticalGridsUsed++;

            // Record this additional turn
            path.actions.push(
              `additional-turn-${newDirection}-at-${path.x},${path.y}`
            );
          }

          // Continue for 1-2 vertical segments
          const additionalVertical = 1 + Math.floor(Math.random() * 2);
          for (
            let i = 0;
            i < additionalVertical && path.segmentsCreated < this.pathSegments;
            i++
          ) {
            path = this.extendPath(path);
            path.segmentsCreated++;
          }

          // Return to horizontal
          const returnKey = `${path.x},${path.y}:right`;
          let shouldCurveReturn;
          let returnCurveRadius = this.gridSize * this.curveRadiusGrid;

          if (this.turnTypesAtCoordinates[returnKey] !== undefined) {
            shouldCurveReturn = this.turnTypesAtCoordinates[returnKey];

            if (shouldCurveReturn && this.curveRadiusAtCoordinates[returnKey]) {
              returnCurveRadius = this.curveRadiusAtCoordinates[returnKey];
            }
          } else {
            shouldCurveReturn = Math.random() < 0.5 && this.useCurvedTurns;

            if (shouldCurveReturn && Math.random() < 0.3) {
              returnCurveRadius = this.gridSize * (this.curveRadiusGrid / 2);
            }

            this.turnTypesAtCoordinates[returnKey] = shouldCurveReturn;
            if (shouldCurveReturn) {
              this.curveRadiusAtCoordinates[returnKey] = returnCurveRadius;
            }
          }

          if (shouldCurveReturn) {
            path = this.createCurvedTurn(path, "right", returnCurveRadius);
          } else {
            path.direction = "right";
            path.lastTurnPoint = path.x;
            path.actions.push(`return-right-at-${path.x},${path.y}`);
          }
        }
      }

      // Extend the path
      path = this.extendPath(path);
      path.segmentsCreated++;
    }

    // Ensure path ends horizontally pointing right
    if (path.direction !== "right") {
      path.direction = "right";
      path = this.extendPath(path);
    }

    // Perform final length adjustment to ensure exact target length
    path = this.adjustPathToExactLength(path);

    // Add this end Y position to our tracking
    this.endYPositions.add(path.y);

    return path;
  }

  extendPath(path) {
    // Fixed segment length based on grid size
    const segmentLength = this.gridSize;

    let nextX = path.x;
    let nextY = path.y;

    // Move in the current direction, ensuring we never go left
    switch (path.direction) {
      case "right":
        nextX += segmentLength; // Always move right, never left
        // Constrain horizontal extension to prevent overflow
        nextX = Math.min(nextX, this.maxRightExtension);
        this.minX = Math.max(this.minX, nextX);
        break;
      case "up":
        nextY -= segmentLength;
        // Ensure we don't go too far up
        nextY = Math.max(nextY, 30);
        break;
      case "down":
        nextY += segmentLength;
        // Ensure we don't go too far down
        nextY = Math.min(nextY, this.viewHeight - 30);
        break;
      case "left": // Should never happen, but just in case
        // Force right movement instead of left
        nextX += segmentLength;
        path.direction = "right";
        break;
    }

    // Add line segment to path
    const newPathData = `${path.pathData} L${nextX},${nextY}`;

    // Track key points for length calculation
    path.points.push({ x: nextX, y: nextY });

    // Add position to tracking
    const posKey = `${nextX},${nextY}`;
    this.pathPositions.add(posKey);

    // Return updated path
    return {
      ...path,
      x: nextX,
      y: nextY,
      pathData: newPathData,
      points: [...path.points],
      actions: [...path.actions],
    };
  }

  adjustPathToExactLength(path) {
    const tempPath = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    tempPath.setAttribute("d", path.pathData);
    const currentLength = tempPath.getTotalLength();

    // If we need to extend the path to reach target length
    if (currentLength < this.targetPathLength) {
      const extraLength = this.targetPathLength - currentLength;
      // Limit maximum extension to prevent paths from extending too far
      const maxExtension = this.gridSize * 4;
      const actualExtension = Math.min(extraLength, maxExtension);

      const extraX = path.x + actualExtension;
      path.pathData += ` L${extraX},${path.y}`;
      path.x = extraX;
    }

    return path;
  }

  createCurvedTurn(path, newDirection, customRadius) {
    const startX = path.x;
    const startY = path.y;
    const curveRadius = customRadius || this.gridSize * this.curveRadiusGrid;
    let curvePathData = "";
    let endX = startX;
    let endY = startY;

    // Calculate control points and end point based on current and new directions
    if (
      path.direction === "right" &&
      (newDirection === "up" || newDirection === "down")
    ) {
      // Turning from right to up/down
      endX = startX + curveRadius;
      endY =
        newDirection === "up" ? startY - curveRadius : startY + curveRadius;

      // Create a quarter-circle bezier curve
      // For a 90-degree turn, control points are at distance * 0.552
      const controlDistance = curveRadius * 0.552;
      const cp1x = startX + controlDistance;
      const cp1y = startY;
      const cp2x = endX;
      const cp2y =
        newDirection === "up"
          ? startY - controlDistance
          : startY + controlDistance;

      curvePathData = `C ${cp1x},${cp1y} ${cp2x},${cp2y} ${endX},${endY}`;
    } else if (
      (path.direction === "up" || path.direction === "down") &&
      newDirection === "right"
    ) {
      // Turning from up/down to right
      endX = startX + curveRadius;
      endY =
        path.direction === "up" ? startY - curveRadius : startY + curveRadius;

      // Create a quarter-circle bezier curve
      const controlDistance = curveRadius * 0.552;
      const cp1x = startX;
      const cp1y =
        path.direction === "up"
          ? startY - controlDistance
          : startY + controlDistance;
      const cp2x = startX + controlDistance;
      const cp2y = endY;

      curvePathData = `C ${cp1x},${cp1y} ${cp2x},${cp2y} ${endX},${endY}`;
    }

    // Add curve to path
    const newPathData = `${path.pathData} ${curvePathData}`;

    // Store action for debugging
    const updatedActions = [
      ...path.actions,
      `curved-turn-${newDirection}-at-${startX},${startY}-radius-${curveRadius}`,
    ];

    // Update path tracking
    this.lastTurnDirection[path.id] = newDirection;

    // Update position tracking
    const posKey = `${endX},${endY}`;
    this.pathPositions.add(posKey);

    // Create updated path object
    const updatedPath = {
      ...path,
      x: endX,
      y: endY,
      direction: newDirection,
      pathData: newPathData,
      lastTurnPoint: endX,
      verticalGridsUsed:
        path.direction !== newDirection
          ? path.verticalGridsUsed + 1
          : path.verticalGridsUsed,
      points: [...path.points, { x: endX, y: endY }],
      actions: updatedActions,
    };

    return updatedPath;
  }
}

class WindAnimation {
  constructor(options = {}) {
    this.svg = document.querySelector(".wind-svg");
    this.active = false;
    this.progress = 0;
    this.lastTimestamp = 0;
    this.paths = [];
    this.animate = this.animate.bind(this);
    this.pendingRegeneration = new Map();
    this.regenerationDelay = 4000; // Increased from 2500 to 5000
    this.visibilityDuration = 2000; // Duration to keep path fully visible (in ms)

    this.config = {
      maxPaths: 6,
      viewWidth: window.innerWidth,
      viewHeight: 500,
    };

    // Recalculate on window resize to prevent overflow
    if (typeof window !== "undefined") {
      window.addEventListener("resize", this.handleResize.bind(this));
    }

    this.pathTree = new PathTree(this.config.viewWidth, this.config.viewHeight);
    this.init();
  }

  handleResize() {
    this.config.viewWidth = window.innerWidth;
    if (this.svg) {
      this.svg.setAttribute(
        "viewBox",
        `0 0 ${this.config.viewWidth} ${this.config.viewHeight}`
      );
    }
    this.regeneratePaths();
  }

  init() {
    if (!this.svg) return;

    // Set viewBox to match window dimensions for proper scaling
    this.svg.setAttribute(
      "viewBox",
      `0 0 ${this.config.viewWidth} ${this.config.viewHeight}`
    );

    // Add CSS to ensure SVG doesn't overflow horizontally
    this.svg.style.maxWidth = "100%";
    this.svg.style.width = "100%";
    this.svg.style.overflow = "hidden";

    this.svg.innerHTML = "";
    this.pendingRegeneration.clear();

    // Generate tree of paths
    const pathData = this.pathTree.generatePaths();

    // Validate we have enough paths
    console.log(`Generated ${pathData.length} paths`);

    // Create SVG paths with distinct styles for better visibility
    pathData.forEach((d, index) => {
      const path = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      path.setAttribute("class", "wind-path");

      // Add different class based on index to help with debugging
      path.classList.add(`path-${index}`);

      if (index === 0) {
        path.classList.add("main-path"); // Add class to main path
      } else {
        path.classList.add("branch-path"); // Add class to branches
      }

      path.setAttribute("d", d);
      path.setAttribute("stroke-width", "2.5");
      path.style.filter = "blur(0px)";

      this.svg.appendChild(path);
    });

    this.paths = Array.from(this.svg.querySelectorAll(".wind-path"));

    this.paths.forEach((path) => {
      const length = path.getTotalLength();
      path.setAttribute("data-length", length);
      path.setAttribute("data-progress", "0");
      path.setAttribute("data-phase", "appearing"); // Track animation phase

      path.style.opacity = "1";
      path.style.transition = "none";

      // Set up for reverse animation (start to end)
      const visibleLength = length * 0.15;
      path.style.strokeDasharray = `${visibleLength}, ${length}`;
      path.style.strokeDashoffset = 0; // Start from the start
      path.style.setProperty("--path-length", length);
    });

    this.activateAnimation();
  }

  regeneratePaths() {
    if (!this.svg) return;

    this.svg.innerHTML = "";
    this.pendingRegeneration.clear();

    // Generate new tree of paths
    const pathData = this.pathTree.generatePaths();

    // Create new SVG paths
    pathData.forEach((d, index) => {
      const path = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      path.setAttribute("class", "wind-path");
      path.setAttribute("d", d);
      path.setAttribute("stroke-width", "2.5");
      path.style.filter = "blur(0px)";

      this.svg.appendChild(path);
    });

    this.paths = Array.from(this.svg.querySelectorAll(".wind-path"));

    this.paths.forEach((path) => {
      const length = path.getTotalLength();
      path.setAttribute("data-length", length);
      path.setAttribute("data-progress", "0");
      path.setAttribute("data-phase", "appearing");

      path.style.opacity = "1";
      path.style.transition = "none";

      // Set up for reverse animation (start to end)
      const visibleLength = length * 0.15;
      path.style.strokeDasharray = `${visibleLength}, ${length}`;
      path.style.strokeDashoffset = 0; // Start from the start
      path.style.setProperty("--path-length", length);
    });
  }

  activateAnimation() {
    if (!this.active) {
      this.active = true;
      this.resetPaths();
      this.progress = 0;
      this.lastTimestamp = performance.now();
      requestAnimationFrame(this.animate);
    }
  }

  deactivateAnimation() {
    this.active = false;
  }

  resetPaths() {
    this.pendingRegeneration.clear();

    this.paths.forEach((path) => {
      const length = parseFloat(path.getAttribute("data-length"));
      path.setAttribute("data-progress", "0");
      path.setAttribute("data-status", "reset");
      path.setAttribute("data-phase", "appearing");
      path.setAttribute("data-visible-time", "0");

      path.style.transition = "none";
      path.style.opacity = "1";

      // Set up for reverse animation (start to end)
      const visibleLength = length * 0.15;
      path.style.strokeDasharray = `${visibleLength}, ${length}`;
      path.style.strokeDashoffset = 0;
    });
  }

  getInterpolatedVisibleLength(length, progress) {
    const targetLength = 0.15;
    const startLength = 0.1;
    const interpolationProgress = Math.min(1, progress / 0.3);
    const t = this.easeInOutCubic(interpolationProgress);
    return length * (startLength + (targetLength - startLength) * t);
  }

  animate(timestamp) {
    if (!this.active) return;

    const deltaTime = (timestamp - this.lastTimestamp) / 1000;
    this.lastTimestamp = timestamp;

    // Check for paths that need to be regenerated
    for (const [path, timeToRegenerate] of this.pendingRegeneration.entries()) {
      if (timestamp >= timeToRegenerate) {
        // When any path needs regeneration, regenerate the entire tree
        this.regeneratePaths();
        break;
      }
    }

    // Consistent animation speed for all paths
    const animationSpeed = 0.4;

    this.paths.forEach((path, index) => {
      if (this.pendingRegeneration.has(path)) return;

      const pathLength = parseFloat(path.getAttribute("data-length"));
      let pathProgress = parseFloat(path.getAttribute("data-progress") || "0");
      const phase = path.getAttribute("data-phase") || "appearing";

      // Handle different animation phases
      if (phase === "appearing") {
        // Phase 1: Appear from start to end (reversed direction)
        if (pathProgress < 1) {
          pathProgress = Math.min(1, pathProgress + deltaTime * animationSpeed);
          path.setAttribute("data-progress", pathProgress.toString());

          // Animation now goes from start to end
          const visibleLength = pathLength * pathProgress;
          path.style.strokeDasharray = `${visibleLength}, ${pathLength}`;
          path.style.strokeDashoffset = 0;

          if (pathProgress === 1) {
            // Path is fully visible, switch to "visible" phase
            path.setAttribute("data-phase", "visible");
            path.style.strokeDasharray = `${pathLength}, 0`; // Make entire path visible
            path.style.strokeDashoffset = 0;
            path.setAttribute("data-visible-time", timestamp.toString());
          }
        }
      } else if (phase === "visible") {
        // Phase 2: Keep path fully visible for a duration
        const visibleStartTime = parseFloat(
          path.getAttribute("data-visible-time") || "0"
        );
        const visibleDuration = timestamp - visibleStartTime;

        if (visibleDuration >= this.visibilityDuration) {
          // Time to start disappearing
          path.setAttribute("data-phase", "disappearing");
          path.setAttribute("data-progress", "0");
        }
      } else if (phase === "disappearing") {
        // Phase 3: Disappear gradually (from end to start - reversed)
        if (pathProgress < 1) {
          pathProgress = Math.min(1, pathProgress + deltaTime * animationSpeed);
          path.setAttribute("data-progress", pathProgress.toString());

          // For disappearing, use end-to-start animation
          const visibleLength = pathLength * (1 - pathProgress);
          path.style.strokeDasharray = `${visibleLength}, ${pathLength}`;
          path.style.strokeDashoffset = -pathLength + visibleLength;

          if (pathProgress === 1 && !this.pendingRegeneration.has(path)) {
            path.setAttribute("data-status", "completed");
            if (!this.pendingRegeneration.size) {
              // Schedule regeneration of the entire tree
              this.pendingRegeneration.set(
                path,
                timestamp + this.regenerationDelay
              );
            }
          }
        }
      }
    });

    requestAnimationFrame(this.animate);
  }

  easeInOutCubic(x) {
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  }
}

export default function initWindAnimation() {
  if (typeof window !== "undefined") {
    setTimeout(() => {
      window.windAnimation = new WindAnimation();
    }, 1000);
  }
}
