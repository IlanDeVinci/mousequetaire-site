"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

const GSAPContext = createContext();

export function GSAPProvider({ children }) {
  const [contextReady, setContextReady] = useState(false);

  useEffect(() => {
    try {
      // Register GSAP plugins
      gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

      // Configure defaults
      gsap.config({
        nullTargetWarn: false,
      });

      // Set context as ready immediately
      setContextReady(true);
    } catch (error) {
      console.warn("GSAP initialization failed:", error);
      // Still set as ready to prevent infinite loading
      setContextReady(true);
    }

    // Clean up ScrollTrigger on unmount
    return () => {
      try {
        ScrollTrigger.getAll().forEach((t) => t.kill());
        ScrollTrigger.clearMatchMedia();
      } catch (error) {
        console.warn("GSAP cleanup failed:", error);
      }
    };
  }, []);

  return (
    <GSAPContext.Provider value={{ contextReady, gsap, ScrollTrigger }}>
      {children}
    </GSAPContext.Provider>
  );
}

export const useGSAP = () => {
  const context = useContext(GSAPContext);

  // Provide default values if context is not available
  if (!context) {
    return {
      contextReady: false,
      gsap: null,
      ScrollTrigger: null,
    };
  }

  return context;
};
