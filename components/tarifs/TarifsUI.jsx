// Composants de présentation de la grille tarifaire (page /nostarifs).
// Pas de hooks : composants serveur, importés dans app/nostarifs/page.js.

const PRICE_COLORS = {
  green: "#4ADE80",
  blue: "#71C6F0",
};

export const CheckIcon = (props) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Inclus"
    role="img"
    {...props}
  >
    <path
      d="M20 6L9 17L4 12"
      stroke="#05DF72"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const CrossIcon = (props) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Non inclus"
    role="img"
    {...props}
  >
    <path
      d="M18 6L6 18"
      stroke="#FF6467"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6 6L18 18"
      stroke="#FF6467"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const WarningIcon = (props) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Basique / optionnel"
    role="img"
    {...props}
  >
    <path
      d="M11.4413 3.33429C11.2948 3.08172 11.0845 2.87208 10.8314 2.72635C10.5784 2.58061 10.2916 2.50391 9.99959 2.50391C9.70761 2.50391 9.42075 2.58061 9.16774 2.72635C8.91472 2.87208 8.70444 3.08172 8.55793 3.33429L1.89126 15.001C1.74505 15.2542 1.66804 15.5414 1.66797 15.8339C1.66789 16.1263 1.74475 16.4136 1.89083 16.6669C2.03691 16.9202 2.24706 17.1306 2.50019 17.277C2.75332 17.4234 3.04051 17.5007 3.33293 17.501H16.6663C16.9587 17.5007 17.2459 17.4234 17.499 17.277C17.7521 17.1306 17.9623 16.9202 18.1084 16.6669C18.2544 16.4136 18.3313 16.1263 18.3312 15.8339C18.3311 15.5414 18.2541 15.2542 18.1079 15.001L11.4413 3.33429Z"
      stroke="#FDC700"
      strokeWidth="1.66667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Rend une valeur de cellule : booléen -> icône, "warning" -> icône, sinon texte.
const Cell = ({ value }) => {
  if (value === true) return <CheckIcon className="mx-auto" />;
  if (value === false) return <CrossIcon className="mx-auto" />;
  if (value === "warning") return <WarningIcon className="mx-auto" />;
  return <span className="text-sm text-white font-medium">{value}</span>;
};

export const SectionTitle = ({ children }) => (
  <h2
    className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-6 sm:mb-8"
    style={{ color: "#EBF2FA" }}
  >
    {children}
  </h2>
);

const cardClasses =
  "rounded-2xl border border-[#4d5067] bg-[#191b33] p-5 sm:p-6";

// Conteneur de tableau : bords arrondis, bordure, aucune marge interne
// pour que les bordures des cellules aillent jusqu'au bord.
const tableWrapperClasses =
  "rounded-2xl border border-[#4d5067] overflow-hidden";

export const PriceCard = ({ title, description, price, color = "green" }) => (
  <div className={cardClasses}>
    <h3 className="text-lg sm:text-xl font-semibold text-[#EBF2FA] mb-2">
      {title}
    </h3>
    <p className="text-sm text-white/60 mb-4 leading-relaxed min-h-[2.5rem]">
      {description}
    </p>
    <p
      className="text-2xl sm:text-3xl font-bold leading-snug"
      style={{ color: PRICE_COLORS[color] }}
    >
      {price}
    </p>
  </div>
);

export const ComparisonTable = ({
  data,
  firstColLabel = "Services inclus",
}) => (
  <div className={`${tableWrapperClasses} mt-6`}>
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left min-w-[560px]">
        <thead>
          <tr className="bg-[#4d5067]">
            <th className="py-3 pl-5 pr-4 text-sm font-semibold text-[#EBF2FA]">
              {firstColLabel}
            </th>
            {data.columns.map((col) => (
              <th
                key={col}
                className="py-3 px-2 text-sm font-semibold text-[#EBF2FA] text-center whitespace-nowrap"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row) => (
            <tr
              key={row.label}
              className="bg-[#191b33] border-b border-[#4d5067] last:border-0"
            >
              <td className="py-3 pl-5 pr-4 text-sm text-white/80">
                {row.label}
              </td>
              {row.values.map((value, i) => (
                <td key={i} className="py-3 px-2 text-center">
                  <Cell value={value} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export const MaintenanceCard = ({ title, price, period, features }) => (
  <div className={cardClasses}>
    <h3 className="text-lg sm:text-xl font-semibold text-[#EBF2FA] mb-3">
      {title}
    </h3>
    <p className="mb-5">
      <span
        className="text-2xl sm:text-3xl font-bold"
        style={{ color: PRICE_COLORS.green }}
      >
        {price}
      </span>
      <span className="text-sm text-white/60">{period}</span>
    </p>
    <ul className="space-y-2">
      {features.map((feature) => (
        <li
          key={feature}
          className="flex items-start gap-2 text-sm text-white/80"
        >
          <CheckIcon width="18" height="18" className="mt-0.5 shrink-0" />
          <span>{feature}</span>
        </li>
      ))}
    </ul>
  </div>
);

export const ServicesTable = ({ rows }) => (
  <div className={tableWrapperClasses}>
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left min-w-[560px]">
        <thead>
          <tr className="bg-[#4d5067]">
            <th className="py-3 pl-5 pr-4 text-sm font-semibold text-[#EBF2FA]">
              Service
            </th>
            <th className="py-3 px-4 text-sm font-semibold text-[#EBF2FA]">
              Description
            </th>
            <th className="py-3 px-4 text-sm font-semibold text-[#EBF2FA] text-center whitespace-nowrap">
              Prix
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.service}
              className="bg-[#191b33] border-b border-[#4d5067] last:border-0"
            >
              <td className="py-3 pl-5 pr-4 text-sm text-white/90 font-medium">
                {row.service}
              </td>
              <td className="py-3 px-4 text-sm text-white/60">
                {row.description}
              </td>
              <td className="py-3 px-4 text-sm font-semibold text-center whitespace-nowrap text-[#4ADE80]">
                {row.price}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export const Legend = () => (
  <div className={cardClasses}>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-white/80">
      <div className="flex items-center gap-3">
        <CheckIcon width="20" height="20" />
        <span>
          <strong className="text-[#EBF2FA] font-semibold">Inclus</strong> -
          Service inclus dans le forfait
        </span>
      </div>
      <div className="flex items-center gap-3">
        <CrossIcon width="20" height="20" />
        <span>
          <strong className="text-[#EBF2FA] font-semibold">Non inclus</strong> -
          Service non disponible
        </span>
      </div>
      <div className="flex items-center gap-3">
        <WarningIcon width="20" height="20" />
        <span>
          <strong className="text-[#EBF2FA] font-semibold">
            Basique/Optionnel
          </strong>{" "}
          - Version basique ou en option
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-[#8EC5FF] font-semibold whitespace-nowrap">
          +XX€
        </span>
        <span>
          <strong className="text-[#EBF2FA] font-semibold">Supplément</strong> -
          Coût additionnel
        </span>
      </div>
    </div>
  </div>
);

export const NoteBox = ({ children }) => (
  <div
    className="flex items-center gap-4 p-5 sm:p-6 text-sm text-white/80 leading-relaxed"
    style={{
      borderRadius: "16px",
      border: "1px solid rgba(81, 162, 255, 0.30)",
      background: "rgba(43, 127, 255, 0.20)",
    }}
  >
    <span className="text-2xl shrink-0 leading-none" aria-hidden="true">
      💡
    </span>
    <div>{children}</div>
  </div>
);
