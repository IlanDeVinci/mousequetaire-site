"use client";
import { useState, useCallback, useEffect } from "react";
import Image from "next/image";

const contactOptions = [
  {
    icon: "/images/instagram-icon.png",
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
  },
  {
    icon: "/images/form-icon.png",
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
  },
  {
    icon: "/images/chat-icon.png",
    title: "Chat",
    description: "Discutez en direct",
    content: (
      <div className="flex flex-col items-center gap-6">
        <h3 className="text-2xl md:text-3xl font-bold mb-4">Chat en Direct</h3>
        <p className="text-base md:text-lg mb-6">
          Notre équipe est disponible pour répondre à vos questions
        </p>
        <button className="bg-[#7DD4FF] text-[#002132] font-bold py-3 px-6 rounded">
          Démarrer le chat
        </button>
      </div>
    ),
    bgColor: "#006A9E",
  },
];

export default function Contact() {
  // Simplify state management
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
              <div key={index} className="w-[250px] h-[250px] relative">
                <div
                  onClick={(e) => !activeModal && handleCircleClick(e, index)}
                  className={`w-full h-full rounded-full flex items-center justify-center 
                  ${!activeModal ? "cursor-pointer hover:scale-105" : ""} 
                  transition-all duration-700 ease-in-out`}
                  style={{ backgroundColor: option.bgColor }}
                >
                  {/* Circle Content */}
                  <div className="flex w-[70%] flex-col items-center">
                    <div className="text-5xl text-white relative w-full aspect-[1]">
                      <Image
                        src={option.icon}
                        alt={option.title}
                        fill
                        style={{ objectFit: "contain" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop view - horizontal layout */}
          <div className="hidden md:flex justify-center mb-24 relative h-72">
            <div className="w-full max-w-[1000px] relative">
              {contactOptions.map((option, index) => (
                <div
                  key={index}
                  className="absolute top-0 transition-all duration-700"
                  style={{
                    left: `${index * 350}px`,
                    width: "288px",
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
                      ${!activeModal ? "cursor-pointer hover:scale-105" : ""} 
                      transition-all duration-700 ease-in-out`}
                    style={{
                      backgroundColor: option.bgColor,
                      transform:
                        activeModal === index && isExpanded
                          ? `translate(${circlePosition?.transform.translateX}px, ${circlePosition?.transform.translateY}px) scale(${circlePosition?.transform.scale})`
                          : "none",
                    }}
                  >
                    {/* Circle Content */}
                    <div
                      className={`flex w-[70%] flex-col items-center transition-opacity duration-700
                      ${!isExpanded ? "opacity-100" : "opacity-0"}`}
                    >
                      <div className="text-6xl text-white relative w-full aspect-[1]">
                        <Image
                          src={option.icon}
                          alt={option.title}
                          fill
                          style={{ objectFit: "contain" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Modal Overlay - responsive for all screens */}
          {activeModal !== null && (
            <div
              className={`fixed inset-0 z-[1001] flex items-center justify-center pointer-events-none
                transition-opacity duration-300 px-4
                ${isExpanded && !isAnimating ? "opacity-100" : "opacity-0"}`}
            >
              <div
                className={`relative w-full max-w-4xl pointer-events-auto
                  transition-all duration-300 ${
                    isExpanded ? "scale-100" : "scale-95"
                  }
                  bg-[#070b18]/95 rounded-2xl p-4 sm:p-6 md:p-8 m-2 sm:m-4 md:m-6 max-h-[90vh] overflow-y-auto`}
              >
                <div className="text-white">
                  {contactOptions[activeModal].content}
                </div>
                <button
                  onClick={!isAnimating ? closeModal : undefined}
                  className="absolute top-2 right-2 sm:-top-2 sm:-right-2 text-white text-xl 
                    hover:text-[#7DD4FF] transition-colors p-2 sm:p-4
                    hover:bg-black/10 rounded-full"
                  aria-label="Close modal"
                >
                  ✕
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
