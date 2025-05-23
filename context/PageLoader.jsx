"use client";

import React, { useState, useEffect, createContext, useContext } from "react";

// Create loading context
const LoadingContext = createContext();

export function LoadingProvider({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingComplete, setIsLoadingComplete] = useState(false);

  const completeLoading = () => {
    setIsLoading(false);
    // Small delay to ensure fade-out completes before marking as complete
    setTimeout(() => setIsLoadingComplete(true), 500);
  };

  return (
    <LoadingContext.Provider
      value={{ isLoading, isLoadingComplete, completeLoading }}
    >
      {children}
    </LoadingContext.Provider>
  );
}

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    return {
      isLoading: false,
      isLoadingComplete: true,
      completeLoading: () => {},
    };
  }
  return context;
};

export default function PageLoader() {
  const [isVisible, setIsVisible] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);
  const { completeLoading } = useLoading();

  useEffect(() => {
    // Show loader for 800ms
    const timer = setTimeout(() => {
      // Start fade-out
      setIsVisible(false);

      // Complete loading process
      completeLoading();

      // Remove from DOM after fade-out completes
      setTimeout(() => {
        setShouldRender(false);
      }, 500); // Match transition duration
    }, 500);

    return () => clearTimeout(timer);
  }, [completeLoading]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#050610] transition-opacity duration-500 ease-out ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="relative">
        <div className="h-24 w-24 rounded-full border-t-4 border-b-4 border-[#87D7FF] animate-spin"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-light text-sm">
          <span className="font-montserrat">&lt;/&gt;</span>
        </div>
      </div>
    </div>
  );
}
