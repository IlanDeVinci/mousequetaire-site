"use client";
import Navbar from "../../components/Navbar";
import Image from "next/image";
import { useState, useCallback, useRef } from "react";
const services = [
	{
		icon: "/bulbe.png",
		title: "Développement Web",
		description: "Création de sites web modernes et responsive",
		bgColor: "#004165",
	},
	{
		icon: "/supporttechnique.png",
		title: "Support Technique",
		description: "Assistance et maintenance professionnelle",
		bgColor: "#005180",
	},
	{
		icon: "/internetpicto.png",
		title: "Conseil",
		description: "Solutions digitales sur mesure",
		bgColor: "#006A9E",
	},
];

const sections = [
	{
		title: "Expertise Technique",
		description:
			"Notre équipe possède une expertise approfondie dans les dernières technologies web et mobile.",
		image: "/images/ronds.png",
		isReversed: false,
	},
	{
		title: "Support 24/7",
		description:
			"Une équipe dédiée à votre service pour répondre à vos besoins en temps réel.",
		image: "/images/webp.png",
		isReversed: true,
	},
	{
		title: "Solutions Innovantes",
		description:
			"Des solutions créatives et innovantes pour répondre à vos défis numériques.",
		image: "/images/feuille.png",
		isReversed: false,
	},
];

export default function Services() {
	const [activeIndex, setActiveIndex] = useState(null);
	const [isAnimating, setIsAnimating] = useState(false);
	const lastIndex = useRef(null);

	const handleMouseEnter = useCallback(
		(index) => {
			// Allow animation if hovering a different circle or no animation is in progress
			if (!isAnimating || lastIndex.current !== index) {
				setIsAnimating(true);
				setActiveIndex(index);
				lastIndex.current = index;
				setTimeout(() => {
					setIsAnimating(false);
				}, 750);
			}
		},
		[isAnimating]
	);

	const handleMouseLeave = useCallback(() => {
		lastIndex.current = null;
		setActiveIndex(null);
	}, []);

	return (
		<>
			<Navbar />
			<main className="pt-24 pb-16 bg-[#002132] min-h-screen px-48">
				<div className="container mx-auto px-4">
					{/* Header Section */}
					<h1 className="text-5xl font-bold mt-16 mb-6 text-center text-[#7DD4FF]">
						Nos Services
					</h1>
					<p className="text-white text-center max-w-2xl mx-auto mb-16 text-lg">
						Découvrez notre gamme complète de services numériques conçus pour
						propulser votre entreprise vers le succès.
					</p>
					{/* Interactive Circles */}
					<div className="flex justify-center mb-24 relative h-72">
						<div className="w-[1000px] relative">
							{services.map((service, index) => (
								<div
									key={index}
									className="absolute top-0 transition-all duration-700 ease-in-out"
									style={{
										left:
											activeIndex === index
												? index === 2
													? "calc(100% - 1012px)" // Adjusted: 1000px + 16px padding
													: "0px"
												: `${index * 350}px`,
										zIndex: activeIndex === index ? 10 : 1,
										width: "288px",
										padding: "8px",
									}}
									onMouseEnter={() => handleMouseEnter(index)}
									onMouseLeave={handleMouseLeave}>
									<div
										className={`h-72 rounded-full flex items-center justify-center cursor-pointer transition-all duration-700 ease-in-out relative overflow-hidden ${
											activeIndex === index ? "w-[1000px]" : "w-72"
										}`}
										style={{
											backgroundColor: service.bgColor,
											transformOrigin: index === 2 ? "right" : "left",
										}}>
										<div
											className={`absolute transition-all duration-700 ease-in-out flex items-center gap-12 ${
												index === 2
													? "right-3 flex-row-reverse" // Added flex-row-reverse for the right circle
													: "left-3"
											}`}>
											<span className="text-6xl text-white shrink-0 w-64 h-64 relative">
												<Image
													src={service.icon}
													alt={service.title}
													fill
													className="object-contain p-4"
												/>
											</span>
											<div
												className={`transition-all duration-300 text-white ${
													activeIndex === index
														? "opacity-100 delay-200"
														: "opacity-0 delay-0"
												}`}>
												<h3 className="text-4xl font-bold mb-4">
													{service.title}
												</h3>
												<p className="whitespace-normal max-w-[600px] text-xl">
													{service.description}
												</p>
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
					{/* Alternating Sections */}
					{sections.map((section, index) => (
						<div
							key={index}
							className={`flex flex-col ${
								section.isReversed ? "md:flex-row-reverse" : "md:flex-row"
							} items-center gap-12 mb-24`}>
							<div className="flex-1">
								<div className="relative h-[400px] w-full rounded-xl overflow-hidden m-4">
									<Image
										src={section.image}
										alt={section.title}
										fill
										className="object-contain p-8"
									/>
								</div>
							</div>
							<div className="flex-1 text-white">
								<h2 className="text-3xl font-bold mb-6 text-[#7DD4FF]">
									{section.title}
								</h2>
								<p className="text-lg leading-relaxed">{section.description}</p>
							</div>
						</div>
					))}
				</div>
			</main>
		</>
	);
}
