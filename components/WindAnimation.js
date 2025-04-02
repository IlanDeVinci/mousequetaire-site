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
    this.maxVerticalGrids = 2; // Reduced from 3 to 2 for less vertical movement
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

    // Store intersection points
    this.intersectionPoints = [];

    // Higher probability for right movement after first turn
    this.rightMovementProbability = 0.75; // 75% chance to favor right movement
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
        // Reduced chance for another turn - higher probability of continuing right
        if (Math.random() > this.rightMovementProbability) {
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
        nextX += segmentLength;
        nextX = Math.min(nextX, this.maxRightExtension);
        break;
      case "up":
        nextY -= segmentLength;
        nextY = Math.max(nextY, 30);
        break;
      case "down":
        nextY += segmentLength;
        nextY = Math.min(nextY, this.viewHeight - 30);
        break;
      default:
        // Force right movement for any other direction
        nextX += segmentLength;
        path.direction = "right";
        break;
    }

    // Track key points for length calculation
    const newPoint = { x: nextX, y: nextY };

    // Add position to tracking
    this.pathPositions.add(`${nextX},${nextY}`);

    return {
      ...path,
      x: nextX,
      y: nextY,
      pathData: `${path.pathData} L${nextX},${nextY}`,
      points: [...path.points, newPoint],
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
    if (path.direction === "right") {
      // Turning from right to up/down
      endX = startX + curveRadius;
      endY =
        newDirection === "up" ? startY - curveRadius : startY + curveRadius;

      // Create a quarter-circle bezier curve
      const controlDistance = curveRadius * 0.552;
      const cp1x = startX + controlDistance;
      const cp1y = startY;
      const cp2x = endX;
      const cp2y =
        newDirection === "up"
          ? startY - controlDistance
          : startY + controlDistance;

      curvePathData = `C ${cp1x},${cp1y} ${cp2x},${cp2y} ${endX},${endY}`;
    } else {
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

    // Update path tracking
    this.lastTurnDirection[path.id] = newDirection;

    // Update position tracking
    const posKey = `${endX},${endY}`;
    this.pathPositions.add(posKey);

    return {
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
      actions: [
        ...path.actions,
        `curved-turn-${newDirection}-at-${startX},${startY}-radius-${curveRadius}`,
      ],
    };
  }

  findIntersections() {
    // Clear previous intersections
    this.intersectionPoints = [];

    // We need actual DOM elements to check intersections
    const pathElements = document.querySelectorAll(".wind-path");
    if (!pathElements || pathElements.length < 2) return [];

    // Prepare paths for processing
    const processedPaths = [];

    // Process each path element
    pathElements.forEach((pathEl, index) => {
      const length = pathEl.getTotalLength();
      // Sample more points for better intersection detection
      const samplePoints = Math.max(50, Math.floor(length / 10));
      const points = [];

      // Sample points along the path
      for (let i = 0; i < samplePoints; i++) {
        const point = pathEl.getPointAtLength((i * length) / samplePoints);
        points.push([point.x, point.y]);
      }

      // Create line segments from points
      const segments = [];
      for (let i = 0; i < points.length - 1; i++) {
        segments.push([points[i], points[i + 1]]);
      }

      processedPaths.push({ index, segments });
    });

    // Find intersections between paths
    for (let i = 0; i < processedPaths.length; i++) {
      const path1 = processedPaths[i];

      for (let j = i + 1; j < processedPaths.length; j++) {
        const path2 = processedPaths[j];

        for (const seg1 of path1.segments) {
          for (const seg2 of path2.segments) {
            const intersection = this.doLinesIntersect(seg1, seg2);
            if (intersection) {
              this.intersectionPoints.push({
                x: intersection.x,
                y: intersection.y,
                pathIndices: [path1.index, path2.index],
              });
            }
          }
        }
      }
    }

    // Remove duplicates by comparing distances
    const uniqueIntersections = [];
    const minDistance = 10;

    for (const point of this.intersectionPoints) {
      let isDuplicate = false;

      for (const existingPoint of uniqueIntersections) {
        const dx = point.x - existingPoint.x;
        const dy = point.y - existingPoint.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < minDistance) {
          isDuplicate = true;
          break;
        }
      }

      if (!isDuplicate) {
        uniqueIntersections.push(point);
      }
    }

    this.intersectionPoints = uniqueIntersections;
    return uniqueIntersections;
  }

  doLinesIntersect(line1, line2) {
    const [[x1, y1], [x2, y2]] = line1;
    const [[x3, y3], [x4, y4]] = line2;

    // Calculate line directions
    const dx1 = x2 - x1;
    const dy1 = y2 - y1;
    const dx2 = x4 - x3;
    const dy2 = y4 - y3;

    // Calculate determinant
    const denominator = dy2 * dx1 - dx2 * dy1;

    // If lines are parallel
    if (Math.abs(denominator) < 0.0001) return null;

    // Calculate intersection parameters
    const ua = (dx2 * (y1 - y3) - dy2 * (x1 - x3)) / denominator;
    const ub = (dx1 * (y1 - y3) - dy1 * (x1 - x3)) / denominator;

    // Check if intersection is within both line segments
    if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
      // Calculate intersection point
      const x = x1 + ua * dx1;
      const y = y1 + ua * dy1;
      return { x, y };
    }

    return null;
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

    // Color palette for gradient
    this.colors = {
      start: "#87CEFA", // Light sky blue
      end: "#00008B", // Dark blue
    };

    // Intersection markers
    this.intersectionMarkers = [];
    this.markerLifetime = 5000; // 5 seconds

    // Colors for intersection markers
    this.markerColors = {
      fill: "#000000", // Black fill
      stroke: "#3498db", // Blue stroke
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
    this.intersectionMarkers = [];

    // Create gradient definition
    this.createGradientDefs();

    // Generate tree of paths
    const pathData = this.pathTree.generatePaths();

    // Create SVG paths with distinct styles for better visibility
    pathData.forEach((d, index) => {
      const path = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      path.setAttribute("class", "wind-path");
      path.classList.add(`path-${index}`);

      if (index === 0) {
        path.classList.add("main-path");
        path.setAttribute("stroke", "url(#mainGradient)");
      } else {
        path.classList.add("branch-path");
        path.setAttribute("stroke", "url(#branchGradient)");
      }

      path.setAttribute("d", d);
      path.setAttribute("stroke-width", "2.5");
      path.setAttribute("fill", "none"); // Ensure paths are not filled
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
      path.style.strokeDashoffset = 0;
      path.style.setProperty("--path-length", length);
    });

    // Create intersection markers sooner - reduced from 1000ms to 500ms
    setTimeout(() => this.createIntersectionMarkers(), 500);

    this.activateAnimation();
  }

  createGradientDefs() {
    // Create gradient definitions for paths
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");

    // Create main path gradient (brighter blue)
    const mainGradient = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "linearGradient"
    );
    mainGradient.setAttribute("id", "mainGradient");
    // Set gradient direction explicitly to horizontal
    mainGradient.setAttribute("x1", "0%");
    mainGradient.setAttribute("y1", "0%");
    mainGradient.setAttribute("x2", "100%");
    mainGradient.setAttribute("y2", "0%");

    const mainStop1 = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "stop"
    );
    mainStop1.setAttribute("offset", "0%");
    mainStop1.setAttribute("stop-color", "#A0D8FF");

    const mainStop2 = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "stop"
    );
    mainStop2.setAttribute("offset", "100%");
    mainStop2.setAttribute("stop-color", "#0000CD");

    mainGradient.appendChild(mainStop1);
    mainGradient.appendChild(mainStop2);

    // Create branch path gradient (slightly darker blue)
    const branchGradient = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "linearGradient"
    );
    branchGradient.setAttribute("id", "branchGradient");
    // Set gradient direction explicitly to horizontal
    branchGradient.setAttribute("x1", "0%");
    branchGradient.setAttribute("y1", "0%");
    branchGradient.setAttribute("x2", "100%");
    branchGradient.setAttribute("y2", "0%");

    const branchStop1 = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "stop"
    );
    branchStop1.setAttribute("offset", "0%");
    branchStop1.setAttribute("stop-color", "#87CEFA");

    const branchStop2 = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "stop"
    );
    branchStop2.setAttribute("offset", "100%");
    branchStop2.setAttribute("stop-color", "#00008B");

    branchGradient.appendChild(branchStop1);
    branchGradient.appendChild(branchStop2);

    defs.appendChild(mainGradient);
    defs.appendChild(branchGradient);

    this.svg.appendChild(defs);
  }

  regeneratePaths() {
    if (!this.svg) return;

    // Clean up any existing intersection markers
    this.intersectionMarkers.forEach((marker) => {
      if (marker && marker.parentNode) {
        marker.parentNode.removeChild(marker);
      }
    });
    this.intersectionMarkers = [];

    this.svg.innerHTML = "";
    this.pendingRegeneration.clear();

    // Recreate gradient defs
    this.createGradientDefs();

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
      path.setAttribute("fill", "none"); // Ensure paths are not filled

      if (index === 0) {
        path.classList.add("main-path");
        path.setAttribute("stroke", "url(#mainGradient)");
      } else {
        path.classList.add("branch-path");
        path.setAttribute("stroke", "url(#branchGradient)");
      }

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

    // Create intersection markers sooner - reduced from 1000ms to 500ms
    setTimeout(() => this.createIntersectionMarkers(), 500);
  }

  createIntersectionMarkers() {
    // First, remove any existing markers
    this.intersectionMarkers.forEach((marker) => {
      if (marker && marker.parentNode) {
        marker.parentNode.removeChild(marker);
      }
    });
    this.intersectionMarkers = [];

    // Find intersections using improved algorithm
    const intersections = this.pathTree.findIntersections();

    // Remove markers that are too close to each other
    const filteredIntersections = [];
    const minimumDistance = 20; // Minimum distance between markers in pixels

    // Sort intersections by x position first to prioritize leftmost markers
    const sortedIntersections = [...intersections].sort((a, b) => a.x - b.x);

    for (const point of sortedIntersections) {
      let tooClose = false;

      // Check if this point is too close to any already filtered point
      for (const existingPoint of filteredIntersections) {
        const dx = point.x - existingPoint.x;
        const dy = point.y - existingPoint.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < minimumDistance) {
          tooClose = true;
          break;
        }
      }

      // If not too close to any existing point, add it
      if (!tooClose) {
        filteredIntersections.push(point);
      }
    }

    // Get a maximum of 6 intersections
    let selectedIntersections = filteredIntersections
      .filter(() => Math.random() < 0.5)
      // Ensure they're sorted by X position for sequential animation
      .sort((a, b) => a.x - b.x);

    // Limit to maximum 6 markers
    if (selectedIntersections.length > 6) {
      // If we have more than 6, take a distributed sample to cover the width
      const step = Math.floor(selectedIntersections.length / 6);
      const limitedIntersections = [];

      // Take markers at regular intervals to cover full range
      for (let i = 0; i < 6; i++) {
        const index = Math.min(i * step, selectedIntersections.length - 1);
        limitedIntersections.push(selectedIntersections[index]);
      }
      selectedIntersections = limitedIntersections;
    }

    console.log(
      `Found ${intersections.length} intersections, filtered to ${filteredIntersections.length}, showing ${selectedIntersections.length} in sequence (max 6)`
    );

    // Get min and max X positions for proportional delays
    const xValues = selectedIntersections.map((point) => point.x);
    const minX = Math.min(...xValues);
    const maxX = Math.max(...xValues);
    const xRange = maxX - minX || 1; // Avoid division by zero

    // Create marker for each selected intersection
    selectedIntersections.forEach((point, index) => {
      const marker = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
      );

      marker.setAttribute("cx", point.x);
      marker.setAttribute("cy", point.y);
      marker.setAttribute("r", 7);
      marker.setAttribute("fill", this.markerColors.fill);
      marker.setAttribute("stroke", this.markerColors.stroke);
      marker.setAttribute("stroke-width", 2);
      marker.setAttribute("class", "intersection-marker");
      marker.setAttribute("data-x-position", point.x);
      marker.setAttribute("data-index", index.toString()); // Store display order index

      // Initially set opacity to 0
      marker.style.opacity = "0";

      this.svg.appendChild(marker);
      this.intersectionMarkers.push(marker);

      // Simplified sequential timing based purely on x position
      const xPositionRatio = (point.x - minX) / xRange; // 0 to 1 based on position
      const baseDelay = 50; // minimum delay
      const maxAdditionalDelay = 1000; // maximum additional delay
      const sequentialDelay = baseDelay + xPositionRatio * maxAdditionalDelay;

      setTimeout(() => {
        if (marker && marker.parentNode) {
          marker.style.opacity = "1";
        }
      }, sequentialDelay);
    });
  }

  fadeOutIntersectionMarkers(pathDisappearProgress) {
    // Start fadeout earlier - at 30% path disappearing progress instead of 50%
    if (pathDisappearProgress <= 0) return;

    if (pathDisappearProgress > 0) {
      // Sort markers by their index to ensure they fade out in the same order they appeared (left to right)
      const sortedMarkers = [...this.intersectionMarkers].sort((a, b) => {
        const indexA = parseInt(a.getAttribute("data-index") || "0");
        const indexB = parseInt(b.getAttribute("data-index") || "0");
        return indexA - indexB;
      });

      // Use longer sequential delays between markers
      sortedMarkers.forEach((marker, index) => {
        if (marker && marker.parentNode) {
          // More time between each marker (200ms per marker)
          const fadeDelay = index * 150;

          setTimeout(() => {
            marker.style.opacity = "0";

            // Remove from DOM after transition completes
            setTimeout(() => {
              if (marker.parentNode) {
                marker.parentNode.removeChild(marker);
              }
            }, 550); // Slightly longer than the 0.5s CSS transition
          }, fadeDelay);
        }
      });

      // Clear the array after scheduling all fadeouts
      this.intersectionMarkers = [];
    }
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

    // Check if any path needs regeneration
    for (const [path, timeToRegenerate] of this.pendingRegeneration.entries()) {
      if (timestamp >= timeToRegenerate) {
        this.regeneratePaths();
        break;
      }
    }

    const animationSpeed = 0.4;
    let allPathsVisible = true;

    // Track if any path is in disappearing phase
    let anyPathDisappearing = false;
    let maxDisappearProgress = 0;

    // Handle animation phases for paths
    this.paths.forEach((path) => {
      if (this.pendingRegeneration.has(path)) return;

      const pathLength = parseFloat(path.getAttribute("data-length"));
      let pathProgress = parseFloat(path.getAttribute("data-progress") || "0");
      const phase = path.getAttribute("data-phase") || "appearing";

      // Optimized animation phase handling
      if (phase === "appearing") {
        pathProgress = Math.min(1, pathProgress + deltaTime * animationSpeed);
        path.setAttribute("data-progress", pathProgress.toString());

        // Animation now goes from start to end
        const visibleLength = pathLength * pathProgress;
        path.style.strokeDasharray = `${visibleLength}, ${pathLength}`;

        if (pathProgress === 1) {
          path.setAttribute("data-phase", "visible");
          path.style.strokeDasharray = `${pathLength}, 0`;
          path.setAttribute("data-visible-time", timestamp.toString());
        } else {
          allPathsVisible = false;
        }
      } else if (phase === "visible") {
        const visibleStartTime = parseFloat(
          path.getAttribute("data-visible-time")
        );
        if (timestamp - visibleStartTime >= this.visibilityDuration) {
          path.setAttribute("data-phase", "disappearing");
          path.setAttribute("data-progress", "0");
        }
      } else if (phase === "disappearing") {
        pathProgress = Math.min(1, pathProgress + deltaTime * animationSpeed);
        path.setAttribute("data-progress", pathProgress.toString());

        const visibleLength = pathLength * (1 - pathProgress);
        path.style.strokeDasharray = `${visibleLength}, ${pathLength}`;
        path.style.strokeDashoffset = -pathLength + visibleLength;

        // Track disappearing state - set an offset of -0.3 to start marker fade 1s earlier
        // This will make fadeOutIntersectionMarkers() start working earlier
        anyPathDisappearing = true;
        maxDisappearProgress = Math.max(
          maxDisappearProgress,
          pathProgress - 0.3
        );

        if (pathProgress === 1 && !this.pendingRegeneration.has(path)) {
          path.setAttribute("data-status", "completed");
          if (!this.pendingRegeneration.size) {
            this.pendingRegeneration.set(
              path,
              timestamp + this.regenerationDelay
            );
          }
        }
      }
    });

    // Handle intersection marker fading based on path state
    if (anyPathDisappearing && this.intersectionMarkers.length > 0) {
      this.fadeOutIntersectionMarkers(maxDisappearProgress);
    }

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
