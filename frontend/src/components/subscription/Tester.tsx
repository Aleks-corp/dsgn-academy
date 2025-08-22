"use client";

import { formatDateToDDMMYYYY } from "@/lib/date.utils";
import { IUser } from "@/types/users.type";
import ButtonBlack from "../buttons/ButtonsBlack";

export default function TestSubProfile({ profile }: { profile: IUser }) {
  return (
    <div className="w-full max-w-96">
      <p className="font-inter text-xs font-medium leading-4 tracking-thin mb-4">
        Ваш Преміум доступ безкоштовно активовано на 6 місяців — до{" "}
        {formatDateToDDMMYYYY(profile.subend)}.
      </p>
      <div className="py-3 border-1 border-[#E2E2E2] rounded-[20px]">
        <p className="font-inter font-medium text-xl leading-7 tracking-thinest px-3 mb-3">
          Тестувальник
        </p>
        <div className="flex flex-col gap-2 p-3 bg-icon border-1 border-[#E2E2E2] rounded-[20px] shadow-sub">
          <div className="flex">
            <p className="font-inter font-medium text-2xl leading-8 tracking-thin text-muted mt-1">
              €
            </p>
            <p className="font-inter text-[40px] leading-12 tracking-thinest mr-2">
              0
            </p>
            <p className="font-inter font-medium text-xs leading-4 tracking-thin text-muted mt-6 ">
              EUR / місяць
            </p>
          </div>
          <ButtonBlack
            type="button"
            text="Перейти в групу"
            textPressed="Перейти в групу"
            className="w-full"
          />
        </div>
        <ul className="flex flex-col gap-2 p-3 font-inter text-xs leading-5 tracking-thin">
          <li className="flex gap-2 items-center justify-center text-center">
            Завдяки вашим ідеям та уважності платформа стає кращою для всіх 💙
          </li>
        </ul>
      </div>
    </div>
  );
}
