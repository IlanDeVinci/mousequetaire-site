import { BreadcrumbSchema } from "@/app/schema";

export const metadata = {
  title: "Nos Tarifs — Web, Print et Design",
  description:
    "Tarifs Mousequetaire : landing pages, sites vitrine, e-commerce, applications web, identité visuelle, supports print et réseaux sociaux.",
  keywords: [
    "tarif création site internet",
    "prix site vitrine",
    "tarif site e-commerce",
    "prix application web sur mesure",
    "tarif refonte site web",
    "prix maintenance site internet",
    "tarif identité visuelle",
    "prix supports print",
    "tarif design réseaux sociaux",
    "devis site web gratuit",
    "tarif développeur web freelance",
    "grille tarifaire agence web",
  ],
  openGraph: {
    title: "Nos Tarifs — Web, Print et Design | Mousequetaire",
    description:
      "Découvrez nos tarifs pour le web, l'identité visuelle, les supports print et les réseaux sociaux.",
    url: "https://mousequetaire.com/nostarifs",
  },
  alternates: {
    canonical: "https://mousequetaire.com/nostarifs",
  },
};

export default function TarifsLayout({ children }) {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Accueil", url: "https://mousequetaire.com" },
          { name: "Nos Tarifs", url: "https://mousequetaire.com/nostarifs" },
        ]}
      />
      {children}
    </>
  );
}
