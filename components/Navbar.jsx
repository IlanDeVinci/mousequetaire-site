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
  const { isModalOpen, isNestedModal, closeModal } = useModal();

  // Remove CSS animation and use pure JS approach
  const [showArrow, setShowArrow] = useState(false);
  const arrowRef = useRef(null);
  const animationRef = useRef(null);
  const isAnimatingRef = useRef(false);
  const lastModalStateRef = useRef({ isOpen: false, isNested: false });

  // Basic scroll and resize handlers
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    const handleResize = () => setIsLargeScreen(window.innerWidth >= 1450);

    handleResize();
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Clean up any ongoing animations when component unmounts
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Enhanced arrow animation function with bounce effect
  const animateArrow = (show) => {
    // If we are already animating, cancel the current animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    // Set a flag to indicate we're animating
    isAnimatingRef.current = true;

    // Make the arrow visible if showing
    if (show && !showArrow) {
      setShowArrow(true);
    }

    // Get the current time
    const startTime = Date.now();

    // Set animation parameters
    const duration = show ? 800 : 300; // ms - longer for entrance with bounce

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
      // Calculate progress (0 to 1)
      const elapsed = Date.now() - startTime;
      const rawProgress = Math.min(elapsed / duration, 1);

      // Apply easing for better animation feel
      const progress = show ? easeOutBack(rawProgress) : easeInOut(rawProgress);

      // If element doesn't exist yet, stop animation
      if (!arrowRef.current) {
        if (show) {
          // If showing, retry on next frame until element is available
          animationRef.current = requestAnimationFrame(animate);
        } else {
          // If hiding and element doesn't exist, we're done
          isAnimatingRef.current = false;
        }
        return;
      }

      // Apply transform and opacity based on direction
      if (show) {
        // Animate in with bounce: from -30px up and 0 opacity to 0px and 1 opacity
        let y = 0;
        if (progress < 0.7) {
          // First part: come up quickly
          y = -30 * (1 - progress / 0.7);
        } else {
          // Second part: small bounce
          const bounceProgress = (progress - 0.7) / 0.3;
          y = 10 * Math.sin(bounceProgress * Math.PI);
        }

        const opacity = Math.min(1, progress * 1.5); // Fade in faster than the animation
        arrowRef.current.style.transform = `translateY(${y}px)`;
        arrowRef.current.style.opacity = opacity;
      } else {
        // Animate out: from 0px and 1 opacity to -20px and 0 opacity
        const y = -20 * progress;
        const opacity = 1 - progress;
        arrowRef.current.style.transform = `translateY(${y}px)`;
        arrowRef.current.style.opacity = opacity;
      }

      // Continue if not finished
      if (rawProgress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // Animation complete
        isAnimatingRef.current = false;

        // If hiding, remove from DOM after animation
        if (!show) {
          setShowArrow(false);
        }
      }
    };

    // Start animation
    animationRef.current = requestAnimationFrame(animate);
  };

  // Modified modal state handler to manage nested modal transitions
  useEffect(() => {
    // Track changes in modal state
    const modalStateChanged =
      isModalOpen !== lastModalStateRef.current.isOpen ||
      isNestedModal !== lastModalStateRef.current.isNested;

    // Store the previous state for reference before updating
    const wasOpen = lastModalStateRef.current.isOpen;
    const wasNested = lastModalStateRef.current.isNested;

    // Update the reference to current state
    lastModalStateRef.current = {
      isOpen: isModalOpen,
      isNested: isNestedModal,
    };

    // Handle arrow visibility and animation
    if (isModalOpen) {
      setScrolled(true);

      // For initial modal open, animate arrow entrance
      if (!showArrow) {
        console.log("Starting arrow entrance animation");
        setTimeout(() => animateArrow(true), 100);
      }
      // For transitions between modal states when arrow is already showing
      else if (modalStateChanged) {
        console.log("Modal state changed, ensuring arrow stays visible");

        // Critical fix: Make sure arrow stays visible during all modal transitions
        if (arrowRef.current) {
          // Only update label without affecting visibility
          const currentTransform = arrowRef.current.style.transform;
          const currentOpacity = arrowRef.current.style.opacity;

          // Ensure opacity is at least 1 during transitions
          if (parseFloat(currentOpacity) < 1) {
            arrowRef.current.style.opacity = "1";
          }

          // Ensure transform is in a good position
          if (
            !currentTransform ||
            currentTransform.includes("translateY(-20px)")
          ) {
            arrowRef.current.style.transform = "translateY(0px)";
          }
        }
      }
    } else {
      // Only animate exit when closing from a non-transitional state
      if (showArrow) {
        console.log("Starting arrow exit animation");
        animateArrow(false);
      }

      if (window.scrollY <= 20) {
        setScrolled(false);
      }
    }
  }, [isModalOpen, isNestedModal, showArrow]);

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
      console.log("Handling back arrow click for nested modal");
      closeModal(true); // Pass 'true' to indicate we're just going back one level, not closing completely
    } else if (isModalOpen) {
      // If in the main modal, close it
      console.log("Handling back arrow click for main modal");
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

  // Back arrow component with improved animation and text updates
  const BackArrow = () => {
    if (!showArrow) return null;

    const arrowLabel = isNestedModal ? "Retour" : "Fermer";

    return (
      <div
        ref={arrowRef}
        className="fixed flex mx-auto top-[50px] md:top-[70px] z-[-1] w-full justify-center items-center cursor-pointer"
        onClick={handleBackArrowClick}
        style={{
          transform: "translateY(-20px)",
          opacity: 0,
          transition: "none", // Disable CSS transitions
        }}
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
    </header>
  );
};

export default Navbar;
