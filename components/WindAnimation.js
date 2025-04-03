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

    // Track turn types at specific coordinates - use exact coordinate as key
    this.turnTypesAtCoordinates = {}; // Track if curved/straight turn used at specific points
    this.curveRadiusAtCoordinates = {}; // Track curve radius at specific points

    // Add debug info collection
    this.turnDebugInfo = [];
    this.debugMode = false; // Set to true to enable detailed logging

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
    let directions = [];
    const firstDirection = Math.random() < 0.5 ? "up" : "down";
    directions.push(firstDirection);

    const remainingCount = 5;
    const upCount =
      firstDirection === "up" ? remainingCount / 2 - 1 : remainingCount / 2;
    const downCount =
      firstDirection === "down" ? remainingCount / 2 - 1 : remainingCount / 2;

    for (let i = 0; i < Math.ceil(upCount); i++) directions.push("up");
    for (let i = 0; i < Math.ceil(downCount); i++) directions.push("down");

    const firstDir = directions[0];
    const rest = directions.slice(1);

    for (let i = rest.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [rest[i], rest[j]] = [rest[j], rest[i]];
    }

    return [firstDir, ...rest];
  }

  generatePaths() {
    this.nodes.clear();
    this.paths = [];
    this.occupiedYPositions = [];
    this.endYPositions.clear();
    this.lastTurnDirection = {};
    this.pathActionHistory = {};
    this.pathPositions = new Set();
    this.forbiddenPositions = new Set();
    this.pathDirectionsAtPoint = {};
    this.turnTypesAtCoordinates = {};
    this.curveRadiusAtCoordinates = {};
    this.turnDebugInfo = [];

    const startX =
      this.direction === "right"
        ? this.viewWidth * (2 / 3)
        : this.viewWidth * (1 / 3);

    this.minX = startX;

    const startY = this.viewHeight / 2;

    this.pathPositions.add(`${startX},${startY}`);

    const yPositions = [];
    const spacing = 80;
    const maxPaths = Math.min(6, this.pathCount);

    yPositions.push(startY);

    for (let i = 1; i <= Math.floor(maxPaths / 2); i++) {
      const above = startY - i * spacing;
      const below = startY + i * spacing;

      if (above >= 50) yPositions.push(above);
      if (below <= this.viewHeight - 50) yPositions.push(below);
    }

    yPositions.sort((a, b) => a - b);
    this.occupiedYPositions = yPositions;

    this.pathOffsets = [];
    for (let i = 0; i < yPositions.length; i++) {
      this.pathOffsets.push((10 * i) % this.gridSize);
    }

    const tempPaths = [];
    for (let i = 0; i < Math.min(this.pathCount, yPositions.length); i++) {
      const targetY = yPositions[i];
      const offset = this.pathOffsets[i];
      const pathId = `path-${i}-${this.direction}`;

      this.lastTurnDirection[pathId] = "";
      this.pathActionHistory[pathId] = [];

      const path = {
        id: pathId,
        x: startX,
        y: startY,
        targetY: targetY,
        direction: this.direction,
        pathData: `M${startX},${startY}`,
        segmentsCreated: 0,
        isMainPath: i === Math.floor(yPositions.length / 2),
        gridOffset: offset,
        lastTurnPoint: 0,
        verticalGridsUsed: 0,
        totalLength: 0,
        points: [{ x: startX, y: startY }],
        actions: [],
        pathIndex: i,
      };

      const pathDirectionIndex = i % this.forcedInitialDirections.length;
      const completePath = this.growDistinctPath(path, pathDirectionIndex);
      tempPaths.push(completePath);
    }

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

      this.targetPathLength = maxLength;
    }

    this.paths = [];
    this.pathPositions = new Set();
    this.forbiddenPositions = new Set();
    this.endYPositions = new Set();

    for (let i = 0; i < tempPaths.length; i++) {
      const originalPath = tempPaths[i];
      const pathId = `path-${i}-${this.direction}`;

      this.lastTurnDirection[pathId] = "";
      this.pathActionHistory[pathId] = [];

      const path = {
        id: pathId,
        x: startX,
        y: startY,
        targetY: yPositions[i],
        direction: this.direction,
        pathData: `M${startX},${startY}`,
        segmentsCreated: 0,
        isMainPath: originalPath.isMainPath,
        gridOffset: originalPath.gridOffset,
        lastTurnPoint: 0,
        verticalGridsUsed: 0,
        endY: 0,
        points: [{ x: startX, y: startY }],
        actions: [],
        pathIndex: i,
        mustTurn: true,
        forcedYOffset: this.forcedYOffsets[i % this.forcedYOffsets.length],
      };

      const pathDirectionIndex = i % this.forcedInitialDirections.length;
      const completePath = this.growDistinctPath(path, pathDirectionIndex);

      if (completePath.isMainPath) {
        this.paths.unshift(completePath.pathData);
      } else {
        this.paths.push(completePath.pathData);
      }
    }

    this.commonLength = this.targetPathLength;
    return this.paths;
  }

  growDistinctPath(path, directionIndex = path.pathIndex) {
    const initialSegmentsForThisPath =
      this.initialSegmentCounts[
        path.pathIndex % this.initialSegmentCounts.length
      ];

    while (path.segmentsCreated < initialSegmentsForThisPath) {
      path.direction = this.direction;
      path = this.extendPath(path);
      path.segmentsCreated++;
    }

    const forcedDirection =
      this.forcedInitialDirections[directionIndex] ||
      (Math.random() > 0.5 ? "up" : "down");

    const coordKey = `${path.x},${path.y}`;

    let shouldCurve;
    let curveRadius = this.gridSize * this.curveRadiusGrid;

    if (this.turnTypesAtCoordinates[coordKey] !== undefined) {
      shouldCurve = this.turnTypesAtCoordinates[coordKey];

      if (shouldCurve && this.curveRadiusAtCoordinates[coordKey]) {
        curveRadius = this.curveRadiusAtCoordinates[coordKey];
      }

      if (this.debugMode) {
        console.log(
          `Reusing turn type at ${coordKey}: curved=${shouldCurve}, radius=${curveRadius}`
        );
      }

      this.turnDebugInfo.push({
        action: "reused",
        coordKey,
        curved: shouldCurve,
        radius: curveRadius,
        pathId: path.id,
        direction: forcedDirection,
      });
    } else {
      shouldCurve = Math.random() < 0.5 && this.useCurvedTurns;

      if (shouldCurve && Math.random() < 0.3) {
        curveRadius = this.gridSize * (this.curveRadiusGrid / 2);
      }

      this.turnTypesAtCoordinates[coordKey] = shouldCurve;
      if (shouldCurve) {
        this.curveRadiusAtCoordinates[coordKey] = curveRadius;
      }

      if (this.debugMode) {
        console.log(
          `New turn type at ${coordKey}: curved=${shouldCurve}, radius=${curveRadius}`
        );
      }

      this.turnDebugInfo.push({
        action: "created",
        coordKey,
        curved: shouldCurve,
        radius: curveRadius,
        pathId: path.id,
        direction: forcedDirection,
      });
    }

    if (shouldCurve) {
      path = this.createCurvedTurn(path, forcedDirection, curveRadius);
    } else {
      path.direction = forcedDirection;
      this.lastTurnDirection[path.id] = forcedDirection;
      path.lastTurnPoint = path.x;
      path.verticalGridsUsed++;

      path.actions.push(
        `forced-turn-${forcedDirection}-at-${path.x},${path.y}`
      );
    }

    const verticalSegments = 1 + (path.pathIndex % 3);
    for (
      let i = 0;
      i < verticalSegments && path.segmentsCreated < this.pathSegments;
      i++
    ) {
      path = this.extendPath(path);
      path.segmentsCreated++;
    }

    const horizontalDirection = this.direction;
    const horizontalCoordKey = `${path.x},${path.y}`;
    let shouldCurveHorizontal;
    let horizontalCurveRadius = this.gridSize * this.curveRadiusGrid;

    if (this.turnTypesAtCoordinates[horizontalCoordKey] !== undefined) {
      shouldCurveHorizontal = this.turnTypesAtCoordinates[horizontalCoordKey];

      if (
        shouldCurveHorizontal &&
        this.curveRadiusAtCoordinates[horizontalCoordKey]
      ) {
        horizontalCurveRadius =
          this.curveRadiusAtCoordinates[horizontalCoordKey];
      }

      this.turnDebugInfo.push({
        action: "reused",
        coordKey: horizontalCoordKey,
        curved: shouldCurveHorizontal,
        radius: horizontalCurveRadius,
        pathId: path.id,
        direction: horizontalDirection,
      });
    } else {
      shouldCurveHorizontal = Math.random() < 0.5 && this.useCurvedTurns;

      if (shouldCurveHorizontal && Math.random() < 0.3) {
        horizontalCurveRadius = this.gridSize * (this.curveRadiusGrid / 2);
      }

      this.turnTypesAtCoordinates[horizontalCoordKey] = shouldCurveHorizontal;
      if (shouldCurveHorizontal) {
        this.curveRadiusAtCoordinates[horizontalCoordKey] =
          horizontalCurveRadius;
      }

      this.turnDebugInfo.push({
        action: "created",
        coordKey: horizontalCoordKey,
        curved: shouldCurveHorizontal,
        radius: horizontalCurveRadius,
        pathId: path.id,
        direction: horizontalDirection,
      });
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

    while (path.segmentsCreated < this.pathSegments) {
      const distanceFromLastTurn = Math.abs(path.x - path.lastTurnPoint);
      const atTurnPoint = distanceFromLastTurn >= this.gridSize * 2;

      if (
        path.direction === this.direction &&
        atTurnPoint &&
        path.verticalGridsUsed < this.maxVerticalGrids
      ) {
        if (Math.random() > this.horizontalMovementProbability) {
          const newDirection =
            this.lastTurnDirection[path.id] === "up" ? "down" : "up";

          const lateralCoordKey = `${path.x},${path.y}`;
          let shouldCurveLateral;
          let lateralCurveRadius = this.gridSize * this.curveRadiusGrid;

          if (this.turnTypesAtCoordinates[lateralCoordKey] !== undefined) {
            shouldCurveLateral = this.turnTypesAtCoordinates[lateralCoordKey];

            if (
              shouldCurveLateral &&
              this.curveRadiusAtCoordinates[lateralCoordKey]
            ) {
              lateralCurveRadius =
                this.curveRadiusAtCoordinates[lateralCoordKey];
            }

            this.turnDebugInfo.push({
              action: "reused",
              coordKey: lateralCoordKey,
              curved: shouldCurveLateral,
              radius: lateralCurveRadius,
              pathId: path.id,
              direction: newDirection,
            });
          } else {
            shouldCurveLateral = Math.random() < 0.5 && this.useCurvedTurns;

            if (shouldCurveLateral && Math.random() < 0.3) {
              lateralCurveRadius = this.gridSize * (this.curveRadiusGrid / 2);
            }

            this.turnTypesAtCoordinates[lateralCoordKey] = shouldCurveLateral;
            if (shouldCurveLateral) {
              this.curveRadiusAtCoordinates[lateralCoordKey] =
                lateralCurveRadius;
            }

            this.turnDebugInfo.push({
              action: "created",
              coordKey: lateralCoordKey,
              curved: shouldCurveLateral,
              radius: lateralCurveRadius,
              pathId: path.id,
              direction: newDirection,
            });
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

            path.actions.push(
              `additional-turn-${newDirection}-at-${path.x},${path.y}`
            );
          }

          const additionalVertical = 1 + Math.floor(Math.random() * 2);
          for (
            let i = 0;
            i < additionalVertical && path.segmentsCreated < this.pathSegments;
            i++
          ) {
            path = this.extendPath(path);
            path.segmentsCreated++;
          }

          const returnCoordKey = `${path.x},${path.y}`;
          let shouldCurveReturn;
          let returnCurveRadius = this.gridSize * this.curveRadiusGrid;

          if (this.turnTypesAtCoordinates[returnCoordKey] !== undefined) {
            shouldCurveReturn = this.turnTypesAtCoordinates[returnCoordKey];

            if (
              shouldCurveReturn &&
              this.curveRadiusAtCoordinates[returnCoordKey]
            ) {
              returnCurveRadius = this.curveRadiusAtCoordinates[returnCoordKey];
            }

            this.turnDebugInfo.push({
              action: "reused",
              coordKey: returnCoordKey,
              curved: shouldCurveReturn,
              radius: returnCurveRadius,
              pathId: path.id,
              direction: horizontalDirection,
            });
          } else {
            shouldCurveReturn = Math.random() < 0.5 && this.useCurvedTurns;

            if (shouldCurveReturn && Math.random() < 0.3) {
              returnCurveRadius = this.gridSize * (this.curveRadiusGrid / 2);
            }

            this.turnTypesAtCoordinates[returnCoordKey] = shouldCurveReturn;
            if (shouldCurveReturn) {
              this.curveRadiusAtCoordinates[returnCoordKey] = returnCurveRadius;
            }

            this.turnDebugInfo.push({
              action: "created",
              coordKey: returnCoordKey,
              curved: shouldCurveReturn,
              radius: returnCurveRadius,
              pathId: path.id,
              direction: horizontalDirection,
            });
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

      path = this.extendPath(path);
      path.segmentsCreated++;
    }

    if (path.direction !== this.direction) {
      path.direction = this.direction;
      path = this.extendPath(path);
    }

    path = this.adjustPathToExactLength(path);

    this.endYPositions.add(path.y);

    return path;
  }

  validateTurnConsistency() {
    const turnsByCoordinates = {};

    this.turnDebugInfo.forEach((info) => {
      if (!turnsByCoordinates[info.coordKey]) {
        turnsByCoordinates[info.coordKey] = [];
      }
      turnsByCoordinates[info.coordKey].push(info);
    });

    let inconsistentTurns = 0;

    Object.entries(turnsByCoordinates).forEach(([coordKey, turns]) => {
      if (turns.length > 1) {
        const firstType = turns[0].curved;
        const allSameType = turns.every((t) => t.curved === firstType);

        if (!allSameType) {
          inconsistentTurns++;
          if (this.debugMode) {
            console.error(`Inconsistent turn types at ${coordKey}:`, turns);
          }
        }
      }
    });

    return {
      totalCoordinates: Object.keys(turnsByCoordinates).length,
      inconsistentTurns,
      isConsistent: inconsistentTurns === 0,
    };
  }

  extendPath(path) {
    const segmentLength = this.gridSize;

    let nextX = path.x;
    let nextY = path.y;

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
        if (this.direction === "right") {
          nextX += segmentLength;
        } else {
          nextX -= segmentLength;
        }
        path.direction = this.direction;
        break;
    }

    const newPoint = { x: nextX, y: nextY };

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

    if (currentLength < this.targetPathLength) {
      const extraLength = this.targetPathLength - currentLength;
      const maxExtension = this.gridSize * 6;
      const actualExtension = Math.min(extraLength, maxExtension);

      const extraX =
        this.direction === "right"
          ? path.x + actualExtension
          : path.x - actualExtension;

      path.pathData += ` L${extraX},${path.y}`;
      path.x = extraX;
    }

    for (let i = 0; i < this.extraEndSegments; i++) {
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

    if (path.direction === "right" || path.direction === "left") {
      const horizontalOffset =
        path.direction === "right" ? curveRadius : -curveRadius;
      endX = startX + horizontalOffset;
      endY =
        newDirection === "up" ? startY - curveRadius : startY + curveRadius;

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
      const horizontalDirection = newDirection;
      const horizontalOffset =
        horizontalDirection === "right" ? curveRadius : -curveRadius;
      endX = startX + horizontalOffset;
      endY =
        path.direction === "up" ? startY - curveRadius : startY + curveRadius;

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

    const newPathData = `${path.pathData} ${curvePathData}`;

    this.lastTurnDirection[path.id] = newDirection;

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
    this.intersectionPoints = [];

    const pathElements = document.querySelectorAll(
      `.wind-path[data-direction="${this.direction}"]`
    );
    if (!pathElements || pathElements.length < 2) return [];

    const processedPaths = [];

    pathElements.forEach((pathEl, index) => {
      const length = pathEl.getTotalLength();
      const samplePoints = Math.max(50, Math.floor(length / 10));
      const points = [];

      for (let i = 0; i < samplePoints; i++) {
        const point = pathEl.getPointAtLength((i * length) / samplePoints);
        points.push([point.x, point.y]);
      }

      const segments = [];
      for (let i = 0; i < points.length - 1; i++) {
        segments.push([points[i], points[i + 1]]);
      }

      processedPaths.push({ index, segments });
    });

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

    const dx1 = x2 - x1;
    const dy1 = y2 - y1;
    const dx2 = x4 - x3;
    const dy2 = y4 - y3;

    const denominator = dy2 * dx1 - dx2 * dy1;

    if (Math.abs(denominator) < 0.0001) return null;

    const ua = (dx2 * (y1 - y3) - dy2 * (x1 - x3)) / denominator;
    const ub = (dx1 * (y1 - y3) - dy1 * (x1 - x3)) / denominator;

    if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
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
    this.leftPaths = [];
    this.rightPaths = [];
    this.animate = this.animate.bind(this);
    this.pendingRegeneration = new Map();
    this.regenerationDelay = 2500;
    this.visibilityDuration = 2000;

    this.config = {
      maxPaths: 6,
      viewWidth: window.innerWidth,
      viewHeight: 500,
    };

    this.colors = {
      start: "#87CEFA",
      end: "#00008B",
    };

    this.intersectionMarkers = [];
    this.markerLifetime = 5000;

    this.markerColors = {
      fill: "#000000",
      stroke: "#3498db",
    };

    if (typeof window !== "undefined") {
      window.addEventListener("resize", this.handleResize.bind(this));
    }

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

    this.svg.setAttribute(
      "viewBox",
      `0 0 ${this.config.viewWidth} ${this.config.viewHeight}`
    );

    this.svg.style.maxWidth = "100%";
    this.svg.style.width = "100%";
    this.svg.style.overflow = "hidden";

    this.svg.innerHTML = "";
    this.pendingRegeneration.clear();
    this.intersectionMarkers = [];

    this.createGradientDefs();

    this.rightPathTree.turnTypesAtCoordinates = {};
    this.rightPathTree.curveRadiusAtCoordinates = {};
    this.leftPathTree.turnTypesAtCoordinates = {};
    this.leftPathTree.curveRadiusAtCoordinates = {};

    this.rightPathTree.forcedInitialDirections =
      this.rightPathTree.getRandomizedDirections();
    const rightPathData = this.rightPathTree.generatePaths();

    this.leftPathTree.forcedInitialDirections =
      this.leftPathTree.getRandomizedDirections();
    const leftPathData = this.leftPathTree.generatePaths();

    if (this.rightPathTree.debugMode) {
      const rightConsistency = this.rightPathTree.validateTurnConsistency();
      const leftConsistency = this.leftPathTree.validateTurnConsistency();

      console.log("Right path tree turn consistency:", rightConsistency);
      console.log("Left path tree turn consistency:", leftConsistency);
    }

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

      path.setAttribute("stroke-width", "0");
      path.setAttribute("fill", "none");
      path.style.opacity = "0";
      path.style.strokeWidth = "0";
      path.style.filter = "blur(0px)";
      path.setAttribute("data-direction", "right");

      this.svg.appendChild(path);
    });

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

      path.setAttribute("stroke-width", "0");
      path.setAttribute("fill", "none");
      path.style.opacity = "0";
      path.style.strokeWidth = "0";
      path.style.filter = "blur(0px)";
      path.setAttribute("data-direction", "left");

      this.svg.appendChild(path);
    });

    this.rightPaths = Array.from(this.svg.querySelectorAll(".right-path"));
    this.leftPaths = Array.from(this.svg.querySelectorAll(".left-path"));
    this.paths = [...this.rightPaths, ...this.leftPaths];

    this.paths.forEach((path) => {
      const length = path.getTotalLength();
      path.setAttribute("data-length", length);
      path.setAttribute("data-progress", "0");
      path.setAttribute("data-phase", "appearing");

      path.style.opacity = "0";
      path.style.strokeWidth = "0";
      path.style.transition = "none";

      const visibleLength = length * 0.15;
      path.style.strokeDasharray = `${visibleLength}, ${length}`;
      path.style.strokeDashoffset = 0;
      path.style.setProperty("--path-length", length);
    });

    setTimeout(() => this.createIntersectionMarkers(), 500);

    this.activateAnimation();
  }

  createGradientDefs() {
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");

    // Right path gradients (bright blue theme)
    const mainGradient = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "linearGradient"
    );
    mainGradient.setAttribute("id", "mainGradient");
    mainGradient.setAttribute("x1", "0%");
    mainGradient.setAttribute("y1", "0%");
    mainGradient.setAttribute("x2", "100%");
    mainGradient.setAttribute("y2", "0%");

    const mainStop1 = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "stop"
    );
    mainStop1.setAttribute("offset", "0%");
    mainStop1.setAttribute("stop-color", "#40FFFF"); // Bright cyan blue
    mainStop1.setAttribute("class", "animated-gradient-start-right");

    const mainStop2 = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "stop"
    );
    mainStop2.setAttribute("offset", "100%");
    mainStop2.setAttribute("stop-color", "#0080FF"); // Bright medium blue
    mainStop2.setAttribute("class", "animated-gradient-end-right");

    mainGradient.appendChild(mainStop1);
    mainGradient.appendChild(mainStop2);

    const branchGradient = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "linearGradient"
    );
    branchGradient.setAttribute("id", "branchGradient");
    branchGradient.setAttribute("x1", "0%");
    branchGradient.setAttribute("y1", "0%");
    branchGradient.setAttribute("x2", "100%");
    branchGradient.setAttribute("y2", "0%");

    const branchStop1 = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "stop"
    );
    branchStop1.setAttribute("offset", "0%");
    branchStop1.setAttribute("stop-color", "#80FFFF"); // Light cyan blue
    branchStop1.setAttribute("class", "animated-gradient-start-right");

    const branchStop2 = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "stop"
    );
    branchStop2.setAttribute("offset", "100%");
    branchStop2.setAttribute("stop-color", "#0040FF"); // Bright deep blue
    branchStop2.setAttribute("class", "animated-gradient-end-right");

    branchGradient.appendChild(branchStop1);
    branchGradient.appendChild(branchStop2);

    // Left path gradients (same bright blue theme)
    const mainGradientLeft = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "linearGradient"
    );
    mainGradientLeft.setAttribute("id", "mainGradientLeft");
    mainGradientLeft.setAttribute("x1", "100%");
    mainGradientLeft.setAttribute("y1", "0%");
    mainGradientLeft.setAttribute("x2", "0%");
    mainGradientLeft.setAttribute("y2", "0%");

    const mainLeftStop1 = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "stop"
    );
    mainLeftStop1.setAttribute("offset", "0%");
    mainLeftStop1.setAttribute("stop-color", "#40FFFF"); // Bright cyan blue
    mainLeftStop1.setAttribute("class", "animated-gradient-start-left");

    const mainLeftStop2 = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "stop"
    );
    mainLeftStop2.setAttribute("offset", "100%");
    mainLeftStop2.setAttribute("stop-color", "#0080FF"); // Bright medium blue
    mainLeftStop2.setAttribute("class", "animated-gradient-end-left");

    mainGradientLeft.appendChild(mainLeftStop1);
    mainGradientLeft.appendChild(mainLeftStop2);

    const branchGradientLeft = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "linearGradient"
    );
    branchGradientLeft.setAttribute("id", "branchGradientLeft");
    branchGradientLeft.setAttribute("x1", "100%");
    branchGradientLeft.setAttribute("y1", "0%");
    branchGradientLeft.setAttribute("x2", "0%");
    branchGradientLeft.setAttribute("y2", "0%");

    const branchLeftStop1 = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "stop"
    );
    branchLeftStop1.setAttribute("offset", "0%");
    branchLeftStop1.setAttribute("stop-color", "#80FFFF"); // Light cyan blue
    branchLeftStop1.setAttribute("class", "animated-gradient-start-left");

    const branchLeftStop2 = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "stop"
    );
    branchLeftStop2.setAttribute("offset", "100%");
    branchLeftStop2.setAttribute("stop-color", "#0040FF"); // Bright deep blue
    branchLeftStop2.setAttribute("class", "animated-gradient-end-left");

    branchGradientLeft.appendChild(branchLeftStop1);
    branchGradientLeft.appendChild(branchLeftStop2);

    // Add filter for glow effect
    const glowFilter = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "filter"
    );
    glowFilter.setAttribute("id", "glow");
    glowFilter.setAttribute("x", "-20%");
    glowFilter.setAttribute("y", "-20%");
    glowFilter.setAttribute("width", "140%");
    glowFilter.setAttribute("height", "140%");

    const feGaussianBlur = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "feGaussianBlur"
    );
    feGaussianBlur.setAttribute("stdDeviation", "20");
    feGaussianBlur.setAttribute("result", "blur");

    const feComposite = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "feComposite"
    );
    feComposite.setAttribute("in", "SourceGraphic");
    feComposite.setAttribute("in2", "blur");
    feComposite.setAttribute("operator", "over");

    glowFilter.appendChild(feGaussianBlur);
    glowFilter.appendChild(feComposite);

    defs.appendChild(mainGradient);
    defs.appendChild(branchGradient);
    defs.appendChild(mainGradientLeft);
    defs.appendChild(branchGradientLeft);

    defs.appendChild(glowFilter);

    this.svg.appendChild(defs);

    // Apply the filter to all paths when they appear
    setTimeout(() => {
      this.paths.forEach((path) => {
        path.style.filter = "url(#glow)";
      });
    }, 100);
  }

  regeneratePaths() {
    if (!this.svg) return;

    this.hidePaths();

    this.intersectionMarkers.forEach((marker) => {
      if (marker && marker.parentNode) {
        marker.parentNode.removeChild(marker);
      }
    });
    this.intersectionMarkers = [];

    setTimeout(() => {
      this.svg.innerHTML = "";
      this.pendingRegeneration.clear();

      this.createGradientDefs();

      this.rightPathTree.turnTypesAtCoordinates = {};
      this.rightPathTree.curveRadiusAtCoordinates = {};
      this.rightPathTree.turnDebugInfo = [];
      this.leftPathTree.turnTypesAtCoordinates = {};
      this.leftPathTree.curveRadiusAtCoordinates = {};
      this.leftPathTree.turnDebugInfo = [];

      this.rightPathTree.forcedInitialDirections =
        this.rightPathTree.getRandomizedDirections();
      const rightPathData = this.rightPathTree.generatePaths();

      this.leftPathTree.forcedInitialDirections =
        this.leftPathTree.getRandomizedDirections();
      const leftPathData = this.leftPathTree.generatePaths();

      if (this.rightPathTree.debugMode) {
        const rightConsistency = this.rightPathTree.validateTurnConsistency();
        const leftConsistency = this.leftPathTree.validateTurnConsistency();

        console.log(
          "Right path tree turn consistency (regenerated):",
          rightConsistency
        );
        console.log(
          "Left path tree turn consistency (regenerated):",
          leftConsistency
        );
      }

      rightPathData.forEach((d, index) => {
        const path = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path"
        );
        path.setAttribute("class", "wind-path right-path");
        path.classList.add(`right-path-${index}`);
        path.setAttribute("d", d);

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

      leftPathData.forEach((d, index) => {
        const path = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path"
        );
        path.setAttribute("class", "wind-path left-path");
        path.classList.add(`left-path-${index}`);
        path.setAttribute("d", d);

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

      this.rightPaths = Array.from(this.svg.querySelectorAll(".right-path"));
      this.leftPaths = Array.from(this.svg.querySelectorAll(".left-path"));
      this.paths = [...this.rightPaths, ...this.leftPaths];

      this.paths.forEach((path) => {
        const length = path.getTotalLength();
        path.setAttribute("data-length", length);
        path.setAttribute("data-progress", "0");
        path.setAttribute("data-phase", "appearing");

        path.style.opacity = "0";
        path.style.strokeWidth = "0";
        path.setAttribute("stroke-width", "0");
        path.style.transition = "none";

        const visibleLength = length * 0.15;
        path.style.strokeDasharray = `${visibleLength}, ${length}`;
        path.style.strokeDashoffset = 0;
        path.style.setProperty("--path-length", length);
      });

      setTimeout(() => this.createIntersectionMarkers(), 500);

      setTimeout(() => {
        this.paths.forEach((path) => {
          path.style.opacity = "0.7";
          path.style.strokeWidth = "2.5";
          path.style.transition = "opacity 0.3s ease, stroke-width 0.3s ease";
          path.classList.add("visible");
        });
      }, 100);
    }, 100);
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
    this.intersectionMarkers.forEach((marker) => {
      if (marker && marker.parentNode) {
        marker.parentNode.removeChild(marker);
      }
    });
    this.intersectionMarkers = [];

    const rightIntersections = this.rightPathTree.findIntersections();
    const leftIntersections = this.leftPathTree.findIntersections();

    const filteredRightIntersections =
      this.filterIntersections(rightIntersections);
    const filteredLeftIntersections =
      this.filterIntersections(leftIntersections);

    filteredRightIntersections.sort((a, b) => a.x - b.x);

    filteredLeftIntersections.sort((a, b) => b.x - a.x);

    let selectedRightIntersections = filteredRightIntersections
      .filter(() => Math.random() < 0.5)
      .slice(0, 6);

    let selectedLeftIntersections = filteredLeftIntersections
      .filter(() => Math.random() < 0.5)
      .slice(0, 6);

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

    this.createMarkersForIntersections(selectedRightIntersections, "right");

    this.createMarkersForIntersections(selectedLeftIntersections, "left");
  }

  filterIntersections(intersections) {
    const filteredIntersections = [];
    const minimumDistance = 20;

    for (const point of intersections) {
      let tooClose = false;

      for (const existingPoint of filteredIntersections) {
        const dx = point.x - existingPoint.x;
        const dy = point.y - existingPoint.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < minimumDistance) {
          tooClose = true;
          break;
        }
      }

      if (!tooClose) {
        filteredIntersections.push(point);
      }
    }

    return filteredIntersections;
  }

  createMarkersForIntersections(intersections, direction) {
    if (intersections.length === 0) return;

    const xValues = intersections.map((point) => point.x);
    const minX = Math.min(...xValues);
    const maxX = Math.max(...xValues);
    const xRange = maxX - minX || 1;

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
      marker.setAttribute("data-index", index.toString());

      marker.style.opacity = "0";

      this.svg.appendChild(marker);
      this.intersectionMarkers.push(marker);

      let xPositionRatio;
      if (direction === "right") {
        xPositionRatio = (point.x - minX) / xRange;
      } else {
        xPositionRatio = (maxX - point.x) / xRange;
      }

      const baseDelay = 50;
      const maxAdditionalDelay = 1000;
      const sequentialDelay = baseDelay + xPositionRatio * maxAdditionalDelay;

      setTimeout(() => {
        if (marker && marker.parentNode) {
          marker.style.opacity = "1";
        }
      }, sequentialDelay);
    });
  }

  fadeOutIntersectionMarkers(pathDisappearProgress) {
    if (pathDisappearProgress <= 0) return;

    if (pathDisappearProgress > 0) {
      const rightMarkers = this.intersectionMarkers.filter(
        (marker) => marker.getAttribute("data-direction") === "right"
      );

      const leftMarkers = this.intersectionMarkers.filter(
        (marker) => marker.getAttribute("data-direction") === "left"
      );

      const sortedRightMarkers = [...rightMarkers].sort((a, b) => {
        const indexA = parseInt(a.getAttribute("data-index") || "0");
        const indexB = parseInt(b.getAttribute("data-index") || "0");
        return indexA - indexB;
      });

      const sortedLeftMarkers = [...leftMarkers].sort((a, b) => {
        const indexA = parseInt(a.getAttribute("data-index") || "0");
        const indexB = parseInt(b.getAttribute("data-index") || "0");
        return indexA - indexB;
      });

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

      this.intersectionMarkers = [];
    }
  }

  activateAnimation() {
    if (!this.active) {
      this.active = true;
      this.resetPaths();
      this.progress = 0;
      this.lastTimestamp = performance.now();

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

      path.style.opacity = "0";
      path.style.strokeWidth = "0";
      path.setAttribute("stroke-width", "0");

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

    for (const [path, timeToRegenerate] of this.pendingRegeneration.entries()) {
      if (timestamp >= timeToRegenerate) {
        this.paths.forEach((p) => {
          p.style.opacity = "0";
          p.style.strokeWidth = "0";
          p.setAttribute("stroke-width", "0");
        });

        setTimeout(() => {
          this.regeneratePaths();
        }, 50);

        this.pendingRegeneration.clear();
        break;
      }
    }

    const animationSpeed = 0.4;
    let allPathsVisible = true;

    let anyPathDisappearing = false;
    let maxDisappearProgress = 0;

    this.paths.forEach((path) => {
      if (this.pendingRegeneration.has(path)) return;

      const pathLength = parseFloat(path.getAttribute("data-length"));
      let pathProgress = parseFloat(path.getAttribute("data-progress") || "0");
      const phase = path.getAttribute("data-phase") || "appearing";

      if (phase === "appearing") {
        pathProgress = Math.min(1, pathProgress + deltaTime * animationSpeed);
        path.setAttribute("data-progress", pathProgress.toString());

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

        anyPathDisappearing = true;
        maxDisappearProgress = Math.max(
          maxDisappearProgress,
          pathProgress - 0.1
        );

        if (pathProgress >= 0.9) {
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
      // If an animation already exists, deactivate it first
      if (window.windAnimation) {
        window.windAnimation = null;
      }

      // Create a new animation instance
      window.windAnimation = new WindAnimation();
    }, 1000);
  }
}
