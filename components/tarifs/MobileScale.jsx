"use client";

import { useEffect, useRef } from "react";

// On mobile the cards keep a readable, real-size content layer, while the
// decorative art layer is rendered at its desktop reference size (REF_WIDTH x
// 333) and scaled down via --tarif-scale so it looks identical to desktop, just
// smaller. Hover-driven animations are replayed on scroll-into-view since touch
// devices have no hover.
const MOBILE_MAX = 767;
const REF_WIDTH = 704;

export default function MobileScale({ children }) {
  const ref = useRef(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const cards = Array.from(root.querySelectorAll(".tarif-compact-card"));

    const setScale = () => {
      root.style.setProperty(
        "--tarif-scale",
        (root.clientWidth / REF_WIDTH).toFixed(4)
      );
    };
    setScale();
    const ro = new ResizeObserver(setScale);
    ro.observe(root);

    let io = null;
    const setupIO = () => {
      if (io) {
        io.disconnect();
        io = null;
      }
      cards.forEach((c) => c.classList.remove("in-view"));
      if (window.innerWidth <= MOBILE_MAX) {
        io = new IntersectionObserver(
          (entries) => {
            entries.forEach((e) =>
              e.target.classList.toggle("in-view", e.isIntersecting)
            );
          },
          // Only the central band of the viewport counts as "in view", so the
          // animations wait until the card is almost vertically centered.
          { threshold: 0, rootMargin: "-40% 0px -40% 0px" }
        );
        cards.forEach((c) => io.observe(c));
      }
    };
    setupIO();
    window.addEventListener("resize", setupIO);

    return () => {
      ro.disconnect();
      if (io) io.disconnect();
      window.removeEventListener("resize", setupIO);
    };
  }, []);

  return <div ref={ref}>{children}</div>;
}
