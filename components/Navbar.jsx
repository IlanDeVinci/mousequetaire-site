"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import { useModal } from "@/context/ModalContext";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const { isModalOpen, isNestedModal, closeModal } = useModal();
  const [isFirstRender, setIsFirstRender] = useState(true);

  // Set default animation state to true to prevent showing "out" animation first
  const [arrowVisible, setArrowVisible] = useState(false);
  const [arrowAnimating, setArrowAnimating] = useState(true);

  // Enhanced tracking to prevent animation issues
  const currentAnimationRef = useRef(null);
  const arrowElementRef = useRef(null);
  const animationStateRef = useRef("initial");
  const animationLockRef = useRef(false);
  const processedModalStateRef = useRef(false);
  const uniqueAnimationIdRef = useRef(Date.now());

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1450); // 768px is md breakpoint in Tailwind
    };

    // Initialize on mount
    handleResize();

    // Add event listeners
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Set scrolled to true when modal is open
  useEffect(() => {
    if (isModalOpen) {
      setScrolled(true);
    } else if (window.scrollY <= 20) {
      // Only reset to false if we're actually at the top of the page
      setScrolled(false);
    }
  }, [isModalOpen]);

  useEffect(() => {
    // After first render, set isFirstRender to false
    setIsFirstRender(false);
  }, []);

  // Completely rewritten animation controller with strict state control
  useEffect(() => {
    if (isFirstRender) return;

    // Important: Don't re-trigger animation logic if we're already processing this modal state
    if (processedModalStateRef.current === isModalOpen) return;
    processedModalStateRef.current = isModalOpen;

    // Reset animation lock on each modal state change
    animationLockRef.current = false;

    // Function to handle animation cleanup
    const clearAnimations = () => {
      if (arrowElementRef.current) {
        arrowElementRef.current.style.animation = "none";
        arrowElementRef.current.classList.remove(
          "animate-arrow-in",
          "animate-arrow-out"
        );
        void arrowElementRef.current.offsetWidth;
      }

      if (currentAnimationRef.current) {
        clearTimeout(currentAnimationRef.current);
        currentAnimationRef.current = null;
      }
    };

    // Opening modal - with strict once-only execution
    if (isModalOpen && !arrowVisible) {
      // Skip if already animating or we're already in visible/entering state
      if (
        animationLockRef.current ||
        animationStateRef.current === "entering" ||
        animationStateRef.current === "visible"
      ) {
        return;
      }

      console.log("[Arrow Debug] Modal opened - Starting show sequence");
      clearAnimations();

      // Set lock to prevent multiple animations
      animationLockRef.current = true;

      // Set internal state to track what we're doing
      animationStateRef.current = "entering";
      uniqueAnimationIdRef.current = Date.now();

      // First make the arrow visible with the "in" animation ready
      setArrowVisible(true);

      // Apply animation state after a short delay to ensure DOM is updated
      const animationId = uniqueAnimationIdRef.current;
      currentAnimationRef.current = setTimeout(() => {
        // Only proceed if this is still the active animation request
        if (animationId === uniqueAnimationIdRef.current) {
          setArrowAnimating(true);
          console.log("[Arrow Debug] Arrow animation triggered");
        }
      }, 50);

      // Mark animation as complete after full duration
      currentAnimationRef.current = setTimeout(() => {
        if (animationId === uniqueAnimationIdRef.current) {
          console.log("[Arrow Debug] Entrance animation should be complete");
          animationStateRef.current = "visible";
          animationLockRef.current = false;
        }
      }, 850);
    }
    // Closing modal - with strict once-only execution
    else if (!isModalOpen && arrowVisible) {
      // Skip if already in exit animation
      if (animationLockRef.current || animationStateRef.current === "exiting") {
        return;
      }

      console.log("[Arrow Debug] Modal closed - Starting hide sequence");
      clearAnimations();

      // Set lock to prevent multiple animations
      animationLockRef.current = true;

      // Mark as exiting
      animationStateRef.current = "exiting";

      // Start exit animation
      setArrowAnimating(false);

      // Wait for exit animation to complete before hiding
      currentAnimationRef.current = setTimeout(() => {
        console.log("[Arrow Debug] Exit animation complete - Hiding arrow");
        setArrowVisible(false);
        animationStateRef.current = "hidden";
        animationLockRef.current = false;
      }, 350);
    }

    return () => {
      if (currentAnimationRef.current) {
        clearTimeout(currentAnimationRef.current);
      }
    };
  }, [isModalOpen, isFirstRender]);

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

  // Back arrow function for modals
  const handleBackArrowClick = () => {
    if (isNestedModal) {
      // If in a nested modal, go back to the previous step
      closeModal(true); // Pass 'true' to indicate we're just going back one level, not closing completely
    } else if (isModalOpen) {
      // If in the main modal, close it
      closeModal();
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
            className="object-contain drop-shadow-[0_0_8px_rgba(0,0,0,0.35)] filter"
            style={{ filter: "drop-shadow(0 0 8px rgba(0, 0, 0, 0.35))" }}
            priority
          />
        </div>
      </Link>
    </div>
  );

  // Back arrow component with memoization to prevent re-renders
  const BackArrow = useCallback(() => {
    // Don't render if not visible
    if (!arrowVisible) return null;

    const arrowLabel = isNestedModal ? "Retour" : "Fermer";
    const animationId = uniqueAnimationIdRef.current;

    // Prevent duplicate animation events
    const handleAnimationStart = (e) => {
      if (e.animationName !== "arrowIn" && e.animationName !== "arrowOut")
        return;
      const animName = e.animationName === "arrowIn" ? "ENTER" : "EXIT";
      console.log(`[Arrow Debug] Animation started: ${animName}`);
    };

    const handleAnimationEnd = (e) => {
      if (e.animationName !== "arrowIn" && e.animationName !== "arrowOut")
        return;
      const animName = e.animationName === "arrowIn" ? "ENTER" : "EXIT";
      console.log(`[Arrow Debug] Animation ended: ${animName}`);
    };

    // Use key prop to force complete remount when animation changes
    return (
      <div
        ref={arrowElementRef}
        key={`arrow-${arrowAnimating ? "in" : "out"}-${animationId}`}
        className={`fixed flex mx-auto top-[50px] md:top-[70px] z-[-1] w-full justify-center items-center cursor-pointer ${
          arrowAnimating ? "animate-arrow-in" : "animate-arrow-out"
        }`}
        onClick={handleBackArrowClick}
        style={{ transform: "translateZ(-1px)" }}
        aria-label={arrowLabel}
        onAnimationStart={handleAnimationStart}
        onAnimationEnd={handleAnimationEnd}
        data-animation-state={animationStateRef.current}
      >
        <div className="bg-[#04ACFF] rounded-full p-3 shadow-md flex w-28 items-center justify-center transition-transform hover:scale-105">
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
        <span className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 text-white text-xs whitespace-nowrap opacity-80">
          {arrowLabel}
        </span>
      </div>
    );
  }, [
    arrowVisible,
    isNestedModal,
    arrowAnimating,
    uniqueAnimationIdRef.current,
    handleBackArrowClick,
  ]);

  // Calculate navbar classes based on scroll state and screen size
  const getNavbarClasses = () => {
    // Always use pt-12 mt-4 for non-scrolled state
    if (!scrolled) return "pt-12 mt-4";

    // When scrolled, only remove padding/margin on large screens
    return isLargeScreen ? "pt-0 mt-0" : "pt-12 mt-4";
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

      {/* Add bounce-in and bounce-out animations to global styles */}
      <style jsx global>{`
        @keyframes arrowIn {
          0% {
            opacity: 0;
            transform: translateY(-60px) scale(0.8);
          }
          50% {
            opacity: 0.7;
            transform: translateY(8px) scale(1.05);
          }
          75% {
            transform: translateY(-4px) scale(0.98);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes arrowOut {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-60px) scale(0.8);
          }
        }

        .animate-arrow-in {
          will-change: transform, opacity;
          animation-name: arrowIn !important;
          animation-duration: 0.65s !important;
          animation-timing-function: cubic-bezier(
            0.34,
            1.56,
            0.64,
            1
          ) !important;
          animation-delay: 0.5s !important;
          animation-fill-mode: forwards !important;
          animation-iteration-count: 1 !important;
          opacity: 0;
        }

        .animate-arrow-out {
          will-change: transform, opacity;
          animation-name: arrowOut !important;
          animation-duration: 0.3s !important;
          animation-timing-function: cubic-bezier(
            0.55,
            0.085,
            0.68,
            0.53
          ) !important;
          animation-delay: 0s !important;
          animation-fill-mode: forwards !important;
          animation-iteration-count: 1 !important;
        }
      `}</style>
    </header>
  );
};

export default Navbar;
