"use client";
import { useState, useCallback, useEffect } from "react";
import Image from "next/image";

// New component for Instagram image slider
const InstagramSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const images = [
    "/images/instagram-icon.png",
    "/images/instagram-slide2.png",
    "/images/instagram-slide3.png",
  ];

  useEffect(() => {
    let interval;
    if (isHovered) {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % images.length);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <div
      className="relative w-full h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {images.map((src, index) => (
        <div
          key={index}
          className="absolute inset-0 transition-opacity duration-500"
          style={{ opacity: isHovered && currentSlide === index ? 1 : 0 }}
        >
          <Image
            src={src}
            alt={`Instagram slide ${index + 1}`}
            fill
            style={{ objectFit: "contain" }}
          />
        </div>
      ))}
      {!isHovered && (
        <Image
          src={images[0]}
          alt="Instagram"
          fill
          style={{ objectFit: "contain" }}
        />
      )}
    </div>
  );
};

// New component for animated form icon SVG
const FormIconSVG = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="w-full h-full flex items-center justify-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <svg
        viewBox="0 0 100 100"
        width="100%"
        height="100%"
        className="transition-all duration-500"
      >
        {/* Circles on the left */}
        <circle
          cx="30"
          cy="30"
          r="8"
          fill="none"
          stroke={isHovered ? "#FFFFFF" : "#1D1D1B"}
          strokeWidth="2"
          className="transition-all duration-500"
        />
        <circle
          cx="30"
          cy="50"
          r="8"
          fill="none"
          stroke={isHovered ? "#FFFFFF" : "#1D1D1B"}
          strokeWidth="2"
          className="transition-all duration-500"
        />
        <circle
          cx="30"
          cy="70"
          r="8"
          fill="none"
          stroke={isHovered ? "#FFFFFF" : "#1D1D1B"}
          strokeWidth="2"
          className="transition-all duration-500"
        />

        {/* Lines on the right */}
        <line
          x1="50"
          y1="30"
          x2="80"
          y2="30"
          stroke={isHovered ? "#FFFFFF" : "#1D1D1B"}
          strokeWidth="2"
          className="transition-all duration-500"
        />
        <line
          x1="50"
          y1="50"
          x2="80"
          y2="50"
          stroke={isHovered ? "#FFFFFF" : "#1D1D1B"}
          strokeWidth="2"
          className="transition-all duration-500"
        />
        <line
          x1="50"
          y1="70"
          x2="80"
          y2="70"
          stroke={isHovered ? "#FFFFFF" : "#1D1D1B"}
          strokeWidth="2"
          className="transition-all duration-500"
        />
      </svg>
    </div>
  );
};

const contactOptions = [
  {
    title: "Instagram",
    description: "Appelez-nous directement",
    content: (
      <div className="flex flex-col items-center gap-6">
        <h3 className="text-2xl md:text-3xl font-bold mb-4">
          Contact Téléphonique
        </h3>
        <p className="text-base md:text-lg mb-6">
          Disponible du lundi au vendredi, de 9h à 18h
        </p>
        <a
          href="tel:+33123456789"
          className="text-xl md:text-2xl hover:text-[#7DD4FF]"
        >
          +33 1 23 45 67 89
        </a>
      </div>
    ),
    bgColor: "#002132",
    customIcon: <InstagramSlider />,
    hoverEffect: "hover:animate-pulse",
  },
  {
    title: "Email",
    description: "Contactez-nous par email",
    content: (
      <div className="flex flex-col items-center gap-6">
        <h3 className="text-2xl md:text-3xl font-bold mb-4">
          Contact par Email
        </h3>
        <p className="text-base md:text-lg mb-6">
          Envoyez-nous un message et nous vous répondrons dans les plus brefs
          délais
        </p>
        <form className="w-full max-w-md flex flex-col gap-4">
          <input
            type="email"
            placeholder="Votre email"
            className="w-full p-3 rounded bg-white/10 text-white border border-white/20"
          />
          <textarea
            placeholder="Votre message"
            rows={5}
            className="w-full p-3 rounded bg-white/10 text-white border border-white/20"
          />
          <button className="bg-[#7DD4FF] text-[#002132] font-bold py-3 px-6 rounded">
            Envoyer
          </button>
        </form>
      </div>
    ),
    bgColor: "#70C7F2",
    customIcon: <FormIconSVG />,
  },
];

export default function Contact() {
  const [activeModal, setActiveModal] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [circlePosition, setCirclePosition] = useState(null);

  const handleCircleClick = useCallback(
    (e, index) => {
      if (isAnimating) return;
      setIsAnimating(true);
      document.body.style.overflow = "hidden";

      const rect = e.currentTarget.getBoundingClientRect();
      const windowCenter = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      };

      setCirclePosition({
        index,
        rect,
        transform: {
          translateX: windowCenter.x - (rect.left + rect.width / 2),
          translateY: windowCenter.y - (rect.top + rect.height / 2),
          scale:
            Math.max(
              window.innerWidth / rect.width,
              window.innerHeight / rect.height
            ) * 1.1,
        },
      });

      setActiveModal(index);
      requestAnimationFrame(() => {
        setIsExpanded(true);
        setTimeout(() => setIsAnimating(false), 500);
      });
    },
    [isAnimating]
  );

  const closeModal = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIsExpanded(false);

    setTimeout(() => {
      setActiveModal(null);
      setCirclePosition(null);
      setIsAnimating(false);
      document.body.style.overflow = "auto";
    }, 300);
  }, [isAnimating]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && !isAnimating && activeModal !== null) {
        closeModal();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isAnimating, activeModal, closeModal]);

  return (
    <>
      <main className="pt-24 pb-16 bg-[#050610] min-h-screen">
        <div className="container mx-auto px-4">
          <p className="text-white text-center max-w-[400px] mx-auto font-montserrat font-semibold mb-8 md:mb-16 text-xl md:text-3xl px-4">
            Contactez-nous via ces différents médias :
          </p>

          {/* Mobile view - stack circles vertically */}
          <div className="md:hidden flex flex-col items-center gap-8 mb-16">
            {contactOptions.map((option, index) => (
              <div
                key={index}
                className="w-[250px] h-[250px] relative transition-all duration-700"
                style={{
                  opacity:
                    activeModal !== null && activeModal !== index ? 0 : 1,
                  transitionDuration:
                    activeModal !== null && activeModal !== index
                      ? "300ms"
                      : "700ms",
                }}
              >
                <div
                  onClick={(e) => !activeModal && handleCircleClick(e, index)}
                  className={`w-full h-full rounded-full flex items-center justify-center
                  ${
                    !activeModal
                      ? "cursor-pointer hover:shadow-2xl hover:shadow-[#7DD4FF]/20"
                      : ""
                  } 
                  transition-all duration-500 ease-in-out ${
                    option.hoverEffect || ""
                  }`}
                  style={{
                    backgroundColor: option.bgColor,
                    transform:
                      activeModal === index && isExpanded
                        ? `translate(${circlePosition?.transform.translateX}px, ${circlePosition?.transform.translateY}px) scale(${circlePosition?.transform.scale})`
                        : "none",
                    animation: !activeModal
                      ? `float 3s ease-in-out infinite ${index * 0.5}s`
                      : "none",
                  }}
                >
                  {/* Circle Content */}
                  <div
                    className={`flex w-[70%] flex-col items-center transition-opacity duration-700
                    ${!isExpanded ? "opacity-100" : "opacity-0"}`}
                  >
                    <div className="text-5xl text-white relative w-full aspect-[1]">
                      {option.customIcon}
                    </div>
                  </div>
                  {!activeModal && (
                    <div className="absolute inset-0 rounded-full bg-white/5 hover:bg-transparent transition-all duration-300 hover:opacity-20" />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Desktop view - horizontal layout */}
          <div className="hidden md:flex justify-center mb-24 relative h-72">
            <div className="w-full max-w-[800px] relative flex justify-center">
              {contactOptions.map((option, index) => (
                <div
                  key={index}
                  className="transition-all duration-700 absolute top-0"
                  style={{
                    width: "288px",
                    left: `${index * 500}px`,
                    opacity:
                      activeModal !== null && activeModal !== index ? 0 : 1,
                    transitionDuration:
                      activeModal !== null && activeModal !== index
                        ? "300ms"
                        : "700ms",
                  }}
                >
                  <div
                    onClick={(e) => !activeModal && handleCircleClick(e, index)}
                    className={`w-72 h-72 rounded-full flex items-center justify-center 
                      ${
                        !activeModal
                          ? "cursor-pointer hover:shadow-2xl hover:shadow-[#7DD4FF]/30"
                          : ""
                      } 
                      transition-all duration-500 ease-in-out ${
                        option.hoverEffect || ""
                      }`}
                    style={{
                      backgroundColor: option.bgColor,
                      transform:
                        activeModal === index && isExpanded
                          ? `translate(${circlePosition?.transform.translateX}px, ${circlePosition?.transform.translateY}px) scale(${circlePosition?.transform.scale})`
                          : "none",
                      animation: !activeModal
                        ? `float 3s ease-in-out infinite ${index * 0.5}s`
                        : "none",
                    }}
                  >
                    {/* Circle Content */}
                    <div
                      className={`flex w-[70%] flex-col items-center transition-opacity duration-700
                      ${!isExpanded ? "opacity-100" : "opacity-0"}`}
                    >
                      <div className="text-6xl text-white relative w-full aspect-[1]">
                        {option.customIcon}
                      </div>
                    </div>
                    {!activeModal && (
                      <div className="absolute inset-0 rounded-full bg-white/5 hover:bg-transparent transition-all duration-300 hover:opacity-20" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Modal Overlay - responsive for all screens */}
          {activeModal !== null && (
            <div className="h-[100vh] w-full overflow-hidden fixed inset-0 z-[1000]">
              <div
                className={`fixed inset-0 z-[1001] flex items-center justify-center pointer-events-none overflow-hidden
                  transition-opacity duration-300 px-4
                  ${isExpanded && !isAnimating ? "opacity-100" : "opacity-0"}`}
              >
                <div
                  className={`relative w-full max-w-4xl pointer-events-auto
                    transition-all duration-300 ${
                      isExpanded ? "scale-100" : "scale-95"
                    }
                    bg-[#070b18]/95 rounded-2xl p-4 sm:p-6 md:p-8 m-0 sm:m-4 md:m-6
                    fixed sm:relative inset-0 sm:inset-auto h-full sm:h-auto
                    flex items-center justify-center`}
                >
                  <div className="text-white w-full flex items-center justify-center">
                    {contactOptions[activeModal].content}
                  </div>
                  <button
                    onClick={!isAnimating ? closeModal : undefined}
                    className="absolute top-4 right-4 sm:-top-2 sm:-right-2 text-white text-xl hover:text-[#7DD4FF] transition-colors p-2 sm:p-4 hover:bg-black/10 rounded-full z-[1002]"
                    aria-label="Close modal"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
