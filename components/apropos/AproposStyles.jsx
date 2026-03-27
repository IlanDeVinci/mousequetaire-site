"use client";

export default function AproposStyles() {
  return (
    <style jsx global>{`
      @keyframes circleGlow {
        0% {
          box-shadow: 0 0 0 0px rgba(135, 215, 255, 0.5);
        }
        50% {
          box-shadow: 0 0 0 30px rgba(135, 215, 255, 0.8);
        }
        100% {
          box-shadow: 0 0 0 0px rgba(135, 215, 255, 0.5);
        }
      }

      @keyframes fadeInText {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .fade-in-text {
        animation: fadeInText 0.6s ease-out forwards;
      }

      .value-content {
        will-change: transform;
      }
    `}</style>
  );
}
