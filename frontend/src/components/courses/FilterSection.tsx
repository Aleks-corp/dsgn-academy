"use client";

import { useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import { selectVideoFilters } from "@/selectors/videos.selectors";

export default function FilterSection() {
  const filters = useAppSelector(selectVideoFilters);
  const [selectedCategory, setSelectedCategory] = useState<string>("Всі відео");
  const btnClasses = (isSelected: boolean) =>
    `px-3 py-1.5 rounded-full font-inter cursor-pointer transition-colors text-sm font-medium leading-5 ${
      isSelected
        ? "bg-[#0F0F0F] text-background"
        : "bg-[#00000010] text-black hover:bg-[#00000020]"
    }`;
  if (!filters || filters.length === 0) {
    return null;
  }
  return (
    <section className="flex flex-col text-center px-5 py-2 gap-4">
      <div className="flex gap-3 flex-wrap">
        <button
          onClick={() => setSelectedCategory("Всі відео")}
          className={btnClasses(selectedCategory === "Всі відео")}
          type="button"
        >
          Всі відео
        </button>
        {filters.map((filter, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setSelectedCategory(filter.filter)}
            className={btnClasses(selectedCategory === filter.filter)}
          >
            {filter.filter}
          </button>
        ))}
      </div>
    </section>
  );
}
