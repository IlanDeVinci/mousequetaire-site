"use client";

import React, { useState, useEffect } from "react";

export default function PageLoader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simple, reliable timeout - no dependencies
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800); // Show loader for 800ms

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050610] transition-opacity duration-300">
      <div className="relative">
        <div className="h-24 w-24 rounded-full border-t-4 border-b-4 border-[#87D7FF] animate-spin"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-light text-sm">
          <span className="font-montserrat">&lt;/&gt;</span>
        </div>
      </div>
    </div>
  );
}
