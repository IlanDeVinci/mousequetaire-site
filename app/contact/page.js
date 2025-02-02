"use client";
import { useState } from "react";
import Navbar from "../../components/Navbar";

export default function Contact() {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		message: "",
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		// Ajoutez ici la logique d'envoi du formulaire
		console.log(formData);
	};

	return (
		<>
			<Navbar />
			<main className="pt-24 pb-16 min-h-screen bg-[#002132]">
				<div className="container mx-auto px-4 max-w-xl">
					<h1 className="text-4xl md:text-5xl font-bold mb-8 text-center text-white">
						Contactez-nous
					</h1>
					<form
						onSubmit={handleSubmit}
						className="space-y-6 bg-[#003152] p-8 rounded-2xl border border-[#006A9E]/20">
						{[
							{ id: "name", label: "Nom", type: "text" },
							{ id: "email", label: "Email", type: "email" },
						].map((field) => (
							<div
								key={field.id}
								className="group">
								<label
									htmlFor={field.id}
									className="block mb-2 font-medium text-white">
									{field.label}
								</label>
								<input
									type={field.type}
									id={field.id}
									value={formData[field.id]}
									onChange={(e) =>
										setFormData({ ...formData, [field.id]: e.target.value })
									}
									className="w-full p-3 bg-[#002132] border border-[#006A9E]/30 rounded-lg text-white focus:ring-2 focus:ring-[#006A9E] focus:border-transparent transition-all duration-300 outline-none hover:border-[#006A9E]"
									required
								/>
							</div>
						))}
						<div className="group">
							<label
								htmlFor="message"
								className="block mb-2 font-medium text-white">
								Message
							</label>
							<textarea
								id="message"
								rows="5"
								value={formData.message}
								onChange={(e) =>
									setFormData({ ...formData, message: e.target.value })
								}
								className="w-full p-3 bg-[#002132] border border-[#006A9E]/30 rounded-lg text-white focus:ring-2 focus:ring-[#006A9E] focus:border-transparent transition-all duration-300 outline-none hover:border-[#006A9E]"
								required
							/>
						</div>
						<button
							type="submit"
							className="w-full py-4 px-6 bg-[#006A9E] text-white rounded-lg font-semibold hover:bg-[#0085c7] hover:shadow-lg shadow-[#006A9E]/50 transform hover:-translate-y-0.5 transition-all duration-300">
							Envoyer
						</button>
					</form>
				</div>
			</main>
		</>
	);
}
