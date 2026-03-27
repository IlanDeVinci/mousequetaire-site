import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "../components/ScrollReveal";
import TypeWriter from "../components/TypeWriter";
import HeroSection from "../components/HeroSection";
import HomeStyles from "../components/HomeStyles";
import FlipCard from "../components/FlipCard";

export default function Home() {
  return (
    <>
      <HomeStyles />
      <ScrollReveal animation="fade-up" threshold={0.1}>
        <HeroSection>
          <TypeWriter
            text="Transformation digitale. Innovation technologique. Création d'identité numérique."
            className="text-base md:text-lg text-white opacity-70 mb-12 font-light tracking-wide"
            speed={50}
          />
        </HeroSection>
      </ScrollReveal>
      {/* Services Section */}
      <ScrollReveal animation="fade-up" threshold={0.1}>
        <section className="py-16 mx-[5vw]">
          <div className="container mx-auto px-4">
            <h2 className="text-5xl font-light text-center mb-12 text-white">
              Nos Services
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 services-grid">
              {[
                {
                  title: "Développement Web",
                  description:
                    "Sites et applications web sur mesure avec des technologies modernes. Développement réactif, optimisé pour les performances et compatible tous appareils. Solutions évolutives adaptées à vos besoins uniques.",
                },
                {
                  title: "Design UX/UI",
                  description:
                    "Maquettes d'applications, logos, chartes graphiques et interfaces utilisateur intuitives. Design créatif et fonctionnel qui valorise votre marque. Solutions visuelles adaptées à votre identité pour une expérience utilisateur optimale.",
                },
                {
                  title: "Stratégie Digitale",
                  description:
                    "Analyse de marché et ciblage précis de votre audience. Stratégies de référencement (SEO/SEA) pour maximiser votre visibilité. Plans de conversion optimisés et présence sur les réseaux sociaux. L'expertise de nos techniciens garantit un ROI mesurable pour votre entreprise.",
                },
              ].map((service, index) => (
                <ScrollReveal
                  className="flip-card-scrollreveal"
                  key={index}
                  animation="fade-up"
                  threshold={0.1}
                  delay={index * 150}
                >
                  <FlipCard
                    frontContent={service.title}
                    backContent={service.description}
                    index={index}
                  />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>
      {/* Team Section */}
      <ScrollReveal animation="fade-up" threshold={0.1} delay={100}>
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-5xl font-light text-center mb-12 text-white">
              Notre Équipe
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mx-auto max-w-6xl">
              {[
                {
                  name: "Samuel Alhadef",
                  role: "CEO/CCO - Chief Customer Officer",
                  image: "/images/photo-samuel.jpg",
                },
                {
                  name: "Ilan Maouchi",
                  role: "CIO - Chief Information Officer",
                  image: "/images/photo-ilan.jpeg",
                },
                {
                  name: "Dorian Collet",
                  role: "Directeur Artistique",
                  image: "/images/photo-dorian.png",
                },
              ].map((member, index) => (
                <ScrollReveal
                  key={index}
                  animation="zoom-in"
                  threshold={0.1}
                  delay={index * 200}
                >
                  <div className="flex flex-col items-center">
                    <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden mb-4 border-2 border-[#48B1E5]/30">
                      <Image
                        src={member.image}
                        alt={member.name}
                        width={300}
                        height={300}
                        className={`object-cover w-full h-full ${
                          member.name === "Dorian Collet"
                            ? "scale-125 object-center"
                            : ""
                        }`}
                      />
                    </div>
                    <h3 className="text-xl font-medium text-white">
                      {member.name}
                    </h3>
                    <p className="text-[#48B1E5] font-semibold font-montserrat">
                      {member.role}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
          <div className="mt-12 text-center">
            <Link href="/apropos">
              <button className="bg-[#EBF2FA] hover:bg-[#256b90] text-white font-semibold py-3 px-6 rounded-full transition duration-300 items-center justify-center mx-auto cursor-pointer max-w-xs inline-flex">
                <span className="text-[#060606] text-lg font-montserrat">
                  En savoir plus
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 ml-2 text-[#060606]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </Link>
          </div>
        </section>
      </ScrollReveal>
      <ScrollReveal animation="fade-right" threshold={0.1}>
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3 xl md:text-5xl font-light text-center mb-12 text-white">
              Les Mousequetaires, notre ambition...{" "}
            </h2>

            <div className="max-w-5xl mx-auto space-y-10">
              <ScrollReveal animation="fade-up" delay={500} threshold={0.2}>
                <div className="flex justify-start">
                  <div
                    className="w-4/5 md:w-2/3 text-gray-300 p-6 rounded-lg relative py-12 overflow-hidden text-justify"
                    style={{
                      background:
                        "linear-gradient(to right, rgba(5,6,16,0.85), rgba(5,6,16,0.95))",
                    }}
                  >
                    <div
                      className="absolute inset-0 z-0 opacity-80"
                      style={{
                        backgroundImage: "url('/images/accueil1.svg')",
                        backgroundSize: "contain",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        transition: "all 1.2s ease-out",
                      }}
                    ></div>
                    <p className="text-lg relative z-10 backdrop-blur-xs p-4 rounded-2xl border-1 border-white/80">
                      Mouse-quetaires est né en 2025 de la rencontre de trois
                      passionnés réunis autour d&apos;un bon repas et de
                      discussions animées. Notre aventure est celle d&apos;amis
                      unis par une vision commune : rendre la technologie et le
                      développement web accessibles à tous, en dépassant les
                      barrières du jargon technique et en proposant une approche
                      claire, humaine et pédagogique.
                    </p>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal animation="fade-left" delay={500} threshold={0.2}>
                <div className="flex justify-end">
                  <div
                    className="w-4/5 md:w-2/3 text-gray-300 p-6 rounded-lg relative overflow-hidden py-12 text-justify"
                    style={{
                      background:
                        "linear-gradient(to left, rgba(5,6,16,0.85), rgba(5,6,16,0.95))",
                      textAlignLast: "right",
                    }}
                  >
                    <div
                      className="absolute inset-0 z-0 opacity-100"
                      style={{
                        backgroundImage: "url('/images/accueil2.svg')",
                        backgroundSize: "contain",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        transition: "all 1.2s ease-out",
                      }}
                    ></div>
                    <p className="text-lg relative z-10 backdrop-blur-xs p-4 rounded-2xl border-1 border-white/80">
                      Ce qui nous anime au quotidien ? L&apos;exigence
                      d&apos;une qualité sans compromis, une créativité sans
                      limites, et une transparence totale dans tout ce que nous
                      entreprenons. Et nous croyons fermement qu&apos;une
                      relation de confiance repose sur l&apos;honnêteté. Chaque
                      projet est traité avec intégrité, sincérité et un
                      engagement authentique. Les solutions standardisées ? Très
                      peu pour nous. Votre projet est unique, et il mérite une
                      attention sur mesure, avec cette touche personnelle qui
                      fait toute la différence.
                    </p>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal animation="zoom-in" delay={500} threshold={0.2}>
                <div className="flex justify-start">
                  <div
                    className="w-4/5 md:w-2/3 text-gray-300 p-6 rounded-lg relative py-12 text-justify"
                    style={{
                      background:
                        "linear-gradient(to right, rgba(5,6,16,0.85), rgba(5,6,16,0.95))",
                    }}
                  >
                    <div
                      className="absolute inset-0 z-0 opacity-90"
                      style={{
                        backgroundImage: "url('/images/accueil3.svg')",
                        backgroundSize: "contain",
                        backgroundPosition: "bottom  left",
                        backgroundRepeat: "no-repeat",
                        maskImage:
                          "linear-gradient(to left, rgba(0,0,0,1) 70%, rgba(0,0,0,0))",
                        WebkitMaskImage:
                          "linear-gradient(to left, rgba(0,0,0,1) 70%, rgba(0,0,0,0))",
                        transition: "all 1.2s ease-out",
                      }}
                    ></div>
                    <p className="text-lg relative z-10 backdrop-blur-xs p-4 rounded-2xl border-1 border-white/80">
                      Nous travaillons en équipe soudée, où expertise technique
                      et créativité se nourrissent mutuellement. Nous sommes
                      chacun experts dans nos domaines et c'est en mettant nos
                      compétences en commun que nous arrivons à comprendre vos
                      défis numériques et à imaginer des solutions qui vous
                      ressemblent vraiment.
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>
      </ScrollReveal>
      {/* Projects Section */}
      <ScrollReveal animation="fade-up" threshold={0.05}>
        <section className="py-16 mx-6">
          <div className="container mx-auto px-4">
            <h2 className="text-5xl font-light text-center mb-12 text-white">
              Quelques unes de nos créations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  title: "Pizzeria Chartrettes",
                  description: "Site vitrine pour la pizzeria de Chartrettes",
                  image: "/images/projets/pizzeria/icon.png",
                },
                {
                  title: "Reservation bureaux CCI",
                  description: "Application de reservation integree a Teams",
                  image: "/images/projets/Application-teams/icon.png",
                },
                {
                  title: "Conge Chartrettes",
                  description:
                    "Application de gestion des conges pour la mairie",
                  image: "/images/projets/conge-chartrettes/icon.png",
                },
              ].map((project, index) => (
                <ScrollReveal
                  key={index}
                  animation="zoom-in"
                  delay={200 * index}
                  threshold={0.2}
                >
                  <div className="group relative overflow-hidden rounded-3xl aspect-square">
                    <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-[#050610] z-10" />
                    <Image
                      src={project.image}
                      alt={project.title}
                      width={400}
                      height={400}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-linear-to-b from-transparent via-[#050610]/40 to-[#050610] flex flex-col justify-end p-4 transition-all z-20"></div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
            <div className="mt-12 text-center">
              <Link href="/portfolio">
                <button className="bg-[#EBF2FA] hover:bg-[#256b90] text-white font-semibold py-3 px-6 rounded-full transition duration-300 items-center justify-center mx-auto cursor-pointer max-w-xs inline-flex">
                  <span className="text-[#060606] text-lg font-montserrat">
                    En savoir plus
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 ml-2 text-[#060606]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </Link>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </>
  );
}
