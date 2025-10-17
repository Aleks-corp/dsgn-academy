"use client";

import { formatDateToDDMMYYYY } from "@/lib/date.utils";
import { IUser } from "@/types/users.type";
import { premiumDescription } from "@/constants/sub.desc.constants";
import SubCard from "@/components/SubCard";
import NavLink from "@/components/links/Link";

export default function RemovedSubProfile({ profile }: { profile: IUser }) {
  return (
    <>
      <p className="font-inter text-xs font-medium leading-4 tracking-thin mb-4">
        Доступ до Преміум завершиться {formatDateToDDMMYYYY(profile.subend)}
      </p>
      <SubCard
        title="Скасовано"
        subTitle="Після завершення періоду у вас залишиться лише базовий безкоштовний
        доступ."
        description={premiumDescription}
        amount={profile.amount}
        submitComponent={
          <NavLink
            rout="/check-subscription"
            text="Відновити підписку"
            style="accent"
          />
        }
        subscription="premiumRemoved"
      />
      {/* <div className="py-3 border-1 border-[#E2E2E2] rounded-[20px]">
        <p className="font-inter font-medium text-xl leading-7 tracking-thinest px-3 mb-3">
          Скасовано
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
            text="Відновити підписку"
            style="accent"
            className="w-full"
          />
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
      </div> */}
    </>
  );
}
