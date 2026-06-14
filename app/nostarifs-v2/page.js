import ScrollReveal from "../../components/ScrollReveal";
import AnimatedTarifCards, {
  AnimatedTarifCards2,
} from "../../components/tarifs/AnimatedTarifCards";

export default function TarifsV2() {
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

        {/* Cartes animées */}
        <ScrollReveal animation="fade-up" delay={200}>
          <AnimatedTarifCards />
        </ScrollReveal>

        {/* Section 2 */}
        <ScrollReveal animation="fade-down">
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-semibold text-center mt-24 sm:mt-32 mb-3"
            style={{ color: "#EBF2FA" }}
          >
            Services complémentaires
          </h2>
        </ScrollReveal>
        <ScrollReveal animation="fade-up" delay={150}>
          <p className="text-center text-xl sm:text-2xl font-medium text-[#EBF2FA] mb-1">
            Pour aller plus loin
          </p>
          <p className="text-center text-sm sm:text-base text-white/60 mb-12 sm:mb-16">
            Options et accompagnements à la carte
          </p>
        </ScrollReveal>

        {/* Cartes 05–08 */}
        <ScrollReveal animation="fade-up" delay={200}>
          <AnimatedTarifCards2 />
        </ScrollReveal>
      </div>
    </div>
  );
}
