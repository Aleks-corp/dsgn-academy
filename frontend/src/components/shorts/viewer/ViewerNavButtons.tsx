"use client";

import { ChevronUp, ChevronDown } from "lucide-react";

export default function NavButtons({
  onPrev,
  onNext,
}: {
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="hidden md:flex flex-col gap-3 absolute right-4 top-1/2 -translate-y-1/2 z-20">
      <button
        aria-label="Попереднє відео"
        onClick={onPrev}
        className="rounded-full bg-white/90 hover:bg-white shadow p-2"
      >
        <ChevronUp className="w-5 h-5" />
      </button>
      <button
        aria-label="Наступне відео"
        onClick={onNext}
        className="rounded-full bg-white/90 hover:bg-white shadow p-2"
      >
        <ChevronDown className="w-5 h-5" />
      </button>
    </div>
  );
}
