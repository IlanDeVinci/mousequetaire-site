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
      className={`relative z-20 flex h-full items-center gap-10 px-12 sm:px-20 md:px-28 lg:px-32 sm:gap-16 transition-[text-shadow] duration-700 ${
        glow ? "group-hover:[text-shadow:0_0_22px_rgba(125,212,255,0.85)]" : ""
      }`}
    >
      <span className={`w-10 shrink-0 text-[clamp(20px,3vw,36px)] font-bold sm:w-14 md:w-16 ${txt}`}>
        {number}
      </span>
      <div className="min-w-0 flex-1">
        <h3 className={`text-[clamp(20px,3.2vw,36px)] font-bold leading-tight ${txt}`}>
          {title}
        </h3>
        <p className={`mt-1 text-[clamp(14px,2.2vw,28px)] leading-snug ${sub}`}>
          {subtitle}
        </p>
      </div>
      <span className={`shrink-0 whitespace-nowrap text-right text-[clamp(18px,3vw,36px)] font-bold ${txt}`}>
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
    let raf;
    const tick = (t) => {
      const s = stateRef.current;
      if (!s.last) s.last = t;
      const dt = Math.min((t - s.last) / 1000, 0.05);
      s.last = t;
      if (hoveredRef.current) {
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
    <div className="flex flex-col gap-8 sm:gap-10">
      {/* Card 1 — full-width glow line + #146683 header/footer */}
      <div
        className="group relative h-[333px] w-full overflow-hidden rounded-full"
        style={{ backgroundColor: "#003E5C" }}
      >
        {/* center glow — soft & wide band across the full width */}
        <div
          className="absolute inset-0 z-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
          style={{
            background:
              "linear-gradient(to bottom, rgba(125,212,255,0) 8%, rgba(125,212,255,0.12) 30%, rgba(125,212,255,0.4) 50%, rgba(125,212,255,0.12) 70%, rgba(125,212,255,0) 92%)",
            filter: "blur(14px)",
          }}
        />
        {/* header — off-screen by default, slides down on hover (no fade) */}
        <div
          className="absolute inset-x-0 top-0 z-10 -translate-y-full transition-transform duration-500 group-hover:translate-y-0"
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
          className="absolute inset-x-0 bottom-0 z-10 translate-y-full transition-transform duration-500 group-hover:translate-y-0"
          style={{ backgroundColor: "#146683" }}
        >
          <div className="mx-auto flex max-w-[52%] items-center justify-center gap-4 py-4">
            <span className={`${pill} w-12`} />
            <span className={`${pill} w-10`} />
            <span className={`${pill} w-8`} />
          </div>
        </div>
        <CardContent {...cards[0]} glow />
      </div>

      {/* Card 2 — dense circular starfield, velocity-based rotation */}
      <div
        className="tarif-card2 group relative h-[333px] w-full overflow-hidden rounded-full"
        style={{ backgroundColor: "#001722" }}
        onMouseEnter={() => (hoveredRef.current = true)}
        onMouseLeave={() => (hoveredRef.current = false)}
      >
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[100vw] w-[100vw] -translate-x-1/2 -translate-y-1/2">
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
        <CardContent {...cards[1]} />
      </div>

      {/* Card 3 — gradient slides L→R + provided icons rushing/converging */}
      <div className="tarif-card3 group relative h-[333px] w-full overflow-hidden rounded-full">
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
        <CardContent {...cards[2]} />
      </div>

      {/* Card 4 — fades to black, squares wrap the 4, glow square at right edge */}
      <div
        className="group relative h-[333px] w-full overflow-hidden rounded-full"
        style={{ backgroundColor: "#002132" }}
      >
        <div className="absolute inset-0 z-0 bg-black opacity-0 transition-opacity duration-700 group-hover:opacity-80" />
        {/* concentric circles (grow) + 4 lines (extend horizontally), centered on the right edge */}
        <div
          className="pointer-events-none absolute right-0 top-1/2 z-0 h-[700px] w-[700px] -translate-y-1/2 translate-x-1/2 scale-[0.18] opacity-0 transition-all duration-700 group-hover:scale-100 group-hover:opacity-100"
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

        {/* content (card 4 has squares anchored to the number) */}
        <div className="relative z-20 flex h-full items-center gap-10 px-12 sm:px-20 md:px-28 lg:px-32 sm:gap-16">
          <span className="relative grid w-10 shrink-0 place-items-center text-[clamp(20px,3vw,36px)] font-bold text-white sm:w-14 md:w-16">
            <span className="pointer-events-none absolute left-1/2 top-1/2 block h-0 w-0">
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
            4
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="text-[clamp(20px,3.2vw,36px)] font-bold leading-tight text-white">
              {cards[3].title}
            </h3>
            <p className="mt-1 text-[clamp(14px,2.2vw,28px)] leading-snug text-white/90">
              {cards[3].subtitle}
            </p>
          </div>
          <span className="shrink-0 whitespace-nowrap text-right text-[clamp(18px,3vw,36px)] font-bold text-white">
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
    title: "Référencement SEO",
    subtitle: "Optimisation et suivi de positionnement",
    price: "à définir",
    style: { backgroundImage: "linear-gradient(to right, #70C7F2, #022435)" },
    dark: false,
  },
  {
    number: "07",
    title: "Hébergement",
    subtitle: "Serveurs dédiés et nom de domaine inclus",
    price: "à définir",
    style: { backgroundColor: "#7DD4FF" },
    dark: true,
  },
  {
    number: "08",
    title: "Formation",
    subtitle: "Prise en main et accompagnement personnalisé",
    price: "à définir",
    style: { backgroundColor: "#EBF2FA" },
    dark: true,
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
      className="card5-diamond absolute z-10 h-[38px] w-[38px] sm:h-[52px] sm:w-[52px] md:h-[67px] md:w-[67px]"
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

      <Sparkle className="card5-sparkle card5-sparkle-left absolute z-10 h-[102px] w-[102px] sm:h-[132px] sm:w-[132px] md:h-[164px] md:w-[164px]" />
      <Sparkle className="card5-sparkle card5-sparkle-right absolute z-10 h-[92px] w-[92px] sm:h-[122px] sm:w-[122px] md:h-[150px] md:w-[150px]" />
      <DiamondMark />

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

function CompactCardContent({ number, title, subtitle, price, dark }) {
  const mainColor = dark ? "text-[#002132]" : "text-white";
  const subtitleColor = dark ? "text-[#002132]/75" : "text-white/90";

  return (
    <div
      className={`tarif-compact-content relative z-20 grid h-full grid-cols-[auto_minmax(0,1fr)_auto] items-center ${mainColor}`}
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

export function AnimatedTarifCards2() {
  return (
    <div className="flex flex-col gap-8 sm:gap-10">
      <LogoIdentityCard />
      {cards2.slice(1).map((c) => (
        <div
          key={c.number}
          className="tarif-compact-card group relative h-[333px] w-full overflow-hidden rounded-full transition-transform duration-500 hover:scale-[1.01]"
          style={c.style}
        >
          <CompactCardContent
            number={c.number}
            title={c.title}
            subtitle={c.subtitle}
            price={c.price}
            dark={c.dark}
          />
        </div>
      ))}
    </div>
  );
}
