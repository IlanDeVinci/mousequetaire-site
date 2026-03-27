"use client";

import Image from "next/image";
import { useRef, useEffect } from "react";
import ScrollReveal from "../ScrollReveal";
import { useGSAP } from "../../context/GSAPContext";

export default function TeamMember({ image, name, role, description, reverse }) {
  const isDorian = name === "Dorian Collet";
  const memberRef = useRef(null);
  const { gsap, contextReady } = useGSAP();

  useEffect(() => {
    if (!contextReady || !gsap || !memberRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          gsap.fromTo(
            memberRef.current,
            {
              opacity: 0,
              x: reverse ? 50 : -50,
              rotationY: reverse ? 15 : -15,
            },
            {
              opacity: 1,
              x: 0,
              rotationY: 0,
              duration: 1,
              ease: "power3.out",
              delay: 0.1,
            }
          );
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(memberRef.current);

    return () => observer.disconnect();
  }, [contextReady, gsap, reverse]);

  return (
    <ScrollReveal
      animation={reverse ? "fade-left" : "fade-right"}
      delay={100}
      className={`flex flex-col md:flex-row items-center mb-8 md:mb-12`}
    >
      <article
        ref={memberRef}
        className={`flex flex-col ${
          reverse ? "md:flex-row-reverse" : "md:flex-row"
        } items-center mb-8 md:mb-12`}
      >
        <div className="rounded-full overflow-hidden shrink-0 w-[120px] h-[120px] sm:w-[150px] sm:h-[150px] md:w-[180px] md:h-[180px] lg:w-[200px] lg:h-[200px] mb-4 md:mb-0">
          <Image
            src={image}
            alt={`Photo de ${name}`}
            width={200}
            height={200}
            className={`w-full h-full object-cover object-top ${
              isDorian ? "scale-125" : ""
            }`}
          />
        </div>
        <div
          className={`${
            reverse ? "mr-4 md:mr-6 lg:mr-12" : "ml-4 md:ml-6 lg:ml-12"
          } text-center md:text-left ${reverse ? "md:text-right" : ""} text-lg`}
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl">{name}</h2>
          <h3 className="text-[#87D7FF] my-2 text-base sm:text-lg md:text-xl">
            {role}
          </h3>
          <p className="text-xs sm:text-sm md:text-base">{description}</p>
        </div>
      </article>
    </ScrollReveal>
  );
}
