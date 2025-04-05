"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
// Portfolio items data from main page
const portfolioItems = [
  {
    id: 1,
    title: "Featured Project",
    description:
      "A showcase of our best work with cutting-edge design and functionality. This project demonstrates our ability to create modern, responsive websites that meet the highest standards of web development and design principles. We incorporated the latest technologies to ensure optimal performance and user experience.",
    image: "/images/project1.jpg",
    importance: 4,
    technologies: ["React", "NextJS", "TailwindCSS", "Framer Motion"],
    client: "Major Tech Corp",
    year: "2023",
    challenge:
      "Creating a scalable platform that could handle thousands of concurrent users while maintaining performance and accessibility.",
    solution:
      "We implemented server-side rendering with Next.js and optimized database queries to ensure fast loading times even under heavy load.",
    results:
      "The client saw a 30% increase in user engagement and a significant reduction in bounce rate after the new implementation.",
    gallery: [
      "/images/project1.jpg",
      "/images/project2.jpg",
      "/images/project3.jpg",
    ],
  },
  {
    id: 2,
    title: "Web Design",
    description:
      "Modern and responsive web design focused on user experience. This project involved a complete redesign of the client's online presence to better align with their brand identity and improve customer engagement through intuitive navigation and visually appealing elements.",
    image: "/images/project2.jpg",
    importance: 3,
    technologies: ["Figma", "HTML5", "CSS3", "JavaScript"],
    client: "Fashion Brand",
    year: "2023",
    challenge:
      "Translating the unique aesthetic of a high-end fashion brand to the digital space while ensuring responsive design across all devices.",
    solution:
      "Custom design system with carefully crafted typography, color schemes, and animations that reflect the brand's identity.",
    results:
      "Increased mobile conversion rates by 45% and reduced cart abandonment by 20%.",
    gallery: [
      "/images/project2.jpg",
      "/images/project4.jpg",
      "/images/project5.jpg",
    ],
  },
  {
    id: 3,
    title: "Mobile App",
    description:
      "Cross-platform mobile application with seamless performance. This health-focused application needed to provide real-time data synchronization between devices while maintaining strict privacy and security standards for sensitive user health information.",
    image: "/images/project3.jpg",
    importance: 4,
    technologies: ["React Native", "Firebase", "Redux", "TypeScript"],
    client: "Health Startup",
    year: "2022",
    challenge:
      "Building a secure, cross-platform application that could handle sensitive health data while providing a seamless user experience.",
    solution:
      "React Native for consistent UX across iOS and Android, with end-to-end encryption and HIPAA-compliant data storage solutions.",
    results:
      "The app has been downloaded over 100,000 times and maintains a 4.8-star rating on both app stores.",
    gallery: [
      "/images/project3.jpg",
      "/images/project6.jpg",
      "/images/project7.jpg",
    ],
  },
  {
    id: 4,
    title: "UI/UX Design",
    description:
      "Comprehensive user interface and experience design for a SaaS platform. This project involved extensive user research, wireframing, and prototyping to create an intuitive interface that simplified complex workflows for enterprise users.",
    image: "/images/project4.jpg",
    importance: 3,
    technologies: ["Figma", "Adobe XD", "Sketch", "InVision"],
    client: "Enterprise Software Company",
    year: "2022",
    challenge:
      "Simplifying complex workflows and data visualization for non-technical users.",
    solution:
      "User-centered design approach with extensive testing and iterative improvements based on direct feedback.",
    results:
      "Reduced onboarding time by 60% and increased daily active users by 25%.",
    gallery: [
      "/images/project4.jpg",
      "/images/project8.jpg",
      "/images/project9.jpg",
    ],
  },
  {
    id: 5,
    title: "Brand Identity",
    description:
      "Complete brand identity development for a new tech startup. This project encompassed everything from logo design and color palette selection to typography guidelines and marketing materials to establish a cohesive brand presence across all channels.",
    image: "/images/project5.jpg",
    importance: 4,
    technologies: ["Illustrator", "Photoshop", "InDesign"],
    client: "Tech Startup",
    year: "2023",
    challenge:
      "Creating a distinctive brand identity in a crowded market that conveys innovation while remaining approachable.",
    solution:
      "Comprehensive brand guidelines with flexible applications across digital and print mediums.",
    results:
      "The client secured Series A funding within 6 months, with investors specifically noting the strong brand presence.",
    gallery: [
      "/images/project5.jpg",
      "/images/project10.jpg",
      "/images/project11.jpg",
    ],
  },
  {
    id: 6,
    title: "E-commerce Solution",
    description:
      "Custom e-commerce platform with advanced features and integrations.",
    image: "/images/project6.jpg",
    importance: 3,
    technologies: ["Shopify", "React", "Node.js", "MongoDB"],
    client: "Retail Chain",
    year: "2022",
    challenge:
      "Integrating online and in-store inventory systems with real-time updates.",
    solution:
      "Custom API development connecting POS systems with the online storefront.",
    results:
      "25% increase in sales with 40% of purchases using the omnichannel features.",
    gallery: [
      "/images/project6.jpg",
      "/images/project12.jpg",
      "/images/project13.jpg",
    ],
  },
  {
    id: 7,
    title: "Product Photography",
    description:
      "Professional product photography for an online catalog featuring over 200 items. The project required consistent lighting, styling, and composition across diverse product lines to maintain brand cohesion while highlighting each product's unique features.",
    image: "/images/project7.jpg",
    importance: 2,
    technologies: ["Adobe Lightroom", "Photoshop", "Studio Lighting"],
    client: "Luxury Goods Retailer",
    year: "2022",
    challenge:
      "Showcasing product details and textures while maintaining visual consistency across the entire catalog.",
    solution:
      "Custom lighting setups for each product category with standardized post-processing workflows.",
    results:
      "Products featured in the new catalog saw a 35% higher conversion rate compared to previous imagery.",
    gallery: [
      "/images/project7.jpg",
      "/images/project14.jpg",
      "/images/project15.jpg",
    ],
  },
  {
    id: 8,
    title: "Social Media Campaign",
    description:
      "Comprehensive social media marketing campaign across multiple platforms for a product launch. The strategy included content creation, influencer partnerships, paid advertising, and community engagement to maximize reach and conversion.",
    image: "/images/project8.jpg",
    importance: 3,
    technologies: ["Meta Business Suite", "TikTok Ads", "HootSuite", "Canva"],
    client: "Consumer Electronics Brand",
    year: "2023",
    challenge:
      "Standing out in a saturated market during a competitive holiday season.",
    solution:
      "Targeted micro-influencer strategy combined with platform-specific content optimized for each audience segment.",
    results:
      "Generated 2.5 million impressions and exceeded sales targets by 20% within the first month.",
    gallery: [
      "/images/project8.jpg",
      "/images/project1.jpg",
      "/images/project3.jpg",
    ],
  },
  {
    id: 9,
    title: "Motion Graphics",
    description:
      "Series of animated explainer videos for a complex financial product. The videos needed to break down sophisticated concepts into accessible, engaging content while maintaining the established brand voice and visual identity.",
    image: "/images/project9.jpg",
    importance: 4,
    technologies: ["After Effects", "Cinema 4D", "Premiere Pro", "Audition"],
    client: "Financial Services Company",
    year: "2022",
    challenge:
      "Explaining complex financial concepts clearly without oversimplifying critical details.",
    solution:
      "Progressive disclosure approach with layered information presentation using visual metaphors and character animation.",
    results:
      "Customer understanding of product features increased by 60%, leading to higher quality leads.",
    gallery: [
      "/images/project9.jpg",
      "/images/project2.jpg",
      "/images/project5.jpg",
    ],
  },
  {
    id: 10,
    title: "Logo Design",
    description:
      "Creation of a versatile logo system for a growing educational organization. The logo needed to be adaptable across various departments and programs while maintaining a cohesive brand identity that would resonate with both young students and parents.",
    image: "/images/project10.jpg",
    importance: 2,
    technologies: ["Illustrator", "Photoshop", "Procreate"],
    client: "Educational Institution",
    year: "2023",
    challenge:
      "Creating a system that works across digital and physical applications while appealing to multiple age groups.",
    solution:
      "Modular logo system with a core mark and customizable elements for different departments and programs.",
    results:
      "Successfully implemented across 12 departments with 97% approval from stakeholders.",
    gallery: [
      "/images/project10.jpg",
      "/images/project5.jpg",
      "/images/project11.jpg",
    ],
  },
  {
    id: 11,
    title: "Print Design",
    description:
      "Annual report design for a non-profit organization highlighting their impact and financial transparency. The publication needed to convey complex data in an accessible format while telling compelling stories about the organization's work.",
    image: "/images/project11.jpg",
    importance: 3,
    technologies: ["InDesign", "Illustrator", "Photoshop"],
    client: "International NGO",
    year: "2022",
    challenge:
      "Balancing data visualization with emotional storytelling in a limited page count.",
    solution:
      "Integrated infographic system with custom photography and a thoughtful narrative structure.",
    results:
      "The report helped secure three major grants and increased donor retention by 15%.",
    gallery: [
      "/images/project11.jpg",
      "/images/project5.jpg",
      "/images/project10.jpg",
    ],
  },
  {
    id: 12,
    title: "Website Redesign",
    description:
      "Complete overhaul of a 10-year-old website for a government agency serving millions of citizens. The project required improving accessibility, modernizing the user interface, and optimizing content organization while meeting strict regulatory requirements.",
    image: "/images/project12.jpg",
    importance: 4,
    technologies: ["WordPress", "PHP", "JavaScript", "WCAG Guidelines"],
    client: "Government Agency",
    year: "2023",
    challenge:
      "Meeting stringent accessibility and security requirements while dramatically improving the user experience.",
    solution:
      "Ground-up rebuild with a content-first approach, focusing on task completion and information architecture.",
    results:
      "85% improvement in task completion rates and full WCAG 2.1 AA compliance achieved.",
    gallery: [
      "/images/project12.jpg",
      "/images/project6.jpg",
      "/images/project13.jpg",
    ],
  },
  {
    id: 13,
    title: "App Interface",
    description:
      "User interface design for an IoT control application connecting smart home devices. The interface needed to be intuitive for users of all technical abilities while providing advanced controls for power users and ensuring reliability for critical home functions.",
    image: "/images/project13.jpg",
    importance: 3,
    technologies: ["Figma", "Protopie", "UserTesting"],
    client: "Home Automation Company",
    year: "2022",
    challenge:
      "Creating an interface that scales from simple to complex use cases while maintaining reliability for critical functions.",
    solution:
      "Progressive disclosure design with contextual controls and a unified dashboard for cross-device management.",
    results:
      "Customer support calls decreased by 42% and app store ratings improved from 3.2 to 4.7 stars.",
    gallery: [
      "/images/project13.jpg",
      "/images/project4.jpg",
      "/images/project9.jpg",
    ],
  },
  {
    id: 14,
    title: "Marketing Material",
    description:
      "Comprehensive marketing collateral for a major product launch including digital assets, print materials, event displays, and packaging design. All elements needed to work cohesively across channels while adapting to different contexts and audiences.",
    image: "/images/project14.jpg",
    importance: 4,
    technologies: ["InDesign", "Photoshop", "Illustrator", "Dimension"],
    client: "Automotive Manufacturer",
    year: "2023",
    challenge:
      "Maintaining brand consistency across diverse materials and formats while meeting tight production deadlines.",
    solution:
      "Modular design system with comprehensive templates and clear guidelines for implementation partners.",
    results:
      "Successfully launched in 27 markets simultaneously with 100% brand compliance across all materials.",
    gallery: [
      "/images/project14.jpg",
      "/images/project7.jpg",
      "/images/project11.jpg",
    ],
  },
  {
    id: 15,
    title: "Interactive Installation",
    description:
      "Large-scale interactive installation for a museum exhibit combining physical elements with digital interfaces. The experience needed to be engaging for visitors of all ages while communicating educational content about environmental conservation.",
    image: "/images/project15.jpg",
    importance: 4,
    technologies: [
      "Arduino",
      "Processing",
      "Projection Mapping",
      "Motion Sensors",
    ],
    client: "Science Museum",
    year: "2022",
    challenge:
      "Creating a durable, maintainable installation that remains engaging through repeated visits and varying group sizes.",
    solution:
      "Modular physical components with reactive digital elements that adapt to visitor behavior and group dynamics.",
    results:
      "Average engagement time of 14 minutes (triple the museum average) with 95% positive visitor feedback.",
    gallery: [
      "/images/project15.jpg",
      "/images/project9.jpg",
      "/images/project3.jpg",
    ],
  },
];

export default function ProjectDetails() {
  const params = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    // Find the project based on the ID from the URL
    const projectId = parseInt(params.id);
    const foundProject = portfolioItems.find((item) => item.id === projectId);

    if (foundProject) {
      setProject(foundProject);
      // Set document title
      document.title = `${foundProject.title} | Portfolio`;
    }

    setLoading(false);
  }, [params.id]);

  if (loading) {
    return (
      <div className="bg-[#050610] min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-white">
          Loading project details...
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="bg-[#050610] min-h-screen p-8 text-white">
        <div className="max-w-4xl mx-auto mt-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Project Not Found</h1>
          <p className="mb-8">
            Sorry, we couldn&apos;t find the project you&apos;re looking for.
          </p>
          <Link
            href="/portfolio"
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition-colors"
          >
            Back to Portfolio
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
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>

        <div className="absolute bottom-0 left-0 w-full p-4 sm:p-6 md:p-8 lg:p-16">
          <div className="max-w-6xl mx-auto">
            <Link
              href="/portfolio"
              className="inline-block mb-4 sm:mb-6 text-blue-300 hover:text-blue-100 transition-colors"
            >
              ← Back to Portfolio
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
              Project Overview
            </h2>
            <p className="text-gray-300 mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base">
              {project.description}
            </p>

            {project.challenge && (
              <>
                <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
                  The Challenge
                </h2>
                <p className="text-gray-300 mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base">
                  {project.challenge}
                </p>
              </>
            )}

            {project.solution && (
              <>
                <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
                  The Solution
                </h2>
                <p className="text-gray-300 mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base">
                  {project.solution}
                </p>
              </>
            )}

            {project.results && (
              <>
                <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
                  The Results
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
                  Project Gallery
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
                        alt={`${project.title} - Gallery ${index + 1}`}
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
                Project Details
              </h3>

              <div className="mb-4 sm:mb-6">
                <h4 className="text-xs sm:text-sm uppercase text-gray-400">
                  Client
                </h4>
                <p className="text-base sm:text-lg">{project.client}</p>
              </div>

              <div className="mb-4 sm:mb-6">
                <h4 className="text-xs sm:text-sm uppercase text-gray-400">
                  Year
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

              <Link
                href="/contact"
                className="block w-full text-center bg-blue-600 hover:bg-blue-700 px-4 py-2 sm:py-3 rounded-lg transition-colors mt-6 sm:mt-8 text-sm sm:text-base"
              >
                Discuss a Similar Project
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
                <span className="ml-2">Previous Project</span>
              </Link>
            )}

            <Link
              href="/portfolio"
              className="text-gray-400 hover:text-white transition-colors"
            >
              All Projects
            </Link>

            {project.id < portfolioItems.length && (
              <Link
                href={`/portfolio/${project.id + 1}`}
                className="flex items-center text-blue-300 hover:text-blue-100 mt-4 sm:mt-0 group"
              >
                <span className="mr-2">Next Project</span>
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
