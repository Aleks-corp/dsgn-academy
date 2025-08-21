"use client";

import { useAppSelector } from "@/redux/hooks";
import { selectVideoFilters } from "@/selectors/videos.selectors";
import { useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const ALL_LABEL = "Всі відео";
const RECO_LABEL = "Рекомендовано";

export default function FilterSection() {
  const filters = useAppSelector(selectVideoFilters);
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeFilter = searchParams.get("filter") || "";
  const isRecommended = searchParams.has("recommended");

  const btnClasses = useCallback(
    (isSelected: boolean) =>
      `px-3 py-1.5 rounded-full font-inter cursor-pointer transition-colors text-sm font-medium leading-5 ${
        isSelected
          ? "bg-[#0F0F0F] text-background"
          : "bg-[#00000010] text-black hover:bg-[#00000020]"
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
    <section className="flex flex-col text-center px-5 py-2 gap-4">
      <div className="flex gap-3 flex-wrap">
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
