"use client";

export default function PortfolioStyles() {
  return (
    <>
      <style jsx global>{`
        .portfolio-grid {
          display: grid;
          --base-size: 31vw;
          --grid-size: calc(var(--base-size) - 1rem);
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          grid-auto-rows: var(--grid-size);
        }

        @media (max-width: 768px) {
          .portfolio-grid {
            gap: 0.5rem;
          }
        }

        @media (max-width: 640px) {
          .portfolio-grid {
            gap: 0.25rem;
          }
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.85);
          z-index: 50;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 1rem;
          backdrop-filter: blur(8px);
        }

        .modal-content {
          background-color: #0c1221;
          border-radius: 0.75rem;
          max-width: 95%;
          width: 1000px;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          border: 1px solid rgba(59, 130, 246, 0.2);
          box-shadow: 0 0 40px rgba(59, 130, 246, 0.2),
            0 0 100px rgba(0, 0, 0, 0.5);
          scrollbar-width: thin;
          scrollbar-color: rgba(59, 130, 246, 0.5) rgba(17, 24, 39, 0.7);
        }

        .modal-content::-webkit-scrollbar {
          width: 8px;
        }

        .modal-content::-webkit-scrollbar-track {
          background: rgba(17, 24, 39, 0.7);
          border-radius: 0 0.75rem 0.75rem 0;
        }

        .modal-content::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.5);
          border-radius: 20px;
        }

        .carousel-button {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background-color: rgba(0, 0, 0, 0.5);
          border-radius: 9999px;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .carousel-button:hover {
          background-color: rgba(59, 130, 246, 0.7);
        }

        .prev-button {
          left: 10px;
        }

        .next-button {
          right: 10px;
        }

        .swiper {
          width: 100%;
          height: 100%;
        }

        .swiper-slide {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .swiper-pagination-bullet {
          background: rgba(255, 255, 255, 0.5);
          opacity: 1;
        }

        .swiper-pagination-bullet-active {
          background: white;
          transform: scale(1.3);
        }

        .swiper-button-next,
        .swiper-button-prev {
          color: white;
          background-color: rgba(0, 0, 0, 0.5);
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .swiper-button-next:hover,
        .swiper-button-prev:hover {
          background-color: rgba(59, 130, 246, 0.7);
        }

        .swiper-button-next::after,
        .swiper-button-prev::after {
          font-size: 16px;
          font-weight: bold;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(30px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes slideDown {
          from {
            transform: translateY(0);
            opacity: 1;
          }
          to {
            transform: translateY(30px);
            opacity: 0;
          }
        }

        /* Swiper custom styles */
        .swiper-pagination {
          position: absolute;
          bottom: 10px !important;
          z-index: 20;
        }

        .swiper-button-next,
        .swiper-button-prev {
          z-index: 20;
        }

        /* Make sure swiper buttons are visible on mobile */
        @media (max-width: 640px) {
          .swiper-button-next::after,
          .swiper-button-prev::after {
            font-size: 14px;
          }

          .swiper-button-next,
          .swiper-button-prev {
            width: 32px;
            height: 32px;
          }
        }
      `}</style>
    </>
  );
}
