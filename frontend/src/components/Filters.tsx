"use client";

import { useAppSelector } from "@/redux/hooks";

import { selectVideoFilters } from "@/selectors/videos.selectors";
import { useMemo, useCallback } from "react";

const ALL_LABEL = "Всі відео";

export default function FilterRecommended({
  active,
  setActive,
}: {
  active: string;
  setActive: React.Dispatch<string>;
}) {
  const filters = useAppSelector(selectVideoFilters);

  const btnClasses = useCallback(
    (isSelected: boolean) =>
      `px-3 py-1.5 text-center transition-colors whitespace-nowrap font-inter text-sm font-medium tracking-thinest leading-5 rounded-lg cursor-pointer select-none ${
        isSelected
          ? "bg-[#0F0F0F] text-white"
          : "bg-[#00000010] text-[#0f0f0f] hover:bg-[#00000020]"
      }`,
    []
  );

  const items = useMemo(
    () => [ALL_LABEL, ...(filters?.map((f) => f.filter) ?? [])],
    [filters]
  );

  const handleSelect = (label: string) => {
    setActive(label);
    if (label === ALL_LABEL) {
      setActive("");
      return;
    }
    setActive(label);
  };

  if (!filters || filters.length === 0) return null;

  return (
    <section className="flex flex-col">
      <div className="relative flex gap-3 overflow-x-auto no-scrollbar">
        {items.map((label) => {
          const isSelected =
            (label === ALL_LABEL && !active) ||
            (label !== ALL_LABEL && active === label);

          return (
            <button
              key={label}
              type="button"
              onClick={() => handleSelect(label)}
              className={btnClasses(isSelected)}
              aria-pressed={isSelected}
            >
              {label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
