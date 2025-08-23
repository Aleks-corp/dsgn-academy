"use client";

import { useRef } from "react";

export default function ScrollRow({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  const onDrag = (e: React.MouseEvent) => {
    if (!ref.current) return;
    if (e.buttons !== 1) return; // тільки коли зажата ліва кнопка миші
    ref.current.scrollLeft -= e.movementX;
  };

  return (
    <div
      ref={ref}
      onMouseMove={onDrag}
      className="flex gap-3 overflow-x-auto no-scrollbar cursor-grab active:cursor-grabbing"
    >
      {children}
    </div>
  );
}
