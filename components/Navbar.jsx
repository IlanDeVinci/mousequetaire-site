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
  const { isModalOpen, isNestedModal, closeModal } = useModal();
  const [wasModalOpen, setWasModalOpen] = useState(false);

  // Simplified arrow state - only 3 possible states
  const [arrowState, setArrowState] = useState("hidden"); // "hidden", "shown", or "nested"
  const arrowRef = useRef(null);
  const animationRef = useRef(null);

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

  // Simplified animation function
  const animateArrow = (show) => {
    // Cancel any existing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
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

    // Animation function
    const animate = () => {
      // Calculate progress (0 to 1), accounting for delay
      const elapsed = Date.now() - startTime;

      // If we're still in the delay period, handle appropriately
      if (elapsed < delayMs) {
        // During delay, keep arrow at full opacity for fade-out, or hidden for fade-in
        if (arrowRef.current) {
          arrowRef.current.style.opacity = show ? "0" : "1";
          // Keep position at start position during delay
          arrowRef.current.style.transform = show
            ? "translateY(-30px)"
            : "translateY(0px)";
        }
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      // Calculate actual animation progress after delay
      const animationElapsed = elapsed - delayMs;
      const rawProgress = Math.min(animationElapsed / duration, 1);

      // Apply easing for better animation feel
      const progress = show ? easeOutBack(rawProgress) : easeInOut(rawProgress);

      // If element doesn't exist yet, retry on next frame
      if (!arrowRef.current) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      // Apply transform and opacity based on direction
      if (show & !isNestedModal & !wasModalOpen) {
        // Animate in with bounce: from -30px up and 0 opacity to 0px and 1 opacity
        let y = -30;
        if (progress < 0.8) {
          // First part: come up more slowly
          y = -30 * (1 - progress / 0.8);
        } else {
          // Second part: gentler bounce
          const bounceProgress = (progress - 0.8) / 0.2;
          y = 8 * Math.sin(bounceProgress * Math.PI); // Reduced bounce height from 10 to 8
        }

        // More gradual fade in - ensure it's purely controlled by the animation
        const opacity = Math.min(progress * 1.2, 1); // Slightly faster fade-in but capped at 1

        arrowRef.current.style.opacity = opacity.toString();
        arrowRef.current.style.transform = `translateY(${y}px)`;
      } else {
        // Animate out: from 0px and 1 opacity to -30px and 0 opacity
        const y = -30 * progress; // Move up 30px (more noticeable)
        const opacity = 1 - progress;
        arrowRef.current.style.transform = `translateY(${y}px)`;
        arrowRef.current.style.opacity = opacity;
      }

      // Continue if not finished
      if (rawProgress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // Animation complete
        if (!show) {
          // If we were hiding, update the state to hidden AFTER animation completes
          setTimeout(() => {
            setArrowState("hidden");
          }, 100); // Small delay to ensure animation completes
        } else if (arrowRef.current) {
          // Ensure full opacity when animation completes for showing
          arrowRef.current.style.opacity = "1";
        }
      }
    };

    // Start animation
    animationRef.current = requestAnimationFrame(animate);
  };

  // Simplified modal state handler
  useEffect(() => {
    // Determine new arrow state based on modal states
    let newArrowState = "hidden";

    if (isModalOpen) {
      newArrowState = isNestedModal ? "nested" : "shown";
      setScrolled(true);
    } else if (window.scrollY <= 20) {
      setScrolled(false);
    }

    // Preserve opacity for modal-to-modal transitions
    const keepOpacity =
      arrowState !== "hidden" &&
      newArrowState !== "hidden" &&
      arrowState !== newArrowState;

    // Save current opacity if needed
    let currentOpacity = "0";
    if (keepOpacity && arrowRef.current) {
      currentOpacity = arrowRef.current.style.opacity || "1";
    }

    // Handle state transitions
    if (newArrowState === "hidden") {
      // Only animate out if currently showing
      if (arrowState !== "hidden") {
        // Make sure arrow is fully visible before starting hide animation
        if (arrowRef.current) {
          arrowRef.current.style.opacity = "1";
          arrowRef.current.style.transform = "translateY(0px)";
        }
        // Run animation to hide the arrow
        animateArrow(false);
      }
    } else if (arrowState === "hidden") {
      // Arrow is hidden but should be shown - render component first
      setArrowState(newArrowState);

      // Ensure initial opacity is 0 before animation starts
      if (arrowRef.current) {
        arrowRef.current.style.opacity = "0";
        arrowRef.current.style.transform = "translateY(-30px)";
      }

      // Use a small timeout to ensure the DOM has updated
      setTimeout(() => {
        // Start animation immediately
        animateArrow(true);
      }, 50);
    } else if (arrowState !== newArrowState) {
      // For all other state changes when arrow is already visible

      // Update state
      setArrowState(newArrowState);

      // Ensure opacity stays at 1 for modal-to-modal transitions
      if (keepOpacity) {
        // Use multiple techniques to ensure the style is preserved
        if (arrowRef.current) {
          // Immediate update
          arrowRef.current.style.opacity = "1";
          arrowRef.current.style.transform = "translateY(0px)";

          // Follow-up with requestAnimationFrame to ensure it applies after React updates
          requestAnimationFrame(() => {
            if (arrowRef.current) {
              arrowRef.current.style.opacity = "1";
              arrowRef.current.style.transform = "translateY(0px)";
            }
          });

          // And a final timeout for extra reliability
          setTimeout(() => {
            if (arrowRef.current) {
              arrowRef.current.style.opacity = "1";
              arrowRef.current.style.transform = "translateY(0px)";
            }
          }, 1);
        }
      }
    }
  }, [isModalOpen, isNestedModal, arrowState]);

  const pathname = usePathname();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Close mobile menu when clicking a link
  const handleLinkClick = () => {
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  // Back arrow function for modals - modified to handle non-clickable state
  const handleBackArrowClick = () => {
    // Only process click if modal is actually open
    if (!isModalOpen) return;

    // Start the animation first
    if (arrowRef.current) {
      // Make sure arrow is fully visible when clicked
      arrowRef.current.style.opacity = "1";
      arrowRef.current.style.transform = "translateY(0px)";
    }

    // Delay the actual modal close to allow animation to run
    setTimeout(() => {
      if (arrowState === "nested") {
        // If in a nested modal, go back to the previous step
        console.log("Handling back arrow click for nested modal");
        closeModal(true);
      } else {
        // If in the main modal, close it
        console.log("Handling back arrow click for main modal");
        closeModal();
      }
    }, 50); // Small delay before triggering state change
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
                "drop-shadow(0 0 10px rgba(0, 0, 0, 0.7)) drop-shadow(0 0 15px rgba(0, 0, 0, 0.5))",
            }}
            priority
          />
        </div>
      </Link>
    </div>
  );

  // Simplified Back arrow component
  const BackArrow = () => {
    // Determine label based on arrow state
    const arrowLabel = arrowState === "nested" ? "Retour" : "Fermer";

    // Determine if arrow should be clickable
    const isClickable = isModalOpen;
    const cursorStyle = isClickable ? "cursor-pointer" : "cursor-default";
    const pointerEvents = isClickable ? "auto" : "none";

    // Mobile version of back arrow
    if (isMobileView) {
      return (
        <div
          ref={arrowRef}
          className={`fixed flex top-8 right-16 z-50 ${cursorStyle}`}
          onClick={handleBackArrowClick}
          style={{
            opacity: 0, // Always start with opacity 0
            transform: "translateY(-30px)",
            transition: "none", // Ensure no CSS transitions interfere with our animation
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

    // Desktop version of back arrow (original)
    return (
      <div
        ref={arrowRef}
        className={`fixed flex mx-auto top-[50px] md:top-[50px] z-[-1] w-full justify-center items-center ${cursorStyle}`}
        onClick={handleBackArrowClick}
        style={{
          opacity: isNestedModal ? 1 : 0, // Always start with opacity 0
          transform: "translateY(-30px)",
          transition: "none", // Ensure no CSS transitions interfere with our animation
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
