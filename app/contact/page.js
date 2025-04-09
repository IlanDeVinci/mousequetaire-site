"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";

// Move images array outside component to prevent recreation on each render
const instagramSliderImages = [
  "/images/instagram-icon.svg",
  "/images/linkedin.svg",
  "/images/facebook-icon.svg",
];

// Simplified Instagram Slider Component
const InstagramSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [slidesArray, setSlidesArray] = useState([]);
  const originalImages = instagramSliderImages;
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  // Ref to track if we're currently updating slides to avoid infinite loop
  const isUpdating = useRef(false);

  // Function to ensure we have enough slides ahead
  const ensureSufficientSlides = useCallback(
    (targetIndex) => {
      // Don't run if already updating
      if (isUpdating.current) return;

      isUpdating.current = true;

      setSlidesArray((prevSlides) => {
        try {
          // Always maintain 2 full sets of slides ahead of current position
          const remainingSlides = prevSlides.length - targetIndex - 1;

          console.log(
            `Checking slides: ${prevSlides.length} total, ${remainingSlides} ahead of position ${targetIndex}`
          );

          // If we don't have enough slides ahead, add more
          if (remainingSlides < originalImages.length * 2) {
            // FIXED: Create unique timestamps for each set to prevent duplicate keys
            const timestamp1 = Date.now();
            const timestamp2 = timestamp1 + 1;

            // Add two complete sets to ensure we have plenty of slides ahead
            const newSlides = [
              ...originalImages.map((src, idx) => ({
                id: `slide-${timestamp1}-${idx}`,
                src,
                originalIndex: idx,
              })),
              ...originalImages.map((src, idx) => ({
                id: `slide-${timestamp2}-${idx}`,
                src,
                originalIndex: idx,
              })),
            ];

            // FIXED: Don't slice existing slides if it would result in too few slides
            // Keep everything from beginning to current position plus a small buffer
            const keepCount = targetIndex + 1; // Keep at least up to current position

            // Combine without removing any slides that are still needed
            const result = [...prevSlides, ...newSlides];

            console.log(
              `Added ${newSlides.length} new slides. New total: ${
                result.length
              }, ${
                result.length - targetIndex - 1
              } ahead of position ${targetIndex}`
            );

            return result;
          }
          return prevSlides;
        } finally {
          // Always reset the updating flag
          setTimeout(() => {
            isUpdating.current = false;
          }, 0);
        }
      });
    },
    [originalImages]
  );

  // Add a debounced version of the slide management to avoid too many updates
  const debouncedEnsureSlides = useCallback(
    (targetIndex) => {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set a new timeout
      timeoutRef.current = setTimeout(() => {
        ensureSufficientSlides(targetIndex);
      }, 100);
    },
    [ensureSufficientSlides]
  );

  // Modified advanceSlide to use the debounced version
  const advanceSlide = useCallback(
    (forward = true) => {
      // Calculate the next index first
      const nextIndex = currentIndex + 1;

      // Ensure we have enough slides BEFORE setting transition state or changing index
      // Use the debounced version to avoid too many updates
      debouncedEnsureSlides(nextIndex);

      // Now start the transition
      setIsTransitioning(true);

      setCurrentIndex(nextIndex);

      // After transition completes
      timeoutRef.current = setTimeout(() => {
        setIsTransitioning(false);
      }, 500);
    },
    [currentIndex, debouncedEnsureSlides]
  );

  // Initialize with more slides at the start
  useEffect(() => {
    // Create initial slide set with FOUR copies of each image for a good buffer
    const initialSlides = [
      ...originalImages,
      ...originalImages,
      ...originalImages,
      ...originalImages,
    ].map((src, index) => ({
      id: `slide-init-${index}`,
      src: src,
      originalIndex: index % originalImages.length,
    }));

    setSlidesArray(initialSlides);
    console.log(`Initialized with ${initialSlides.length} slides`);
  }, []);

  // Replace the safety check effect with a more conservative approach
  useEffect(() => {
    // Only check if we're not transitioning to avoid conflicts
    if (!isTransitioning) {
      const remainingSlides = slidesArray.length - currentIndex - 1;
      if (remainingSlides < originalImages.length * 2) {
        // Use timeout to avoid render loop
        const timer = setTimeout(() => {
          setSlidesArray((prev) => {
            // Add one full set of slides
            const timestamp = Date.now();
            const newSlides = originalImages.map((src, idx) => ({
              id: `slide-${timestamp}-${idx}`,
              src,
              originalIndex: idx,
            }));

            return [...prev, ...newSlides];
          });
        }, 100);

        return () => clearTimeout(timer);
      }
    }
  }, [
    currentIndex,
    slidesArray.length,
    originalImages.length,
    isTransitioning,
  ]);
  // Modified returnToInstagram to ensure we have enough slides before jumping
  const returnToInstagram = useCallback(() => {
    // Find how many slides until the next Instagram logo
    const currentPosition = currentIndex % originalImages.length;

    console.log(
      `Return to Instagram: Current position in cycle: ${currentPosition}, Total slides: ${slidesArray.length}`
    );

    // If not already on Instagram logo, advance to the next one
    if (currentPosition !== 0) {
      // Calculate steps needed to reach next Instagram logo by moving forward
      const stepsToNextLogo = originalImages.length - currentPosition;
      console.log(`Steps to next Instagram logo: ${stepsToNextLogo}`);

      // Calculate the target position
      const nextInstagramPosition = currentIndex + stepsToNextLogo;
      console.log(`Planning jump to position: ${nextInstagramPosition}`);

      // FIRST ensure we have enough slides for this jump
      ensureSufficientSlides(nextInstagramPosition);

      // Now start the transition
      setIsTransitioning(true);
      console.log(`Jumping to position: ${nextInstagramPosition}`);
      setCurrentIndex(nextInstagramPosition);

      // After transition completes
      timeoutRef.current = setTimeout(() => {
        setIsTransitioning(false);
      }, 500);
    }
  }, [
    currentIndex,
    originalImages.length,
    slidesArray.length,
    ensureSufficientSlides,
  ]);

  useEffect(() => {
    // Handle hover state changes
    if (isHovered) {
      // Start rotating through slides when hovered
      intervalRef.current = setInterval(() => {
        advanceSlide();
      }, 1500);
    } else {
      // When hover ends, return to Instagram logo by advancing forward
      clearTimeouts();
      returnToInstagram();
    }

    return () => {
      clearTimeouts();
    };
  }, [isHovered, advanceSlide, returnToInstagram]);

  // Clear any timeouts to prevent memory leaks
  const clearTimeouts = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  return (
    <div
      className="w-full h-full flex items-center justify-center cursor-pointer overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="w-full h-full relative">
        {slidesArray.map((slide, index) => {
          // Calculate visual position relative to current index
          const position = index - currentIndex;

          // Render more slides to ensure smooth transitions
          // Keep more slides in the DOM to prevent empty spaces
          const isVisible = position >= -2 && position <= 2;

          return (
            <div
              key={slide.id}
              className="absolute inset-0 flex items-center justify-center w-full h-full"
              style={{
                opacity: 1,
                transform: `translateX(${position * 100}%)`,
                transition: isTransitioning
                  ? "transform 500ms cubic-bezier(0.4, 0.0, 0.2, 1)"
                  : "none",
                visibility: isVisible ? "visible" : "hidden",
                zIndex: position === 0 ? 2 : 1,
              }}
            >
              <Image
                src={slide.src}
                alt={`Social media icon ${slide.originalIndex + 1}`}
                width={120}
                height={120}
                style={{ width: "70%", height: "auto" }}
                priority={slide.originalIndex === 0}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

// New component for animated form icon SVG
const FormIconSVG = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [pathProgress, setPathProgress] = useState(0);
  const lastProgressRef = useRef(0);
  const animationDirectionRef = useRef(null);
  const startProgressRef = useRef(0);

  useEffect(() => {
    let animationFrame;
    let startTime;

    // Update the animation direction based on hover state
    if (isHovered && animationDirectionRef.current !== "forward") {
      animationDirectionRef.current = "forward";
      startTime = null; // Reset start time for new animation direction
      startProgressRef.current = pathProgress; // Save starting point
    } else if (!isHovered && animationDirectionRef.current !== "backward") {
      animationDirectionRef.current = "backward";
      startTime = null; // Reset start time for new animation direction
      startProgressRef.current = pathProgress; // Save starting point
    }

    const animatePath = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const duration = 600; // Animation duration in ms

      let progress;

      if (isHovered) {
        // Forward animation - linear progression from start to 1
        // Calculate how much progress we need to make (from current to 1)
        const remainingDistance = 1 - startProgressRef.current;
        // Apply that progress proportionally
        const progressFraction = Math.min(elapsed / duration, 1);
        progress =
          startProgressRef.current + remainingDistance * progressFraction;
      } else {
        // Backward animation - linear regression from start to 0
        // The total distance to travel is the current progress value
        const progressFraction = Math.min(elapsed / duration, 1);
        // Apply regression proportionally
        progress = startProgressRef.current * (1 - progressFraction);
      }

      setPathProgress(progress);

      // Continue animation if we're not at the target state
      if ((isHovered && progress < 1) || (!isHovered && progress > 0)) {
        animationFrame = requestAnimationFrame(animatePath);
      }
    };

    // Start the animation immediately
    animationFrame = requestAnimationFrame(animatePath);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isHovered]); // Remove the pathProgress dependency to prevent re-triggering

  // SVG constants
  const circleRadius = 8;
  const strokeWidth = 4;
  const grayColor = "#1D1D1B";
  const whiteColor = "#FFFFFF";

  // Circle properties for animation with staggered delays
  const circleCircumference = 2 * Math.PI * circleRadius;

  // Calculate animation timing with consistent speed
  const getElementAnimation = (delay) => {
    // Base animation duration as a fraction of total progress (0-1)
    const animationDuration = 0.4; // 40% of the total animation time

    // Start time based on delay (when this element should start animating)
    const startTime = delay;

    // End time (when animation completes)
    const endTime = startTime + animationDuration;

    // Current position within the animation timeline
    let progress = 0;

    if (pathProgress < startTime) {
      // Before animation starts
      progress = 0;
    } else if (pathProgress > endTime) {
      // After animation completes
      progress = 1;
    } else {
      // During animation - normalize to 0-1 range for this segment
      progress = (pathProgress - startTime) / animationDuration;
    }

    return progress;
  };

  const getCircleDash = (index) => {
    // Start times for circles (staggered)
    const delay = index * 0.15;
    const progress = getElementAnimation(delay);
    return progress * circleCircumference;
  };

  const getLineDash = (index) => {
    // Start lines after circles with staggered timing
    const delay = (index + 1.5) * 0.15;
    const progress = getElementAnimation(delay);
    // Return dashoffset (55 when not animated, 0 when fully animated)
    return 55 * (1 - progress);
  };

  return (
    <div
      className="w-full h-full flex items-center justify-center cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <svg viewBox="0 0 100 100" className="w-[70%] h-[70%]">
        {/* Base gray elements */}
        <circle
          cx="15"
          cy="20"
          r={circleRadius}
          fill="none"
          stroke={grayColor}
          strokeWidth={strokeWidth}
        />
        <circle
          cx="15"
          cy="50"
          r={circleRadius}
          fill="none"
          stroke={grayColor}
          strokeWidth={strokeWidth}
        />
        <circle
          cx="15"
          cy="80"
          r={circleRadius}
          fill="none"
          stroke={grayColor}
          strokeWidth={strokeWidth}
        />
        <line
          x1="35"
          y1="20"
          x2="90"
          y2="20"
          stroke={grayColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        <line
          x1="35"
          y1="50"
          x2="90"
          y2="50"
          stroke={grayColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        <line
          x1="35"
          y1="80"
          x2="90"
          y2="80"
          stroke={grayColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* White animated elements */}
        <circle
          cx="15"
          cy="20"
          r={circleRadius}
          fill="none"
          stroke={whiteColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circleCircumference}
          strokeDashoffset={circleCircumference - getCircleDash(0)}
        />
        <circle
          cx="15"
          cy="50"
          r={circleRadius}
          fill="none"
          stroke={whiteColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circleCircumference}
          strokeDashoffset={circleCircumference - getCircleDash(1)}
        />
        <circle
          cx="15"
          cy="80"
          r={circleRadius}
          fill="none"
          stroke={whiteColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circleCircumference}
          strokeDashoffset={circleCircumference - getCircleDash(2)}
        />
        <line
          x1="35"
          y1="20"
          x2="90"
          y2="20"
          stroke={whiteColor}
          strokeWidth={strokeWidth}
          strokeDasharray="55"
          strokeDashoffset={getLineDash(0)}
          strokeLinecap="round"
        />
        <line
          x1="35"
          y1="50"
          x2="90"
          y2="50"
          stroke={whiteColor}
          strokeWidth={strokeWidth}
          strokeDasharray="55"
          strokeDashoffset={getLineDash(1)}
          strokeLinecap="round"
        />
        <line
          x1="35"
          y1="80"
          x2="90"
          y2="80"
          stroke={whiteColor}
          strokeWidth={strokeWidth}
          strokeDasharray="55"
          strokeDashoffset={getLineDash(2)}
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

const contactOptions = [
  {
    title: "Instagram",
    description: "Appelez-nous directement",
    content: (
      <div className="flex flex-col items-center gap-6">
        <h3 className="text-2xl md:text-3xl font-bold mb-4">
          Contact Téléphonique
        </h3>
        <p className="text-base md:text-lg mb-6">
          Disponible du lundi au vendredi, de 9h à 18h
        </p>
        <a
          href="tel:+33123456789"
          className="text-xl md:text-2xl hover:text-[#7DD4FF]"
        >
          +33 1 23 45 67 89
        </a>
      </div>
    ),
    bgColor: "#002132",
    customIcon: <InstagramSlider />,
    hoverEffect: "hover:animate-pulse",
  },
  {
    title: "Email",
    description: "Contactez-nous par email",
    content: (
      <div className="flex flex-col items-center gap-6">
        <h3 className="text-2xl md:text-3xl font-bold mb-4">
          Contact par Email
        </h3>
        <p className="text-base md:text-lg mb-6">
          Envoyez-nous un message et nous vous répondrons dans les plus brefs
          délais
        </p>
        <form className="w-full max-w-md flex flex-col gap-4">
          <input
            type="email"
            placeholder="Votre email"
            className="w-full p-3 rounded bg-white/10 text-white border border-white/20"
          />
          <textarea
            placeholder="Votre message"
            rows={5}
            className="w-full p-3 rounded bg-white/10 text-white border border-white/20"
          />
          <button className="bg-[#7DD4FF] text-[#002132] font-bold py-3 px-6 rounded">
            Envoyer
          </button>
        </form>
      </div>
    ),
    bgColor: "#70C7F2",
    customIcon: <FormIconSVG />,
  },
];

export default function Contact() {
  const [activeModal, setActiveModal] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [circlePosition, setCirclePosition] = useState(null);

  const handleCircleClick = useCallback(
    (e, index) => {
      if (isAnimating) return;
      setIsAnimating(true);
      document.body.style.overflow = "hidden";

      const rect = e.currentTarget.getBoundingClientRect();
      const windowCenter = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      };

      setCirclePosition({
        index,
        rect,
        transform: {
          translateX: windowCenter.x - (rect.left + rect.width / 2),
          translateY: windowCenter.y - (rect.top + rect.height / 2),
          scale:
            Math.max(
              window.innerWidth / rect.width,
              window.innerHeight / rect.height
            ) * 1.1,
        },
      });

      setActiveModal(index);
      requestAnimationFrame(() => {
        setIsExpanded(true);
        setTimeout(() => setIsAnimating(false), 500);
      });
    },
    [isAnimating]
  );

  const closeModal = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIsExpanded(false);

    setTimeout(() => {
      setActiveModal(null);
      setCirclePosition(null);
      setIsAnimating(false);
      document.body.style.overflow = "auto";
    }, 300);
  }, [isAnimating]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && !isAnimating && activeModal !== null) {
        closeModal();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isAnimating, activeModal, closeModal]);

  return (
    <>
      <main className="pt-24 pb-16 bg-[#050610] min-h-screen">
        <div className="container mx-auto px-4">
          <p className="text-white text-center max-w-[400px] mx-auto font-montserrat font-semibold mb-8 md:mb-16 text-xl md:text-3xl px-4">
            Contactez-nous via ces différents médias :
          </p>

          {/* Mobile view - stack circles vertically */}
          <div className="md:hidden flex flex-col items-center gap-8 mb-16">
            {contactOptions.map((option, index) => (
              <div
                key={index}
                className="w-[250px] h-[250px] relative transition-all duration-700"
                style={{
                  opacity:
                    activeModal !== null && activeModal !== index ? 0 : 1,
                  transitionDuration:
                    activeModal !== null && activeModal !== index
                      ? "300ms"
                      : "700ms",
                }}
              >
                <div
                  onClick={(e) => !activeModal && handleCircleClick(e, index)}
                  className={`w-full h-full rounded-full flex items-center justify-center overflow-hidden
                  ${
                    !activeModal
                      ? "cursor-pointer hover:shadow-2xl hover:shadow-[#7DD4FF]/20"
                      : ""
                  } 
                  transition-all duration-500 ease-in-out ${
                    option.hoverEffect || ""
                  }`}
                  style={{
                    backgroundColor: option.bgColor,
                    transform:
                      activeModal === index && isExpanded
                        ? `translate(${circlePosition?.transform.translateX}px, ${circlePosition?.transform.translateY}px) scale(${circlePosition?.transform.scale})`
                        : "none",
                    animation: !activeModal
                      ? `float 3s ease-in-out infinite ${index * 0.5}s`
                      : "none",
                  }}
                >
                  {/* Circle Content */}
                  <div
                    className={`flex items-center justify-center w-full h-full transition-opacity duration-700
                    ${!isExpanded ? "opacity-100" : "opacity-0"}`}
                  >
                    {option.customIcon}
                  </div>
                  {!activeModal && (
                    <div className="absolute inset-0 rounded-full bg-white/5 hover:bg-transparent transition-all duration-300 hover:opacity-20 pointer-events-none" />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Desktop view - horizontal layout */}
          <div className="hidden md:flex justify-center mb-24 relative h-72">
            <div className="w-full max-w-[800px] relative flex justify-center">
              {contactOptions.map((option, index) => (
                <div
                  key={index}
                  className="transition-all duration-700 absolute top-0"
                  style={{
                    width: "288px",
                    left: `${index * 500}px`,
                    opacity:
                      activeModal !== null && activeModal !== index ? 0 : 1,
                    transitionDuration:
                      activeModal !== null && activeModal !== index
                        ? "300ms"
                        : "700ms",
                  }}
                >
                  <div
                    onClick={(e) => !activeModal && handleCircleClick(e, index)}
                    className={`w-72 h-72 rounded-full flex items-center justify-center overflow-hidden
                      ${
                        !activeModal
                          ? "cursor-pointer hover:shadow-2xl hover:shadow-[#7DD4FF]/30"
                          : ""
                      } 
                      transition-all duration-500 ease-in-out ${
                        option.hoverEffect || ""
                      }`}
                    style={{
                      backgroundColor: option.bgColor,
                      transform:
                        activeModal === index && isExpanded
                          ? `translate(${circlePosition?.transform.translateX}px, ${circlePosition?.transform.translateY}px) scale(${circlePosition?.transform.scale})`
                          : "none",
                      animation: !activeModal
                        ? `float 3s ease-in-out infinite ${index * 0.5}s`
                        : "none",
                    }}
                  >
                    {/* Circle Content */}
                    <div
                      className={`flex items-center justify-center w-full h-full transition-opacity duration-700
                      ${!isExpanded ? "opacity-100" : "opacity-0"}`}
                    >
                      {option.customIcon}
                    </div>
                    {!activeModal && (
                      <div className="absolute inset-0 rounded-full bg-white/5 hover:bg-transparent transition-all duration-300 hover:opacity-20 pointer-events-none" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Modal Overlay - responsive for all screens */}
          {activeModal !== null && (
            <div className="h-[100vh] w-full overflow-hidden fixed inset-0 z-[1000]">
              <div
                className={`fixed inset-0 z-[1001] flex items-center justify-center pointer-events-none overflow-hidden
                  transition-opacity duration-300 px-4
                  ${isExpanded && !isAnimating ? "opacity-100" : "opacity-0"}`}
              >
                <div
                  className={`relative w-full max-w-4xl pointer-events-auto
                    transition-all duration-300 ${
                      isExpanded ? "scale-100" : "scale-95"
                    }
                    bg-[#070b18]/95 rounded-2xl p-4 sm:p-6 md:p-8 m-0 sm:m-4 md:m-6
                    fixed sm:relative inset-0 sm:inset-auto h-full sm:h-auto
                    flex items-center justify-center`}
                >
                  <div className="text-white w-full flex items-center justify-center">
                    {contactOptions[activeModal].content}
                  </div>
                  <button
                    onClick={!isAnimating ? closeModal : undefined}
                    className="absolute top-4 right-4 sm:-top-2 sm:-right-2 text-white text-xl hover:text-[#7DD4FF] transition-colors p-2 sm:p-4 hover:bg-black/10 rounded-full z-[1002]"
                    aria-label="Close modal"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
