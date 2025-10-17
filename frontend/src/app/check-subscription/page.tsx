"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAppSelector } from "@/redux/hooks";
import { selectUser } from "@/redux/selectors/auth.selectors";
import { handleWayForPay } from "@/lib/paymentWFP";
import {
  freeDescription,
  premiumDescription,
} from "@/constants/sub.desc.constants";
import Button from "@/components/buttons/Button";
import SubCard from "@/components/SubCard";

// import Button from "@/components/buttons/Button";

function AllSubscriptionPage() {
  const profile = useAppSelector(selectUser);
  const router = useRouter();
  const [duration, setDuration] = useState<"monthly" | "yearly">("monthly");
  const amount = { monthly: 4.95, yearly: 46.8 };
  const [loading, setLoading] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const submitHandler = async () => {
    setLoading(true);
    if (!profile) {
      toast.error("Спочатку зареєструйтесь на платформі", { duration: 7000 });
      timerRef.current = setTimeout(() => router.push("/signup"), 6000);
    } else {
      toast.success(`Pay for ${duration}`);
      await handleWayForPay(profile.email, amount[duration], duration);
    }
  };
  return (
    <div className="w-full">
      <div className="flex flex-col items-center w-fit gap-4 mx-auto mt-11">
        <h2 className="font-inter text-4xl md:text-[40px] text-center text-foreground leading-12 tracking-thinest">
          Обери свій план або просто підтримай
        </h2>
        <p className="text-xs leading-4 tracking-thin">
          Кожна підписка – це ще одне відео українською
        </p>
      </div>
      <div className="flex flex-col items-center w-fit gap-4 mx-auto mt-8 mb-12">
        <button
          type="button"
          aria-pressed={duration === "yearly"}
          onClick={() =>
            setDuration((prev) => (prev === "monthly" ? "yearly" : "monthly"))
          }
          className={`relative inline-flex h-10 w-[294px] items-center rounded-xl border-1 border-border cursor-pointer transition-colors focus:outline-none bg-muted-background shadow-switch-box`}
        >
          <span
            className={`inline-block h-8 w-[136px] transform rounded-lg bg-text-white shadow-switch-btn transition-all duration-500 ${
              duration === "yearly"
                ? "translate-x-[139px] w-[149px]"
                : "translate-x-1 w-[136px]"
            }`}
          />
          <span
            className={`absolute left-4 top-3 font-inter font-semibold text-[13px] leading-4 tracking-thin transition-all duration-500  ${
              duration === "yearly" ? "text-muted" : "text-foreground"
            } `}
          >
            Місячна підписка
          </span>
          <span
            className={`absolute right-4 top-3 font-inter font-semibold text-[13px] leading-4 tracking-thin transition-all duration-500  ${
              duration === "yearly" ? "text-foreground" : "text-muted"
            } `}
          >
            Річна (знижка 22%)
          </span>
          <div className="absolute top-[6px] right-[6px] w-2 h-2 rounded-full bg-accent" />
        </button>
      </div>

      <div className="flex flex-wrap-reverse gap-4 lg:gap-8 w-full justify-center">
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
        <SubCard
          title="Преміум"
          subTitle="Підтримай платформу та відкрий доступ до усіх відео"
          description={premiumDescription}
          submitComponent={
            <Button
              type="button"
              text="Оновити до Преміум"
              className="w-full"
              style="accent"
              onClick={submitHandler}
              disabled={loading}
            />
          }
          subscription="premium"
          amount={duration === "monthly" ? amount.monthly : amount.yearly}
        />
      </div>
    </div>
  );
}
export default AllSubscriptionPage;
