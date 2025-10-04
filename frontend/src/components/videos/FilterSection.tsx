"use client";

import { useAppSelector } from "@/redux/hooks";
import { selectVideoFilters } from "@/selectors/videos.selectors";
import { useMemo, useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDragScroll } from "@/hooks/useDragScroll";
import { selectUser } from "@/redux/selectors/auth.selectors";
import { BsBookmark } from "react-icons/bs";

const ALL_LABEL = "Всі відео";
const RECO_LABEL = "Рекомендовано";
const BOOKMARKED_LABEL = "Закладки";

export default function FilterSection() {
  const filters = useAppSelector(selectVideoFilters);
  const user = useAppSelector(selectUser);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const scrollBind = useDragScroll();

  const activeFilter = searchParams.get("filter") || "";
  const isRecommended = searchParams.has("recommended");
  const bookmarks = pathname === "/bookmarks";

  const btnClasses = useCallback(
    (isSelected: boolean) =>
      `px-3 py-1.5 text-center transition-colors whitespace-nowrap font-inter text-sm font-medium tracking-thinest leading-5 select-none rounded-lg cursor-pointer ${
        isSelected
          ? "bg-[#0F0F0F] text-white"
          : "bg-[#00000010] text-[#0f0f0f] hover:bg-[#00000020]"
      }`,
    []
  );

  const isDisplayReco =
    searchParams.get("category") === "framer" ||
    searchParams.get("category") === "webflow";

  const items = useMemo(() => {
    const base = [ALL_LABEL];
    if (user) {
      base.push(BOOKMARKED_LABEL);
    }
    if (!isDisplayReco) {
      base.push(RECO_LABEL);
    }

    return [...base, ...(filters?.map((f) => f.filter) ?? [])];
  }, [filters, isDisplayReco, user]);

  const handleSelect = (label: string) => {
    const params = new URLSearchParams(window.location.search);

    if (label === BOOKMARKED_LABEL) {
      router.push(`/bookmarks`, { scroll: false });
      return;
    }

    if (label === ALL_LABEL) {
      params.delete("filter");
      params.delete("recommended");
      params.delete("search");
    } else if (label === RECO_LABEL) {
      params.delete("filter");
      params.delete("search");
      params.set("recommended", "true");
    } else {
      params.set("filter", label);
      params.delete("recommended");
      params.delete("search");
    }

    router.push(`/videos?${params.toString()}`, { scroll: false });
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
            (label === ALL_LABEL &&
              !activeFilter &&
              !isRecommended &&
              !bookmarks) ||
            (label === RECO_LABEL && isRecommended && !bookmarks) ||
            (label === BOOKMARKED_LABEL && bookmarks) ||
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
              aria-label="label"
            >
              {label === BOOKMARKED_LABEL ? (
                <BsBookmark size={16} style={{ strokeWidth: 0.5 }} />
              ) : (
                label
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
