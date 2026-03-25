import { BreadcrumbSchema } from "@/app/schema";

export const metadata = {
  title: "Contact — Devis Gratuit pour votre Projet Web",
  description:
    "Contactez Mousequetaire pour votre projet web : site internet, application, e-commerce ou refonte. Devis gratuit et conseil personnalisé. Email : contact.mousequetaire@gmail.com | Tél : 06 52 21 34 87. Réponse sous 24h.",
  keywords: [
    "devis site internet gratuit",
    "contact agence web",
    "devis création site web",
    "agence web île-de-france contact",
    "devis application web",
    "tarif création site internet",
  ],
  openGraph: {
    title: "Contactez Mousequetaire — Devis Gratuit Projet Web",
    description:
      "Obtenez un devis gratuit pour votre projet web. Conseil personnalisé, réponse rapide. Mousequetaire, agence web en Île-de-France.",
    url: "https://mousequetaire.com/contact",
  },
  alternates: {
    canonical: "https://mousequetaire.com/contact",
  },
};

export default function ContactLayout({ children }) {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Accueil", url: "https://mousequetaire.com" },
          { name: "Contact", url: "https://mousequetaire.com/contact" },
        ]}
      />
      {children}
    </>
  );
}
