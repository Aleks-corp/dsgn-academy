"use client";

import Button from "@/components/buttons/Button";
import SubCard from "../SubCard";
import { freeDescription } from "@/constants/sub.desc.constants";
import Link from "next/link";
import { IUser } from "@/types/users.type";
import { useAppDispatch } from "@/redux/hooks";
import { useState } from "react";
import { callSupport } from "@/redux/auth/auth.thunk";
import toast from "react-hot-toast";

export default function FreeSubProfile({ profile }: { profile: IUser }) {
  const [disabled, setDisabled] = useState(false);
  const dispatch = useAppDispatch();

  const supportHandler = async () => {
    setDisabled(true);
    await dispatch(callSupport());
    toast.success(
      "Ваш запит у службу підтримки відправлено. Очікуйте відповідь.",
      { duration: 5000 }
    );
  };

  return (
    <div className="w-full">
      {profile.lastPayedStatus === "Declined" ? (
        <div className="p-6 text-center rounded-3xl bg-[#F9EBEB] mb-4">
          <p className="text-foreground font-inter font-medium text-xl leading-7 tracking-thinest mb-4">
            Оплата не пройшла 😔
          </p>
          <p className="font-inter font-medium text-xs text-muted leading-4 tracking-thin">
            На жаль, ми не отримали підтвердження платежу.
          </p>
          <p className="font-inter font-medium text-xs text-muted leading-4 tracking-thin mb-4">
            Ви можете перейти на{" "}
            <Link
              href={"https://m.wayforpay.com/"}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="text-accent hover:text-accent-hover"
            >
              WayForPay
            </Link>{" "}
            щоб дізнатись причину.
          </p>
          <p className="font-inter font-medium text-xs text-muted leading-4 tracking-thin mb-4">
            Якщо вважаєте, що сталася помилка — зв’яжіться з нашою підтримкою, і
            ми допоможемо вирішити питання. 💙
          </p>
          <Button
            text="Зв’язатись з підтримкою"
            type="button"
            onClick={supportHandler}
            disabled={disabled}
          />
        </div>
      ) : (
        <p className="font-inter text-xs font-medium leading-4 tracking-thin mb-4">
          🎁 Відкрийте всі уроки та бонуси
        </p>
      )}

      <SubCard
        title="Безкоштовний"
        subTitle="Базовий доступ для ознайомлення"
        description={freeDescription}
        submitComponent={
          <Button
            type="button"
            text="Поточний план"
            className="w-full"
            disabled
          />
        }
        subscription="free"
      />
    </div>
  );
}
