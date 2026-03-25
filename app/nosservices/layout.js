import { BreadcrumbSchema, ServiceSchema } from "@/app/schema";

export const metadata = {
  title: "Nos Services — Développement Web, Support & Conseil Digital",
  description:
    "Agence web Mousequetaire : développement de sites internet sur mesure, applications web React/Next.js, support technique dédié, hébergement, SEO, e-commerce et conseil digital en Île-de-France. Devis gratuit.",
  keywords: [
    "développement web sur mesure",
    "création site internet île-de-france",
    "agence web react next.js",
    "support technique site web",
    "hébergement web dédié",
    "maintenance site internet",
    "conseil digital entreprise",
    "création e-commerce",
    "application web sur mesure",
    "refonte site web",
  ],
  openGraph: {
    title: "Services Mousequetaire — Développement Web, Support & Conseil",
    description:
      "Développement web sur mesure, support technique ultra-réactif et conseil digital. Solutions adaptées à votre budget avec hébergement sur nos propres serveurs.",
    url: "https://mousequetaire.com/nosservices",
  },
  alternates: {
    canonical: "https://mousequetaire.com/nosservices",
  },
};

export default function ServicesLayout({ children }) {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Accueil", url: "https://mousequetaire.com" },
          { name: "Nos Services", url: "https://mousequetaire.com/nosservices" },
        ]}
      />
      <ServiceSchema
        name="Développement Web Sur Mesure"
        description="Création de sites web modernes et responsive : sites vitrines, applications web, e-commerce. Technologies React, Next.js, TailwindCSS."
        url="https://mousequetaire.com/nosservices"
      />
      <ServiceSchema
        name="Support Technique & Hébergement"
        description="Hébergement sur serveurs dédiés, maintenance proactive, assistance réactive et résolution de problèmes techniques."
        url="https://mousequetaire.com/nosservices"
      />
      <ServiceSchema
        name="Conseil Digital & SEO"
        description="Accompagnement stratégique, référencement naturel, community management et optimisation de votre présence en ligne."
        url="https://mousequetaire.com/nosservices"
      />
      {children}
    </>
  );
}
