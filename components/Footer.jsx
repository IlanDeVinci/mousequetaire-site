import Link from "next/link";

const Footer = () => {
	return (
		<footer className="bg-gray-800 text-white">
			<div className="container mx-auto px-4 py-8">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div>
						<h3 className="text-xl font-bold mb-2">Mousequetaire</h3>
						<p>Votre partenaire informatique</p>
					</div>
					<div>
						<h4 className="text-lg font-semibold mb-2">Contact</h4>
						<p>contact@mousequetaire.com</p>
						<p>01 23 45 67 89</p>
					</div>
					<div>
						<h4 className="text-lg font-semibold mb-2">Liens</h4>
						<Link href="/services">Nos services</Link>
						<br />
						<Link href="/contact">Contact</Link>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
