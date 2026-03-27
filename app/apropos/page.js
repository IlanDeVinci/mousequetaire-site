import ScrollReveal from "../../components/ScrollReveal";
import DiscoverElement from "../../components/apropos/DiscoverElement";
import TeamMember from "../../components/apropos/TeamMember";
import ValuesSection from "../../components/apropos/ValuesSection";
import AproposStyles from "../../components/apropos/AproposStyles";

const teamMembers = [
  {
    id: 1,
    name: "Samuel Alhadef",
    role: "CEO/CCO | Chief Communication Officer",
    description:
      "Je m'occupe de vous \u00e9couter et de comprendre vos besoins. En tant que responsable des clients, je suis l\u00e0 pour r\u00e9pondre \u00e0 vos questions et m'assurer que votre projet avance bien. Vous parlez directement avec moi, du premier rendez-vous jusqu'\u00e0 la fin ",
    image: "/images/photo-samuel.jpg",
  },
  {
    id: 2,
    name: "C\u00e9lestin Godefroy",
    role: "COO | Chief Operational Officer / Responsable Communication",
    description:
      "Je coordonne toutes nos op\u00e9rations et veille au bon d\u00e9roulement de votre projet. Je m'assure que les d\u00e9lais sont respect\u00e9s et que chaque \u00e9tape est r\u00e9alis\u00e9e avec qualit\u00e9. Je suis \u00e9galement charg\u00e9 de faire conna\u00eetre et cro\u00eetre Mousequetaires.",
    image: "/images/photo-c\u00e9lestin.jpg",
  },
  {
    id: 3,
    name: "Ilan Maouchi",
    role: "CTO | Chief Technical Officer",
    description:
      "Expert technique de l'\u00e9quipe, je con\u00e7ois les solutions et choisis les technologies adapt\u00e9es \u00e0 votre projet. Je transforme vos id\u00e9es en r\u00e9alit\u00e9s num\u00e9riques fonctionnelles et innovantes. Pour toute question technique, comptez sur mon expertise.",
    image: "/images/photo-ilan.jpeg",
  },
  {
    id: 4,
    name: "Dorian Collet",
    role: "Directeur Artistique",
    description:
      "Je suis le Directeur Artistique, responsable de toute l'identit\u00e9 visuelle de vos projets. Je supervise la cr\u00e9ation des designs, garantis leur coh\u00e9rence et m'assure qu'ils refl\u00e8tent parfaitement votre image de marque. Mon r\u00f4le est de transformer vos id\u00e9es en exp\u00e9riences visuelles impactantes.",
    image: "/images/photo-dorian.png",
  },
  {
    id: 6,
    name: "Ilona DUBLINEAU",
    role: "Responsable Commercial & Marketing",
    description:
      "Je suis la Responsable Commercial et Marketing, en charge de d\u00e9velopper notre portefeuille client. Mon r\u00f4le consiste \u00e0 identifier de nouvelles opportunit\u00e9s, prospecter, et \u00e9tablir des relations solides avec nos futurs partenaires. J'accompagne les clients d\u00e8s le premier contact, comprends leurs besoins et leur propose des solutions adapt\u00e9es. Mon objectif est de cr\u00e9er une collaboration de confiance et de d\u00e9crocher les contrats qui permettront \u00e0 votre projet de prendre de l'ampleur.",
    image: "/images/photo_ilona.jpg",
  },
];

export default function Equipe() {
  return (
    <>
      <main className="pt-20">
        <ScrollReveal animation="fade-down" delay={100}>
          <header className="p-4 md:p-24 text-center">
            <h1 className="text-3xl md:text-5xl pb-4 md:pb-8">
              Qui sommes nous ?
            </h1>
            <p>
              Nous sommes trois passionn&eacute;s qui, autour d&apos;un bon repas et de
              discussions enflamm&eacute;es, avons donn&eacute; vie &agrave; Mouse-quetaires en 2025.
              Notre histoire ? Celle d&apos;amis qui partagent un r&ecirc;ve simple
              mais ambitieux : rendre la technologie et l&apos;IA vraiment
              accessibles &agrave; tous, sans le jargon intimidant.
            </p>
          </header>
        </ScrollReveal>
        <ScrollReveal animation="zoom-in" delay={200}>
          <section className="flex justify-center mb-16 px-4">
            <DiscoverElement />
          </section>
        </ScrollReveal>

        <ScrollReveal animation="fade-up" delay={100}>
          <section className="text-center justify-center mb-16 px-4 md:px-12 lg:px-44">
            <h1 className="text-3xl md:text-4xl mb-12 md:mb-24">
              Notre &eacute;quipe
            </h1>
            {teamMembers.map((member, index) => (
              <TeamMember
                key={member.id}
                image={member.image}
                name={member.name}
                role={member.role}
                description={member.description}
                reverse={index % 2 === 1}
              />
            ))}
          </section>
        </ScrollReveal>

        <ValuesSection />
      </main>

      <AproposStyles />
    </>
  );
}
