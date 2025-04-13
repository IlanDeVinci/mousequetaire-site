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
      setIsLargeScreen(window.innerWidth >= 1450);
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

  // Check if we're in a modal-to-modal transition
  const isModalToModalTransition = () => {
    return (
      isModalOpen &&
      lastModalStateRef.current.isModalOpen &&
      ((isNestedModal && !lastModalStateRef.current.isNestedModal) ||
        (!isNestedModal && lastModalStateRef.current.isNestedModal))
    );
  };

  // Simplified animation function with lock to prevent duplicate animations
  const animateArrow = (show) => {
    // Enhanced animation cancellation - always ensure any running animation is properly stopped
    const cancelExistingAnimation = () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };

    // Cancel any existing animation before checking lock
    cancelExistingAnimation();

    // High priority for opening animations - force reset animation lock
    if (show) {
      // Force release animation lock for show animations to ensure they always run
      animationLockRef.current = false;
    }

    // Return early if animation is already in progress and is a new animation
    // but allow interruption for modal-to-modal transitions or show animations
    if (animationLockRef.current && !isModalToModalTransition() && !show) {
      return;
    }

    // Lock animations to prevent duplicates
    animationLockRef.current = true;

    // Set opening animation flag if this is a show animation
    if (show) {
      openingAnimationInProgressRef.current = true;
    }

    // Get the current time
    const startTime = Date.now();

    // Remove the delay for showing animation to prevent flashing
    const delayMs = show ? 0 : 100; // Only keep delay for hiding animation

    // Set animation parameters - make the hide animation longer
    const duration = show ? 1000 : 500; // Increased hide duration to 500ms for better visibility

    // Easing functions for better animation
    const easeOutBack = (x) => {
      const c1 = 1.70158;
      const c3 = c1 + 1;
      return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
    };

    const easeInOut = (x) => {
      return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    };

    // Ensure starting position before animation begins
    // Capture the current position and opacity before starting the animation
    let startOpacity = 0;
    let startY = -30;

    if (arrowRef.current) {
      // For "show" animations, ALWAYS force start from hidden position
      if (show) {
        startOpacity = 0;
        startY = -30;
        // Reset to starting position and ensure it's applied immediately
        arrowRef.current.style.transition = "none";
        arrowRef.current.style.opacity = "0";
        arrowRef.current.style.transform = "translateY(-30px)";
        // Force reflow to ensure styles are applied
        void arrowRef.current.offsetWidth;
      } else {
        // For hide animation, get current position if available
        const currentTransform = arrowRef.current.style.transform;
        const currentOpacity = arrowRef.current.style.opacity;

        if (currentTransform && currentOpacity) {
          startOpacity = parseFloat(currentOpacity) || 0;

          // Try to extract Y position from transform
          const match = currentTransform.match(/translateY\(([-0-9.]+)px\)/);
          if (match && match[1]) {
            startY = parseFloat(match[1]);
          }
        }

        // For hide animation, if not already visible, start visible
        if (startOpacity < 0.5) {
          startOpacity = 1;
          startY = 0;
          arrowRef.current.style.opacity = "1";
          arrowRef.current.style.transform = "translateY(0px)";
        }
      }
    }

    // Animation function
    const animate = () => {
      // Stop animation if the arrow element no longer exists
      if (!arrowRef.current) {
        animationLockRef.current = false;
        return;
      }

      // Calculate progress (0 to 1), accounting for delay
      const elapsed = Date.now() - startTime;

      // If we're still in the delay period, handle appropriately
      if (elapsed < delayMs) {
        // During delay, keep arrow at current position
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      // Calculate actual animation progress after delay
      const animationElapsed = elapsed - delayMs;
      const rawProgress = Math.min(animationElapsed / duration, 1);

      // Apply easing for better animation feel
      const progress = show ? easeOutBack(rawProgress) : easeInOut(rawProgress);

      // Apply transform and opacity based on direction
      if (show && !isNestedModal && !wasModalOpen) {
        // Animate in with bounce: from start position up to 0px and 1 opacity
        let y;

        if (progress < 0.8) {
          // First part: come up more slowly
          y = startY * (1 - progress / 0.8);
        } else {
          // Second part: gentler bounce
          const bounceProgress = (progress - 0.8) / 0.2;
          y = 8 * Math.sin(bounceProgress * Math.PI); // Reduced bounce height from 10 to 8
        }

        // More gradual fade in - ensure it's purely controlled by the animation
        const opacity =
          startOpacity + (1 - startOpacity) * Math.min(progress * 1.2, 1);

        arrowRef.current.style.opacity = opacity.toString();
        arrowRef.current.style.transform = `translateY(${y}px)`;
      } else {
        // Animate out: from current position to -30px and 0 opacity
        const targetY = -30;
        const y = startY + (targetY - startY) * progress;
        const opacity = startOpacity * (1 - progress);

        arrowRef.current.style.transform = `translateY(${y}px)`;
        arrowRef.current.style.opacity = opacity.toString();
      }

      // Continue if not finished
      if (rawProgress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // Animation complete - ENFORCE FINAL VALUES
        if (!show) {
          // If we were hiding, update the state to hidden AFTER animation completes
          // Enforce final state for hiding
          if (arrowRef.current) {
            arrowRef.current.style.opacity = "0";
            arrowRef.current.style.transform = "translateY(-30px)";
          }
          setTimeout(() => {
            setArrowState("hidden");
            // Release animation lock after state change
            animationLockRef.current = false;
          }, 100); // Small delay to ensure animation completes
        } else if (arrowRef.current) {
          // Ensure full opacity and position when animation completes for showing
          arrowRef.current.style.opacity = "1";
          arrowRef.current.style.transform = "translateY(0px)";
          // Release animation lock after animation completes
          animationLockRef.current = false;
          // Reset opening animation flag when animation completes
          openingAnimationInProgressRef.current = false;
        }
      }
    };

    // Start animation
    animationRef.current = requestAnimationFrame(animate);
  };

  const pathname = usePathname();

  // Simplified modal state handler with dedicated transition handling
  useEffect(() => {
    // Only show the arrow if we're on the contact page
    const isContactPage = pathname === "/contact";

    // Function to cancel any ongoing animation
    const cancelOngoingAnimation = () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };

    // Function to reset all animation state - useful when a modal is opened
    const resetAnimationState = () => {
      // Cancel any ongoing animation
      cancelOngoingAnimation();

      // Reset animation lock
      animationLockRef.current = false;
    };

    // Special handling for modal transitions to prevent flickering
    const inTransition = isModalToModalTransition();

    // Detect initial modal open state
    const wasModalClosed = !lastModalStateRef.current.isModalOpen;
    const isInitialModalOpen = isModalOpen && wasModalClosed;

    // Check for modalOpenSource to distinguish different modal triggers
    if (isInitialModalOpen) {
      // IMPORTANT: When a modal opens, immediately cancel any ongoing animation
      resetAnimationState();

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

      // 1. Cancel any ongoing animations to prevent conflicts - enhanced cancellation
      cancelOngoingAnimation();

      // 2. Release animation lock
      animationLockRef.current = false;

      // 3. Update arrow state without triggering animations
      setArrowState(newArrowState);

      // 4. Force arrow to remain fully visible with no transition
      if (arrowRef.current) {
        // Ensure no transition is active
        arrowRef.current.style.transition = "none";
        // Force visibility
        arrowRef.current.style.opacity = "1";
        arrowRef.current.style.transform = "translateY(0px)";

        // Apply changes immediately
        void arrowRef.current.offsetWidth; // Force reflow

        // Add redundant updates to ensure styles are applied across all browsers
        requestAnimationFrame(() => {
          if (arrowRef.current) {
            arrowRef.current.style.opacity = "1";
            arrowRef.current.style.transform = "translateY(0px)";
          }
        });

        // Additional timeout as a fallback guarantee
        setTimeout(() => {
          if (arrowRef.current) {
            arrowRef.current.style.opacity = "1";
            arrowRef.current.style.transform = "translateY(0px)";
          }
        }, 10);
      }
    }
    // Case: Arrow should be hidden (closing modal)
    else if (newArrowState === "hidden") {
      // Cancel any existing animation before starting a new one
      cancelOngoingAnimation();

      // Only animate out if currently showing and not already animating
      if (arrowState !== "hidden" && !animationLockRef.current) {
        // Run animation to hide the arrow - don't set any styles directly
        animateArrow(false);
      }
    }
    // Case: Arrow should be shown but is currently hidden (opening modal for the first time)
    else if (arrowState === "hidden") {
      // Cancel any existing animation before updating state
      cancelOngoingAnimation();

      // FIX: Ensure the arrow is fully hidden BEFORE we update the state
      if (arrowRef.current) {
        arrowRef.current.style.transition = "none";
        arrowRef.current.style.opacity = "0";
        arrowRef.current.style.transform = "translateY(-30px)";
        // Force reflow to ensure styles are applied immediately
        void arrowRef.current.offsetWidth;
      }

      // Update arrow state AFTER ensuring it's hidden
      setArrowState(newArrowState);

      // For first-time modal opening, ensure the arrow starts from the hidden position again
      // This is redundant with the earlier check but important to guarantee hidden start state
      if (isInitialModalOpen && arrowRef.current) {
        // Reset to hidden position
        arrowRef.current.style.transition = "none";
        arrowRef.current.style.opacity = "0";
        arrowRef.current.style.transform = "translateY(-30px)";
        // Force reflow to ensure starting position is applied
        void arrowRef.current.offsetWidth;
      }

      // Check if this is the Instagram modal (special case)
      const isInstagramModal =
        modalOpenSourceRef.current === "main" &&
        !isNestedModal &&
        !wasModalOpen;

      // Only trigger animation if not locked and either:
      // 1. This is the first open event, or
      // 2. This is not the Instagram modal case
      const shouldRunAnimation =
        !animationLockRef.current &&
        (isFirstOpenRef.current || !isInstagramModal);

      // Reset first open flag
      if (isFirstOpenRef.current) {
        isFirstOpenRef.current = false;
      }

      // For Instagram modal, use CSS transition instead of animation
      if (isInstagramModal && !shouldRunAnimation) {
        // Lock to prevent other animations
        animationLockRef.current = true;
        // Set opening animation flag
        openingAnimationInProgressRef.current = true;

        // Use a small delay to ensure state is updated first
        setTimeout(() => {
          if (arrowRef.current) {
            // First confirm the arrow is in the initial position
            arrowRef.current.style.opacity = "0";
            arrowRef.current.style.transform = "translateY(-30px)";

            // Force reflow to ensure initial position is applied
            void arrowRef.current.offsetWidth;

            // Now apply the transition
            arrowRef.current.style.transition =
              "opacity 350ms ease-out, transform 350ms ease-out";
            arrowRef.current.style.opacity = "1";
            arrowRef.current.style.transform = "translateY(0px)";

            // Reset transition and unlock after animation completes
            setTimeout(() => {
              if (arrowRef.current) {
                arrowRef.current.style.transition = "none";
              }
              animationLockRef.current = false;
              // Reset opening animation flag
              openingAnimationInProgressRef.current = false;
            }, 350);
          }
        }, 50); // Increased delay to ensure hidden state is visible first
      }
      // For regular animation case
      else if (shouldRunAnimation) {
        // FIX: Make sure we reset the animation lock
        animationLockRef.current = false;

        // Use a slightly longer timeout to ensure DOM updates and hidden state is visible first
        setTimeout(() => {
          // Double-check animation hasn't been locked in the meantime
          if (!animationLockRef.current) {
            // Final check to ensure arrow starts hidden
            if (arrowRef.current) {
              arrowRef.current.style.transition = "none";
              arrowRef.current.style.opacity = "0";
              arrowRef.current.style.transform = "translateY(-30px)";
              void arrowRef.current.offsetWidth;
            }

            // Run animation, which will now force starting from hidden state
            animateArrow(true);
          }
        }, 50); // Increased from 10ms to 50ms
      }
    }
    // Case: Arrow state changes while already visible
    else if (arrowState !== newArrowState) {
      // Cancel any existing animation before just updating state
      cancelOngoingAnimation();

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
    // Check if we're navigating away from the contact page
    if (previousPathRef.current === "/contact" && pathname !== "/contact") {
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

  // Back arrow function for modals - modified to handle non-clickable state
  const handleBackArrowClick = () => {
    // Only process click if modal is actually open and we're on the contact page
    const isContactPage = pathname === "/contact";
    if (!isModalOpen || !isContactPage) return;

    // Enhanced animation cancellation - make sure it's always called
    // and all animation state is properly reset
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    // Release animation lock if it's set
    animationLockRef.current = false;
    // Reset opening animation flag
    openingAnimationInProgressRef.current = false;

    // Get current animation state and style properties
    let currentOpacity = "1";
    let currentTransform = "translateY(0px)";

    // Try to read current styles, fallback to defaults if not available
    if (arrowRef.current) {
      if (arrowRef.current.style.opacity) {
        currentOpacity = arrowRef.current.style.opacity;
      }
      if (arrowRef.current.style.transform) {
        currentTransform = arrowRef.current.style.transform;
      }

      // Force arrow to be fully visible during transition
      arrowRef.current.style.transition = "none";
      arrowRef.current.style.opacity = "1";
      arrowRef.current.style.transform = "translateY(0px)";

      // Force reflow
      void arrowRef.current.offsetWidth;
    }

    // Now start the closing animation if needed, or just close
    if (arrowState === "nested") {
      // If in a nested modal, go back to the previous step
      console.log("Handling back arrow click for nested modal");
      closeModal(true);
    } else {
      // If in the main modal, close it
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
    <div className="absolute left-4 top-4 md:top-2 z-50">
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

    // Check for modal transition for special rendering
    const inTransition = isModalToModalTransition();

    // Detect if this is an initial render or a modal-to-modal transition
    // This ensures we don't override the animation start position on first render
    const wasModalClosed = !lastModalStateRef.current.isModalOpen;
    const isInitialModalOpen = isModalOpen && wasModalClosed;

    // CRITICAL FIX: Check if an opening animation is in progress
    const isOpeningAnimation = openingAnimationInProgressRef.current;

    // Mobile version of back arrow
    if (isMobileView) {
      return (
        <div
          ref={arrowRef}
          className={`fixed flex top-8 right-16 z-50 ${cursorStyle}`}
          onClick={handleBackArrowClick}
          style={{
            // CRITICAL FIX: Force hidden state during opening animation
            opacity: isOpeningAnimation
              ? 0
              : inTransition
              ? 1
              : arrowState === "hidden"
              ? 0
              : isInitialModalOpen
              ? 0
              : 1,
            transform: isOpeningAnimation
              ? "translateY(-30px)"
              : inTransition
              ? "translateY(0px)"
              : arrowState === "hidden"
              ? "translateY(-30px)"
              : isInitialModalOpen
              ? "translateY(-30px)"
              : "translateY(0px)",
            transition: "none", // No CSS transitions to interfere with our animations
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

    // Desktop version of back arrow
    return (
      <div
        ref={arrowRef}
        className={`fixed flex mx-auto top-[50px] md:top-[50px] z-[-1] w-full justify-center items-center ${cursorStyle}`}
        onClick={handleBackArrowClick}
        style={{
          // CRITICAL FIX: Force hidden state during opening animation
          opacity: isOpeningAnimation
            ? 0
            : inTransition
            ? 1
            : arrowState === "hidden"
            ? 0
            : isInitialModalOpen
            ? 0
            : 1,
          transform: isOpeningAnimation
            ? "translateY(-30px)"
            : inTransition
            ? "translateY(0px)"
            : arrowState === "hidden"
            ? "translateY(-30px)"
            : isInitialModalOpen
            ? "translateY(-30px)"
            : "translateY(0px)",
          transition: "none", // No CSS transitions to interfere with our animations
          pointerEvents: pointerEvents,
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
      </div>
    );
  };

  // Calculate navbar classes based on scroll state and screen size
  const getNavbarClasses = () => {
    // If not scrolled, return base padding
    if (!scrolled) return "pt-2 mt-0";

    // When scrolled, check screen size
    if (isLargeScreen) {
      return "pt-2 mt-0"; // Large screens (≥1450px)
    } else {
      return "pt-14 mt-0"; // Smaller screens (<1450px) - added pt-14
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-[3000]">
      <div className="relative z-[3000]">
        <Logo />
      </div>
      <div className="relative z-[-1]">
        <BackArrow />
      </div>

      {/* Mobile hamburger menu button */}
      <button
        className="absolute top-8 right-4 z-50 md:hidden bg-white rounded-full p-2 w-10 h-10"
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
        className={`w-full px-4 hidden md:flex justify-center transition-all duration-300 delay-150 ${getNavbarClasses()}`}
      >
        <div className="w-[800px] bg-white rounded-full px-4 py-2 md:py-4 shadow-md">
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
                    className={`relative text-xl z-10 font-medium font-montserrat pointer-events-none ${
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
