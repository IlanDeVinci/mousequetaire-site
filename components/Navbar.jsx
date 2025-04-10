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
  const { isModalOpen, isNestedModal, setNestedModal, closeModal } = useModal();
  const [isFirstRender, setIsFirstRender] = useState(true);
  const animationPlayed = useRef(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [arrowVisible, setArrowVisible] = useState(false);
  const previousModalState = useRef({ isOpen: false, isNested: false });

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

  // Reset animation tracking when modal closes
  useEffect(() => {
    if (!isModalOpen) {
      setTimeout(() => {
        animationPlayed.current = false;
      }, 1000); // Wait for animation to finish before resetting
    }
  }, [isModalOpen]);

  // Effect to handle arrow visibility and animation timing
  useEffect(() => {
    // Skip on first render
    if (isFirstRender) return;

    // Only animate when going from closed to open (initial modal open)
    // or from open to closed (final modal close)
    const isInitialOpen = !previousModalState.current.isOpen && isModalOpen;
    const isFinalClose = previousModalState.current.isOpen && !isModalOpen;

    // Detect if we're just switching between nested/non-nested states
    const isNestedStateChange =
      previousModalState.current.isOpen &&
      isModalOpen &&
      previousModalState.current.isNested !== isNestedModal;

    // Show arrow when modal opens initially
    if (isInitialOpen) {
      setShouldAnimate(true);
      setArrowVisible(true);
    }
    // Animate out when fully closing
    else if (isFinalClose) {
      setShouldAnimate(true);
    }
    // Just update without animation when switching nested states
    else if (isNestedStateChange) {
      setShouldAnimate(false);
    }

    // Update previous state for next comparison
    previousModalState.current = {
      isOpen: isModalOpen,
      isNested: isNestedModal,
    };
  }, [isModalOpen, isNestedModal, isFirstRender]);

  // Handle hiding the arrow after animation completes
  useEffect(() => {
    if (!isModalOpen) {
      const timer = setTimeout(() => {
        setArrowVisible(false);
        // Reset animation state after completion
        setShouldAnimate(false);
      }, 600); // Should match animation duration
      return () => clearTimeout(timer);
    }
  }, [isModalOpen]);

  // Remove first render state after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFirstRender(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

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

  // Back arrow component that appears when modal is open
  const BackArrow = () => {
    // Don't render until needed
    if (!arrowVisible && !isModalOpen) return null;

    // Determine animation class based on modal state and whether we should animate
    const animationClass = shouldAnimate
      ? isModalOpen
        ? "animate-arrow-in"
        : "animate-arrow-out"
      : isModalOpen
      ? "opacity-100"
      : "opacity-0";

    // Determine the correct label based on modal state
    const arrowLabel = isNestedModal ? "Retour" : "Fermer";

    return (
      <div
        className={`fixed flex mx-auto top-[50px] md:top-[70px] z-[-1] w-full justify-center items-center cursor-pointer ${animationClass}`}
        onClick={handleBackArrowClick}
        style={{ transform: "translateZ(-1px)" }}
        aria-label={arrowLabel}
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
  };

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
            opacity: 0.9;
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
          30% {
            opacity: 0.7;
            transform: translateY(5px) scale(0.95);
          }
          100% {
            opacity: 0;
            transform: translateY(-60px) scale(0.8);
          }
        }

        .animate-arrow-in {
          animation: arrowIn 0.65s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s
            forwards;
          opacity: 0; /* Start with opacity 0 to prevent flash */
          animation-iteration-count: 1; /* Ensure animation only plays once */
          animation-fill-mode: forwards; /* Maintain final state */
        }

        .animate-arrow-out {
          animation: arrowOut 0.5s cubic-bezier(0.55, 0.085, 0.68, 0.53)
            forwards;
          animation-iteration-count: 1; /* Ensure animation only plays once */
          animation-fill-mode: forwards; /* Maintain final state */
        }
      `}</style>
    </header>
  );
};

export default Navbar;
