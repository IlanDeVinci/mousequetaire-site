"use client";

export default function HomeStyles() {
  return (
    <style jsx global>{`
      /* Simplified CSS - GSAP handles most animations now */
      .metal-text {
        position: relative;
        letter-spacing: 1px;
        color: #888;
        will-change: transform, opacity;
        line-height: 1.2;
        overflow-wrap: break-word;
        word-wrap: break-word;
        -webkit-hyphens: auto;
        -ms-hyphens: auto;
        hyphens: auto;
      }

      /* Main metal background */
      .metal-text::before {
        content: attr(data-text);
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(
          to right,
          #888 0%,
          #aaa 48%,
          #fff 50%,
          #aaa 52%,
          #888 100%
        );
        background-size: 300% 100%;
        color: transparent;
        -webkit-background-clip: text;
        background-clip: text;
        z-index: -1;
        animation: metalShine 6s linear infinite;
      }

      /* Moving shine overlay */
      .metal-text::after {
        content: attr(data-text);
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(
          90deg,
          transparent 0%,
          rgba(255, 255, 255, 0) 35%,
          rgba(255, 255, 255, 0.8) 48%,
          rgba(255, 255, 255, 0.9) 50%,
          rgba(255, 255, 255, 0.8) 52%,
          rgba(255, 255, 255, 0) 65%,
          transparent 100%
        );
        background-size: 200% 100%;
        color: transparent;
        -webkit-background-clip: text;
        background-clip: text;
        animation: shimmer 12s ease-in-out infinite;
        z-index: 1;
      }

      /* Make the metal text responsive on smaller screens */
      @media (max-width: 640px) {
        .metal-text {
          letter-spacing: 0.5px;
        }

        .metal-text::before,
        .metal-text::after {
          background-size: 400% 100%;
        }
      }

      @keyframes metalShine {
        0% {
          background-position: 100% 0;
        }
        100% {
          background-position: -200% 0;
        }
      }

      @keyframes shimmer {
        0% {
          background-position: 200% 0;
        }
        100% {
          background-position: -200% 0;
        }
      }

      /* 3D Flip Card Styles - GSAP enhanced */
      .flip-card-container {
        perspective: 1500px;
        width: 100%;
        aspect-ratio: 1/1;
        cursor: pointer;
        -webkit-tap-highlight-color: transparent;
      }

      .flip-card {
        position: relative;
        width: 100%;
        height: 100%;
        transform-style: preserve-3d;
        /* Remove CSS transition - GSAP handles this */
      }

      .flip-card-front,
      .flip-card-back {
        position: absolute;
        width: 100%;
        height: 100%;
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border-radius: 1.5rem;
      }

      .flip-card-front {
        background: linear-gradient(135deg, #003c59 0%, #002538 100%);
        box-shadow: 0 4px 20px rgba(0, 60, 89, 0.3),
          inset 0 2px 0 rgba(255, 255, 255, 0.1);
        transform: rotateY(0);
      }

      .flip-card-scrollreveal:last-of-type .flip-card-front svg {
        align-self: flex-start;
      }

      .flip-card-front h3 {
        text-shadow: 0 2px 10px rgba(135, 215, 255, 0.3);
      }

      .flip-card-back {
        transform: rotateY(180deg);
        background: linear-gradient(135deg, #035073 0%, #023146 100%);
        box-shadow: 0 4px 20px rgba(135, 215, 255, 0.4),
          inset 0 2px 0 rgba(255, 255, 255, 0.1);
      }

      .flip-card-back-content {
        transform: translateZ(60px);
        display: flex;
        flex-direction: column;
        height: 100%;
        width: 100%;
        align-items: center;
        text-align: center;
      }

      /* Touch device specific styles */
      @media (hover: none) {
        .flip-card-container::after {
          content: "Tap to flip";
          position: absolute;
          bottom: 1rem;
          left: 50%;
          transform: translateX(-50%);
          color: rgba(135, 215, 255, 0.6);
          font-size: 0.75rem;
          opacity: 0.8;
          pointer-events: none;
        }

        .flip-card-container.flipped::after {
          content: "Tap to return";
        }
      }
    `}</style>
  );
}
