"use client";
import Lenis from "lenis";
import { useEffect, useRef } from "react";

export default function LenisProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const wrapperEl = scrollContainerRef.current;
    if (!wrapperEl) return;
    const lenis = new Lenis({
      wrapper: wrapperEl,
      smoothWheel: true,
      duration: 1.3,
    });
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);
  return (
    <div
      className="w-full h-full overflow-y-auto scroll-container"
      ref={scrollContainerRef}
    >
      {children}
    </div>
  );
}
