"use client";

import { useEffect, useRef } from "react";

const cards = [
  {
    number: "01",
    title: "Landing page",
    subtitle: "Une page percutante pour un produit ou un événement",
    price: "150 – 300 €",
  },
  {
    number: "02",
    title: "Site vitrine",
    subtitle: "3 à 5 pages, formation incluse, analytics offerts",
    price: "150 – 300 €",
  },
  {
    number: "03",
    title: "E-commerce",
    subtitle: "Boutique avec paiement en ligne, stocks et comptes clients",
    price: "150 – 300 €",
  },
  {
    number: "04",
    title: "Application web sur mesure",
    subtitle: "Outil interne, gestion clients, automatisation — étudié au cas par cas",
    price: "dès 1 000 €",
  },
];

// Dense circular starfield for card 2 (deterministic -> no hydration mismatch).
const stars = [];
for (let r = 0; r < 12; r++) {
  for (let c = 0; c < 18; c++) {
    stars.push({
      left: `${((c + 0.5) * 100) / 18}%`,
      top: `${((r + 0.5) * 100) / 12}%`,
      size: 4 + ((r * 5 + c * 3) % 3) * 3,
    });
  }
}

// Outlined squares: same size, appear together (spread wider), converge on the "4".
const SQUARE_SIZE = 92;
const card4Squares = [
  { sx: -58, sy: -46 },
  { sx: 56, sy: -38 },
  { sx: 50, sy: 48 },
  { sx: -54, sy: 44 },
  { sx: 10, sy: -66 },
];

// Card 4 rings + 4 lines, all centered on the container's right extremity.
// Square viewBox so circles aren't distorted; center = (RING_C, RING_C).
const RING_VB = 700;
const RING_C = RING_VB / 2;
const RING_HUGE = 330; // new very large circle
const RING_MED = 120; // shrunk
const RING_SMALL = 92; // shrunk
const LINE_INNER_R = RING_SMALL - 1.5; // inside the small circle stroke
const card4Lines = [-52, -18, 18, 52].map((dy) => {
  const half = Math.sqrt(LINE_INNER_R * LINE_INNER_R - dy * dy);
  return { dy, x1: RING_C - half, x2: RING_C + half, y: RING_C + dy };
});

// Stroke props shared by all e-commerce icons (from the provided SVG).
const sp = {
  strokeWidth: 10,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

// Icons extracted verbatim from the provided SVG, cropped via their viewBox.
const ICONS = {
  refresh: {
    vb: "3680 40 116 114",
    ratio: 116 / 114,
    paths: (
      <>
        <path d="M3737 67.5V97H3766.5" stroke="#85EBF3" {...sp} />
        <path
          d="M3785.62 89.6247C3782.06 65.9693 3761.65 47.833 3737 47.833C3709.85 47.833 3687.83 69.8457 3687.83 96.9997C3687.83 124.153 3709.85 146.166 3737 146.166C3757.16 146.166 3774.49 134.031 3782.08 116.666"
          stroke="#85EBF3"
          {...sp}
        />
        <path
          d="M3761.58 116.667H3783.22C3784.85 116.667 3786.17 117.988 3786.17 119.617V141.25"
          stroke="#85EBF3"
          {...sp}
        />
      </>
    ),
  },
  bars: {
    vb: "4295 160 106 106",
    ratio: 1,
    paths: (
      <>
        <path d="M4320.2 260.959L4300.94 185.204L4306.35 183.828" stroke="#85EBF3" {...sp} />
        <path d="M4358.08 251.325L4338.81 175.57L4344.23 174.194" stroke="#85EBF3" {...sp} />
        <path d="M4322.58 179.699L4341.85 255.454" stroke="#85EBF3" {...sp} />
        <path d="M4360.46 170.065L4379.73 245.82" stroke="#85EBF3" {...sp} />
        <path d="M4376.69 165.937L4395.96 241.691" stroke="#85EBF3" {...sp} />
        <path d="M4306.35 183.828L4325.62 259.583L4320.2 260.959" stroke="#85EBF3" {...sp} />
        <path d="M4344.23 174.194L4363.49 249.949L4358.08 251.325" stroke="#85EBF3" {...sp} />
      </>
    ),
  },
  gift: {
    vb: "5048 25 142 148",
    ratio: 142 / 148,
    paths: (
      <>
        <path
          d="M5184.2 94.2015L5171.03 157.73C5169.26 166.282 5160.28 171.241 5152.1 168.189L5063.06 134.973C5054.88 131.92 5051.34 122.292 5055.6 114.668L5087.26 58.0363C5090.69 51.897 5098.09 49.1798 5104.68 51.6381L5175.23 77.9576C5181.82 80.4159 5185.63 87.3145 5184.2 94.2015Z"
          stroke="#85EBF3"
          {...sp}
        />
        <path
          d="M5160.78 49.7513C5163.53 42.3776 5159.78 34.1702 5152.41 31.4193C5145.03 28.6684 5136.82 32.416 5134.07 39.7897"
          stroke="#85EBF3"
          {...sp}
        />
      </>
    ),
  },
  arrows: {
    vb: "5365 145 110 105",
    ratio: 110 / 105,
    paths: (
      <>
        <path d="M5399.98 242.047L5467.78 205.437" stroke="#85EBF3" {...sp} />
        <path d="M5405.18 224.646L5378.74 175.677M5401.94 182.609L5378.74 175.677L5371.8 198.88" stroke="#85EBF3" {...sp} />
        <path d="M5450.38 200.24L5423.94 151.271M5447.14 158.203L5423.94 151.271L5417.01 174.474" stroke="#85EBF3" {...sp} />
      </>
    ),
  },
  cart: {
    vb: "6150 47 200 202",
    ratio: 200 / 202,
    paths: (
      <>
        <path d="M6322.88 243.833C6330.81 243.833 6337.25 237.397 6337.25 229.458C6337.25 221.519 6330.81 215.083 6322.88 215.083C6314.94 215.083 6308.5 221.519 6308.5 229.458C6308.5 237.397 6314.94 243.833 6322.88 243.833Z" stroke="#70C7F2" {...sp} />
        <path d="M6227.04 243.833C6234.98 243.833 6241.42 237.397 6241.42 229.458C6241.42 221.519 6234.98 215.083 6227.04 215.083C6219.1 215.083 6212.67 221.519 6212.67 229.458C6212.67 237.397 6219.1 243.833 6227.04 243.833Z" stroke="#70C7F2" {...sp} />
        <path d="M6294.12 71.333H6346.83L6327.67 176.75H6284.54M6294.12 71.333L6284.54 176.75M6294.12 71.333H6239.02M6284.54 176.75H6246.21M6239.02 71.333H6183.92L6203.08 176.75H6246.21M6239.02 71.333L6246.21 176.75" stroke="#70C7F2" {...sp} />
        <path d="M6183.92 71.3337C6182.32 64.9447 6174.33 52.167 6155.17 52.167" stroke="#70C7F2" {...sp} />
        <path d="M6327.67 176.75H6203.08H6186.13C6169.03 176.75 6159.96 184.237 6159.96 195.917C6159.96 207.597 6169.03 215.083 6186.13 215.083H6322.88" stroke="#70C7F2" {...sp} />
      </>
    ),
  },
};

// One of each: slide in from outside the window, in order, resting at alternating
// heights. Plays once (CSS transition) and reverses when the mouse leaves.
// Order: cart -> arrows -> gift (panier) -> bars -> refresh.
// Final position is off-screen on the right: they slide fully across and exit.
const rushIcons = [
  { k: "cart", h: 128, final: "130%", top: "24%" },
  { k: "arrows", h: 104, final: "124%", top: "70%" },
  { k: "gift", h: 120, final: "118%", top: "22%" },
  { k: "bars", h: 108, final: "112%", top: "72%" },
  { k: "refresh", h: 104, final: "106%", top: "36%" },
].map((ic, i) => ({ ...ic, delay: i * 0.18 }));

function RushIcon({ k, h, final, top, delay }) {
  const ic = ICONS[k];
  return (
    <svg
      viewBox={ic.vb}
      fill="none"
      className="card3-icon absolute"
      style={{
        height: h,
        width: h * ic.ratio,
        top,
        "--final": final,
        transitionDelay: `${delay}s`,
      }}
    >
      {ic.paths}
    </svg>
  );
}

function CardContent({ number, title, subtitle, price, glow, dark }) {
  const txt = dark ? "text-[#002132]" : "text-white";
  const sub = dark ? "text-[#002132]/75" : "text-white/90";
  return (
    <div
      className={`tarif-compact-content relative z-20 grid h-full grid-cols-[auto_minmax(0,1fr)_auto] items-center transition-[text-shadow] duration-700 ${
        glow ? "group-hover:[text-shadow:0_0_22px_rgba(125,212,255,0.85)]" : ""
      }`}
    >
      <span className={`tarif-compact-main shrink-0 font-bold ${txt}`}>
        {number}
      </span>
      <div className="min-w-0">
        <h3 className={`tarif-compact-main font-bold leading-tight ${txt}`}>
          {title}
        </h3>
        <p className={`tarif-compact-subtitle mt-1 leading-snug ${sub}`}>
          {subtitle}
        </p>
      </div>
      <span className={`tarif-compact-main shrink-0 whitespace-nowrap text-right font-bold ${txt}`}>
        {price}
      </span>
    </div>
  );
}

export default function AnimatedTarifCards() {
  const pill = "h-3 rounded-full bg-white";

  // Velocity-based starfield rotation for card 2.
  const starsRef = useRef(null);
  const hoveredRef = useRef(false);
  const stateRef = useRef({ angle: 0, vel: 0, last: 0 });

  useEffect(() => {
    const MAX_VEL = 70; // deg/s
    const ACCEL = 90; // deg/s^2 while hovered
    const DECEL = 45; // deg/s^2 while leaving
    const card = starsRef.current?.closest(".tarif-card2");
    let raf;
    const tick = (t) => {
      const s = stateRef.current;
      if (!s.last) s.last = t;
      const dt = Math.min((t - s.last) / 1000, 0.05);
      s.last = t;
      // On desktop the field spins while hovered; on mobile (no hover) it spins
      // while the card is centered in view.
      const active =
        hoveredRef.current ||
        (window.innerWidth <= 767 && !!card?.classList.contains("in-view"));
      if (active) {
        s.vel = Math.min(MAX_VEL, s.vel + ACCEL * dt);
      } else {
        s.vel = Math.max(0, s.vel - DECEL * dt);
      }
      s.angle = (s.angle + s.vel * dt) % 360;
      if (starsRef.current) {
        starsRef.current.style.transform = `rotate(${s.angle}deg)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="flex flex-col gap-10">
      {/* Card 1 — full-width glow line + #146683 header/footer */}
      <div
        className="tarif-card1 tarif-compact-card group relative h-[333px] w-full overflow-hidden rounded-full"
        style={{ backgroundColor: "#003E5C" }}
      >
        <div className="tarif-art">
          {/* center glow — soft & wide band across the full width */}
          <div
            className="card1-glow absolute inset-0 z-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(125,212,255,0) 8%, rgba(125,212,255,0.12) 30%, rgba(125,212,255,0.4) 50%, rgba(125,212,255,0.12) 70%, rgba(125,212,255,0) 92%)",
              filter: "blur(14px)",
            }}
          />
          {/* header — off-screen by default, slides down on hover (no fade) */}
          <div
            className="card1-header absolute inset-x-0 top-0 z-10"
            style={{ backgroundColor: "#146683" }}
          >
            <div className="mx-auto flex max-w-[52%] items-center justify-between py-4">
              <div className="flex gap-3">
                <span className="h-3 w-3 rounded-full bg-white" />
                <span className="h-3 w-3 rounded-full bg-white" />
                <span className="h-3 w-3 rounded-full bg-white" />
              </div>
              <div className="flex gap-4">
                <span className={`${pill} w-10`} />
                <span className={`${pill} w-10`} />
                <span className={`${pill} w-12`} />
              </div>
            </div>
          </div>
          {/* footer — off-screen by default, slides into place on hover (no fade) */}
          <div
            className="card1-footer absolute inset-x-0 bottom-0 z-10"
            style={{ backgroundColor: "#146683" }}
          >
            <div className="mx-auto flex max-w-[52%] items-center justify-center gap-4 py-4">
              <span className={`${pill} w-12`} />
              <span className={`${pill} w-10`} />
              <span className={`${pill} w-8`} />
            </div>
          </div>
        </div>
        <CardContent {...cards[0]} glow />
      </div>

      {/* Card 2 — dense circular starfield, velocity-based rotation */}
      <div
        className="tarif-card2 tarif-compact-card group relative h-[333px] w-full overflow-hidden rounded-full"
        style={{ backgroundColor: "#001722" }}
        onMouseEnter={() => (hoveredRef.current = true)}
        onMouseLeave={() => (hoveredRef.current = false)}
      >
        <div className="tarif-art">
          <div className="card2-field pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div ref={starsRef} className="card2-stars relative h-full w-full">
              {stars.map((s, i) => (
                <span
                  key={i}
                  className="absolute h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{
                    left: s.left,
                    top: s.top,
                    backgroundColor: "rgba(255,255,255,0.23)",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
        <CardContent {...cards[1]} />
      </div>

      {/* Card 3 — gradient slides L→R + provided icons rushing/converging */}
      <div className="tarif-card3 tarif-compact-card group relative h-[333px] w-full overflow-hidden rounded-full">
        <div className="tarif-art">
          {/* light base */}
          <div className="absolute inset-0 z-0" style={{ backgroundColor: "#006698" }} />
          {/* dark veil: covers the left, widens to the right on hover */}
          <div
            className="card3-dark absolute left-0 top-0 bottom-0 z-0"
            style={{
              backgroundImage:
                "linear-gradient(to right, #03151E 0%, #03151E 18%, rgba(3,21,30,0) 100%)",
            }}
          />
          <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
            {rushIcons.map((ic, i) => (
              <RushIcon key={i} {...ic} />
            ))}
          </div>
        </div>
        <CardContent {...cards[2]} />
      </div>

      {/* Card 4 — fades to black, squares wrap the 4, glow square at right edge */}
      <div
        className="tarif-card4 tarif-compact-card group relative h-[333px] w-full overflow-hidden rounded-full"
        style={{ backgroundColor: "#002132" }}
      >
        <div className="tarif-art">
          <div className="card4-veil absolute inset-0 z-0 bg-black" />
          {/* concentric circles (grow) + 4 lines (extend horizontally), centered on the right edge */}
          <div
            className="card4-rings pointer-events-none absolute right-0 top-1/2 z-0 h-[700px] w-[700px]"
            style={{ filter: "drop-shadow(0 0 12px rgba(255,255,255,0.66))" }}
          >
            <svg className="h-full w-full" viewBox={`0 0 ${RING_VB} ${RING_VB}`} fill="none">
              <circle cx={RING_C} cy={RING_C} r={RING_HUGE} stroke="white" strokeWidth="3" />
              <circle cx={RING_C} cy={RING_C} r={RING_MED} stroke="white" strokeWidth="3" />
              <circle cx={RING_C} cy={RING_C} r={RING_SMALL} stroke="white" strokeWidth="3" />
              {card4Lines.map((l, i) => (
                <line
                  key={i}
                  className="card4-line"
                  x1={l.x1}
                  y1={l.y}
                  x2={l.x2}
                  y2={l.y}
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              ))}
            </svg>
          </div>
        </div>

        {/* content (card 4 has squares anchored to the number) */}
        <div className="tarif-compact-content relative z-20 grid h-full grid-cols-[auto_minmax(0,1fr)_auto] items-center">
          <span className="tarif-compact-main relative grid shrink-0 place-items-center font-bold text-white">
            <span className="card4-square-anchor pointer-events-none absolute left-1/2 top-1/2 block h-0 w-0">
              {card4Squares.map((s, i) => (
                <span
                  key={i}
                  className="card4-square absolute left-0 top-0 block rounded-[8px] border-[3px] border-white"
                  style={{
                    width: SQUARE_SIZE,
                    height: SQUARE_SIZE,
                    "--sx": `${s.sx}px`,
                    "--sy": `${s.sy}px`,
                  }}
                />
              ))}
            </span>
            {cards[3].number}
          </span>
          <div className="min-w-0">
            <h3 className="tarif-compact-main font-bold leading-tight text-white">
              {cards[3].title}
            </h3>
            <p className="tarif-compact-subtitle mt-1 leading-snug text-white/90">
              {cards[3].subtitle}
            </p>
          </div>
          <span className="tarif-compact-main shrink-0 whitespace-nowrap text-right font-bold text-white">
            {cards[3].price}
          </span>
        </div>
      </div>
    </div>
  );
}

// Second section cards (05–08). Content is placeholder — adjust as needed.
const cards2 = [
  {
    number: "05",
    title: "Logo & identité visuelle",
    subtitle: "Du logo simple à la charte complète avec déclinaisons",
    price: "50 – 400 €",
    style: { backgroundColor: "#10AEF4" },
    dark: false,
  },
  {
    number: "06",
    title: "Supports print",
    subtitle: "Flyers, affiches, cartes de visite, roll-ups, étiquettes",
    price: "30 – 110 €",
    style: { backgroundColor: "#063D55" },
    dark: false,
  },
  {
    number: "07",
    title: "Menus & cartes restaurant",
    subtitle: "Carte simple, multi-pages ou pack avec ardoise modifiable",
    price: "150 – 300 €",
    style: { backgroundColor: "#7DD4FF" },
    dark: true,
  },
  {
    number: "08",
    title: "Posts & templates réseaux sociaux",
    subtitle: "Pack Instagram cohérent ou modèles Canva à vos couleurs",
    price: "150 – 300 €",
    style: { backgroundColor: "#A7B5BB" },
    dark: false,
  },
];

function Sparkle({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 141 141"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M140.273 21.9296C101.536 48.5548 91.7188 101.538 118.342 140.273C91.7169 101.535 38.7357 91.719 0 118.343C38.7372 91.718 48.5526 38.7355 21.9285 0C48.5479 38.7408 101.536 48.5548 140.273 21.9296Z"
        fill="white"
      />
    </svg>
  );
}

function DiamondMark() {
  return (
    <svg
      className="card5-diamond absolute z-10 h-[67px] w-[67px]"
      viewBox="0 0 67 67"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M33.5 13.3029L53.6974 33.5L33.5 53.6971L13.3026 33.5L33.5 13.3029Z"
        fill="white"
      />
      <path
        d="M33.5006 0L67.0002 33.5L33.5006 67L0.000236511 33.5L33.5006 0ZM60.3144 33.5L33.5006 6.68653L6.68604 33.5L33.5006 60.3135L60.3144 33.5Z"
        fill="white"
      />
    </svg>
  );
}

function LogoIdentityCard() {
  const card = cards2[0];

  return (
    <div className="tarif-card5 tarif-compact-card group relative h-[333px] w-full overflow-hidden rounded-full bg-[#10AEF4]">
      <div className="tarif-art">
        <svg
          className="card5-wave card5-wave-back absolute left-0 z-0 h-[230px] w-full min-w-[900px]"
          viewBox="0 0 1470 230"
          preserveAspectRatio="none"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M1532 101.219C1453.82 25.6222 1425.51 56.7173 1334.84 86.2775C1244.18 115.838 1177.21 -2.94872 1031.99 43.11C886.764 89.1687 879.955 29.5027 712.645 72.2968C545.334 115.091 592.819 110.1 419.717 31.9121C246.615 -46.2758 276.374 46.9809 149.304 22.1629C22.2349 -2.65513 -64 4.21553 -64 126.758V290.148L1532 315.113C1532 315.113 1526.76 188.221 1532 101.219Z"
            fill="#41C0FF"
          />
        </svg>

        <svg
          className="card5-wave card5-wave-front absolute left-0 z-[1] h-[230px] w-full min-w-[900px]"
          viewBox="0 0 1470 230"
          preserveAspectRatio="none"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M1532 101.533C1453.82 25.9334 1351.83 -5.58297 1261.17 23.9868C1170.5 53.5565 1115.94 116.363 1031.99 43.4308C948.03 -29.5011 879.955 29.8235 712.645 72.6144C545.334 115.405 549.447 -33.1135 419.717 32.2329C289.986 97.5793 267.295 -54.8871 149.304 22.4837C31.3131 99.8546 -64 4.53637 -64 127.079V290.469L1532 315.43C1532 315.43 1526.76 188.532 1532 101.533Z"
            fill="#56C7FF"
          />
        </svg>

        <Sparkle className="card5-sparkle card5-sparkle-left absolute z-10 h-[164px] w-[164px]" />
        <Sparkle className="card5-sparkle card5-sparkle-right absolute z-10 h-[150px] w-[150px]" />
        <DiamondMark />
      </div>

      <div className="tarif-compact-content card5-content relative z-20 grid h-full grid-cols-[auto_minmax(0,1fr)_auto] items-center text-[#002132] transition-[color,text-shadow] duration-700">
        <span className="tarif-compact-main shrink-0 font-bold">
          {card.number}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="tarif-compact-main font-bold leading-tight">
            {card.title}
          </h3>
          <p className="tarif-compact-subtitle mt-1 leading-snug text-[#002132]/75 transition-colors duration-700 group-hover:text-white/90">
            {card.subtitle}
          </p>
        </div>
        <span className="tarif-compact-main shrink-0 whitespace-nowrap text-right font-bold">
          {card.price}
        </span>
      </div>
    </div>
  );
}

function PrintWideLight({ className, clipId }) {
  return (
    <svg
      className={className}
      viewBox="0 0 398 75"
      fill="none"
      aria-hidden="true"
    >
      <g clipPath={`url(#${clipId})`}>
        <rect width="398" height="126" rx="6" fill="#55A4C0" />
        <circle cx="155.5" cy="67.5" r="216.5" fill="#7DD4FF" />
        <circle cx="108" cy="68" r="154" fill="#A2E0FF" />
        <circle cx="63" cy="92" r="124" fill="#C3EBFF" />
        <rect x="17" y="16" width="255" height="32" rx="10" fill="white" />
        <rect x="17" y="56" width="170" height="12" rx="6" fill="white" />
        <rect x="339" y="16" width="42" height="32" rx="7" fill="white" />
      </g>
      <defs>
        <clipPath id={clipId}>
          <rect width="398" height="126" rx="6" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

function PrintWideDetails({ className, gradient = false }) {
  const gradientId = "card6-wide-gradient";

  return (
    <svg
      className={className}
      viewBox={`0 0 289 ${gradient ? 123 : 120}`}
      fill="none"
      aria-hidden="true"
    >
      {gradient && (
        <defs>
          <linearGradient
            id={gradientId}
            x1="144.5"
            y1="0"
            x2="220.5"
            y2="137"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#70C7F2" />
            <stop offset="1" stopColor="#002132" />
          </linearGradient>
        </defs>
      )}
      <rect
        width="289"
        height="167"
        rx="6"
        fill={gradient ? `url(#${gradientId})` : "#55A4C0"}
      />
      <rect x="17" y="16" width="255" height="32" rx="10" fill="white" />
      <rect x="17" y="56" width="170" height="12" rx="6" fill="white" />
      <rect x="137" y="76" width="50" height="12" rx="6" fill="white" />
      <rect x="77" y="76" width="50" height="12" rx="6" fill="white" />
      <rect x="17" y="76" width="12" height="12" rx="6" fill="white" />
      <rect x="36" y="76" width="12" height="12" rx="6" fill="white" />
      <rect x="55" y="76" width="12" height="12" rx="6" fill="white" />
      <rect x="137" y="96" width="50" height="12" rx="6" fill="white" />
    </svg>
  );
}

function PrintTall({ className, long = false }) {
  const gradientId = long ? "card6-tall-long" : "card6-tall-short";

  return (
    <svg
      className={className}
      viewBox={`0 0 171 ${long ? 196 : 155}`}
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id={gradientId}
          x1="162"
          y1="-14.5"
          x2="58.5"
          y2="205"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#70C7F2" />
          <stop offset="1" stopColor="#022435" />
        </linearGradient>
      </defs>
      <rect width="171" height="219" rx="6" fill={`url(#${gradientId})`} />
      <path
        d="M146.767 20.2949H27.4283C22.275 20.2949 18.0974 24.3354 18.0974 29.3195V75.2703C18.0974 80.2545 22.275 84.2949 27.4283 84.2949H146.767C151.92 84.2949 156.097 80.2545 156.097 75.2703V29.3195C156.097 24.3354 151.92 20.2949 146.767 20.2949Z"
        fill="white"
      />
      <rect x="18" y="95" width="138" height="22" rx="4" fill="white" />
      <path
        d="M72.0783 129H21.9217C19.7558 129 18 130.343 18 132V134C18 135.657 19.7558 137 21.9217 137H72.0783C74.2442 137 76 135.657 76 134V132C76 130.343 74.2442 129 72.0783 129Z"
        fill="white"
      />
      <path
        d="M72.0783 145H21.9217C19.7558 145 18 146.343 18 148V150C18 151.657 19.7558 153 21.9217 153H72.0783C74.2442 153 76 151.657 76 150V148C76 146.343 74.2442 145 72.0783 145Z"
        fill="white"
      />
      {long && (
        <path
          d="M72.0783 161H21.9217C19.7558 161 18 162.343 18 164V166C18 167.657 19.7558 169 21.9217 169H72.0783C74.2442 169 76 167.657 76 166V164C76 162.343 74.2442 161 72.0783 161Z"
          fill="white"
        />
      )}
    </svg>
  );
}

function CompactCardContent({
  number,
  title,
  subtitle,
  price,
  dark,
  className = "",
}) {
  const mainColor = dark ? "text-[#002132]" : "text-white";
  const subtitleColor = dark ? "text-[#002132]/75" : "text-white/90";

  return (
    <div
      className={`tarif-compact-content relative z-20 grid h-full grid-cols-[auto_minmax(0,1fr)_auto] items-center ${mainColor} ${className}`}
    >
      <span className="tarif-compact-main shrink-0 font-bold">{number}</span>
      <div className="min-w-0">
        <h3 className="tarif-compact-main font-bold leading-tight">{title}</h3>
        <p className={`tarif-compact-subtitle mt-1 leading-snug ${subtitleColor}`}>
          {subtitle}
        </p>
      </div>
      <span className="tarif-compact-main shrink-0 whitespace-nowrap text-right font-bold">
        {price}
      </span>
    </div>
  );
}

function PrintCard() {
  const card = cards2[1];

  return (
    <div className="tarif-card6 tarif-compact-card group relative h-[333px] w-full overflow-hidden rounded-full bg-[#063D55]">
      <div className="tarif-art">
        <div className="card6-stage pointer-events-none absolute inset-0 z-0">
          <PrintTall className="card6-art card6-art-1" />
          <PrintWideDetails className="card6-art card6-art-2" />
          <PrintWideLight
            className="card6-art card6-art-3"
            clipId="card6-wide-light-left"
          />
          <PrintTall className="card6-art card6-art-4" long />
          <PrintWideDetails className="card6-art card6-art-5" gradient />
          <PrintWideLight
            className="card6-art card6-art-6"
            clipId="card6-wide-light-right"
          />
        </div>
        <div className="card6-glow pointer-events-none absolute inset-0 z-10" />
      </div>
      <CompactCardContent
        number={card.number}
        title={card.title}
        subtitle={card.subtitle}
        price={card.price}
        className="card6-content"
      />
    </div>
  );
}

function RestaurantGlassware() {
  return (
    <svg
      className="card7-glassware pointer-events-none absolute z-10"
      viewBox="0 0 189 280"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M45.1584 229.731V260.793H60.9045C63.8472 260.793 66.6694 261.953 68.7502 264.018C70.831 266.083 72 268.884 72 271.805V280H0.00435883V271.805C0.00435882 270.359 0.291396 268.927 0.849085 267.59C1.40678 266.254 2.22416 265.04 3.25463 264.018C4.28509 262.995 5.50844 262.184 6.85477 261.631C8.2011 261.078 9.64406 260.793 11.1013 260.793H26.8416V229.731C11.9257 229.195 0 217.025 0 202.091V154H71.9956V202.091C72 217.025 60.0815 229.195 45.1584 229.731Z"
        fill="white"
      />
      <path
        d="M189 107.575V267.976C189 271.165 187.73 274.223 185.47 276.478C183.21 278.733 180.144 280 176.948 280H121.052C117.856 280 114.79 278.733 112.53 276.478C110.27 274.223 109 271.165 109 267.976V107.575C109 101.4 111.458 95.479 115.834 91.1131C120.21 86.7472 126.145 84.2944 132.334 84.2944H133.359V4.86102C133.359 3.57181 133.872 2.33537 134.786 1.42376C135.7 0.512153 136.939 0 138.231 0H159.769C160.409 0 161.042 0.125724 161.633 0.370011C162.225 0.614299 162.762 0.97238 163.214 1.42376C163.666 1.87515 164.025 2.41101 164.27 3.00077C164.515 3.59054 164.641 4.22267 164.641 4.86102V84.2944H165.666C171.855 84.2944 177.79 86.7472 182.166 91.1131C186.542 95.479 189 101.4 189 107.575Z"
        fill="white"
      />
    </svg>
  );
}

function RestaurantCard() {
  const card = cards2[2];

  return (
    <div className="tarif-card7 tarif-compact-card group relative h-[333px] w-full overflow-hidden rounded-full bg-[#7DD4FF]">
      <div className="tarif-art">
        <div className="card7-stripe card7-stripe-1" />
        <div className="card7-stripe card7-stripe-2" />
        <div className="card7-stripe card7-stripe-3" />
        <RestaurantGlassware />
      </div>
      <CompactCardContent
        number={card.number}
        title={card.title}
        subtitle={card.subtitle}
        price={card.price}
        dark
        className="card7-content"
      />
    </div>
  );
}

function SocialCardFront() {
  return (
    <svg
      className="card8-template card8-template-front"
      viewBox="0 0 436 333"
      fill="none"
      aria-hidden="true"
    >
      <g clipPath="url(#card8-front-clip)">
        <rect
          x="64.1384"
          y="47.5098"
          width="276"
          height="276"
          rx="26"
          transform="rotate(-6.97358 64.1384 47.5098)"
          fill="white"
        />
        <rect
          x="87.6541"
          y="66.7979"
          width="228"
          height="121"
          rx="16"
          transform="rotate(-6.97358 87.6541 66.7979)"
          fill="#183A46"
        />
        <rect
          x="104.409"
          y="203.776"
          width="108"
          height="32"
          rx="16"
          transform="rotate(-6.97358 104.409 203.776)"
          fill="#183A46"
        />
        <rect
          x="109.265"
          y="243.48"
          width="228"
          height="8"
          rx="4"
          transform="rotate(-6.97358 109.265 243.48)"
          fill="#183A46"
        />
        <rect
          x="111.087"
          y="258.369"
          width="228"
          height="8"
          rx="4"
          transform="rotate(-6.97358 111.087 258.369)"
          fill="#183A46"
        />
        <rect
          x="113.029"
          y="274.251"
          width="228"
          height="8"
          rx="4"
          transform="rotate(-6.97358 113.029 274.251)"
          fill="#183A46"
        />
      </g>
      <defs>
        <clipPath id="card8-front-clip">
          <rect
            x="64.1384"
            y="47.5098"
            width="276"
            height="276"
            rx="26"
            transform="rotate(-6.97358 64.1384 47.5098)"
          />
        </clipPath>
      </defs>
    </svg>
  );
}

function SocialCardBack() {
  return (
    <svg
      className="card8-template card8-template-back"
      viewBox="0 0 452 333"
      fill="none"
      aria-hidden="true"
    >
      <g clipPath="url(#card8-back-clip)">
        <rect
          x="118.866"
          y="12"
          width="276"
          height="276"
          rx="26"
          transform="rotate(11.82 118.866 12)"
          fill="white"
        />
        <rect
          x="134.149"
          y="37.9561"
          width="228"
          height="121"
          rx="16"
          transform="rotate(11.82 134.149 37.9561)"
          fill="#55A4C0"
        />
        <rect x="106.496" y="170.094" width="35" height="32" rx="16" transform="rotate(11.82 106.496 170.094)" fill="#55A4C0" />
        <rect x="162.287" y="181.77" width="35" height="32" rx="16" transform="rotate(11.82 162.287 181.77)" fill="#55A4C0" />
        <rect x="218.079" y="193.445" width="35" height="32" rx="16" transform="rotate(11.82 218.079 193.445)" fill="#55A4C0" />
        <rect x="90.1003" y="247.093" width="130" height="15" rx="7.5" transform="rotate(11.82 90.1003 247.093)" fill="#55A4C0" />
      </g>
      <defs>
        <clipPath id="card8-back-clip">
          <rect
            x="118.866"
            y="12"
            width="276"
            height="276"
            rx="26"
            transform="rotate(11.82 118.866 12)"
          />
        </clipPath>
      </defs>
    </svg>
  );
}

function SocialTemplatesCard() {
  const card = cards2[3];

  return (
    <div className="tarif-card8 tarif-compact-card group relative h-[333px] w-full overflow-hidden rounded-full bg-[#A7B5BB]">
      <div className="tarif-art">
        <div className="card8-scroll-window pointer-events-none absolute inset-y-0 z-0">
          <img
            className="card8-scroll"
            src="/images/social-scroll.svg"
            alt=""
            aria-hidden="true"
          />
        </div>
        <SocialCardBack />
        <SocialCardFront />
        <div className="card8-darkness pointer-events-none absolute inset-0 z-10" />
      </div>
      <CompactCardContent
        number={card.number}
        title={card.title}
        subtitle={card.subtitle}
        price={card.price}
        className="card8-content"
      />
    </div>
  );
}

export function AnimatedTarifCards2() {
  return (
    <div className="flex flex-col gap-10">
      <LogoIdentityCard />
      <PrintCard />
      <RestaurantCard />
      <SocialTemplatesCard />
    </div>
  );
}
