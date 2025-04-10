"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useModal } from "@/context/ModalContext";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const { isModalOpen } = useModal();

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
          />
        </div>
      </Link>
    </div>
  );

  // Calculate navbar classes based on scroll state and screen size
  const getNavbarClasses = () => {
    // Always use pt-12 mt-4 for non-scrolled state
    if (!scrolled) return "pt-12 mt-4";

    // When scrolled, only remove padding/margin on large screens
    return isLargeScreen ? "pt-0 mt-0" : "pt-12 mt-4";
  };

  return (
    <header className="fixed top-0 left-0 w-full z-[3000]">
      <Logo />

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
        className={`w-full px-4 hidden md:flex justify-center transition-all duration-300 ${getNavbarClasses()}`}
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
