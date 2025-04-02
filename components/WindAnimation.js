"use client";

class PathTree {
  constructor(viewWidth, viewHeight, direction = "right") {
    this.viewWidth = viewWidth;
    this.viewHeight = viewHeight;
    this.nodes = new Set();
    this.paths = [];
    this.pathCount = 5 + Math.floor(Math.random() * 2); // 5-6 paths total
    this.occupiedYPositions = [];
    this.minX = 0;
    this.commonLength = 0;
    this.pathSegments = 10 + Math.floor(Math.random() * 5); // 10-14 segments per path
    this.direction = direction; // 'right' or 'left'

    // Fixed grid settings
    this.gridSize = 25; // Changed from 50 to 25 to make the tree about half the size

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
    // Randomize the initial directions - ensure first turn has equal chance of being up or down
    this.forcedInitialDirections = this.getRandomizedDirections();
    this.forcedYOffsets = [60, -60, 120, -120, 180, -180]; // Ensure vertical spacing
    this.initialSegmentCounts = [4, 2, 5, 3, 6, 2]; // How many horizontal segments before first turn

    // Add support for curved paths
    this.useCurvedTurns = true; // Enable curved turns by default
    this.curveRadiusGrid = 1; // Curve radius in grid units

    // Add tracking for turn types at specific coordinates - use exact coordinate as key
    this.turnTypesAtCoordinates = {}; // Track if curved/straight turn used at specific points
    this.curveRadiusAtCoordinates = {}; // Track curve radius at specific points

    // Constrain path extension to prevent overflow
    if (direction === "right") {
      this.maxExtension = viewWidth * 0.98; // Right extension limit
      this.allowedDirections = ["right", "up", "down"]; // Never allow left direction
    } else {
      this.maxExtension = viewWidth * 0.02; // Left extension limit
      this.allowedDirections = ["left", "up", "down"]; // Never allow right direction
    }

    // Store intersection points
    this.intersectionPoints = [];

    // Higher probability for horizontal movement after first turn
    this.horizontalMovementProbability = 0.75; // 75% chance to favor horizontal movement

    // Add extra segments to ensure clean disappearing
    this.extraEndSegments = 2; // Add 2 extra segments at the end
  }

  // Improved randomization method to ensure better variety in directions
  getRandomizedDirections() {
    // Create a balanced set of directions
    let directions = [];

    // Ensure the first direction is randomly chosen with 50/50 chance
    const firstDirection = Math.random() < 0.5 ? "up" : "down";
    directions.push(firstDirection);

    // Add remaining directions ensuring balance
    const remainingCount = 5; // We want 6 total directions (1 first + 5 remaining)
    const upCount =
      firstDirection === "up" ? remainingCount / 2 - 1 : remainingCount / 2;
    const downCount =
      firstDirection === "down" ? remainingCount / 2 - 1 : remainingCount / 2;

    // Add balanced remaining directions
    for (let i = 0; i < Math.ceil(upCount); i++) directions.push("up");
    for (let i = 0; i < Math.ceil(downCount); i++) directions.push("down");

    // Shuffle all but the first element to maintain the randomly chosen first direction
    const firstDir = directions[0];
    const rest = directions.slice(1);

    // Shuffle the remaining directions
    for (let i = rest.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [rest[i], rest[j]] = [rest[j], rest[i]];
    }

    return [firstDir, ...rest];
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

    // Set starting position based on direction
    const startX =
      this.direction === "right"
        ? this.viewWidth * (2 / 3) // 2/3 of the way to the right
        : this.viewWidth * (1 / 3); // 1/3 of the way to the left

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
      const pathId = `path-${i}-${this.direction}`;

      // Initialize tracking for this path
      this.lastTurnDirection[pathId] = "";
      this.pathActionHistory[pathId] = [];

      // Initial path structure with a distinct target Y
      const path = {
        id: pathId,
        x: startX,
        y: startY,
        targetY: targetY, // Each path has a different targetY
        direction: this.direction, // Start in the configured direction
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

      // Generate the path - ensure new randomization for each tree instance
      const pathDirectionIndex = i % this.forcedInitialDirections.length;
      const completePath = this.growDistinctPath(path, pathDirectionIndex);
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
      const pathId = `path-${i}-${this.direction}`;

      // Reset tracking for this path
      this.lastTurnDirection[pathId] = "";
      this.pathActionHistory[pathId] = [];

      // Create a new path but with forced vertical movement
      const path = {
        id: pathId,
        x: startX,
        y: startY,
        targetY: yPositions[i], // Use the distinct Y from positions array
        direction: this.direction, // Start in the configured direction
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

      // Grow this path with guaranteed vertical movement - use path index for direction
      const pathDirectionIndex = i % this.forcedInitialDirections.length;
      const completePath = this.growDistinctPath(path, pathDirectionIndex);

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

  growDistinctPath(path, directionIndex = path.pathIndex) {
    // Get initial segments for this path - some paths wait longer before turning
    const initialSegmentsForThisPath =
      this.initialSegmentCounts[
        path.pathIndex % this.initialSegmentCounts.length
      ];

    // First create initial horizontal segment (now varied based on path index)
    while (path.segmentsCreated < initialSegmentsForThisPath) {
      path.direction = this.direction; // Use the configured direction
      path = this.extendPath(path);
      path.segmentsCreated++;
    }

    // Force a vertical turn to happen after initial segments
    // Use the directionIndex to get the specific direction for this path
    const forcedDirection =
      this.forcedInitialDirections[directionIndex] ||
      (Math.random() > 0.5 ? "up" : "down");

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
    const horizontalDirection = this.direction; // Use the configured direction
    const horizontalTurnKey = `${path.x},${path.y}:${horizontalDirection}`;
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
      path = this.createCurvedTurn(
        path,
        horizontalDirection,
        horizontalCurveRadius
      );
    } else {
      path.direction = horizontalDirection;
      path.lastTurnPoint = path.x;
      path.actions.push(`turn-${horizontalDirection}-at-${path.x},${path.y}`);
    }

    // Continue generating path with normal rules but avoiding overlap
    while (path.segmentsCreated < this.pathSegments) {
      // Consider another turn later in the path
      const distanceFromLastTurn = Math.abs(path.x - path.lastTurnPoint);
      const atTurnPoint = distanceFromLastTurn >= this.gridSize * 2;

      if (
        path.direction === this.direction &&
        atTurnPoint &&
        path.verticalGridsUsed < this.maxVerticalGrids
      ) {
        // Reduced chance for another turn - higher probability of continuing horizontal
        if (Math.random() > this.horizontalMovementProbability) {
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
          const returnKey = `${path.x},${path.y}:${horizontalDirection}`;
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
            path = this.createCurvedTurn(
              path,
              horizontalDirection,
              returnCurveRadius
            );
          } else {
            path.direction = horizontalDirection;
            path.lastTurnPoint = path.x;
            path.actions.push(
              `return-${horizontalDirection}-at-${path.x},${path.y}`
            );
          }
        }
      }

      // Extend the path
      path = this.extendPath(path);
      path.segmentsCreated++;
    }

    // Ensure path ends horizontally pointing in the configured direction
    if (path.direction !== this.direction) {
      path.direction = this.direction;
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

    // Move in the current direction
    switch (path.direction) {
      case "right":
        nextX += segmentLength;
        nextX = Math.min(nextX, this.maxExtension);
        break;
      case "left":
        nextX -= segmentLength;
        nextX = Math.max(nextX, this.maxExtension);
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
        // Force configured direction movement for any other direction
        if (this.direction === "right") {
          nextX += segmentLength;
        } else {
          nextX -= segmentLength;
        }
        path.direction = this.direction;
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
      // Extend further to allow clean animation ending
      const maxExtension = this.gridSize * 6; // Increased from 4 to 6
      const actualExtension = Math.min(extraLength, maxExtension);

      // Adjust X position based on direction
      const extraX =
        this.direction === "right"
          ? path.x + actualExtension
          : path.x - actualExtension;

      path.pathData += ` L${extraX},${path.y}`;
      path.x = extraX;
    }

    // Add additional segments to ensure clean disappearance
    for (let i = 0; i < this.extraEndSegments; i++) {
      // Adjust X position based on direction
      const extraX =
        this.direction === "right"
          ? path.x + this.gridSize
          : path.x - this.gridSize;

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
    if (path.direction === "right" || path.direction === "left") {
      // Turning from horizontal to up/down
      const horizontalOffset =
        path.direction === "right" ? curveRadius : -curveRadius;
      endX = startX + horizontalOffset;
      endY =
        newDirection === "up" ? startY - curveRadius : startY + curveRadius;

      // Create a quarter-circle bezier curve
      const controlDistance = curveRadius * 0.552;
      const cp1x =
        path.direction === "right"
          ? startX + controlDistance
          : startX - controlDistance;
      const cp1y = startY;
      const cp2x = endX;
      const cp2y =
        newDirection === "up"
          ? startY - controlDistance
          : startY + controlDistance;

      curvePathData = `C ${cp1x},${cp1y} ${cp2x},${cp2y} ${endX},${endY}`;
    } else {
      // Turning from up/down to horizontal
      const horizontalDirection = newDirection; // This will be either "right" or "left"
      const horizontalOffset =
        horizontalDirection === "right" ? curveRadius : -curveRadius;
      endX = startX + horizontalOffset;
      endY =
        path.direction === "up" ? startY - curveRadius : startY + curveRadius;

      // Create a quarter-circle bezier curve
      const controlDistance = curveRadius * 0.552;
      const cp1x = startX;
      const cp1y =
        path.direction === "up"
          ? startY - controlDistance
          : startY + controlDistance;
      const cp2x =
        horizontalDirection === "right"
          ? startX + controlDistance
          : startX - controlDistance;
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
    const pathElements = document.querySelectorAll(
      `.wind-path[data-direction="${this.direction}"]`
    );
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
    this.leftPaths = []; // New array for left-facing paths
    this.rightPaths = []; // Renamed from paths to rightPaths for clarity
    this.animate = this.animate.bind(this);
    this.pendingRegeneration = new Map();
    this.regenerationDelay = 3000; // Increased from 2500 to 5000
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

    // Create two path trees - one on the right, one on the left
    this.rightPathTree = new PathTree(
      this.config.viewWidth,
      this.config.viewHeight,
      "right"
    );
    this.leftPathTree = new PathTree(
      this.config.viewWidth,
      this.config.viewHeight,
      "left"
    );

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

    // Generate right-facing tree of paths
    this.rightPathTree.forcedInitialDirections =
      this.rightPathTree.getRandomizedDirections();
    const rightPathData = this.rightPathTree.generatePaths();

    // Generate left-facing tree of paths - use different randomization
    this.leftPathTree.forcedInitialDirections =
      this.leftPathTree.getRandomizedDirections();
    const leftPathData = this.leftPathTree.generatePaths();

    // Create SVG paths for right tree with distinct styles for better visibility
    rightPathData.forEach((d, index) => {
      const path = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      path.setAttribute("class", "wind-path right-path");
      path.classList.add(`right-path-${index}`);

      if (index === 0) {
        path.classList.add("main-path");
        path.setAttribute("stroke", "url(#mainGradient)");
      } else {
        path.classList.add("branch-path");
        path.setAttribute("stroke", "url(#branchGradient)");
      }

      path.setAttribute("d", d);

      // Explicitly set these attributes to zero for complete invisibility
      path.setAttribute("stroke-width", "0");
      path.setAttribute("fill", "none");
      path.style.opacity = "0";
      path.style.strokeWidth = "0";
      path.style.filter = "blur(0px)";
      path.setAttribute("data-direction", "right");

      this.svg.appendChild(path);
    });

    // Create SVG paths for left tree with distinct styles for better visibility
    leftPathData.forEach((d, index) => {
      const path = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      path.setAttribute("class", "wind-path left-path");
      path.classList.add(`left-path-${index}`);

      if (index === 0) {
        path.classList.add("main-path");
        path.setAttribute("stroke", "url(#mainGradientLeft)");
      } else {
        path.classList.add("branch-path");
        path.setAttribute("stroke", "url(#branchGradientLeft)");
      }

      path.setAttribute("d", d);

      // Explicitly set these attributes to zero for complete invisibility
      path.setAttribute("stroke-width", "0");
      path.setAttribute("fill", "none");
      path.style.opacity = "0";
      path.style.strokeWidth = "0";
      path.style.filter = "blur(0px)";
      path.setAttribute("data-direction", "left");

      this.svg.appendChild(path);
    });

    // Store paths in separate arrays for easier management
    this.rightPaths = Array.from(this.svg.querySelectorAll(".right-path"));
    this.leftPaths = Array.from(this.svg.querySelectorAll(".left-path"));
    this.paths = [...this.rightPaths, ...this.leftPaths]; // Combine for overall animation handling

    // Initialize all paths
    this.paths.forEach((path) => {
      const length = path.getTotalLength();
      path.setAttribute("data-length", length);
      path.setAttribute("data-progress", "0");
      path.setAttribute("data-phase", "appearing");

      // Explicitly set all properties that could make the path visible
      path.style.opacity = "0";
      path.style.strokeWidth = "0";
      path.style.transition = "none";

      // Set up for animation
      const visibleLength = length * 0.15;
      path.style.strokeDasharray = `${visibleLength}, ${length}`;
      path.style.strokeDashoffset = 0;
      path.style.setProperty("--path-length", length);
    });

    // Create intersection markers after a delay
    setTimeout(() => this.createIntersectionMarkers(), 500);

    this.activateAnimation();
  }

  createGradientDefs() {
    // Create gradient definitions for paths
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");

    // Create main path gradient (brighter blue) - RIGHT DIRECTION
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
    mainStop1.setAttribute("class", "animated-gradient-start");

    const mainStop2 = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "stop"
    );
    mainStop2.setAttribute("offset", "100%");
    mainStop2.setAttribute("stop-color", "#0000CD");
    mainStop2.setAttribute("class", "animated-gradient-end");

    mainGradient.appendChild(mainStop1);
    mainGradient.appendChild(mainStop2);

    // Create branch path gradient (slightly darker blue) - RIGHT DIRECTION
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
    branchStop1.setAttribute("class", "animated-gradient-start");

    const branchStop2 = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "stop"
    );
    branchStop2.setAttribute("offset", "100%");
    branchStop2.setAttribute("stop-color", "#00008B");
    branchStop2.setAttribute("class", "animated-gradient-end");

    branchGradient.appendChild(branchStop1);
    branchGradient.appendChild(branchStop2);

    // Create main path gradient (brighter blue) - LEFT DIRECTION (flipped)
    const mainGradientLeft = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "linearGradient"
    );
    mainGradientLeft.setAttribute("id", "mainGradientLeft");
    // Reverse gradient direction
    mainGradientLeft.setAttribute("x1", "100%");
    mainGradientLeft.setAttribute("y1", "0%");
    mainGradientLeft.setAttribute("x2", "0%");
    mainGradientLeft.setAttribute("y2", "0%");

    const mainLeftStop1 = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "stop"
    );
    mainLeftStop1.setAttribute("offset", "0%");
    mainLeftStop1.setAttribute("stop-color", "#A0D8FF");
    mainLeftStop1.setAttribute("class", "animated-gradient-start-left");

    const mainLeftStop2 = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "stop"
    );
    mainLeftStop2.setAttribute("offset", "100%");
    mainLeftStop2.setAttribute("stop-color", "#0000CD");
    mainLeftStop2.setAttribute("class", "animated-gradient-end-left");

    mainGradientLeft.appendChild(mainLeftStop1);
    mainGradientLeft.appendChild(mainLeftStop2);

    // Create branch path gradient (slightly darker blue) - LEFT DIRECTION (flipped)
    const branchGradientLeft = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "linearGradient"
    );
    branchGradientLeft.setAttribute("id", "branchGradientLeft");
    // Reverse gradient direction
    branchGradientLeft.setAttribute("x1", "100%");
    branchGradientLeft.setAttribute("y1", "0%");
    branchGradientLeft.setAttribute("x2", "0%");
    branchGradientLeft.setAttribute("y2", "0%");

    const branchLeftStop1 = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "stop"
    );
    branchLeftStop1.setAttribute("offset", "0%");
    branchLeftStop1.setAttribute("stop-color", "#87CEFA");
    branchLeftStop1.setAttribute("class", "animated-gradient-start-left");

    const branchLeftStop2 = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "stop"
    );
    branchLeftStop2.setAttribute("offset", "100%");
    branchLeftStop2.setAttribute("stop-color", "#00008B");
    branchLeftStop2.setAttribute("class", "animated-gradient-end-left");

    branchGradientLeft.appendChild(branchLeftStop1);
    branchGradientLeft.appendChild(branchLeftStop2);

    defs.appendChild(mainGradient);
    defs.appendChild(branchGradient);
    defs.appendChild(mainGradientLeft);
    defs.appendChild(branchGradientLeft);

    this.svg.appendChild(defs);
  }

  regeneratePaths() {
    if (!this.svg) return;

    // Hide existing paths before removing them
    this.hidePaths();

    // Clean up any existing intersection markers
    this.intersectionMarkers.forEach((marker) => {
      if (marker && marker.parentNode) {
        marker.parentNode.removeChild(marker);
      }
    });
    this.intersectionMarkers = [];

    // Clear the svg with a slight delay to ensure transitions have completed
    setTimeout(() => {
      this.svg.innerHTML = "";
      this.pendingRegeneration.clear();

      // Recreate gradient defs
      this.createGradientDefs();

      // Generate new tree of paths with new randomization - right side
      this.rightPathTree.forcedInitialDirections =
        this.rightPathTree.getRandomizedDirections();
      const rightPathData = this.rightPathTree.generatePaths();

      // Generate new tree of paths with new randomization - left side
      this.leftPathTree.forcedInitialDirections =
        this.leftPathTree.getRandomizedDirections();
      const leftPathData = this.leftPathTree.generatePaths();

      // Create new SVG paths for right tree
      rightPathData.forEach((d, index) => {
        const path = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path"
        );
        path.setAttribute("class", "wind-path right-path");
        path.classList.add(`right-path-${index}`);
        path.setAttribute("d", d);

        // Explicitly set both attribute and style to zero
        path.setAttribute("stroke-width", "0");
        path.style.strokeWidth = "0";
        path.setAttribute("fill", "none");
        path.style.opacity = "0";
        path.setAttribute("data-direction", "right");

        if (index === 0) {
          path.classList.add("main-path");
          path.setAttribute("stroke", "url(#mainGradient)");
        } else {
          path.classList.add("branch-path");
          path.setAttribute("stroke", "url(#branchGradient)");
        }

        this.svg.appendChild(path);
      });

      // Create new SVG paths for left tree
      leftPathData.forEach((d, index) => {
        const path = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path"
        );
        path.setAttribute("class", "wind-path left-path");
        path.classList.add(`left-path-${index}`);
        path.setAttribute("d", d);

        // Explicitly set both attribute and style to zero
        path.setAttribute("stroke-width", "0");
        path.style.strokeWidth = "0";
        path.setAttribute("fill", "none");
        path.style.opacity = "0";
        path.setAttribute("data-direction", "left");

        if (index === 0) {
          path.classList.add("main-path");
          path.setAttribute("stroke", "url(#mainGradientLeft)");
        } else {
          path.classList.add("branch-path");
          path.setAttribute("stroke", "url(#branchGradientLeft)");
        }

        this.svg.appendChild(path);
      });

      // Store paths in separate arrays
      this.rightPaths = Array.from(this.svg.querySelectorAll(".right-path"));
      this.leftPaths = Array.from(this.svg.querySelectorAll(".left-path"));
      this.paths = [...this.rightPaths, ...this.leftPaths];

      // Make sure paths are properly initialized with complete invisibility
      this.paths.forEach((path) => {
        const length = path.getTotalLength();
        path.setAttribute("data-length", length);
        path.setAttribute("data-progress", "0");
        path.setAttribute("data-phase", "appearing");

        // Double ensure paths are fully invisible
        path.style.opacity = "0";
        path.style.strokeWidth = "0";
        path.setAttribute("stroke-width", "0");
        path.style.transition = "none";

        // Set up for animation
        const visibleLength = length * 0.15;
        path.style.strokeDasharray = `${visibleLength}, ${length}`;
        path.style.strokeDashoffset = 0; // Start from the start
        path.style.setProperty("--path-length", length);
      });

      // Create intersection markers after a short delay
      setTimeout(() => this.createIntersectionMarkers(), 500);

      // Add a slight delay before showing new paths
      setTimeout(() => {
        this.paths.forEach((path) => {
          path.style.opacity = "0.7";
          path.style.strokeWidth = "2.5";
          path.style.transition = "opacity 0.3s ease, stroke-width 0.3s ease";
          path.classList.add("visible");
        });
      }, 100);
    }, 100); // Short delay to ensure paths are fully hidden before rebuilding
  }

  hidePaths() {
    if (!this.paths || this.paths.length === 0) return;

    this.paths.forEach((path) => {
      path.style.transition = "opacity 0.2s ease, stroke-width 0.2s ease";
      path.style.opacity = "0";
      path.style.strokeWidth = "0";
      path.setAttribute("stroke-width", "0");
      path.classList.remove("visible");
    });
  }

  createIntersectionMarkers() {
    // First, remove any existing markers
    this.intersectionMarkers.forEach((marker) => {
      if (marker && marker.parentNode) {
        marker.parentNode.removeChild(marker);
      }
    });
    this.intersectionMarkers = [];

    // Find intersections for both tree types
    const rightIntersections = this.rightPathTree.findIntersections();
    const leftIntersections = this.leftPathTree.findIntersections();

    // Filter and sort each set of intersections independently
    const filteredRightIntersections =
      this.filterIntersections(rightIntersections);
    const filteredLeftIntersections =
      this.filterIntersections(leftIntersections);

    // Sort right intersections from left to right (lowest X to highest X)
    filteredRightIntersections.sort((a, b) => a.x - b.x);

    // Sort left intersections from right to left (highest X to lowest X)
    filteredLeftIntersections.sort((a, b) => b.x - a.x);

    // Apply random filtering to both sides
    let selectedRightIntersections = filteredRightIntersections
      .filter(() => Math.random() < 0.5)
      .slice(0, 6); // Maximum 6 per side

    let selectedLeftIntersections = filteredLeftIntersections
      .filter(() => Math.random() < 0.5)
      .slice(0, 6); // Maximum 6 per side

    // Add direction information to each intersection
    selectedRightIntersections = selectedRightIntersections.map((point) => ({
      ...point,
      direction: "right",
    }));

    selectedLeftIntersections = selectedLeftIntersections.map((point) => ({
      ...point,
      direction: "left",
    }));

    console.log(
      `Right tree: Found ${rightIntersections.length} intersections, filtered to ${filteredRightIntersections.length}, showing ${selectedRightIntersections.length}`
    );
    console.log(
      `Left tree: Found ${leftIntersections.length} intersections, filtered to ${filteredLeftIntersections.length}, showing ${selectedLeftIntersections.length}`
    );

    // Create markers for right intersections (indexed from left to right)
    this.createMarkersForIntersections(selectedRightIntersections, "right");

    // Create markers for left intersections (indexed from right to left)
    this.createMarkersForIntersections(selectedLeftIntersections, "left");
  }

  filterIntersections(intersections) {
    const filteredIntersections = [];
    const minimumDistance = 20; // Minimum distance between markers in pixels

    for (const point of intersections) {
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

    return filteredIntersections;
  }

  createMarkersForIntersections(intersections, direction) {
    if (intersections.length === 0) return;

    // Get min and max X positions for proportional delays
    const xValues = intersections.map((point) => point.x);
    const minX = Math.min(...xValues);
    const maxX = Math.max(...xValues);
    const xRange = maxX - minX || 1; // Avoid division by zero

    // Create marker for each intersection
    intersections.forEach((point, index) => {
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
      marker.setAttribute("class", `intersection-marker ${direction}-marker`);
      marker.setAttribute("data-x-position", point.x);
      marker.setAttribute("data-direction", direction);
      marker.setAttribute("data-index", index.toString()); // Store display order index

      // Initially set opacity to 0
      marker.style.opacity = "0";

      this.svg.appendChild(marker);
      this.intersectionMarkers.push(marker);

      // Calculate delay based on position
      let xPositionRatio;
      if (direction === "right") {
        // For right tree: leftmost (lowest X) appears first
        xPositionRatio = (point.x - minX) / xRange;
      } else {
        // For left tree: rightmost (highest X) appears first
        xPositionRatio = (maxX - point.x) / xRange;
      }

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
      // Get markers by direction
      const rightMarkers = this.intersectionMarkers.filter(
        (marker) => marker.getAttribute("data-direction") === "right"
      );

      const leftMarkers = this.intersectionMarkers.filter(
        (marker) => marker.getAttribute("data-direction") === "left"
      );

      // Sort right markers by index (left to right)
      const sortedRightMarkers = [...rightMarkers].sort((a, b) => {
        const indexA = parseInt(a.getAttribute("data-index") || "0");
        const indexB = parseInt(b.getAttribute("data-index") || "0");
        return indexA - indexB;
      });

      // Sort left markers by index (right to left order maintained by index)
      const sortedLeftMarkers = [...leftMarkers].sort((a, b) => {
        const indexA = parseInt(a.getAttribute("data-index") || "0");
        const indexB = parseInt(b.getAttribute("data-index") || "0");
        return indexA - indexB;
      });

      // Fade out right markers
      sortedRightMarkers.forEach((marker, index) => {
        if (marker && marker.parentNode) {
          const fadeDelay = index * 150;
          setTimeout(() => {
            marker.style.opacity = "0";
            setTimeout(() => {
              if (marker.parentNode) {
                marker.parentNode.removeChild(marker);
              }
            }, 550);
          }, fadeDelay);
        }
      });

      // Fade out left markers
      sortedLeftMarkers.forEach((marker, index) => {
        if (marker && marker.parentNode) {
          const fadeDelay = index * 150;
          setTimeout(() => {
            marker.style.opacity = "0";
            setTimeout(() => {
              if (marker.parentNode) {
                marker.parentNode.removeChild(marker);
              }
            }, 550);
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

      // Shorter delay before showing paths (reduced from 300ms to 100ms)
      setTimeout(() => {
        this.paths.forEach((path) => {
          path.style.opacity = "0.7";
          path.style.strokeWidth = "2.5";
          path.style.transition = "opacity 0.3s ease, stroke-width 0.3s ease";
          path.classList.add("visible");
        });
      }, 100);

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

      path.classList.remove("visible");
      path.style.transition = "none";

      // Ensure complete invisibility
      path.style.opacity = "0";
      path.style.strokeWidth = "0";
      path.setAttribute("stroke-width", "0");

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
        // Immediately hide all paths before regeneration starts
        this.paths.forEach((p) => {
          p.style.opacity = "0";
          p.style.strokeWidth = "0";
          p.setAttribute("stroke-width", "0");
        });

        // Add a small delay before regenerating paths to ensure they're hidden
        setTimeout(() => {
          this.regeneratePaths();
        }, 50);

        // Clear pending regeneration to prevent multiple calls
        this.pendingRegeneration.clear();
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
          pathProgress - 0.1
        );

        // Hide paths earlier - when they're 90% done disappearing instead of 100%
        if (pathProgress >= 0.9) {
          // Hide the path completely before it's fully disappeared
          path.style.opacity = "0";
          path.style.strokeWidth = "0";
          path.setAttribute("stroke-width", "0");
        }

        if (pathProgress === 1) {
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
