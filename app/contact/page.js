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

// New SocialMediaLink component with centered-to-justified hover effect
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

const contactOptions = [
  {
    title: "Instagram",
    description: "Appelez-nous directement",
    content: (
      <div className="flex flex-col items-center gap-8 w-[90%] md:w-[80%] lg:w-[70%] mx-auto">
        {/* Contact info section with icons */}
        <div className="flex flex-col md:flex-row justify-between items-start w-full gap-6 md:gap-12 mb-2 mt-32 px-40">
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
          <div className="w-full relative" style={{ height: "4  0vh" }}>
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
              grabCursor={true}
              centeredSlides={true}
              slidesPerView="auto"
              loop={true}
              autoplay={{
                delay: 2000,
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
              className="swiper-container h-full rounded-lg"
            >
              {sampleImages.map((image, index) => (
                <SwiperSlide
                  key={index}
                  className="h-[50%]"
                  style={{
                    height: "70%",
                    width: "65%",
                    maxWidth: "450px",
                    top: "20%",
                  }}
                >
                  <div className="relative w-full h-full rounded-lg overflow-x-hidden shadow-lg group">
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

                    {/* Replaced glow effect with direct styling - more reliable */}
                    <div className="slide-glow-effect absolute inset-0 border-2 border-[#7DD4FF]/40 rounded-lg pointer-events-none"></div>
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
              box-shadow: 0 0 50px 8px rgba(255, 255, 255, 0.6) !important;
            }
            .swiper-slide-active .slide-glow-effect {
              box-shadow: 0 0 25px rgba(125, 212, 255, 0.9);
              border-color: rgba(125, 212, 255, 0.8);
            }
            .slide-glow-effect {
              box-shadow: 0 0 12px rgba(125, 212, 255, 0.4);
              transition: all 0.5s ease;
            }
          `}</style>
        </div>
        {/* Updated social media links section */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16 w-full py-8">
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
    //small brightness up effect on hover
    hoverEffect: "hover:brightness-110 ",
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
    hoverEffect: "hover:brightness-110 ",
  },
];

export default function Contact() {
  const [activeModal, setActiveModal] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [circlePosition, setCirclePosition] = useState(null);
  const { setModalOpen } = useModal();

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
    [isAnimating, setModalOpen]
  );

  const closeModal = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIsExpanded(false);
    setModalOpen(false); // Set modal open state to false

    setTimeout(() => {
      setActiveModal(null);
      setCirclePosition(null);
      setIsAnimating(false);
      document.body.style.overflow = "auto";
    }, 300);
  }, [isAnimating, setModalOpen]);

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
      <main className="pt-24 -pb-20 bg-[#050610] min-h-screen">
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
            <div className="fixed inset-0 z-[1000] h-screen w-screen overflow-hidden ">
              <div
                className={`fixed inset-0 z-[1001] flex items-center justify-center pointer-events-none overflow-hidden
                  transition-opacity duration-300 bg-[#002132]
                  ${isExpanded && !isAnimating ? "opacity-100" : "opacity-0"}`}
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
