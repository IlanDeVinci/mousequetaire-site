"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isLight = scrolled || isHovered;

  const pathname = usePathname();

  return (
    <nav
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`fixed w-full z-50 transition-colors duration-300 border-b ${
        isLight
          ? "bg-[#7DD4FF] border-[#006A9E]/10"
          : "bg-[#002132] border-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link
          href="/"
          onClick={(e) => {
            if (pathname === "/") {
              e.preventDefault();
            }
          }}
          className="flex items-center transform hover:scale-105 transition-transform duration-300"
        >
          <div className="relative w-[200px] h-[40px]">
            <Image
              src="/logodark.png"
              alt="Mousequetaire Logo Dark"
              fill
              className={`object-contain transition-opacity duration-300 ${
                isLight ? "opacity-100" : "opacity-0"
              }`}
            />
            <Image
              src="/logo.png"
              alt="Mousequetaire Logo Light"
              fill
              className={`object-contain transition-opacity duration-300 ${
                isLight ? "opacity-0" : "opacity-100"
              }`}
            />
          </div>
        </Link>
        <div className="hidden md:flex space-x-6">
          {["Accueil", "Nos services", "A propos", "Portfolio", "Contact"].map(
            (item) => (
              <Link
                key={item}
                href={
                  item === "Accueil"
                    ? "/"
                    : `/${item.toLowerCase().replace(" ", "")}`
                }
                onClick={(e) => {
                  if (item === "Accueil" && pathname === "/") {
                    e.preventDefault();
                  }
                }}
                className="relative px-4 py-2 transition-all duration-300 rounded-full group"
              >
                <span className="relative z-10 text-white font-medium font-montserrat">
                  {item}
                </span>
                <span
                  className={`absolute inset-0 rounded-full transition-all duration-300 ease-out
			${
        isLight
          ? "bg-[#002132] group-hover:bg-[#003152]"
          : "bg-transparent group-hover:bg-[#003152]/50"
      }`}
                ></span>
              </Link>
            )
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
