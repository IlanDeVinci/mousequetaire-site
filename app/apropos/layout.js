import { BreadcrumbSchema } from "@/app/schema";

export const metadata = {
  title: "À Propos — L'Équipe Mousequetaire, Agence Web en Île-de-France",
  description:
    "Découvrez l'équipe Mousequetaire : développeurs web passionnés basés en Île-de-France. Notre histoire, nos valeurs et notre expertise en création de sites internet, applications web et solutions digitales innovantes.",
  keywords: [
    "équipe développeurs web",
    "agence web île-de-france",
    "développeurs react next.js",
    "agence digitale paris",
    "équipe mousequetaire",
    "création site internet sur mesure",
    "développeurs web passionnés",
  ],
  openGraph: {
    title: "À Propos de Mousequetaire — Agence Web Île-de-France",
    description:
      "Développeurs web passionnés, nous créons des sites internet modernes et des applications sur mesure. Découvrez notre équipe et nos valeurs.",
    url: "https://mousequetaire.com/apropos",
  },
  alternates: {
    canonical: "https://mousequetaire.com/apropos",
  },
};

export default function AproposLayout({ children }) {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Accueil", url: "https://mousequetaire.com" },
          { name: "À Propos", url: "https://mousequetaire.com/apropos" },
        ]}
      />
      {children}
    </>
  );
}
