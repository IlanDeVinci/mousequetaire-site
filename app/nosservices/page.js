import Navbar from "../../components/Navbar";

export default function Services() {
	return (
		<>
			<Navbar />
			<main className="pt-24 pb-16 bg-[#002132] min-h-screen">
				<div className="container mx-auto px-4">
					<h1 className="text-4xl md:text-5xl font-bold mb-12 text-center text-white">
						Nos Services
					</h1>
					<div className="grid gap-8 grid-cols-1 md:grid-cols-3">
						{[
							{
								title: "Développement Web",
								description:
									"Création de sites web sur mesure pour votre entreprise.",
								icon: "🌐",
							},
							{
								title: "Support Technique",
								description:
									"Assistance et maintenance informatique professionnelle.",
								icon: "🛠",
							},
							{
								title: "Conseil",
								description:
									"Accompagnement dans votre transformation digitale.",
								icon: "💡",
							},
						].map((service, index) => (
							<div
								key={index}
								className="group p-8 bg-[#003152] rounded-xl border border-[#006A9E]/20 hover:border-[#006A9E] shadow-lg hover:shadow-[#006A9E]/20 transform hover:-translate-y-2 transition-all duration-300">
								<div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
									{service.icon}
								</div>
								<h2 className="text-xl font-bold mb-4 text-white">
									{service.title}
								</h2>
								<p className="text-gray-300 group-hover:text-white transition-colors duration-300">
									{service.description}
								</p>
							</div>
						))}
					</div>
				</div>
			</main>
		</>
	);
}
