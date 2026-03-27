"use client";
import { useState, useRef, useEffect } from "react";
import { useGSAP } from "../../context/GSAPContext";

const GridElementsAnimation = () => {
  const { gsap, contextReady } = useGSAP();
  const [positions, setPositions] = useState([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  const gridRefs = useRef([]);
  const pseudoRefs = useRef([]);
  const colorTimelineRef = useRef(null);
  const positionTimelineRef = useRef(null);
  const rotationTimelineRef = useRef(null);

  const elements = [
    { id: 1, rounded: "rounded-tl-[69px] rounded-br-[69px]", hasLetter: false },
    { id: 2, rounded: "rounded-lg", hasLetter: false },
    { id: 3, rounded: "rounded-tr-full", hasLetter: false },
    { id: 4, rounded: "rounded-full", hasLetter: false },
    { id: 5, rounded: "", hasLetter: true },
    { id: 6, rounded: "rounded-3xl", hasLetter: false },
    { id: 7, rounded: "rounded-bl-full", hasLetter: false },
    { id: 8, rounded: "rounded-xl", hasLetter: false },
    { id: 9, rounded: "rounded-br-full", hasLetter: false },
  ];

  const availableGradients = [
    { from: "rgb(96, 165, 250)", to: "rgb(168, 85, 247)" },
    { from: "rgb(74, 222, 128)", to: "rgb(96, 165, 250)" },
    { from: "rgb(250, 204, 21)", to: "rgb(249, 115, 22)" },
    { from: "rgb(248, 113, 113)", to: "rgb(236, 72, 153)" },
    { from: "rgb(168, 85, 247)", to: "rgb(99, 102, 241)" },
    { from: "rgb(99, 102, 241)", to: "rgb(96, 165, 250)" },
    { from: "rgb(236, 72, 153)", to: "rgb(248, 113, 113)" },
    { from: "rgb(96, 165, 250)", to: "rgb(45, 212, 191)" },
    { from: "rgb(45, 212, 191)", to: "rgb(74, 222, 128)" },
    { from: "rgb(249, 115, 22)", to: "rgb(250, 204, 21)" },
    { from: "rgb(34, 211, 238)", to: "rgb(96, 165, 250)" },
  ];

  const calculatePosition = (index) => {
    const pos = positions[index];
    const col = pos % 3;
    const row = Math.floor(pos / 3);
    return {
      col,
      row,
      left: `${col * 33.333 + 1.2}%`,
      top: `${row * 33.333 + 1.2}%`,
    };
  };

  // Initialize GSAP animations and set initial positions
  useEffect(() => {
    if (!gsap || !contextReady) return;

    // Kill existing timelines
    if (colorTimelineRef.current) colorTimelineRef.current.kill();
    if (positionTimelineRef.current) positionTimelineRef.current.kill();
    if (rotationTimelineRef.current) rotationTimelineRef.current.kill();

    // Set initial positions for all elements
    gridRefs.current.forEach((el, index) => {
      if (el) {
        const { left, top } = calculatePosition(index);
        gsap.set(el, {
          left,
          top,
          rotation: 0,
        });
      }
    });

    // Set initial pseudo element opacity for shapes only
    pseudoRefs.current.forEach((el, index) => {
      if (el && !elements[index].hasLetter) {
        gsap.set(el, { opacity: 0 });
      }
    });

    // Color change animation timeline
    const createColorTimeline = () => {
      const tl = gsap.timeline({ repeat: -1 });

      tl.add(() => {
        const randomIndex = Math.floor(Math.random() * 9);
        const randomGradient =
          availableGradients[
            Math.floor(Math.random() * availableGradients.length)
          ];

        if (gridRefs.current[randomIndex]) {
          const mainEl = gridRefs.current[randomIndex];

          // Handle letter A differently (text gradient) vs shapes (background gradient)
          if (elements[randomIndex].hasLetter) {
            // For letter A, animate the text gradient directly on both spans
            const mainSpan = mainEl.querySelector(".main-letter");
            const pseudoSpan = mainEl.querySelector(".pseudo-letter");

            if (mainSpan && pseudoSpan) {
              // Set new gradient on pseudo span and animate it in
              gsap.set(pseudoSpan, {
                backgroundImage: `linear-gradient(135deg, ${randomGradient.from}, ${randomGradient.to})`,
                webkitBackgroundClip: "text",
                backgroundClip: "text",
                webkitTextFillColor: "transparent",
                color: "transparent",
              });

              gsap
                .timeline()
                .to(pseudoSpan, {
                  opacity: 1,
                  duration: 1,
                  ease: "power2.inOut",
                })
                .call(() => {
                  // Update main span gradient while preserving background-clip
                  gsap.set(mainSpan, {
                    backgroundImage: `linear-gradient(135deg, ${randomGradient.from}, ${randomGradient.to})`,
                    webkitBackgroundClip: "text",
                    backgroundClip: "text",
                    webkitTextFillColor: "transparent",
                    color: "transparent",
                  });
                })
                .to(pseudoSpan, {
                  opacity: 0,
                  duration: 0.5,
                  ease: "power2.inOut",
                });
            }
          } else {
            // For shapes, use pseudo element for smooth background transition
            const pseudoEl = pseudoRefs.current[randomIndex];

            if (pseudoEl) {
              gsap.set(pseudoEl, {
                background: `linear-gradient(135deg, ${randomGradient.from}, ${randomGradient.to})`,
              });

              gsap
                .timeline()
                .to(pseudoEl, {
                  opacity: 1,
                  duration: 1,
                  ease: "power2.inOut",
                })
                .call(() => {
                  gsap.set(mainEl, {
                    background: `linear-gradient(135deg, ${randomGradient.from}, ${randomGradient.to})`,
                  });
                })
                .to(pseudoEl, {
                  opacity: 0,
                  duration: 0.5,
                  ease: "power2.inOut",
                });
            }
          }
        }
      }, 0).to({}, { duration: 2 });

      return tl;
    };

    // Position swap animation timeline
    const createPositionTimeline = () => {
      const tl = gsap.timeline({ repeat: -1 });

      tl.add(() => {
        const idx1 = Math.floor(Math.random() * 9);
        let idx2 = Math.floor(Math.random() * 9);
        while (idx2 === idx1) {
          idx2 = Math.floor(Math.random() * 9);
        }

        // Update positions state for React tracking
        setPositions((prev) => {
          const newPositions = [...prev];
          const temp = newPositions[idx1];
          newPositions[idx1] = newPositions[idx2];
          newPositions[idx2] = temp;
          return newPositions;
        });

        // Animate the actual position swap with GSAP
        if (gridRefs.current[idx1] && gridRefs.current[idx2]) {
          const pos1 = calculatePosition(idx1);
          const pos2 = calculatePosition(idx2);

          gsap.to(gridRefs.current[idx1], {
            left: pos2.left,
            top: pos2.top,
            duration: 1.5,
            ease: "power2.inOut",
          });

          gsap.to(gridRefs.current[idx2], {
            left: pos1.left,
            top: pos1.top,
            duration: 1.5,
            ease: "power2.inOut",
          });
        }
      }, 0).to({}, { duration: 3 });

      return tl;
    };

    // Rotation animation timeline
    const createRotationTimeline = () => {
      const tl = gsap.timeline({ repeat: -1 });

      tl.add(() => {
        const elementIndex = Math.floor(Math.random() * 9);

        // Skip rotation for the letter 'A'
        if (elements[elementIndex].hasLetter) return;

        if (gridRefs.current[elementIndex]) {
          const rotationOptions = [90, 180, 360];
          const rotationAmount =
            rotationOptions[Math.floor(Math.random() * rotationOptions.length)];

          gsap.to(gridRefs.current[elementIndex], {
            rotation: `+=${rotationAmount}`,
            duration: 1.5,
            ease: "power2.inOut",
          });
        }
      }, 0).to({}, { duration: 4 });

      return tl;
    };

    // Create and start all timelines with different delays
    colorTimelineRef.current = createColorTimeline();
    positionTimelineRef.current = createPositionTimeline();
    rotationTimelineRef.current = createRotationTimeline();

    // Stagger the start times
    colorTimelineRef.current.delay(0);
    positionTimelineRef.current.delay(1);
    rotationTimelineRef.current.delay(2);

    return () => {
      if (colorTimelineRef.current) colorTimelineRef.current.kill();
      if (positionTimelineRef.current) positionTimelineRef.current.kill();
      if (rotationTimelineRef.current) rotationTimelineRef.current.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gsap, contextReady]);

  // Update positions when state changes (for any non-GSAP initiated changes)
  useEffect(() => {
    if (!gsap || !contextReady) return;

    gridRefs.current.forEach((el, index) => {
      if (el) {
        const { left, top } = calculatePosition(index);
        // Only animate if position is significantly different (avoid redundant animations)
        const currentLeft = gsap.getProperty(el, "left");
        const currentTop = gsap.getProperty(el, "top");

        if (currentLeft !== left || currentTop !== top) {
          gsap.to(el, {
            left,
            top,
            duration: 1.5,
            ease: "power2.inOut",
          });
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gsap, contextReady, positions]);

  return (
    <div className="absolute inset-0 flex items-center justify-center p-4 overflow-visible">
      <div className="relative w-full max-w-[400px] aspect-square">
        {elements.map((element, index) => {
          const initialPos = calculatePosition(index);
          const initialGradient =
            availableGradients[index % availableGradients.length];

          if (element.hasLetter) {
            return (
              <div
                key={element.id}
                ref={(el) => (gridRefs.current[index] = el)}
                className="absolute flex items-center justify-center"
                style={{
                  width: "calc(33.333% - 8px)",
                  height: "calc(33.333% - 8px)",
                  left: initialPos.left,
                  top: initialPos.top,
                  position: "absolute",
                }}
              >
                <span
                  className="main-letter text-7xl md:text-9xl font-bold relative"
                  style={{
                    background: `linear-gradient(135deg, ${initialGradient.from}, ${initialGradient.to})`,
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    color: "transparent",
                    zIndex: 1,
                  }}
                >
                  A
                  <span
                    className="pseudo-letter absolute inset-0 text-7xl md:text-9xl font-bold"
                    style={{
                      background: `linear-gradient(135deg, ${initialGradient.from}, ${initialGradient.to})`,
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      color: "transparent",
                      opacity: 0,
                      zIndex: 2,
                    }}
                  >
                    A
                  </span>
                </span>
              </div>
            );
          }

          return (
            <div
              key={element.id}
              ref={(el) => (gridRefs.current[index] = el)}
              className={`absolute ${element.rounded} flex items-center justify-center overflow-hidden`}
              style={{
                width: "calc(33.333% - 8px)",
                height: "calc(33.333% - 8px)",
                left: initialPos.left,
                top: initialPos.top,
                position: "absolute",
                background: `linear-gradient(135deg, ${initialGradient.from}, ${initialGradient.to})`,
                zIndex: 1,
              }}
            >
              <div
                ref={(el) => (pseudoRefs.current[index] = el)}
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(135deg, ${initialGradient.from}, ${initialGradient.to})`,
                  opacity: 0,
                  zIndex: 0,
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GridElementsAnimation;
