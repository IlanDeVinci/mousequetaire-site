import { BreadcrumbSchema } from "@/app/schema";

export const metadata = {
  title: "Nos Tarifs — Grille Tarifaire Développement Web",
  description:
    "Tarifs Mousequetaire : sites vitrine, landing pages, e-commerce, applications web sur mesure, refonte, maintenance et services additionnels. Devis gratuit et sans engagement, paiements échelonnés.",
  keywords: [
    "tarif création site internet",
    "prix site vitrine",
    "tarif site e-commerce",
    "prix application web sur mesure",
    "tarif refonte site web",
    "prix maintenance site internet",
    "devis site web gratuit",
    "tarif développeur web freelance",
    "grille tarifaire agence web",
  ],
  openGraph: {
    title: "Nos Tarifs — Grille Tarifaire Mousequetaire",
    description:
      "Sites vitrine, e-commerce, applications web sur mesure, refonte et maintenance. Tarifs transparents, devis gratuit et sans engagement.",
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
