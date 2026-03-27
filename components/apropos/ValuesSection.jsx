"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import ScrollReveal from "../ScrollReveal";
import { useGSAP } from "../../context/GSAPContext";

export default function ValuesSection() {
  const [hoveredValue1, setHoveredValue1] = useState(false);
  const [hoveredValue2, setHoveredValue2] = useState(false);
  const [hoveredValue3, setHoveredValue3] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const value1Ref = useRef(null);
  const value2Ref = useRef(null);
  const value3Ref = useRef(null);
  const { gsap, contextReady } = useGSAP();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia("(max-width: 768px)").matches);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleValueHover = (valueNumber, isHovering) => {
    if (!contextReady || !gsap) return;

    const refs = [value1Ref, value2Ref, value3Ref];
    const setters = [setHoveredValue1, setHoveredValue2, setHoveredValue3];
    const ref = refs[valueNumber - 1];
    const setter = setters[valueNumber - 1];

    if (!ref.current) return;

    const content = ref.current.querySelector(".value-content");
    const textElement = content?.querySelector("p");

    if (!content || !textElement) return;

    if (isHovering) {
      // Smooth scale animation for the content
      gsap.to(content, {
        transformOrigin: valueNumber === 2 ? "right center" : "left center",
        scaleX: 1,
        duration: 0.1,
        ease: "power2.out",
      });

      // Fade text animation - change state only after fade out is complete
      gsap.to(textElement, {
        opacity: 0,
        duration: 0.15,
        ease: "power2.out",
        onComplete: () => {
          setter(true);
          gsap.to(textElement, {
            opacity: 1,
            duration: 0.15,
            ease: "power2.out",
          });
        },
      });
    } else {
      // Return to normal with smooth ease
      gsap.to(content, {
        scaleX: 1,
        duration: 0.15,
        ease: "power2.out",
      });

      // Fade text back - change state only after fade out is complete
      gsap.to(textElement, {
        opacity: 0,
        duration: 0.2,
        ease: "power2.out",
        onComplete: () => {
          setter(false);
          gsap.to(textElement, {
            opacity: 1,
            duration: 0.15,
            ease: "power2.out",
          });
        },
      });
    }
  };

  return (
    <section className="text-center my-16 pb-24 md:my-24 md:pb-32">
      <ScrollReveal animation="fade-up" delay={100}>
        <h1 className="text-3xl md:text-4xl my-12 md:my-16 md:mb-24">
          Nos valeurs
        </h1>
      </ScrollReveal>

      <ScrollReveal animation="fade-right" delay={200} threshold={0.2}>
        <div
          ref={value1Ref}
          className="relative px-2 md:px-4 py-24 sm:py-28 md:py-32 flex justify-center overflow-visible w-full cursor-pointer group"
          onMouseEnter={() => !isMobile && handleValueHover(1, true)}
          onMouseLeave={() => !isMobile && handleValueHover(1, false)}
          onClick={() => isMobile && setHoveredValue1(!hoveredValue1)}
        >
          {/* Invisible hitbox layer that covers the rectangle area */}
          <div className="absolute top-1/2 left-[40px] md:left-[60px] transform -translate-y-1/2 h-[180px] sm:h-[180px] md:h-[180px] lg:h-[200px] w-[85%] sm:w-[80%] md:w-[65%] lg:w-[55%] z-40"></div>

          <div
            className={`absolute top-0 rounded-r-full bg-[#00527A] text-white p-4 md:p-8
                    h-[180px] sm:h-[180px] md:h-[180px] lg:h-[200px] left-0 z-10
                    transition-all duration-500 ease-out
                    ${
                      hoveredValue1
                        ? "w-[95vw] md:w-[85vw] lg:w-[80vw]"
                        : "w-[85%] sm:w-[80%] md:w-[60%] lg:w-[45%]"
                    } group-hover:shadow-lg`}
          ></div>

          <div
            className={`absolute top-0 rounded-r-full bg-[#006A9E] text-white p-4 md:p-8
                    h-[180px] sm:h-[180px] md:h-[180px] lg:h-[200px] left-[-20px] md:left-[-40px] z-20
                    transition-all duration-500 ease-out
                    ${
                      hoveredValue1
                        ? "w-[95vw] md:w-[85vw] lg:w-[80vw]"
                        : "w-[85%] sm:w-[80%] md:w-[60%] lg:w-[45%]"
                    } group-hover:shadow-lg`}
          ></div>

          <div
            className={`absolute top-0 rounded-r-full bg-[#0091D9] text-white pl-4 md:pl-8
                    flex items-center gap-2 md:gap-4 value-content
                    transition-all duration-500 ease-out
                    h-[180px] sm:h-[180px] md:h-[180px] lg:h-[200px] left-[-40px] md:left-[-80px] z-30
                    ${
                      hoveredValue1
                        ? "w-[95vw] md:w-[85vw] lg:w-[80vw]"
                        : "w-[85%] sm:w-[80%] md:w-[60%] lg:w-[45%]"
                    } group-hover:shadow-lg`}
          >
            <div className="shrink-0 ml-[40px] md:ml-[60px] lg:ml-[80px] -left-8 md:left-0">
              <Image
                src="/images/valeur1.svg"
                alt="Icon Entraide"
                width={100}
                height={100}
                className="w-[40px] h-[40px] sm:w-[60px] sm:h-[60px] md:w-[100px] md:h-[100px] rounded-full"
              />
            </div>
            <div className="overflow-hidden h-full flex items-center">
              <p
                className={`text-[10px] xs:text-[11px] sm:text-xs md:text-sm lg:text-base ${
                  hoveredValue1
                    ? "font-montserrat font-bold"
                    : "font-montserrat font-extrabold whitespace-nowrap"
                } transition-all duration-500 ease-out text-left`}
              >
                {hoveredValue1 ? (
                  <span className="fade-in-text overflow-y-auto max-h-{170px] sm:max-h-[160px] md:max-h-[150px] lg:max-h-[170px] block w-[60vw] sm:w-[50vw] md:w-[55vw] lg:w-[60vw] font-montserrat font-bold text-[10px] xs:text-[10px] sm:text-xs md:text-[13px] lg:text-sm">
                    L&apos;entraide est au c&oelig;ur de notre ADN, car nous
                    savons que les meilleures solutions naissent du partage
                    des id&eacute;es et des comp&eacute;tences. Notre collaboration
                    quotidienne nous permet de voir chaque d&eacute;fi sous
                    plusieurs angles et d&apos;y apporter des r&eacute;ponses plus
                    innovantes. Ensemble, nous transformons vos projets en
                    succ&egrave;s collectifs o&ugrave; la satisfaction de nos clients est
                    notre plus belle r&eacute;compense.
                  </span>
                ) : (
                  "Entraide Collaboration"
                )}
              </p>
            </div>
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal animation="fade-left" delay={300} threshold={0.2}>
        <div
          ref={value2Ref}
          className="relative px-2 md:px-4 py-24 sm:py-28 md:py-32 flex justify-center overflow-visible w-full cursor-pointer group"
          onMouseEnter={() => !isMobile && handleValueHover(2, true)}
          onMouseLeave={() => !isMobile && handleValueHover(2, false)}
          onClick={() => isMobile && setHoveredValue2(!hoveredValue2)}
        >
          {/* Invisible hitbox layer that covers the rectangle area */}
          <div className="absolute top-1/2 right-[40px] md:right-[60px] transform -translate-y-1/2 h-[180px] sm:h-[180px] md:h-[180px] lg:h-[200px] w-[85%] sm:w-[80%] md:w-[65%] lg:w-[55%] z-40"></div>

          <div
            className={`absolute top-0 rounded-l-full bg-[#00527A] text-white p-4 md:p-8
                    h-[180px] sm:h-[180px] md:h-[180px] lg:h-[200px] right-0 z-10
                    transition-all duration-500 ease-out
                    ${
                      hoveredValue2
                        ? "w-[95vw] md:w-[85vw] lg:w-[80vw]"
                        : "w-[85%] sm:w-[80%] md:w-[60%] lg:w-[45%]"
                    } group-hover:shadow-lg`}
          ></div>

          <div
            className={`absolute top-0 rounded-l-full bg-[#006A9E] text-white p-4 md:p-8
                    h-[180px] sm:h-[180px] md:h-[180px] lg:h-[200px] right-[-20px] md:right-[-40px] z-20
                    transition-all duration-500 ease-out
                    ${
                      hoveredValue2
                        ? "w-[95vw] md:w-[85vw] lg:w-[80vw]"
                        : "w-[85%] sm:w-[80%] md:w-[60%] lg:w-[45%]"
                    } group-hover:shadow-lg`}
          ></div>

          <div
            className={`absolute top-0 rounded-l-full bg-[#0091D9] text-white pr-4 md:pr-8
                    flex items-center justify-end gap-2 md:gap-4 value-content
                    transition-all duration-500 ease-out
                    h-[180px] sm:h-[180px] md:h-[180px] lg:h-[200px] right-[-40px] md:right-[-80px] z-30
                    ${
                      hoveredValue2
                        ? "w-[95vw] md:w-[85vw] lg:w-[80vw]"
                        : "w-[85%] sm:w-[80%] md:w-[60%] lg:w-[45%]"
                    } group-hover:shadow-lg`}
          >
            <div className="overflow-hidden h-full flex items-center grow justify-end">
              <p
                className={`text-[10px] xs:text-[11px] sm:text-xs md:text-sm lg:text-base ${
                  hoveredValue2
                    ? "font-montserrat font-bold"
                    : "font-montserrat font-extrabold whitespace-nowrap"
                } transition-all duration-500 ease-out text-right`}
              >
                {hoveredValue2 ? (
                  <span className="fade-in-text overflow-y-auto max-h-{170px] sm:max-h-[160px] md:max-h-[150px] lg:max-h-[170px] block w-[60vw] sm:w-[50vw] md:w-[55vw] lg:w-[60vw] font-montserrat font-bold text-[10px] xs:text-[11px] sm:text-xs md:text-[13px] lg:text-sm">
                    L&apos;innovation guide chacune de nos d&eacute;cisions, nous
                    poussant constamment &agrave; explorer de nouvelles approches
                    pour r&eacute;soudre vos d&eacute;fis num&eacute;riques. Notre cr&eacute;ativit&eacute; se
                    nourrit de curiosit&eacute;, d&apos;exp&eacute;rimentation et
                    d&apos;une volont&eacute; de d&eacute;passer les solutions
                    conventionnelles. Nous transformons les contraintes en
                    opportunit&eacute;s cr&eacute;atives, apportant &agrave; vos projets cette
                    &eacute;tincelle qui les rend uniques et m&eacute;morables.
                  </span>
                ) : (
                  "Innovation Cr\u00e9ativit\u00e9"
                )}
              </p>
            </div>
            <div className="shrink-0 mr-[40px] md:mr-[60px] lg:mr-[80px]">
              <Image
                src="/images/valeur2.svg"
                alt="Icon Innovation"
                width={100}
                height={100}
                className="w-[40px] h-[40px] sm:w-[60px] sm:h-[60px] md:w-[100px] md:h-[100px] rounded-full"
              />
            </div>
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal animation="fade-right" delay={400} threshold={0.2}>
        <div
          ref={value3Ref}
          className="relative px-2 md:px-4 py-24 sm:py-28 md:py-32 flex justify-center overflow-visible w-full cursor-pointer group"
          onMouseEnter={() => !isMobile && handleValueHover(3, true)}
          onMouseLeave={() => !isMobile && handleValueHover(3, false)}
          onClick={() => isMobile && setHoveredValue3(!hoveredValue3)}
        >
          {/* Invisible hitbox layer that covers the rectangle area */}
          <div className="absolute top-1/2 left-[40px] md:left-[60px] transform -translate-y-1/2 h-[180px] sm:h-[180px] md:h-[180px] lg:h-[200px] w-[85%] sm:w-[80%] md:w-[65%] lg:w-[55%] z-40"></div>

          <div
            className={`absolute top-0 rounded-r-full bg-[#00527A] text-white p-4 md:p-8
                    h-[180px] sm:h-[180px] md:h-[180px] lg:h-[200px] left-0 z-10
                    transition-all duration-500 ease-out
                    ${
                      hoveredValue3
                        ? "w-[95vw] md:w-[85vw] lg:w-[80vw]"
                        : "w-[85%] sm:w-[80%] md:w-[60%] lg:w-[45%]"
                    } group-hover:shadow-lg`}
          ></div>

          <div
            className={`absolute top-0 rounded-r-full bg-[#006A9E] text-white p-4 md:p-8
                    h-[180px] sm:h-[180px] md:h-[180px] lg:h-[200px] left-[-20px] md:left-[-40px] z-20
                    transition-all duration-500 ease-out
                    ${
                      hoveredValue3
                        ? "w-[95vw] md:w-[85vw] lg:w-[80vw]"
                        : "w-[85%] sm:w-[80%] md:w-[60%] lg:w-[45%]"
                    } group-hover:shadow-lg`}
          ></div>

          <div
            className={`absolute top-0 rounded-r-full bg-[#0091D9] text-white pl-4 md:pl-8
                    flex items-center gap-2 md:gap-4 value-content
                    transition-all duration-500 ease-out
                    h-[180px] sm:h-[180px] md:h-[180px] lg:h-[200px] left-[-40px] md:left-[-80px] z-30
                    ${
                      hoveredValue3
                        ? "w-[95vw] md:w-[85vw] lg:w-[80vw]"
                        : "w-[85%] sm:w-[80%] md:w-[60%] lg:w-[45%]"
                    } group-hover:shadow-lg`}
          >
            <div className="shrink-0 ml-[40px] md:ml-[60px] lg:ml-[80px]">
              <Image
                src="/images/valeur3.svg"
                alt="Icon Excellence"
                width={100}
                height={100}
                className="w-[40px] h-[40px] sm:w-[60px] sm:h-[60px] md:w-[100px] md:h-[100px] rounded-full"
              />
            </div>
            <div className="overflow-hidden h-full flex items-center">
              <p
                className={`text-[10px] xs:text-[11px] sm:text-xs md:text-sm lg:text-base ${
                  hoveredValue3
                    ? "font-montserrat font-bold"
                    : "font-montserrat font-extrabold whitespace-nowrap"
                } transition-all duration-500 ease-out text-left`}
              >
                {hoveredValue3 ? (
                  <span className="fade-in-text overflow-y-auto max-h-{170px] sm:max-h-[160px] md:max-h-[150px] lg:max-h-[170px] block w-[60vw] sm:w-[50vw] md:w-[55vw] lg:w-[60vw] font-montserrat font-bold text-[10px] xs:text-[11px] sm:text-xs md:text-[13px] lg:text-sm">
                    L&apos;excellence n&apos;est pas n&eacute;gociable pour nous,
                    chaque ligne de code et chaque pixel sont
                    m&eacute;ticuleusement travaill&eacute;s pour atteindre les plus hauts
                    standards. Notre exigence de qualit&eacute; se traduit par des
                    tests rigoureux et une attention obsessionnelle aux
                    d&eacute;tails que vous remarquerez dans le produit final. Nous
                    ne livrons que des solutions dont nous sommes fiers, car
                    votre satisfaction et la performance de votre projet
                    sont notre v&eacute;ritable mesure de r&eacute;ussite.
                  </span>
                ) : (
                  "Excellence Qualit\u00e9"
                )}
              </p>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
