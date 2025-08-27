"use client";

import { formatDateToDDMMYYYY } from "@/lib/date.utils";
import { IUser } from "@/types/users.type";
import SubCard from "../SubCard";
import NavLink from "../links/Link";
import { testerDescription } from "@/constants/sub.desc.constants";

export default function TestSubProfile({ profile }: { profile: IUser }) {
  return (
    <>
      <p className="font-inter text-xs font-medium leading-4 tracking-thin mb-4">
        Ваш Преміум доступ безкоштовно активовано на 6 місяців — до{" "}
        {formatDateToDDMMYYYY(profile.subend)}.
      </p>
      <SubCard
        title="Тестувальник"
        subTitle="Базовий доступ для ознайомлення"
        description={testerDescription}
        submitComponent={
          <NavLink
            rout="https://web.telegram.org/k/#-2700107263"
            text="Перейти в групу"
            style="accent"
            target="_blank"
            rel="noopener noreferrer"
          />
        }
        subscription="tester"
      />
    </>
  );
}
