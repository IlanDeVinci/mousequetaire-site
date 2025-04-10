"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { useModal } from "@/context/ModalContext";
// Import Swiper components and required modules
import { Swiper, SwiperSlide } from "swiper/react";
import {
  EffectCoverflow,
  Navigation,
  Pagination,
  A11y,
  Autoplay,
} from "swiper/modules";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";

// Move images array outside component to prevent recreation on each render
const instagramSliderImages = [
  "/images/instagram-icon.svg",
  "/images/linkedin.svg",
  "/images/facebook-icon.svg",
];

// Modified InstagramSlider component to include default loading state
const InstagramSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [slidesArray, setSlidesArray] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const originalImages = instagramSliderImages;
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  // Ref to track if we're currently updating slides to avoid infinite loop
  const isUpdating = useRef(false);

  useEffect(() => {
    const loadImage = async () => {
      try {
        await Promise.all(
          instagramSliderImages.map((src) => {
            return new Promise((resolve, reject) => {
              const img = window.Image
                ? new window.Image()
                : document.createElement("img");
              img.src = src;
              img.onload = resolve;
              img.onerror = reject;
            });
          })
        );
      } finally {
        setIsLoading(false);
      }
    };
    loadImage();
  }, []);

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
      setTimeout(() => {
        setIsTransitioning(false);
        console.log(`Transition complete, current index: ${nextIndex}`);
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
    // Wait until transitions are complete before proceeding
    if (isTransitioning) {
      const checkTransition = setInterval(() => {
        console.log(`Checking transition state: ${isTransitioning}`);
        if (!isTransitioning) {
          clearInterval(checkTransition);
          // Find how many slides until the next Instagram logo
          console.log(`Transition complete, returning to Instagram logo`);
          returnToInstagram();
        }
      }, 100);
      return;
    }

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
      }, 300);
    }
  }, [
    currentIndex,
    originalImages.length,
    slidesArray.length,
    ensureSufficientSlides,
    isTransitioning,
  ]);

  useEffect(() => {
    // Handle hover state changes
    if (isHovered) {
      // Start rotating through slides when hovered
      intervalRef.current = setInterval(() => {
        advanceSlide();
      }, 1000);
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

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Image
          src="/images/instagram-icon.svg"
          alt="Loading..."
          width={120}
          height={120}
          style={{ width: "70%", height: "auto", opacity: 0.5 }}
        />
      </div>
    );
  }

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

// New SocialMediaLink component with centered-to-justified hover effect and bigger hitbox
const SocialMediaLink = ({ icon, colorIcon, handle, href }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex items-center justify-center w-56 h-16 transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Invisible enlarged hitbox */}
      <div className="absolute inset-0 w-full h-full -m-4 cursor-pointer" />

      <div
        className={`relative flex items-center justify-center transition-all duration-300 ${
          isHovered ? "w-32 h-16 -translate-x-24" : "w-32 h-16"
        }`}
      >
        {/* Base icon */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
            isHovered ? "opacity-0" : "opacity-100"
          }`}
        >
          <Image
            src={icon}
            alt={handle}
            width={90}
            height={90}
            className="opacity-100"
          />
        </div>
        {/* Colored icon */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={colorIcon}
            alt={handle}
            width={90}
            height={90}
            className="opacity-100"
          />
        </div>
      </div>
      {/* Handle text */}
      <span
        className={`text-lg font-medium transition-all duration-300 absolute
          ${isHovered ? "opacity-100 translate-x-8" : "opacity-0 translate-y-0"}
        `}
      >
        {handle}
      </span>
    </a>
  );
};

// Updated ContactInfoLink component with centered-to-justified hover effect
const ContactInfoLink = ({ icon, label, value, href }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      href={href}
      className="group relative flex items-center justify-center w-56 h-16 transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`relative flex items-center justify-center transition-all duration-300 ${
          isHovered ? "w-16 h-16 -translate-x-28" : "w-16 h-16"
        }`}
      >
        <Image
          src={icon}
          alt={label}
          width={70}
          height={70}
          className="opacity-100"
        />
      </div>
      <div
        className={`absolute transition-all duration-300 text-center ${
          isHovered ? "opacity-100 translate-x-12" : "opacity-0"
        }`}
      >
        <p className="text-sm text-gray-300">{label}</p>
        <span
          className={`block text-lg ${
            isHovered ? "text-[#7DD4FF]" : "text-white"
          }`}
        >
          {value}
        </span>
      </div>
    </a>
  );
};

// Sample images for the Instagram modal slider
const sampleImages = [
  {
    src: "/images/project1.jpg",
    alt: "Sample image 1",
    type: "instagram",
  },
  {
    src: "/images/project2.jpg",
    alt: "Sample image 2",
    type: "linkedin",
  },
  {
    src: "/images/project3.jpg",
    alt: "Sample image 3",
    type: "instagram",
  },
  {
    src: "/images/project4.jpg",
    alt: "Sample image 4",
    type: "linkedin",
  },
];

// New component for background animation in the Email modal
const BackgroundAnimation = () => {
  const [animatedImages, setAnimatedImages] = useState([]);
  const backgroundImgs = [
    "/images/nuage1.svg",
    "/images/nuage2.svg",
    "/images/nuage3.svg",
    "/images/nuage4.svg",
  ];

  // Define cleanupCompletedAnimations BEFORE it's used in useEffect
  const cleanupCompletedAnimations = useCallback(() => {
    setAnimatedImages((prev) => {
      const now = Date.now();
      return prev.filter((img) => {
        // For other images, check if their duration has passed
        const animationEndTime = img.createdAt + img.duration * 1000 - 1000; // 1 second buffer
        // Remove images whose duration has elapsed
        return now < animationEndTime;
      });
    });
  }, []);

  useEffect(() => {
    // Create initial set of animated images with proper positioning
    const initialImages = [
      {
        id: "initial-1",
        src: backgroundImgs[0],
        size: Math.floor(Math.random() * 120) + 400,
        y: 20,
        delay: 0,
        duration: Math.floor(Math.random() * 10) + 8,
        opacity: Math.random() * 0.2 + 0.7,
        initialPosition: 20, // Start from left side
        createdAt: Date.now(), // Add creation timestamp for tracking lifecycle
      },
      {
        id: "initial-2",
        src: backgroundImgs[1],
        size: Math.floor(Math.random() * 120) + 400,
        y: 50,
        delay: 0,
        duration: Math.floor(Math.random() * 10) + 8,
        opacity: Math.random() * 0.2 + 0.7,
        initialPosition: 40, // Position at 20% of screen width
        createdAt: Date.now(), // Add creation timestamp for tracking lifecycle
      },
      {
        id: "initial-3",
        src: backgroundImgs[2],
        size: Math.floor(Math.random() * 120) + 400,
        y: 75,
        delay: 0,
        duration: Math.floor(Math.random() * 10) + 8,
        opacity: Math.random() * 0.2 + 0.7,
        initialPosition: 60, // Position at 40% of screen width
        createdAt: Date.now(), // Add creation timestamp for tracking lifecycle
      },
      {
        id: "initial-4",
        src: backgroundImgs[3],
        size: Math.floor(Math.random() * 120) + 400,
        y: 30,
        delay: 0,
        duration: Math.floor(Math.random() * 10) + 8,
        opacity: Math.random() * 0.2 + 0.7,
        initialPosition: 80, // Position at 60% of screen width
        createdAt: Date.now(), // Add creation timestamp for tracking lifecycle
      },
    ];
    setAnimatedImages(initialImages);

    // Create image generation function
    const createImage = () => {
      const randomImg =
        backgroundImgs[Math.floor(Math.random() * backgroundImgs.length)];
      const randomSize = Math.floor(Math.random() * 120) + 400; // Bigger: 80-200px
      const randomY = Math.floor(Math.random() * 80) + 10; // 10-90% vertical position
      const randomDuration = Math.floor(Math.random() * 10) + 8; // Faster: 8-18s
      const opacity = Math.random() * 0.2 + 0.7; // Slightly more opacity

      return {
        id: Date.now() + Math.random(),
        src: randomImg,
        size: randomSize,
        y: randomY,
        delay: 0, // No delay for new images
        duration: randomDuration,
        initialPosition: null, // Will start from right edge (100%)
        opacity,
        createdAt: Date.now(), // Add creation timestamp for tracking lifecycle
      };
    };

    // Set up interval for generating new images
    const interval = setInterval(() => {
      setAnimatedImages((prev) => {
        // Always add a new image
        return [...prev, createImage()];
      });
    }, 2500);

    // Set up cleanup interval (run every second)
    const cleanupInterval = setInterval(cleanupCompletedAnimations, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(cleanupInterval);
    };
  }, [cleanupCompletedAnimations]); // Add cleanupCompletedAnimations to dependencies

  return (
    <div className="absolute inset-0 overflow-hidden z-0 opacity-80">
      {animatedImages.map((img) => (
        <div
          key={img.id}
          className="absolute"
          style={{
            top: `${img.y}%`,
            animation: `floatRight ${img.duration}s linear infinite`,
            // Completely separate styling for initial vs new images
            ...(img.initialPosition !== null
              ? {
                  left: `${img.initialPosition}%`,
                  right: "auto",
                }
              : {
                  right: "-550px",
                  left: "auto",
                }),
            zIndex: 0,
          }}
        >
          <div
            className="relative rounded-lg overflow-hidden"
            style={{
              opacity: img.opacity,
            }}
          >
            <Image
              src={img.src}
              alt=""
              className="object-cover"
              width={img.size}
              height={img.size}
              style={{ height: "auto" }} // Add height: auto to maintain aspect ratio
            />
          </div>
        </div>
      ))}

      <style jsx>{`
        @keyframes floatRight {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-170vw);
          }
        }
      `}</style>
    </div>
  );
};

// Modified component for a contact box in the Email modal
const ContactBox = ({
  title,
  description,
  icon,
  bgColor,
  onClick,
  hasInput = false,
  inputPlaceholder = "",
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [showError, setShowError] = useState(false);

  const handleClick = (e) => {
    if (hasInput && !inputValue.trim()) {
      setShowError(true);
      return;
    }
    if (onClick) {
      onClick(e, inputValue);
    }
  };

  return (
    <div
      onClick={!hasInput ? handleClick : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowError(false);
      }}
      className="p-6 rounded-lg transition-all duration-300 flex flex-col items-center justify-center text-center cursor-pointer relative"
      style={{
        backgroundColor: bgColor || "#1E3A4C",
        boxShadow: isHovered ? "0 0 0 12px rgba(170, 220, 255, 0.8)" : "none",
        zIndex: isHovered ? 10 : 1,
        transform: isHovered ? "scale(1.02)" : "scale(1)",
      }}
    >
      <div className="w-full">
        <div className="flex items-center justify-center mb-4">
          {icon && <div className="w-8 h-8 mb-2 mr-3">{icon}</div>}
          <h4 className="text-3xl font-bold mb-2 font-montserrat">{title}</h4>
        </div>
        <p className="text-white font-montserrat">{description}</p>

        {hasInput && (
          <div
            className="overflow-hidden transition-all duration-300 absolute left-0 right-0 -bottom-2 -z-30"
            style={{
              height: isHovered ? "80px" : "0px",
              opacity: isHovered ? 1 : 0,
              transform: `translateY(${isHovered ? "65px" : "-10px"})`,
            }}
          >
            <div className="bg-white p-4 rounded-b-lg shadow-lg">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleClick(e);
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    if (showError) setShowError(false);
                  }}
                  placeholder={inputPlaceholder}
                  className={`w-full px-4 py-2 bg-gray-50 rounded-l outline-none border transition-colors ${
                    showError
                      ? "border-red-500"
                      : "border-gray-300 focus:border-[#7DD4FF]"
                  } text-gray-800 placeholder-gray-400`}
                  onClick={(e) => e.stopPropagation()}
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#7DD4FF] hover:bg-[#5AA8D0] text-[#0E304A] font-bold rounded transition-colors"
                >
                  →
                </button>
              </form>
              {showError && (
                <p className="text-red-500 text-xs mb-5 absolute">
                  Ce champ est requis
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// New expanded contact options for when a box is clicked
const expandedContactOptions = [
  {
    title: "Support Technique",
    description: "Assistance pour vos problèmes techniques",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z" />
      </svg>
    ),
    bgColor: "#1E3A4C",
  },
  {
    title: "Service Client",
    description: "Questions sur vos commandes et services",
    icon: "",
    bgColor: "#235A74",
  },
  {
    title: "Ventes",
    description: "Informations sur nos produits et services",
    icon: "",
    bgColor: "#286A89",
  },
  {
    title: "Partenariats",
    description: "Collaborations et opportunités d'affaires",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
      </svg>
    ),
    bgColor: "#2D7A9E",
  },
  {
    title: "Médias",
    description: "Demandes de presse et médias",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M22 3H2C.9 3 0 3.9 0 5v14c0 1.1.9 2 2 2h20c1.1 0 1.99-.9 1.99-2L24 5c0-1.1-.9-2-2-2zM8 6c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm6 12H2v-1c0-2 4-3.1 6-3.1s6 1.1 6 3.1v1zm3.85-4h1.64L21 16l-1.99 1.99c-1.31-.98-2.28-2.38-2.73-3.99-.18-.64-.28-1.31-.28-2s.1-1.36.28-2c.45-1.62 1.42-3.01 2.73-3.99L21 8l-1.51 2h-1.64c-.22.63-.35 1.3-.35 2s.13 1.37.35 2z" />
      </svg>
    ),
    bgColor: "#328AB3",
  },
  {
    title: "Retour",
    description: "Revenir aux options principales",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M19 7v4H5.83l3.58-3.59L8 6l-6 6 6 6 1.41-1.41L5.83 13H21V7z" />
      </svg>
    ),
    bgColor: "#389AC7",
  },
];

const contactGridItems = [
  {
    title: "Email Pro",
    description: "Pour toute question concernant nos services professionnels",
    buttonLink: "mailto:pro@mousequetaire.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z" />
      </svg>
    ),
    bgColor: "#004A6F",
  },
  {
    title: "Support",
    description:
      "Besoin d'aide avec un projet existant ou d'un support technique",
    buttonLink: "mailto:support@mousequetaire.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M11.5 2C6.81 2 3 5.81 3 10.5S6.81 19 11.5 19h.5v3c4.86-2.34 8-7 8-11.5C20 5.81 16.19 2 11.5 2zm1 14.5h-2v-2h2v2zm0-3.5h-2c0-3.25 3-3 3-5 0-1.1-.9-2-2-2s-2 .9-2 2h-2c0-2.21 1.79-4 4-4s4 1.79 4 4c0 2.5-3 2.75-3 5z" />
      </svg>
    ),
    bgColor: "#007EBD",
  },
  {
    title: "Carrières",
    description:
      "Rejoignez notre équipe dynamique de professionnels passionnés",
    buttonLink: "mailto:jobs@mousequetaire.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M10 16v-1H3.01L3 19c0 1.11.89 2 2 2h14c1.11 0 2-.89 2-2v-4h-7v1h-4zm10-9h-4.01V5l-2-2h-4l-2 2v2H4c-1.1 0-2 .9-2 2v3c0 1.11.89 2 2 2h6v-2h4v2h6c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zm-6 0h-4V5h4v2z" />
      </svg>
    ),
    bgColor: "#0089CD",
  },

  {
    title: "Autres",
    description: "Pour toutes autres demandes",
    buttonLink: "mailto:contact@mousequetaire.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
      </svg>
    ),
    bgColor: "#48B1E5",
    hasInput: true,
    inputPlaceholder: "Votre message",
  },
];

const contactOptions = [
  {
    title: "Instagram",
    description: "Appelez-nous directement",
    content: (
      <div className="flex flex-col items-center gap-8 w-[90%] md:w-[80%] lg:w-[70%] mx-auto">
        {/* Contact info section with icons */}
        <div className="flex flex-col md:flex-row justify-between items-start w-full gap-6 md:gap-12 mb-2 mt-32 px-52">
          <ContactInfoLink
            icon="/images/phone-icon.svg"
            label="APPELEZ-NOUS"
            value="+33 1 23 45 67 89"
            href="tel:+33123456789"
          />
          <ContactInfoLink
            icon="/images/email-icon.svg"
            label="ÉCRIVEZ-NOUS"
            value="contact@mousequetaire.com"
            href="mailto:contact@mousequetaire.com"
          />
        </div>
        {/* Image slider section with improved Swiper configuration */}
        <div className="w-full py-4">
          <p className="text-lg mb-2 text-center">
            Découvrez nos dernières publications
          </p>
          <div className="w-full relative" style={{ height: "40vh" }}>
            {/* Left fade overlay - changed to white */}
            <div
              className="absolute left-0 top-0 h-full w-[25%] z-[2000] pointer-events-none"
              style={{
                background:
                  "linear-gradient(to right, rgba(0, 33, 50, 1) 10%, rgba(0, 33, 50, 0))",
              }}
            ></div>

            <Swiper
              modules={[EffectCoverflow, Navigation, Pagination, Autoplay]}
              effect="coverflow"
              centeredSlides={true}
              slidesPerView="auto"
              loop={true}
              autoplay={{
                delay: 200000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              coverflowEffect={{
                rotate: -10,
                stretch: -80,
                depth: 100,
                modifier: 1.5,
                slideShadows: true,
              }}
              navigation={{
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
              }}
              pagination={{
                clickable: true,
                type: "bullets",
              }}
              className="swiper-container h-full"
            >
              {sampleImages.map((image, index) => (
                <SwiperSlide
                  key={index}
                  className="h-[45%]"
                  style={{
                    height: "70%",
                    width: "65%",
                    maxWidth: "450px",
                    top: "15%",
                    borderRadius: "25px",
                  }}
                >
                  <div className="relative w-full h-full rounded-3xl overflow-hidden group">
                    <Image
                      src={image.src || "/images/placeholder.jpg"}
                      alt={image.alt}
                      fill
                      className="object-cover transition-transform group-hover:scale-105 duration-500"
                    />

                    {/* Gradient overlay fading from bottom (opaque) to transparent */}
                    <div className="absolute bottom-0 left-0 right-0 h-[60%] bg-gradient-to-t from-white to-transparent flex items-end justify-between px-4 py-4">
                      <span className="text-black text-sm font-medium truncate">
                        Projet {index + 1}
                      </span>
                      <div className="h-12 w-12">
                        {image.type === "instagram" ? (
                          <svg
                            viewBox="0 0 24 24"
                            fill="black"
                            className="w-full h-full"
                          >
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                          </svg>
                        ) : (
                          <svg
                            viewBox="0 0 24 24"
                            fill="black"
                            className="w-full h-full"
                          >
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}

              {/* Update navigation buttons to be invisible until hover */}
              <div className="swiper-button-next !hidden after:!content-none !w-14 !h-14 !bg-black/30 hover:!bg-black/50 !rounded-full transition-all duration-300 !right-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="white"
                  className="w-6 h-6 mx-auto"
                >
                  <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                </svg>
              </div>
              <div className="swiper-button-prev !hidden after:!content-none !w-14 !h-14 !bg-black/30 hover:!bg-black/50 !rounded-full transition-all duration-300 !left-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="white"
                  className="w-6 h-6 mx-auto"
                >
                  <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" />
                </svg>
              </div>
            </Swiper>

            {/* Right fade overlay - changed to white */}
            <div
              className="absolute right-0 top-0 h-full w-[25%] z-[2000] pointer-events-none"
              style={{
                background:
                  "linear-gradient(to left, rgba(0, 33, 50, 1) 10%, rgba(0, 33, 50, 0))",
              }}
            ></div>
          </div>
          <style jsx global>{`
            @keyframes pulseGlow {
              0% {
                box-shadow: 0 0 10px 0px rgba(125, 212, 255, 0.5);
              }
              50% {
                box-shadow: 0 0 50px 20px rgba(125, 212, 255, 0.8);
              }
              100% {
                box-shadow: 0 0 10px 0px rgba(125, 212, 255, 0.5);
              }
            }

            @keyframes borderPulse {
              0% {
                border-color: rgba(125, 212, 255, 0.3);
              }
              50% {
                border-color: rgba(125, 212, 255, 0.8);
              }
              100% {
                border-color: rgba(125, 212, 255, 0.3);
              }
            }

            .swiper-pagination-bullet {
              width: 10px;
              height: 10px;
              background: rgba(255, 255, 255, 0.4);
              opacity: 1;
              margin: 0 4px !important;
              transition: all 0.3s ease;
            }
            .swiper-pagination-bullet-active {
              background: white;
              transform: scale(1.3);
            }
            .swiper-pagination {
              position: relative;
              margin-top: 15px;
            }
            .swiper-container .swiper-slide-shadow-left,
            .swiper-container .swiper-slide-shadow-right {
              background-image: linear-gradient(
                to left,
                rgba(0, 0, 0, 0.3),
                rgba(0, 0, 0, 0)
              );
            }
            .swiper-button-next,
            .swiper-button-prev {
              backdrop-filter: blur(4px);
              margin-top: -24px !important;
              transition: all 0.3s ease !important;
            }
            .swiper-button-next::after,
            .swiper-button-prev::after {
              display: none !important;
            }
            .swiper-button-disabled {
              opacity: 0 !important;
            }
            .swiper-slide-active {
              z-index: 10;
              transform: scale(1.05);
              transition: transform 0.5s ease;
              box-shadow: 0 0 40px 0px rgba(255, 255, 255, 0.6) !important;
            }
            .swiper-slide-active .slide-glow-effect {
              box-shadow: 0 0 25px rgba(125, 212, 255, 0.9);
              border-color: rgba(125, 212, 255, 0.8);
            }
            .slide-glow-effect {
              box-shadow: 0 0 12px rgba(125, 212, 255, 0.4);
              transition: all 0.5s ease;
            }
            .swiper-container,
            .swiper-wrapper,
            .swiper-slide {
              height: 100%;
            }
            .swiper-slide > div {
              height: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
            }
          `}</style>
        </div>
        {/* Updated social media links section */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-16 md:gap-40 w-full py-8">
          <SocialMediaLink
            icon="/images/insta-icon.svg"
            colorIcon="/images/insta-icon-color.svg"
            handle="@mousequetaire"
            href="https://instagram.com/mousequetaire"
          />
          <SocialMediaLink
            icon="/images/linkedin-icon.svg"
            colorIcon="/images/linkedin-icon-color.svg"
            handle="@mousequetaire"
            href="https://linkedin.com/company/mousequetaire"
          />
        </div>
      </div>
    ),
    bgColor: "#002132",
    customIcon: <InstagramSlider />,
    hoverEffect: "hover:brightness-110 ",
  },
  {
    title: "Email",
    description: "Contactez-nous par email",
    content: (
      <div className="flex flex-col w-full h-[100vh] relative">
        {/* Animated background */}
        <BackgroundAnimation />

        {/* Content overlay */}
        <div className="relative z-10 flex flex-col items-center gap-6 w-full mt-30">
          <h3 className="text-2xl md:text-3xl font-bold mb-2">
            Contactez-nous
          </h3>

          {/* Grid view for contact options */}
          <div className="w-full max-w-5xl px-4 grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {contactGridItems.map((item, index) => (
              <ContactBox
                key={index}
                title={item.title}
                description={item.description}
                buttonLink={item.buttonLink}
                icon={item.icon}
                bgColor={item.bgColor}
                isButton={true}
              />
            ))}
          </div>
        </div>
      </div>
    ),
    bgColor: "#70C7F2",
    customIcon: <FormIconSVG />,
    hoverEffect: "hover:brightness-110 ",
  },
];

export default function Contact() {
  const [activeModal, setActiveModal] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [circlePosition, setCirclePosition] = useState(null);
  const { setModalOpen, setNestedModal, registerCloseModal } = useModal();
  const [showExpandedOptions, setShowExpandedOptions] = useState(false);

  const handleCircleClick = useCallback(
    (e, index) => {
      if (isAnimating) return;

      // Scroll to top smoothly with fallback for browsers that don't support smooth scrolling
      if (window.scrollY > 200) {
        window.scrollTo({
          top: 200,
          left: 0,
        });
      }
      setIsAnimating(true);
      document.body.style.overflow = "hidden";
      setModalOpen(true); // Set modal open state to true
      setNestedModal(false); // Reset nested modal state

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
            ) * 1.3,
        },
      });

      setActiveModal(index);
      requestAnimationFrame(() => {
        setIsExpanded(true);
        setTimeout(() => setIsAnimating(false), 500);
      });
    },
    [isAnimating, setModalOpen, setNestedModal]
  );

  const closeModal = useCallback(
    (isBackAction = false) => {
      if (isAnimating) return;

      if (isBackAction && showExpandedOptions) {
        // If this is a back action and we're in expanded options, just go back to main options
        setShowExpandedOptions(false);
        setNestedModal(false);
        return;
      }

      setIsAnimating(true);
      setIsExpanded(false);
      setModalOpen(false);
      setNestedModal(false);

      setTimeout(() => {
        setActiveModal(null);
        setCirclePosition(null);
        setIsAnimating(false);
        setShowExpandedOptions(false);
        document.body.style.overflow = "auto";
      }, 300);
    },
    [isAnimating, setModalOpen, setNestedModal, showExpandedOptions]
  );

  // Register our closeModal function with the context when component mounts or closeModal changes
  useEffect(() => {
    registerCloseModal(closeModal);
    return () => {
      // Reset the close modal function when component unmounts
      registerCloseModal(() => {});
    };
  }, [closeModal, registerCloseModal]);

  const handleContactBoxClick = (e, inputValue) => {
    e.preventDefault();
    if (inputValue) {
      console.log("Input value:", inputValue);
    }
    setShowExpandedOptions(true);
    setNestedModal(true); // Set nested modal state to true
  };

  const handleReturnClick = (e) => {
    e.preventDefault();
    setShowExpandedOptions(false);
    setNestedModal(false); // Set nested modal state to false
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && !isAnimating) {
        if (showExpandedOptions) {
          // If in expanded options, go back to main options
          handleReturnClick(e);
        } else if (activeModal !== null) {
          // Otherwise, close the modal completely
          closeModal();
        }
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isAnimating, activeModal, closeModal, showExpandedOptions]);

  return (
    <>
      <main className="pt-24 -pb-20 bg-[#050610] min-h-screen font-montserrat">
        <div className="container mx-auto px-4">
          <p className="text-white text-center max-w-[400px] mx-auto font-montserrat font-semibold mb-8 md:mb-16 text-xl md:text-3xl px-4">
            Contactez-nous via ces différents médias :
          </p>

          {/* Mobile view - stack circles vertically */}
          <div className="md:hidden flex flex-col items-center gap-8 mb-0">
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

                  animation: !activeModal
                    ? `circleGlow 3s infinite ${index * 0.3}s`
                    : "none",
                }}
              >
                <div
                  onClick={(e) => !activeModal && handleCircleClick(e, index)}
                  className={`w-full h-full rounded-full flex items-center justify-center overflow-hidden
                  ${!activeModal ? "cursor-pointer" : ""} 
                  transition-all duration-500 ease-in-out ${
                    option.hoverEffect || ""
                  }`}
                  style={{
                    backgroundColor: option.bgColor,
                    transform:
                      activeModal === index && isExpanded
                        ? `translate(${circlePosition?.transform.translateX}px, ${circlePosition?.transform.translateY}px) scale(${circlePosition?.transform.scale})`
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
                  className="transition-all duration-700 absolute top-0 rounded-full"
                  style={{
                    width: "288px",
                    left: `${index * 500}px`,
                    opacity:
                      activeModal !== null && activeModal !== index ? 0 : 1,
                    transitionDuration:
                      activeModal !== null && activeModal !== index
                        ? "300ms"
                        : "700ms",

                    animation: !activeModal
                      ? `circleGlow 3s infinite ${index * 0.3}s`
                      : "none",
                    borderRadius: "50%",
                  }}
                >
                  <div
                    onClick={(e) => !activeModal && handleCircleClick(e, index)}
                    className={`w-72 h-72 rounded-full flex items-center justify-center overflow-hidden
                      ${!activeModal ? "cursor-pointer" : ""} 
                      transition-all duration-500 ease-in-out ${
                        option.hoverEffect || ""
                      }`}
                    style={{
                      backgroundColor: option.bgColor,
                      transform:
                        activeModal === index && isExpanded
                          ? `translate(${circlePosition?.transform.translateX}px, ${circlePosition?.transform.translateY}px) scale(${circlePosition?.transform.scale})`
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
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Modal Overlay - responsive for all screens with hidden scrollbar */}
          {activeModal !== null && (
            <div className="fixed inset-0 z-[1000] h-screen w-screen overflow-hidden">
              <div
                className={`fixed inset-0 z-[1001] flex items-center justify-center pointer-events-none overflow-hidden
                  transition-opacity duration-300
                  ${isExpanded && !isAnimating ? "opacity-100" : "opacity-0"}`}
                style={{
                  backgroundColor:
                    activeModal !== null
                      ? contactOptions[activeModal].bgColor
                      : "#002132",
                }}
              >
                <div
                  className={`relative w-full pointer-events-auto
                    transition-all duration-300 ${
                      isExpanded ? "scale-100" : "scale-95"
                    }
                   rounded-2xl  m-0 
                    fixed sm:relative inset-0 sm:inset-auto max-h-[100vh] sm:h-auto
                    flex items-center justify-center overflow-hidden`}
                >
                  <div className="text-white w-full flex items-center justify-center">
                    {activeModal === 1 && (
                      <div className="flex flex-col w-full h-[100vh] relative">
                        {/* Animated background */}
                        <BackgroundAnimation />

                        {/* Content overlay */}
                        <div className="relative z-10 flex flex-col items-center gap-6 w-full mt-32">
                          <h3 className="text-2xl md:text-3xl font-bold mb-2 mt-16">
                            {!showExpandedOptions
                              ? "Qui êtes-vous ?"
                              : "Pourquoi voulez-vous nous contacter ?"}
                          </h3>

                          {/* Grid view for contact options */}
                          <div
                            className={`w-full max-w-5xl px-4 grid grid-cols-1 md:grid-cols-2 ${
                              !showExpandedOptions ? "gap-20" : "gap-10"
                            } mb-16`}
                          >
                            {!showExpandedOptions
                              ? contactGridItems.map((item, index) => (
                                  <ContactBox
                                    key={index}
                                    title={item.title}
                                    description={item.description}
                                    icon={item.icon}
                                    bgColor={item.bgColor}
                                    onClick={handleContactBoxClick}
                                    hasInput={item.hasInput}
                                    inputPlaceholder={item.inputPlaceholder}
                                  />
                                ))
                              : expandedContactOptions.map((item, index) => (
                                  <ContactBox
                                    key={index}
                                    title={item.title}
                                    description={item.description}
                                    icon={item.icon}
                                    bgColor={item.bgColor}
                                    onClick={
                                      item.title === "Retour"
                                        ? handleReturnClick
                                        : undefined
                                    }
                                  />
                                ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {activeModal === 0 && contactOptions[activeModal].content}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <style jsx global>{`
        @keyframes boxShadowPulse {
          0% {
            box-shadow: 0 0 30px 0px rgba(125, 212, 255, 0.5);
          }
          50% {
            box-shadow: 0 0 70px 0px rgba(125, 212, 255, 0.8);
          }
          100% {
            box-shadow: 0 0 30px 0px rgba(125, 212, 255, 0.5);
          }
        }

        @keyframes circleGlow {
          0% {
            box-shadow: 0 0 0 0px rgba(125, 212, 255, 0.5);
          }
          50% {
            box-shadow: 0 0 0 30px rgba(125, 212, 255, 0.8);
          }
          100% {
            box-shadow: 0 0 0 0px rgba(125, 212, 255, 0.5);
          }
        }

        @keyframes borderPulse {
          0% {
            border-color: rgba(125, 212, 255, 0.3);
          }
          50% {
            border-color: rgba(125, 212, 255, 0.8);
          }
          100% {
            border-color: rgba(125, 212, 255, 0.3);
          }
        }
      `}</style>{" "}
    </>
  );
}
