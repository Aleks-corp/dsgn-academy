"use client";

import { ChevronUp, ChevronDown, X } from "lucide-react";

export default function ViewNavButtons({
  onPrev,
  onNext,
  onClose,
}: {
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
}) {
  return (
    <>
      <button
        aria-label="Close"
        onClick={onClose}
        className="hidden md:flex absolute top-2 right-2 z-20 rounded-full shadow p-2 bg-muted-background hover:bg-white text-muted hover:text-black cursor-pointer transition-all duration-300"
      >
        <X className="w-5 h-5 " />
      </button>
      <div className="hidden md:flex flex-col gap-3 absolute right-4 top-1/2 -translate-y-1/2 z-20">
        <button
          aria-label="Попереднє відео"
          onClick={onPrev}
          className="rounded-full bg-muted-background hover:bg-white text-muted hover:text-black  shadow p-2 cursor-pointer transition-all duration-300"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
        <button
          aria-label="Наступне відео"
          onClick={onNext}
          className="rounded-full bg-muted-background hover:bg-white text-muted hover:text-black  shadow p-2 cursor-pointer transition-all duration-300"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>
    </>
  );
}
