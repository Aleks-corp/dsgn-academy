"use client";

import { formatDateToDDMMYYYY } from "@/lib/date.utils";
import { IUser } from "@/types/users.type";
import SubCard from "../SubCard";
import { premiumDescription } from "@/constants/sub.desc.constants";
import Button from "../buttons/Button";
import Link from "next/link";

export default function PremiumSubProfile({ profile }: { profile: IUser }) {
  return (
    <div className="w-full">
      <p className="font-inter text-xs font-medium leading-4 tracking-thin mb-4">
        Ваш тариф буде автоматично продовжено{" "}
        {formatDateToDDMMYYYY(profile.subend)}
      </p>
      <SubCard
        title="Преміум"
        subTitle="Дякуємо, що ви з нами! 💙"
        description={premiumDescription}
        amount={profile.amount}
        submitComponent={
          <Button
            type="button"
            text="Поточний план"
            className="w-full"
            style="accent"
            disabled
          />
        }
        subscription="premium"
      />
      <Link
        className="inline-flex font-inter text-xs font-medium leading-4 tracking-[-0.12px] text-muted-text hover:text-foreground transition-all duration-300 cursor-pointer mt-4"
        href={"/profile/unsubscribe"}
      >
        Скасувати підписку
      </Link>
    </div>
  );
}
