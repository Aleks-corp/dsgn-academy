"use client";

import Button from "@/components/buttons/Button";
import { Check } from "lucide-react";

export default function FreeSubProfile() {
  return (
    <div className="w-full max-w-96">
      <p className="font-inter text-xs font-medium leading-4 tracking-thin mb-4">
        🎁 Відкрийте всі уроки та бонуси
      </p>
      <div className="py-3 border-1 border-[#E2E2E2] rounded-[20px]">
        <p className="font-inter font-medium text-xl leading-7 tracking-thinest px-3 mb-3">
          Безкоштовний
        </p>
        <div className="flex flex-col gap-2 p-3 bg-icon border-1 border-[#E2E2E2] rounded-[20px] shadow-sub">
          <div className="flex">
            <p className="font-inter font-medium text-2xl leading-8 tracking-thin text-muted mt-1">
              €
            </p>
            <p className="font-inter text-[40px] leading-12 tracking-thinest mr-2">
              4.95
            </p>
            <p className="font-inter font-medium text-xs leading-4 tracking-thin text-muted mt-6 ">
              EUR / місяць
            </p>
          </div>
          <Button
            type="button"
            text="Оновити до Преміум"
            style="accent"
            className="w-full"
          />
        </div>
        <ul className="flex flex-col gap-2 p-3 font-inter text-xs leading-5 tracking-thin">
          <li className="flex gap-2 items-center">
            <Check size={16} strokeWidth={1} absoluteStrokeWidth />
            Повний доступ до всіх відео
          </li>
          <li className="flex gap-2 items-center">
            <Check size={16} strokeWidth={1} absoluteStrokeWidth />
            Доступ до усіх курсів та добірок
          </li>
          <li className="flex gap-2 items-center">
            <Check size={16} strokeWidth={1} absoluteStrokeWidth />
            Підтримка українського контенту 🇺🇦
          </li>
        </ul>
      </div>
    </div>
  );
}
