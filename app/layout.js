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
  title: "Mousequetaire",
  description: "Mousequetaire - Agence de développement web & design",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="bg-[#050610]">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Mousequetaire" />
        <link rel="icon" href="/favicon.png" />
        <title>Mousequetaire</title>
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
