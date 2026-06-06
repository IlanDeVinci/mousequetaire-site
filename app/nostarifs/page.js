import ScrollReveal from "../../components/ScrollReveal";
import {
  SectionTitle,
  PriceCard,
  ComparisonTable,
  MaintenanceCard,
  ServicesTable,
  Legend,
  NoteBox,
} from "../../components/tarifs/TarifsUI";
import {
  vitrineCards,
  vitrineComparison,
  ecommerceCards,
  ecommerceComparison,
  applicationCards,
  refonteCards,
  maintenanceCards,
  servicesAdditionnels,
  conditions,
} from "../../data/tarifs";

export default function Tarifs() {
  return (
    <div className="pt-8 pb-16 px-3 sm:px-4 md:px-8 lg:px-12 xl:px-48">
      <div className="container mx-auto">
        {/* En-tête */}
        <ScrollReveal animation="fade-down">
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-semibold text-center mt-8 sm:mt-12 mb-3"
            style={{ color: "#EBF2FA" }}
          >
            Nos tarifs
          </h1>
        </ScrollReveal>
        <ScrollReveal animation="fade-up" delay={150}>
          <p className="text-center text-xl sm:text-2xl font-medium text-[#EBF2FA] mb-1">
            Grille Tarifaire
          </p>
          <p className="text-center text-sm sm:text-base text-white/60 mb-12 sm:mb-16">
            Services de Développement Web - Tarifs Étudiant Freelance
          </p>
        </ScrollReveal>

        {/* Sites Vitrine & Landing Pages */}
        <ScrollReveal animation="fade-up" className="mb-16">
          <SectionTitle>Sites Vitrine & Landing Pages</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {vitrineCards.map((card) => (
              <PriceCard key={card.title} {...card} color="green" />
            ))}
          </div>
          <ComparisonTable data={vitrineComparison} />
        </ScrollReveal>

        {/* Sites E-commerce */}
        <ScrollReveal animation="fade-up" className="mb-16">
          <SectionTitle>Sites E-commerce</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {ecommerceCards.map((card) => (
              <PriceCard key={card.title} {...card} color="green" />
            ))}
          </div>
          <ComparisonTable data={ecommerceComparison} />
        </ScrollReveal>

        {/* Applications Web Personnalisées */}
        <ScrollReveal animation="fade-up" className="mb-16">
          <SectionTitle>Applications Web Personnalisées</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6">
            {applicationCards.map((card) => (
              <PriceCard key={card.title} {...card} color="green" />
            ))}
          </div>
          <NoteBox>
            <strong className="text-[#71C6F0] font-semibold">Note :</strong> Les
            applications web personnalisées sont évaluées au cas par cas. Un
            devis détaillé sera fourni après analyse de vos besoins spécifiques.
            Les prix incluent le développement frontend et backend, la base de
            données, et la documentation technique.
          </NoteBox>
        </ScrollReveal>

        {/* Refonte de Sites Existants */}
        <ScrollReveal animation="fade-up" className="mb-16">
          <SectionTitle>Refonte de Sites Existants</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {refonteCards.map((card, i) => (
              <PriceCard
                key={card.title}
                {...card}
                color={i === 1 ? "green" : "blue"}
              />
            ))}
          </div>
        </ScrollReveal>

        {/* Maintenance & Support */}
        <ScrollReveal animation="fade-up" className="mb-16">
          <SectionTitle>Maintenance & Support</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {maintenanceCards.map((card) => (
              <MaintenanceCard key={card.title} {...card} />
            ))}
          </div>
          <p className="mt-6 text-sm text-white/70 rounded-2xl border border-[#4d5067] bg-[#191b33] p-4">
            <strong className="text-[#EBF2FA] font-semibold">
              Heure supplémentaire :
            </strong>{" "}
            Développement ou modifications au-delà du forfait -{" "}
            <span className="text-[#4ADE80] font-semibold">25€/heure</span>
          </p>
        </ScrollReveal>

        {/* Services Additionnels */}
        <ScrollReveal animation="fade-up" className="mb-16">
          <SectionTitle>Services Additionnels</SectionTitle>
          <ServicesTable rows={servicesAdditionnels} />
        </ScrollReveal>

        {/* Légende */}
        <ScrollReveal animation="fade-up" className="mb-16">
          <SectionTitle>Légende</SectionTitle>
          <Legend />
        </ScrollReveal>

        {/* Conditions générales */}
        <ScrollReveal animation="fade-up">
          <SectionTitle>📋Conditions générales</SectionTitle>
          <div className="rounded-2xl border border-[#4d5067] bg-[#191b33] p-5 sm:p-6">
            <ul className="space-y-3">
              {conditions.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-sm sm:text-base text-white/80"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#05DF72]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
