"use client";

import { useAppSelector } from "@/redux/hooks";
import { selectVideoFilters } from "@/selectors/videos.selectors";
import { useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDragScroll } from "@/hooks/useDragScroll";

const ALL_LABEL = "Всі відео";
const RECO_LABEL = "Рекомендовано";

export default function FilterSection() {
  const filters = useAppSelector(selectVideoFilters);
  const router = useRouter();
  const searchParams = useSearchParams();
  const scrollBind = useDragScroll();

  const activeFilter = searchParams.get("filter") || "";
  const isRecommended = searchParams.has("recommended");

  const btnClasses = useCallback(
    (isSelected: boolean) =>
      `px-3 py-1.5 text-center transition-colors whitespace-nowrap font-inter text-sm font-medium tracking-thinest leading-5 select-none rounded-lg cursor-pointer ${
        isSelected
          ? "bg-[#0F0F0F] text-white"
          : "bg-[#00000010] text-[#0f0f0f] hover:bg-[#00000020]"
      }`,
    []
  );

  const items = useMemo(
    () => [ALL_LABEL, RECO_LABEL, ...(filters?.map((f) => f.filter) ?? [])],
    [filters]
  );

  const handleSelect = (label: string) => {
    if (label === ALL_LABEL) {
      router.push("/videos"); // прибираємо всі query
      return;
    }
    if (label === RECO_LABEL) {
      router.push("/videos?recommended"); // рівно ?recommended
      return;
    }
    // інші фільтри
    router.push(`/videos?filter=${encodeURIComponent(label)}`);
  };

  if (!filters || filters.length === 0) return null;

  return (
    <section className="relative flex flex-col">
      <div
        {...scrollBind}
        className="flex gap-3 overflow-x-auto no-scrollbar cursor-grab py-4"
      >
        {items.map((label) => {
          const isSelected =
            (label === ALL_LABEL && !activeFilter && !isRecommended) ||
            (label === RECO_LABEL && isRecommended) ||
            (label !== ALL_LABEL &&
              label !== RECO_LABEL &&
              activeFilter === label);

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
