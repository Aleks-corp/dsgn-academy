"use client";

import { formatDateToDDMMYYYY } from "@/lib/date.utils";
import { IUser } from "@/types/users.type";
import { Check } from "lucide-react";

export default function PremiumSubProfile({ profile }: { profile: IUser }) {
  return (
    <div className="w-full max-w-96">
      <p className="font-inter text-xs font-medium leading-4 tracking-thin mb-4">
        Ваш тариф буде автоматично продовжено{" "}
        {formatDateToDDMMYYYY(profile.subend)}
      </p>
      <div className="py-3 border-1 border-[#E2E2E2] rounded-[20px]">
        <p className="font-inter font-medium text-xl leading-7 tracking-thinest px-3 mb-3">
          Преміум
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
          <p className="font-inter text-[11px] leading-5 tracking-thin text-center">
            Дякуємо, що ви з нами! 💙
          </p>
        </div>
        <ul className="flex flex-col gap-2 p-3 font-inter text-[13px] leading-5 tracking-thin">
          <li className="flex gap-2 items-center">
            <Check size={16} strokeWidth={1} absoluteStrokeWidth />
            Усе з безкоштовного пакета
          </li>
          <li className="flex gap-2 items-center">
            <Check size={16} strokeWidth={1} absoluteStrokeWidth />
            Повний доступ до курсів
          </li>
          <li className="flex gap-2 items-center">
            <Check size={16} strokeWidth={1} absoluteStrokeWidth />
            Необмежені короткі відео
          </li>
        </ul>
      </div>
    </div>
  );
}
