"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { portfolioItems } from "@/data/portfolioItems";

export default function ProjectDetailsClient({ project }) {
  const [activeImage, setActiveImage] = useState(0);

  if (!project) {
    return (
      <div className="bg-[#050610] min-h-screen p-8 text-white">
        <div className="max-w-4xl mx-auto mt-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Projet introuvable</h1>
          <p className="mb-8">
            Désolé, nous n&apos;avons pas trouvé le projet que vous cherchez.
          </p>
          <Link
            href="/portfolio"
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition-colors"
          >
            Retour au Portfolio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#050610] min-h-screen text-white font-sans">
      {/* Hero section with project image */}
      <div className="relative h-[40vh] sm:h-[50vh] md:h-[60vh] lg:h-[70vh]">
        <Image
          src={project.gallery ? project.gallery[activeImage] : project.image}
          alt={project.title}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black to-transparent"></div>

        <div className="absolute bottom-0 left-0 w-full p-4 sm:p-6 md:p-8 lg:p-16">
          <div className="max-w-6xl mx-auto">
            <Link
              href="/portfolio"
              className="inline-block mb-4 sm:mb-6 text-blue-300 hover:text-blue-100 transition-colors"
            >
              ← Retour au Portfolio
            </Link>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-2">
              {project.title}
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
              <span className="bg-blue-900/50 px-2 sm:px-3 py-1 rounded-full">
                {project.client}
              </span>
              <span className="bg-gray-800/80 px-2 sm:px-3 py-1 rounded-full">
                {project.year}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto p-4 sm:p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12">
          {/* Left column - Project details */}
          <div className="md:col-span-2">
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
              Aperçu du Projet
            </h2>
            <p className="text-gray-300 mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base">
              {project.description}
            </p>

            {project.challenge && (
              <>
                <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
                  Le Défi
                </h2>
                <p className="text-gray-300 mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base">
                  {project.challenge}
                </p>
              </>
            )}

            {project.solution && (
              <>
                <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
                  La Solution
                </h2>
                <p className="text-gray-300 mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base">
                  {project.solution}
                </p>
              </>
            )}

            {project.results && (
              <>
                <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
                  Les Résultats
                </h2>
                <p className="text-gray-300 mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base">
                  {project.results}
                </p>
              </>
            )}

            {/* Project gallery */}
            {project.gallery && project.gallery.length > 1 && (
              <div className="mt-6 sm:mt-8 md:mt-12">
                <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
                  Galerie du Projet
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
                  {project.gallery.map((img, index) => (
                    <div
                      key={index}
                      className={`relative aspect-video cursor-pointer overflow-hidden rounded-lg ${
                        activeImage === index ? "ring-2 ring-blue-500" : ""
                      }`}
                      onClick={() => setActiveImage(index)}
                    >
                      <Image
                        src={img}
                        alt={`${project.title} - Image ${index + 1}`}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right column - Project meta */}
          <div className="md:col-span-1 mt-6 md:mt-0">
            <div className="bg-gray-900 rounded-lg p-4 sm:p-6 sticky top-8">
              <h3 className="text-lg sm:text-xl font-bold mb-4">
                Détails du Projet
              </h3>

              <div className="mb-4 sm:mb-6">
                <h4 className="text-xs sm:text-sm uppercase text-gray-400">
                  Client
                </h4>
                <p className="text-base sm:text-lg">{project.client}</p>
              </div>

              <div className="mb-4 sm:mb-6">
                <h4 className="text-xs sm:text-sm uppercase text-gray-400">
                  Année
                </h4>
                <p className="text-base sm:text-lg">{project.year}</p>
              </div>

              {project.technologies && project.technologies.length > 0 && (
                <div className="mb-4 sm:mb-6">
                  <h4 className="text-xs sm:text-sm uppercase text-gray-400">
                    Technologies
                  </h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {project.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="bg-blue-900/30 text-blue-200 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center bg-blue-600 hover:bg-blue-700 px-4 py-2 sm:py-3 rounded-lg transition-colors mt-6 sm:mt-8 text-sm sm:text-base"
                >
                  {project.linkLabel || "Voir le projet"}
                </a>
              )}

              <Link
                href="/contact"
                className={`block w-full text-center bg-gray-700 hover:bg-gray-600 px-4 py-2 sm:py-3 rounded-lg transition-colors ${project.link ? "mt-3" : "mt-6 sm:mt-8"} text-sm sm:text-base`}
              >
                Discuter d&apos;un projet similaire
              </Link>
            </div>
          </div>
        </div>

        {/* Next/Previous Project navigation */}
        <div className="mt-8 sm:mt-12 md:mt-16 pt-6 sm:pt-8 border-t border-gray-800">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            {project.id > 1 && (
              <Link
                href={`/portfolio/${project.id - 1}`}
                className="flex items-center text-blue-300 hover:text-blue-100 mb-4 sm:mb-0 group"
              >
                <span className="transform group-hover:-translate-x-1 transition-transform">
                  ←
                </span>
                <span className="ml-2">Projet précédent</span>
              </Link>
            )}

            <Link
              href="/portfolio"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Tous les Projets
            </Link>

            {project.id < portfolioItems.length && (
              <Link
                href={`/portfolio/${project.id + 1}`}
                className="flex items-center text-blue-300 hover:text-blue-100 mt-4 sm:mt-0 group"
              >
                <span className="mr-2">Projet suivant</span>
                <span className="transform group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
