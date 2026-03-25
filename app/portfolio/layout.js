import { BreadcrumbSchema } from "@/app/schema";

export const metadata = {
  title: "Portfolio — Nos Réalisations Web, Apps & IA",
  description:
    "Découvrez les réalisations de Mousequetaire : sites vitrines, applications web Next.js/React, projets d'intelligence artificielle, e-commerce PrestaShop, solutions IoT et expériences 3D. Projets pour mairies, CCI, entreprises et startups.",
  keywords: [
    "portfolio agence web",
    "réalisations développement web",
    "projets next.js react",
    "création site vitrine",
    "application web sur mesure",
    "projet intelligence artificielle",
    "e-commerce prestashop",
    "solution iot entreprise",
    "portfolio développeur web île-de-france",
  ],
  openGraph: {
    title: "Portfolio Mousequetaire — Sites Web, Apps & Projets IA",
    description:
      "15+ projets réalisés : sites vitrines, applications web, IA, e-commerce et IoT pour des clients variés en France.",
    url: "https://mousequetaire.com/portfolio",
  },
  alternates: {
    canonical: "https://mousequetaire.com/portfolio",
  },
};

export default function PortfolioLayout({ children }) {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Accueil", url: "https://mousequetaire.com" },
          { name: "Portfolio", url: "https://mousequetaire.com/portfolio" },
        ]}
      />
      {children}
    </>
  );
}
