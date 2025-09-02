"use client";

import { useAppSelector } from "@/redux/hooks";
import { useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDragScroll } from "@/hooks/useDragScroll";
import { selectShortsTopTags } from "@/redux/selectors/shorts.selector";

const ALL_LABEL = "Всі відео";

export default function FilterShortsSection() {
  const tags = useAppSelector(selectShortsTopTags);
  const router = useRouter();
  const searchParams = useSearchParams();
  const scrollBind = useDragScroll();

  const activeFilter = searchParams.get("filter") || "";

  const btnClasses = useCallback(
    (isSelected: boolean) =>
      `px-3 py-1.5 text-center transition-colors whitespace-nowrap font-inter text-sm font-medium tracking-thinest leading-5 select-none rounded-lg cursor-pointer ${
        isSelected
          ? "bg-[#0F0F0F] text-white"
          : "bg-[#00000010] text-[#0f0f0f] hover:bg-[#00000020]"
      }`,
    []
  );

  const items = useMemo(() => {
    const base = [ALL_LABEL];

    return [...base, ...(tags?.map((f) => f.tag) ?? [])];
  }, [tags]);

  const handleSelect = (label: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (label === ALL_LABEL) {
      params.delete("filter");
      params.delete("search");
    } else {
      params.set("filter", label);
      params.delete("search");
    }
    router.push(`/shorts${params.toString() ? `?${params.toString()}` : ""}`, {
      scroll: false,
    });
  };

  if (!tags || tags.length === 0) return null;

  return (
    <section className="relative flex flex-col">
      <div
        {...scrollBind}
        className="flex gap-3 overflow-x-auto no-scrollbar cursor-grab py-4"
      >
        {items.map((label: string) => {
          const isSelected =
            (label === ALL_LABEL && !activeFilter) ||
            (label !== ALL_LABEL && activeFilter === label);

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
