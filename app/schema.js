export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": "https://mousequetaire.com/#organization",
    name: "Mousequetaire",
    url: "https://mousequetaire.com",
    logo: {
      "@type": "ImageObject",
      url: "https://mousequetaire.com/logo.png",
      width: 800,
      height: 600,
    },
    description:
      "Agence de développement web et design en Île-de-France. Création de sites internet modernes, applications web sur mesure, support technique et conseil digital.",
    email: "contact.mousequetaire@gmail.com",
    telephone: "+33652213487",
    sameAs: [
      "https://www.instagram.com/mousequetaire",
      "https://www.linkedin.com/company/mousequetaire",
    ],
    address: {
      "@type": "PostalAddress",
      addressRegion: "Île-de-France",
      addressCountry: "FR",
    },
    areaServed: [
      {
        "@type": "GeoCircle",
        geoMidpoint: {
          "@type": "GeoCoordinates",
          latitude: 48.8566,
          longitude: 2.3522,
        },
        geoRadius: "100000",
      },
      {
        "@type": "Country",
        name: "France",
      },
    ],
    priceRange: "€€",
    knowsAbout: [
      "Développement Web",
      "Design Web",
      "React",
      "Next.js",
      "Applications sur mesure",
      "Support technique",
      "Intelligence artificielle",
      "E-commerce",
      "SEO",
      "IoT",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Services Mousequetaire",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Développement Web",
            description:
              "Création de sites web modernes et responsive : sites vitrines, applications web, e-commerce.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Support Technique",
            description:
              "Hébergement sur serveurs dédiés, maintenance, assistance et résolution de problèmes techniques.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Conseil Digital",
            description:
              "Accompagnement stratégique, community management, SEO et solutions digitales sur mesure.",
          },
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebSiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://mousequetaire.com/#website",
    name: "Mousequetaire",
    url: "https://mousequetaire.com",
    description:
      "Agence de développement web et design basée en Île-de-France. Sites vitrines, applications web, e-commerce, IA et support technique.",
    publisher: {
      "@id": "https://mousequetaire.com/#organization",
    },
    inLanguage: "fr-FR",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://mousequetaire.com/portfolio?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ServiceSchema({ name, description, url }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url,
    provider: {
      "@id": "https://mousequetaire.com/#organization",
    },
    areaServed: {
      "@type": "Country",
      name: "France",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BreadcrumbSchema({ items }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function FAQSchema({ questions }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
