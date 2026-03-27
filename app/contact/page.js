import ContactPageClient from "@/components/contact/ContactPageClient";

export default function Contact() {
  return (
    <>
      <main className="pt-24 -pb-20 bg-[#050610] min-h-screen font-montserrat">
        {/* Static SEO content - visible to crawlers */}
        <div className="sr-only">
          <h1>Contactez Mousequetaire</h1>
          <p>
            Contactez-nous via ces différents médias : Instagram, Email.
            Appelez-nous au +33 1 23 45 67 89 ou écrivez-nous à mousequetaires@gmail.com.
            Découvrez nos dernières publications sur Instagram @mousequetaire et LinkedIn @mousequetaire.
          </p>
          <h2>Nos services de contact</h2>
          <ul>
            <li>Email Pro - Pour toute question concernant nos services professionnels - pro@mousequetaire.com</li>
            <li>Support - Besoin d&apos;aide avec un projet existant ou d&apos;un support technique - support@mousequetaire.com</li>
            <li>Carrières - Rejoignez notre équipe dynamique de professionnels passionnés - jobs@mousequetaire.com</li>
            <li>Autres - Pour toutes autres demandes - contact@mousequetaire.com</li>
          </ul>
          <h2>Réseaux sociaux</h2>
          <ul>
            <li><a href="https://instagram.com/mousequetaire">Instagram - @mousequetaire</a></li>
            <li><a href="https://www.linkedin.com/in/samuel-alhadef-190951257/">LinkedIn - @mousequetaire</a></li>
          </ul>
        </div>

        {/* Interactive client component */}
        <ContactPageClient />
      </main>
    </>
  );
}
