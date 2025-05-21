"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useModal } from "@/context/ModalContext";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const {
    isModalOpen,
    isNestedModal,
    closeModal,
    setModalOpen,
    setNestedModal,
  } = useModal();
  const [wasModalOpen, setWasModalOpen] = useState(false);

  // Simplified arrow state - only 3 possible states
  const [arrowState, setArrowState] = useState("hidden"); // "hidden", "shown", or "nested"
  const arrowRef = useRef(null);
  const animationRef = useRef(null);

  // Add new state object for animation tracking
  const arrowAnimationState = useRef({
    // Current position and target values
    currentY: -30,
    targetY: -30,
    currentOpacity: 0,
    targetOpacity: 0,

    // Animation timing
    startTime: null,
    duration: 500,

    // State flags
    isAnimating: false,
    animationType: null, // "showing", "hiding", "transitioning"

    // Last known modal state for comparison
    lastModalState: {
      isOpen: false,
      isNested: false,
    },
  });

  // Lock to prevent double animations
  const animationLockRef = useRef(false);

  // Track modal transitions
  const lastModalStateRef = useRef({
    isModalOpen: false,
    isNestedModal: false,
  });

  // Track when a modal is first opened to prevent duplicate animations
  const isFirstOpenRef = useRef(false);

  // Track modal open source to prevent duplicate animations
  const modalOpenSourceRef = useRef(null);

  // Add a new ref to track opening animation state
  const openingAnimationInProgressRef = useRef(false);

  // Basic scroll and resize handlers
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1250);
      setIsMobileView(window.innerWidth < 768); // Match md breakpoint
    };

    handleResize();
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Track previous modal state for transitions
  useEffect(() => {
    if (isModalOpen) {
      setWasModalOpen(true);
    } else {
      // Reset wasModalOpen with a delay to allow for animations
      const timeout = setTimeout(() => {
        setWasModalOpen(false);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [isModalOpen]);

  // Clean up any ongoing animations when component unmounts
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Add this useEffect near your other modal-related effects
  useEffect(() => {
    // Run only on initial component mount
    const isContactPage = pathname === "/contact";

    // Always reset arrow state on component mount
    setArrowState("hidden");

    // Reset animation state and ensure arrow is hidden
    if (arrowRef.current) {
      arrowRef.current.style.transition = "none";
      arrowRef.current.style.opacity = "0";
      arrowRef.current.style.transform = "translateY(-30px)";
    }

    // Reset all animation-related refs
    arrowAnimationState.current = {
      currentY: -30,
      targetY: -30,
      currentOpacity: 0,
      targetOpacity: 0,
      startTime: null,
      duration: 500,
      isAnimating: false,
      animationType: null,
      lastModalState: {
        isOpen: false,
        isNested: false,
      },
    };

    // Reset tracking refs
    openingAnimationInProgressRef.current = false;
    exitAnimationInProgressRef.current = false;
    isFirstOpenRef.current = false;
    modalOpenSourceRef.current = null;

    // If on contact page and modal is open, only then update arrow state
    if (isContactPage && isModalOpen) {
      setArrowState(isNestedModal ? "nested" : "shown");
    }

    // Cancel any ongoing animations
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array means this runs once on mount

  // Track if we've recently handled a click to prevent multiple rapid clicks
  const clickHandledRef = useRef(false);

  // Track if an exit animation is currently in progress
  const exitAnimationInProgressRef = useRef(false);

  // Check if we're in a modal-to-modal transition
  const isModalToModalTransition = () => {
    return (
      isModalOpen &&
      lastModalStateRef.current.isModalOpen &&
      ((isNestedModal && !lastModalStateRef.current.isNestedModal) ||
        (!isNestedModal && lastModalStateRef.current.isNestedModal))
    );
  };

  // Enhanced animation function with better interruption handling
  const startArrowAnimation = () => {
    // Clear any existing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    // Animation state machine with improved handling for interrupted animations
    const animateArrowFrame = (timestamp) => {
      if (!arrowRef.current) return;

      const animState = arrowAnimationState.current;

      // Initialize startTime on first frame
      if (!animState.startTime) {
        animState.startTime = timestamp;

        // For hiding animations, always ensure we start from visible state
        if (animState.animationType === "hiding") {
          // Ensure we're starting from a visible state for smooth exit
          animState.currentY = 0;
          animState.currentOpacity = 1;

          // Mark that an exit animation is in progress
          exitAnimationInProgressRef.current = true;
        }
      }

      // Calculate progress
      const elapsed = timestamp - animState.startTime;

      // Use longer duration for exit animations to ensure visibility
      const effectiveDuration =
        animState.animationType === "hiding"
          ? Math.max(animState.duration, 600) // Minimum 600ms for exit
          : animState.duration;

      const progress = Math.min(elapsed / effectiveDuration, 1);

      // Easing function for smoother animation
      const easeOutBack = (x) => {
        // Enhanced springiness for showing animation with more pronounced overshoot
        const c1 = 2.5; // Increased from 1.70158 for more bounciness
        const c3 = c1 + 1;
        return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
      };

      // Custom elastic/spring easing for entrance animation
      const elasticOut = (x) => {
        // Reduced elastic bounce parameters for smoother animation
        const amplitude = 0.6; // Reduced from 1.0 for less pronounced bounce
        const period = 0.4; // Increased from 0.3 for fewer bounces
        const decay = 8; // Increased from 6 for faster decay of bounces

        // If we're at the end of the animation, ensure we return exactly 1
        if (x >= 1) return 1;

        // Calculate the elastic bounce with smoother physics
        return (
          1 +
          amplitude *
            Math.pow(2, -decay * x) *
            Math.sin((x * Math.PI * 2) / period)
        );
      };

      // Use different easing based on animation type
      let easedProgress;
      if (animState.animationType === "showing") {
        // For showing animations, implement smoother elastic behavior

        // First part approaches target with less overshoot (0-30%)
        if (progress < 0.3) {
          // Reduced overshoot
          easedProgress = (progress / 0.3) * 1.1; // 10% overshoot instead of 20%
        }
        // Second part is gentler elastic bounce (30-100%)
        else {
          // Map remaining progress to elastic bounce
          const bounceProgress = (progress - 0.3) / 0.7;

          // Calculate elastic bounce with smoother overshoots
          const elasticValue = elasticOut(bounceProgress);

          // Apply elastic bounce with less dramatic overshooting
          // Scale the bounces down for smoother effect
          easedProgress = 1 + (elasticValue - 1) * 0.2; // Reduced from 0.3
        }
      } else {
        // Use cubic ease-in-out for hiding and transitions
        easedProgress =
          progress < 0.5
            ? 4 * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      }

      // Calculate current position and opacity
      if (animState.animationType === "showing") {
        // Convert eased progress into Y position with proper overshoots
        const startY = -80;
        const targetY = animState.targetY; // Should be 0
        const range = targetY - startY;

        // Apply eased progress to position calculation
        // This allows for going beyond targetY (overshoot) based on easedProgress value
        animState.currentY = startY + range * easedProgress;

        // Opacity reaches full quickly but doesn't overshoot
        animState.currentOpacity = Math.min(1, progress * 2.5);
      } else {
        // Regular interpolation for other animations
        animState.currentY =
          animState.currentY +
          (animState.targetY - animState.currentY) * easedProgress;
        animState.currentOpacity =
          animState.currentOpacity +
          (animState.targetOpacity - animState.currentOpacity) * easedProgress;
      }

      // Apply to DOM with string conversion for opacity to ensure proper CSS value
      arrowRef.current.style.transform = `translateY(${animState.currentY}px)`;
      arrowRef.current.style.opacity = String(animState.currentOpacity);

      // Continue animation if not complete
      if (progress < 1) {
        animState.isAnimating = true;
        animationRef.current = requestAnimationFrame(animateArrowFrame);
      } else {
        // Animation complete
        animState.isAnimating = false;
        animState.startTime = null;

        // Ensure final values are exact
        animState.currentY = animState.targetY;
        animState.currentOpacity = animState.targetOpacity;
        arrowRef.current.style.transform = `translateY(${animState.targetY}px)`;
        arrowRef.current.style.opacity = String(animState.targetOpacity);

        // Reset animation lock
        animationLockRef.current = false;

        // Reset animation flags
        if (animState.animationType === "showing") {
          openingAnimationInProgressRef.current = false;
        } else if (animState.animationType === "hiding") {
          exitAnimationInProgressRef.current = false;
        }

        // Update arrow state if hiding completed and fully hidden
        if (animState.animationType === "hiding" && animState.targetY === -30) {
          // Use timeout to ensure the DOM has updated before changing state
          setTimeout(() => {
            setArrowState("hidden");
          }, 50);
        }
      }
    };

    // Start the animation loop
    animationRef.current = requestAnimationFrame(animateArrowFrame);
  };

  // Enhanced function to update arrow target state with better safeguards
  const updateArrowTargetState = (type) => {
    const animState = arrowAnimationState.current;

    // Special handling for hiding animations to ensure they complete
    if (type === "hiding") {
      // Cancel any existing animations
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }

      // Reset animation states
      animState.isAnimating = false;
      animState.startTime = null;

      // Ensure we're starting from visible position for smoothness
      animState.currentY = 0;
      animState.currentOpacity = 1;

      // Explicitly set the starting position to ensure clean animation
      if (arrowRef.current) {
        arrowRef.current.style.transform = "translateY(0px)";
        arrowRef.current.style.opacity = "1";
        void arrowRef.current.offsetWidth; // Force reflow
      }
    }
    // Don't start new animation if one is already running of the same type
    else if (animState.isAnimating && animState.animationType === type) {
      return;
    }

    // Set animation parameters based on type
    switch (type) {
      case "showing":
        animState.targetY = 0;
        animState.targetOpacity = 1;
        animState.duration = 1000; // Reduced from 1800 for more snappy animation
        break;
      case "hiding":
        animState.targetY = -30;
        animState.targetOpacity = 0;
        animState.duration = 600; // Extended duration for exit animations
        break;
      case "transitioning":
        // For modal-to-modal transitions, just reset to visible
        animState.currentY = 0;
        animState.targetY = 0;
        animState.currentOpacity = 1;
        animState.targetOpacity = 1;

        // Apply immediately without animation
        if (arrowRef.current) {
          arrowRef.current.style.transform = `translateY(0px)`;
          arrowRef.current.style.opacity = 1;
        }
        return; // Exit without starting animation
    }

    // Set animation type
    animState.animationType = type;

    // For showing animations, always start from hidden position
    if (type === "showing") {
      animState.currentY = -80; // Start from much higher for more dramatic effect
      animState.currentOpacity = 0;

      if (arrowRef.current) {
        arrowRef.current.style.transition = "none";
        arrowRef.current.style.transform = "translateY(-80px)";
        arrowRef.current.style.opacity = "0";
        void arrowRef.current.offsetWidth; // Force reflow
      }

      // Set opening animation flag
      openingAnimationInProgressRef.current = true;
    }

    // Start animation
    startArrowAnimation();
  };

  const pathname = usePathname();

  // Simplified modal state handler with dedicated transition handling
  useEffect(() => {
    // Only show the arrow if we're on the contact page
    const isContactPage = pathname === "/contact";

    // Special handling for modal transitions to prevent flickering
    const inTransition = isModalToModalTransition();

    // Detect initial modal open state
    const wasModalClosed = !lastModalStateRef.current.isModalOpen;
    const isInitialModalOpen = isModalOpen && wasModalClosed;

    // Update our animation state reference
    const animState = arrowAnimationState.current;
    animState.lastModalState.isOpen = isModalOpen;
    animState.lastModalState.isNested = isNestedModal;

    // Check for modalOpenSource to distinguish different modal triggers
    if (isInitialModalOpen) {
      // For first-time modal openings, track which modal is being opened
      if (isNestedModal) {
        modalOpenSourceRef.current = "nested";
      } else {
        modalOpenSourceRef.current = "main";
      }
      isFirstOpenRef.current = true;

      // CRITICAL FIX: Set opening animation flag immediately on modal open detection
      openingAnimationInProgressRef.current = true;

      // CRITICAL FIX: For first-time modal openings, ensure arrow starts FULLY hidden
      // and do it immediately without waiting for microtask queue
      if (arrowRef.current) {
        arrowRef.current.style.transition = "none";
        arrowRef.current.style.opacity = "0";
        arrowRef.current.style.transform = "translateY(-30px)";
        // Force reflow to ensure styles are applied immediately
        void arrowRef.current.offsetWidth;
      }
    } else if (!isModalOpen) {
      // Reset source tracking when modal closes completely
      modalOpenSourceRef.current = null;
      // Clear opening animation flag when modal is closed
      openingAnimationInProgressRef.current = false;
    }

    // Determine new arrow state based on modal states
    let newArrowState = "hidden";
    if (isModalOpen && isContactPage) {
      newArrowState = isNestedModal ? "nested" : "shown";
      setScrolled(true);
    } else if (window.scrollY <= 20) {
      setScrolled(false);
    }

    // CRITICAL SECTION: Modal-to-modal transitions need special handling
    if (inTransition) {
      console.log("Modal-to-modal transition detected");

      // 1. Cancel any ongoing animations to prevent conflicts
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }

      // 2. Release animation lock
      animationLockRef.current = false;

      // 3. Update arrow state without triggering animations
      setArrowState(newArrowState);

      // 4. Handle transition in our new system
      updateArrowTargetState("transitioning");
    }
    // Case: Arrow should be hidden (closing modal)
    else if (newArrowState === "hidden") {
      // Only animate out if currently showing
      if (arrowState !== "hidden") {
        // Run animation to hide the arrow
        updateArrowTargetState("hiding");
      }
    }
    // Case: Arrow should be shown but is currently hidden (opening modal for the first time)
    else if (arrowState === "hidden") {
      // FIX: Ensure the arrow is fully hidden BEFORE we update the state
      if (arrowRef.current) {
        arrowRef.current.style.transition = "none";
        arrowRef.current.style.opacity = "0";
        arrowRef.current.style.transform = "translateY(-30px)";
        // Force reflow to ensure styles are applied immediately
        void arrowRef.current.offsetWidth;
      }

      // Update arrow state
      setArrowState(newArrowState);

      // Use a short delay to ensure DOM updates before starting animation
      setTimeout(() => {
        updateArrowTargetState("showing");
      }, 50);
    }
    // Case: Arrow state changes while already visible
    else if (arrowState !== newArrowState) {
      // Just update the state without animation
      setArrowState(newArrowState);

      // CRITICAL FIX: Only set to fully visible if we're not in an opening animation
      if (arrowRef.current && !openingAnimationInProgressRef.current) {
        arrowRef.current.style.opacity = "1";
        arrowRef.current.style.transform = "translateY(0px)";
      }
    }

    // Update our reference to current modal states for future comparison
    lastModalStateRef.current = { isModalOpen, isNestedModal };
  }, [isModalOpen, isNestedModal, arrowState, pathname]);

  // Add new effect to reset modal states when leaving contact page
  const previousPathRef = useRef(pathname);

  useEffect(() => {
    // When navigating TO the contact page (not just away from it)
    if (previousPathRef.current !== "/contact" && pathname === "/contact") {
      console.log("Navigating to contact page, ensuring arrow is hidden");

      // Force arrow to hidden state initially
      setArrowState("hidden");

      // Ensure arrow is visually hidden
      if (arrowRef.current) {
        arrowRef.current.style.transition = "none";
        arrowRef.current.style.opacity = "0";
        arrowRef.current.style.transform = "translateY(-30px)";
      }

      // Only after a delay, check if modals require it to be shown
      setTimeout(() => {
        if (isModalOpen) {
          setArrowState(isNestedModal ? "nested" : "shown");
          updateArrowTargetState("showing");
        }
      }, 100);

      console.log("Leaving contact page, resetting modal states");

      // Reset all modal-related states
      setModalOpen(false);
      setNestedModal(false);
      setWasModalOpen(false);

      // Also reset the arrow state
      setArrowState("hidden");

      // If the arrow is visible, hide it
      if (arrowRef.current) {
        arrowRef.current.style.opacity = "0";
        arrowRef.current.style.transform = "translateY(-30px)";
      }

      // Reset all animation-related state
      animationLockRef.current = false;
      isFirstOpenRef.current = false;
      modalOpenSourceRef.current = null;

      // Cancel any ongoing animations
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    }

    // Update the previous path reference
    previousPathRef.current = pathname;
  }, [pathname, setModalOpen, setNestedModal]);

  // Improved back arrow click handler with debounce
  const handleBackArrowClick = () => {
    // Only process click if modal is open, on contact page, and not already handling a click
    const isContactPage = pathname === "/contact";
    if (!isModalOpen || !isContactPage || clickHandledRef.current) return;

    // Set click handled flag to prevent multiple rapid clicks
    clickHandledRef.current = true;

    // Clear flag after a short delay
    setTimeout(() => {
      clickHandledRef.current = false;
    }, 300); // 300ms debounce

    // Cancel any ongoing animations immediately
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    // Reset animation references
    animationLockRef.current = false;
    openingAnimationInProgressRef.current = false;

    // Force arrow to be fully visible during transition
    if (arrowRef.current) {
      arrowRef.current.style.transition = "none";
      arrowRef.current.style.opacity = "1";
      arrowRef.current.style.transform = "translateY(0px)";
      void arrowRef.current.offsetWidth; // Force reflow

      // Also update our animation state tracker
      arrowAnimationState.current.currentY = 0;
      arrowAnimationState.current.currentOpacity = 1;
    }

    // Handle modal closing based on current state
    if (arrowState === "nested") {
      console.log("Handling back arrow click for nested modal");
      closeModal(true);
    } else {
      console.log("Handling back arrow click for main modal");
      closeModal();
    }
  };

  const toggleMobileMenu = () => {
    // Preserve back arrow state when toggling mobile menu
    const currentArrowState = arrowState;
    setMobileMenuOpen(!mobileMenuOpen);

    // Ensure the arrow state isn't lost when toggling mobile menu
    if (
      isModalOpen &&
      currentArrowState !== "hidden" &&
      !openingAnimationInProgressRef.current
    ) {
      // Short delay to make sure it preserves after render
      setTimeout(() => {
        if (arrowRef.current && !openingAnimationInProgressRef.current) {
          arrowRef.current.style.opacity = "1";
          arrowRef.current.style.transform = "translateY(0px)";
        }
      }, 50);
    }
  };

  // Close mobile menu when clicking a link
  const handleLinkClick = () => {
    if (mobileMenuOpen) {
      // Store current arrow state before closing mobile menu
      const currentArrowState = arrowState;
      setMobileMenuOpen(false);

      // Ensure arrow remains visible if it was visible before
      if (
        isModalOpen &&
        currentArrowState !== "hidden" &&
        !openingAnimationInProgressRef.current
      ) {
        // Reapply styles after a small delay to ensure they take effect after render
        setTimeout(() => {
          if (arrowRef.current && !openingAnimationInProgressRef.current) {
            arrowRef.current.style.opacity = "1";
            arrowRef.current.style.transform = "translateY(0px)";
          }
        }, 50);
      }
    }
  };

  // Logo component positioned relatively within the navbar
  const Logo = () => (
    <div className="absolute left-4 -top-1 z-50">
      <Link
        href="/"
        onClick={(e) => {
          if (pathname === "/") {
            e.preventDefault();
          }
          handleLinkClick();
        }}
        className="flex items-center transform hover:scale-105 transition-transform duration-300"
      >
        <div className="relative w-[200px] md:w-[300px] h-[60px] md:h-[80px]">
          <Image
            src="/images/logo.svg"
            alt="Mousequetaire Logo Dark"
            fill
            className="object-contain"
            style={{
              filter:
                "drop-shadow(0 0 3px rgba(0, 0, 0, 0.7)) drop-shadow(0 0 6px rgba(0, 0, 0, 0.5))",
            }}
            priority
          />
        </div>
      </Link>
    </div>
  );

  // Simplified Back arrow component with special handling for different states
  const BackArrow = () => {
    // Check if we're on the contact page
    const isContactPage = pathname === "/contact";

    // If not on contact page, don't render the arrow at all
    if (!isContactPage) {
      return null;
    }

    // Determine label based on arrow state
    const arrowLabel = arrowState === "nested" ? "Retour" : "Fermer";

    // Determine if arrow should be clickable
    const isClickable = isModalOpen;
    const cursorStyle = isClickable ? "cursor-pointer" : "cursor-default";
    const pointerEvents = isClickable ? "auto" : "none";

    // Mobile version of back arrow - keep original behavior for mobile
    if (isMobileView) {
      // Use the values from our animation state for consistency
      const { currentY, currentOpacity } = arrowAnimationState.current;

      return (
        <div
          ref={arrowRef}
          className={`fixed flex top-2 right-16 z-50 ${cursorStyle}`}
          onClick={handleBackArrowClick}
          style={{
            opacity: currentOpacity,
            transform: `translateY(${currentY}px)`,
            transition: "none",
            pointerEvents: pointerEvents,
          }}
        >
          <div
            className={`bg-white rounded-full p-2 shadow-md flex w-10 h-10 items-center justify-center transition-transform ${
              isClickable ? "hover:scale-105" : ""
            } ${cursorStyle}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-[#002132]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </div>
        </div>
      );
    }

    // Desktop version - use animation state values directly
    const { currentY, currentOpacity } = arrowAnimationState.current;

    // Determine top position based on screen size
    const topPosition = isLargeScreen ? "35px" : "78px"; // Add 50px when smaller than 1450px

    return (
      <div
        ref={arrowRef}
        className={`fixed flex mx-auto w-full justify-center items-center ${cursorStyle}`}
        onClick={handleBackArrowClick}
        style={{
          opacity: currentOpacity,
          transform: `translateY(${currentY}px)`,
          transition: "none",
          pointerEvents: pointerEvents,
          top: topPosition, // Apply dynamic top positioning based on screen size
          zIndex: -1,
        }}
      >
        {/* Invisible hit area for better click detection */}
        <div className={`absolute inset-0 w-full h-28 ${cursorStyle}`} />

        <div
          className={`bg-[#04ACFF] rounded-full p-3 pt-8 shadow-md flex w-28 items-center justify-center transition-transform ${
            isClickable ? "hover:scale-105" : ""
          } ${cursorStyle} relative`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-[#002132]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </div>
        {/*
        <span
          className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 text-white text-xs whitespace-nowrap opacity-90 font-medium"
          style={{
            textShadow:
              "0px 0px 3px rgba(0, 0, 0, 0.8), 0px 0px 8px rgba(0, 0, 0, 0.5)",
            pointerEvents: "none", // Prevent text from interfering with clicks
          }}
        >
          {arrowLabel}
        </span>
        */}
      </div>
    );
  };

  // Calculate navbar classes based on scroll state and screen size
  const getNavbarClasses = () => {
    if (isLargeScreen) {
      return "pt-2 mt-0"; // Large screens (≥1450px)
    } else {
      return "pt-14 mt-0"; // Smaller screens (<1450px) - added pt-14
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-3000">
      <div className="relative z-3000">
        <Logo />
      </div>
      <div className="relative z-[-1]">
        <BackArrow />
      </div>

      {/* Mobile hamburger menu button */}
      <button
        className="absolute top-2 right-4 z-50 md:hidden bg-white rounded-full p-2 w-10 h-10"
        onClick={toggleMobileMenu}
        aria-label="Toggle menu"
      >
        <div
          className={`w-6 h-0.5 bg-[#002132] mb-1.5 transition-all ${
            mobileMenuOpen ? "transform rotate-45 translate-y-2" : ""
          }`}
        ></div>
        <div
          className={`w-6 h-0.5 bg-[#002132] mb-1.5 transition-all ${
            mobileMenuOpen ? "opacity-0" : ""
          }`}
        ></div>
        <div
          className={`w-6 h-0.5 bg-[#002132] transition-all ${
            mobileMenuOpen ? "transform -rotate-45 -translate-y-2" : ""
          }`}
        ></div>
      </button>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 bg-[#002132] z-40 md:hidden flex flex-col items-center justify-center transition-all duration-300 ${
          mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <nav className="flex flex-col items-center space-y-6">
          {["Accueil", "Nos services", "A propos", "Portfolio", "Contact"].map(
            (item) => {
              const itemPath =
                item === "Accueil"
                  ? "/"
                  : `/${item.toLowerCase().replace(" ", "")}`;
              const isActive = pathname === itemPath;

              return (
                <Link
                  key={item}
                  href={itemPath}
                  onClick={(e) => {
                    if (item === "Accueil" && pathname === "/") {
                      e.preventDefault();
                    }
                    handleLinkClick();
                  }}
                  className={`px-4 py-2 text-2xl font-montserrat ${
                    isActive ? "text-[#7DD4FF]" : "text-white"
                  }`}
                >
                  {item}
                </Link>
              );
            }
          )}
        </nav>
      </div>

      {/* Desktop navbar */}
      <nav
        className={`w-full px-1 hidden md:flex justify-center transition-all duration-300 delay-150 ${getNavbarClasses()}`}
      >
        <div className="w-[650px]  top-2 bg-white rounded-full px-1 py-1 md:py-2 shadow-md">
          <div className="flex justify-center space-x-4">
            {[
              "Accueil",
              "Nos services",
              "A propos",
              "Portfolio",
              "Contact",
            ].map((item) => {
              const itemPath =
                item === "Accueil"
                  ? "/"
                  : `/${item.toLowerCase().replace(" ", "")}`;
              const isActive = pathname === itemPath;

              return (
                <Link
                  key={item}
                  href={itemPath}
                  onClick={(e) => {
                    if (item === "Accueil" && pathname === "/") {
                      e.preventDefault();
                    }
                  }}
                  className="relative px-4 py-2 transition-all duration-300 rounded-full group"
                >
                  <span
                    className={`relative text-base z-10 font-medium font-montserrat pointer-events-none ${
                      isActive ? "text-white" : "text-[#002132]"
                    }`}
                  >
                    {item}
                  </span>
                  <span
                    className={`absolute inset-0 rounded-full transition-all duration-300 ease-out ${
                      isActive
                        ? "bg-[#002132]"
                        : "bg-transparent hover:bg-[#002132]/10"
                    }`}
                  ></span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
