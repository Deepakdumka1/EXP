"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const prevPathRef = useRef(pathname);

  useEffect(() => {
    if (prevPathRef.current !== pathname) {
      setIsTransitioning(true);
      prevPathRef.current = pathname;
      const timer = setTimeout(() => setIsTransitioning(false), 10);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  return (
    <div
      className={isTransitioning ? "opacity-0" : "opacity-100 transition-opacity duration-200 ease-out"}
    >
      {children}
    </div>
  );
}
