import { portfolioItems } from "@/data/portfolioItems";
import { BreadcrumbSchema } from "@/app/schema";
import ProjectDetailsClient from "./ProjectDetailsClient";

export function generateStaticParams() {
  return portfolioItems.map((item) => ({
    id: String(item.id),
  }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const project = portfolioItems.find((item) => item.id === parseInt(id));

  if (!project) {
    return {
      title: "Projet introuvable",
      description: "Ce projet n'existe pas dans notre portfolio.",
    };
  }

  const shortDesc = project.description.slice(0, 155).replace(/\s+\S*$/, "…");

  return {
    title: `${project.title} — Réalisation ${project.technologies[0] || "Web"}`,
    description: `${project.title} : ${shortDesc}. Projet réalisé par Mousequetaire pour ${project.client} en ${project.year} avec ${project.technologies.join(", ")}.`,
    keywords: [
      project.title.toLowerCase(),
      ...project.technologies.map((t) => t.toLowerCase()),
      "portfolio agence web",
      "réalisation web",
      project.client.toLowerCase(),
      "développement web île-de-france",
    ],
    openGraph: {
      title: `${project.title} | Portfolio Mousequetaire`,
      description: `${shortDesc}. Réalisé avec ${project.technologies.join(", ")} pour ${project.client}.`,
      url: `https://mousequetaire.com/portfolio/${project.id}`,
      images: [
        {
          url: project.image,
          width: 1200,
          height: 630,
          alt: `${project.title} - Projet ${project.technologies[0] || "web"} par Mousequetaire`,
        },
      ],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} | Mousequetaire`,
      description: shortDesc,
      images: [project.image],
    },
    alternates: {
      canonical: `https://mousequetaire.com/portfolio/${project.id}`,
    },
  };
}

function ProjectSchema({ project }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.description,
    url: `https://mousequetaire.com/portfolio/${project.id}`,
    image: `https://mousequetaire.com${project.image}`,
    dateCreated: project.year,
    creator: {
      "@type": "Organization",
      name: "Mousequetaire",
      url: "https://mousequetaire.com",
    },
    ...(project.client !== "Projet personnel" &&
      project.client !== "Projet artistique" && {
        client: {
          "@type": "Organization",
          name: project.client,
        },
      }),
    keywords: project.technologies.join(", "),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default async function ProjectDetailsPage({ params }) {
  const { id } = await params;
  const project = portfolioItems.find((item) => item.id === parseInt(id));

  return (
    <>
      {project && (
        <>
          <ProjectSchema project={project} />
          <BreadcrumbSchema
            items={[
              { name: "Accueil", url: "https://mousequetaire.com" },
              {
                name: "Portfolio",
                url: "https://mousequetaire.com/portfolio",
              },
              {
                name: project.title,
                url: `https://mousequetaire.com/portfolio/${project.id}`,
              },
            ]}
          />
        </>
      )}
      <ProjectDetailsClient project={project || null} />
    </>
  );
}
