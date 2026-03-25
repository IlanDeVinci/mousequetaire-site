import { Geist, Geist_Mono } from "next/font/google";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import { ModalProvider } from "@/context/ModalContext";
import { GSAPProvider } from "@/context/GSAPContext";
import PageLoader from "@/context/PageLoader";
import { LoadingProvider } from "@/context/PageLoader";
import { OrganizationSchema, WebSiteSchema } from "./schema";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://mousequetaire.com"),
  title: {
    default:
      "Mousequetaire | Agence de Développement Web & Design en Île-de-France",
    template: "%s | Mousequetaire",
  },
  description:
    "Mousequetaire, agence de développement web et design en Île-de-France. Création de sites internet modernes, applications web React/Next.js sur mesure, e-commerce, support technique dédié et conseil digital. Devis gratuit.",
  keywords: [
    "agence web île-de-france",
    "création site internet",
    "développement web sur mesure",
    "agence développement web",
    "création site vitrine",
    "application web react",
    "développeur next.js",
    "design web moderne",
    "site e-commerce",
    "refonte site internet",
    "support technique web",
    "hébergement site web",
    "conseil digital",
    "agence digitale paris",
    "mousequetaire",
    "création application web",
    "développeur web freelance",
    "devis site internet gratuit",
  ],
  authors: [{ name: "Mousequetaire" }],
  creator: "Mousequetaire",
  publisher: "Mousequetaire",
  category: "technology",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://mousequetaire.com",
    siteName: "Mousequetaire",
    title:
      "Mousequetaire — Agence de Développement Web & Design en Île-de-France",
    description:
      "Création de sites internet modernes, applications web sur mesure, e-commerce et support technique. 15+ projets réalisés pour mairies, entreprises et startups.",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 600,
        alt: "Mousequetaire - Agence de Développement Web et Design en Île-de-France",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mousequetaire | Agence Web & Design Île-de-France",
    description:
      "Création de sites internet modernes, applications web sur mesure et support technique dédié. Devis gratuit.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://mousequetaire.com",
    languages: {
      "fr-FR": "https://mousequetaire.com",
    },
  },
  verification: {
    google: "fe6278605ea6ab3d",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className="bg-[#050610]">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <OrganizationSchema />
        <WebSiteSchema />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} antialiased relative bg-[#050610]`}
      >
        <LoadingProvider>
          <GSAPProvider>
            <ModalProvider>
              <PageLoader />
              <Navbar />
              <main className="w-full py-16 pt-32 bg-[#050610] min-h-screen overflow-x-hidden">
                {children}
              </main>
              <BackToTop />
              <Footer />
            </ModalProvider>
          </GSAPProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}
