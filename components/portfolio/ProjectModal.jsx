"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function ProjectModal({
  project,
  currentImageIndex,
  onClose,
  onPrev,
  onNext,
  onSlideChange,
}) {
  if (!project) return null;

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        animation: `fadeIn 0.3s ease forwards`,
      }}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          animation: `slideUp 0.4s ease forwards`,
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-black/40 hover:bg-blue-600 transition-colors duration-300 rounded-full p-2 text-white"
          aria-label="Close modal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="relative h-72 md:h-96">
          {project.images && project.images.length > 0 ? (
            <Swiper
              modules={[Navigation, Pagination, A11y, Autoplay]}
              spaceBetween={0}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              loop={true}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              initialSlide={currentImageIndex}
              onSlideChange={(swiper) => onSlideChange(swiper.activeIndex)}
              className="h-full"
              style={{
                "--swiper-pagination-bullet-size": "16px",
                "--swiper-theme-color": "#ffffff",
              }}
            >
              {project.images.map((image, index) => (
                <SwiperSlide key={`slide-${index}`}>
                  <div className="relative w-full h-full">
                    <Image
                      src={image}
                      alt={`${project.title} - image ${index + 1}`}
                      fill
                      priority
                      className="object-cover rounded-t-lg"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <Image
              src={project.image}
              alt={project.title}
              fill
              priority
              className="object-cover rounded-t-lg"
            />
          )}

          {/* Project title overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/40 to-transparent p-6 z-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              {project.title}
            </h2>
          </div>
        </div>

        <div className="p-6 md:p-8 bg-linear-to-b from-gray-900 to-gray-950 rounded-b-lg">
          <div className="mb-6">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
              {project.title}
            </h3>
            <p className="text-gray-300 leading-relaxed">
              {project.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {project.client && (
              <div>
                <span className="font-semibold text-blue-300 text-sm uppercase tracking-wide">
                  Client
                </span>
                <p className="text-white mt-1">{project.client}</p>
              </div>
            )}

            {project.year && (
              <div>
                <span className="font-semibold text-blue-300 text-sm uppercase tracking-wide">
                  Year
                </span>
                <p className="text-white mt-1">{project.year}</p>
              </div>
            )}
          </div>

          {project.technologies &&
            project.technologies.length > 0 && (
              <div className="mb-6">
                <span className="font-semibold text-blue-300 text-sm uppercase tracking-wide">
                  Technologies
                </span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {project.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-900/30 border border-blue-800/50 rounded-full text-sm text-blue-200"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

          {project.link != null && (
            <div className="mb-8">
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md transition-colors duration-300"
              >
                <div className="flex items-center gap-2">
                  <span>{project.linkLabel || "Voir le projet"}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </div>
              </a>
            </div>
          )}

          <div className="flex justify-between border-t border-gray-800 pt-6">
            <button
              onClick={onPrev}
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span>Previous</span>
            </button>
            <button
              onClick={onNext}
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors duration-300"
            >
              <span>Next</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
